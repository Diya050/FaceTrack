"""
Data Retention Scheduler Service
Runs background jobs to automatically purge old data based on retention policies.
"""
from datetime import datetime, timedelta
from typing import Optional
import logging
import threading

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.system import RetentionPolicy, PurgeJob, AuditLog
from app.models.biometrics import FacialBiometric, FaceEnrollmentSession, FaceEnrollmentImage
from app.models.attendance import Attendance, AttendanceEvent
from app.models.streams import UnknownFace

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler: Optional[BackgroundScheduler] = None


def get_db():
    """Get database session for scheduler jobs."""
    db = SessionLocal()
    try:
        return db
    except Exception:
        db.close()
        raise


def purge_biometric_embeddings(db: Session, policy: RetentionPolicy, job: PurgeJob) -> int:
    """Purge old biometric embeddings (inactive ones only for safety)."""
    cutoff = datetime.utcnow() - timedelta(days=policy.retention_days)
    
    # Only delete inactive embeddings older than retention period
    deleted = db.query(FacialBiometric).filter(
        FacialBiometric.organization_id == policy.organization_id,
        FacialBiometric.is_active == False,
        FacialBiometric.created_at < cutoff
    ).delete(synchronize_session=False)
    
    return deleted


def purge_attendance_records(db: Session, policy: RetentionPolicy, job: PurgeJob) -> int:
    """Purge old attendance records."""
    cutoff = datetime.utcnow() - timedelta(days=policy.retention_days)
    cutoff_date = cutoff.date()
    
    # Delete old attendance records
    deleted = db.query(Attendance).filter(
        Attendance.organization_id == policy.organization_id,
        Attendance.attendance_date < cutoff_date
    ).delete(synchronize_session=False)
    
    # Also delete related attendance events
    db.query(AttendanceEvent).filter(
        AttendanceEvent.organization_id == policy.organization_id,
        AttendanceEvent.scan_timestamp < cutoff
    ).delete(synchronize_session=False)
    
    return deleted


def purge_audit_logs(db: Session, policy: RetentionPolicy, job: PurgeJob) -> int:
    """Purge old audit logs."""
    cutoff = datetime.utcnow() - timedelta(days=policy.retention_days)
    
    deleted = db.query(AuditLog).filter(
        AuditLog.organization_id == policy.organization_id,
        AuditLog.timestamp < cutoff
    ).delete(synchronize_session=False)
    
    return deleted


def purge_consent_records(db: Session, policy: RetentionPolicy, job: PurgeJob) -> int:
    """Purge old consent records - typically kept longer, manual delete only."""
    # Consent records are usually kept for legal compliance
    # Only purge if explicitly enabled
    if not policy.auto_delete:
        return 0
    
    # No consent_records table exists yet, return 0
    return 0


def purge_camera_snapshots(db: Session, policy: RetentionPolicy, job: PurgeJob) -> int:
    """Purge old unknown face snapshots and enrollment images."""
    cutoff = datetime.utcnow() - timedelta(days=policy.retention_days)
    
    # Delete old unknown face records
    deleted = db.query(UnknownFace).filter(
        UnknownFace.organization_id == policy.organization_id,
        UnknownFace.detected_time < cutoff
    ).delete(synchronize_session=False)
    
    # Delete old enrollment session images (keep session records)
    old_sessions = db.query(FaceEnrollmentSession).filter(
        FaceEnrollmentSession.organization_id == policy.organization_id,
        FaceEnrollmentSession.created_at < cutoff,
        FaceEnrollmentSession.status == "completed"
    ).all()
    
    for session in old_sessions:
        img_count = db.query(FaceEnrollmentImage).filter(
            FaceEnrollmentImage.session_id == session.session_id
        ).delete(synchronize_session=False)
        deleted += img_count
    
    return deleted


# Map category to purge function
PURGE_HANDLERS = {
    "biometric_embeddings": purge_biometric_embeddings,
    "attendance_records": purge_attendance_records,
    "audit_logs": purge_audit_logs,
    "consent_records": purge_consent_records,
    "camera_snapshots": purge_camera_snapshots,
}


def execute_purge_job(job_id: str, policy_id: str, organization_id: str):
    """Execute a single purge job."""
    db = get_db()
    try:
        from uuid import UUID
        job = db.query(PurgeJob).filter(PurgeJob.job_id == UUID(job_id)).first()
        policy = db.query(RetentionPolicy).filter(RetentionPolicy.policy_id == UUID(policy_id)).first()
        
        if not job or not policy:
            logger.error(f"Purge job or policy not found: job={job_id}, policy={policy_id}")
            return
        
        # Update job status to running
        job.status = "running"
        db.commit()
        
        try:
            # Get the appropriate purge handler
            handler = PURGE_HANDLERS.get(policy.category)
            if not handler:
                raise ValueError(f"Unknown category: {policy.category}")
            
            # Execute purge
            records_deleted = handler(db, policy, job)
            
            # Update job as completed
            job.status = "completed"
            job.completed_at = datetime.utcnow()
            job.records_deleted = records_deleted
            job.error_message = None
            
            # Update policy last run time
            policy.last_run_at = datetime.utcnow()
            policy.next_run_at = datetime.utcnow() + timedelta(days=30)
            
            db.commit()
            logger.info(f"Purge job completed: {policy.category}, deleted {records_deleted} records")
            
        except Exception as e:
            job.status = "failed"
            job.completed_at = datetime.utcnow()
            job.error_message = str(e)
            db.commit()
            logger.error(f"Purge job failed: {policy.category}, error: {e}")
            
    finally:
        db.close()


def run_scheduled_purges():
    """Check all policies and run purges for those with auto_delete enabled."""
    logger.info("Running scheduled data retention purges...")
    db = get_db()
    
    try:
        # Get all policies with auto_delete enabled
        policies = db.query(RetentionPolicy).filter(
            RetentionPolicy.auto_delete == True
        ).all()
        
        for policy in policies:
            # Check if it's time to run (next_run_at has passed)
            if policy.next_run_at and policy.next_run_at > datetime.utcnow():
                continue
            
            # Create a new purge job
            job = PurgeJob(
                organization_id=policy.organization_id,
                policy_id=policy.policy_id,
                category=policy.category,
                status="scheduled",
                triggered_by="Scheduler",
            )
            db.add(job)
            db.commit()
            db.refresh(job)
            
            # Execute the purge
            execute_purge_job(
                str(job.job_id),
                str(policy.policy_id),
                str(policy.organization_id)
            )
            
        logger.info(f"Scheduled purge check completed, processed {len(policies)} policies")
        
    except Exception as e:
        logger.error(f"Scheduled purge check failed: {e}")
    finally:
        db.close()


def init_scheduler():
    """Initialize and start the APScheduler."""
    global scheduler
    
    if scheduler is not None:
        return scheduler
    
    scheduler = BackgroundScheduler()
    
    # Run purge check daily at 2:00 AM
    scheduler.add_job(
        run_scheduled_purges,
        trigger=CronTrigger(hour=2, minute=0),
        id="data_retention_purge",
        name="Data Retention Purge Job",
        replace_existing=True,
    )
    
    scheduler.start()
    logger.info("Data retention scheduler started - purges will run daily at 2:00 AM")
    
    return scheduler


def shutdown_scheduler():
    """Shutdown the scheduler gracefully."""
    global scheduler
    if scheduler:
        scheduler.shutdown(wait=False)
        scheduler = None
        logger.info("Data retention scheduler stopped")
