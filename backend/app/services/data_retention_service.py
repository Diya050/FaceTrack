from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.system import RetentionPolicy, PurgeJob


DEFAULT_POLICIES = [
    {"category": "biometric_embeddings", "retention_days": 365, "auto_delete": True, "archive_before_delete": True},
    {"category": "attendance_records", "retention_days": 730, "auto_delete": True, "archive_before_delete": True},
    {"category": "audit_logs", "retention_days": 180, "auto_delete": True, "archive_before_delete": False},
    {"category": "consent_records", "retention_days": 1095, "auto_delete": False, "archive_before_delete": True},
    {"category": "camera_snapshots", "retention_days": 30, "auto_delete": True, "archive_before_delete": False},
]


def get_retention_policies(db: Session, organization_id: UUID) -> List[RetentionPolicy]:
    return db.query(RetentionPolicy).filter(
        RetentionPolicy.organization_id == organization_id
    ).all()


def get_retention_policy(db: Session, policy_id: UUID, organization_id: UUID) -> Optional[RetentionPolicy]:
    return db.query(RetentionPolicy).filter(
        RetentionPolicy.policy_id == policy_id,
        RetentionPolicy.organization_id == organization_id
    ).first()


def get_retention_policy_with_storage(db: Session, policy_id: UUID, organization_id: UUID) -> Optional[Dict[str, Any]]:
    policy = get_retention_policy(db, policy_id, organization_id)
    if not policy:
        return None
    
    # Estimate storage - in production this would query actual data
    storage_estimates = {
        "biometric_embeddings": (142, 320),
        "attendance_records": (8640, 185),
        "audit_logs": (3200, 92),
        "consent_records": (210, 4),
        "camera_snapshots": (9800, 1240),
    }
    records, size = storage_estimates.get(policy.category, (0, 0))
    
    return {
        "id": str(policy.policy_id),
        "category": policy.category,
        "retention_days": policy.retention_days,
        "auto_delete": policy.auto_delete,
        "archive_before_delete": policy.archive_before_delete,
        "last_run_at": policy.last_run_at.isoformat() if policy.last_run_at else None,
        "next_run_at": policy.next_run_at.isoformat() if policy.next_run_at else None,
        "records_affected": records,
        "size_mb": size,
    }


def update_retention_policy(
    db: Session,
    policy_id: UUID,
    organization_id: UUID,
    retention_days: int,
    auto_delete: bool,
    archive_before_delete: bool,
) -> Optional[RetentionPolicy]:
    policy = get_retention_policy(db, policy_id, organization_id)
    if not policy:
        return None
    
    policy.retention_days = retention_days
    policy.auto_delete = auto_delete
    policy.archive_before_delete = archive_before_delete
    db.commit()
    db.refresh(policy)
    return policy


def get_purge_jobs(db: Session, organization_id: UUID, limit: int = 50) -> List[PurgeJob]:
    return db.query(PurgeJob).filter(
        PurgeJob.organization_id == organization_id
    ).order_by(PurgeJob.started_at.desc()).limit(limit).all()


def get_purge_job_with_details(db: Session, job_id: UUID, organization_id: UUID) -> Optional[Dict[str, Any]]:
    job = db.query(PurgeJob).filter(
        PurgeJob.job_id == job_id,
        PurgeJob.organization_id == organization_id
    ).first()
    
    if not job:
        return None
    
    return {
        "id": str(job.job_id),
        "category": job.category,
        "status": job.status,
        "started_at": job.started_at.isoformat(),
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        "records_deleted": job.records_deleted,
        "size_mb": job.size_mb,
        "triggered_by": job.triggered_by,
        "error_message": job.error_message,
    }


def create_purge_job(
    db: Session,
    organization_id: UUID,
    policy_id: UUID,
    category: str,
    user_id: UUID,
) -> PurgeJob:
    job = PurgeJob(
        organization_id=organization_id,
        policy_id=policy_id,
        category=category,
        status="scheduled",
        triggered_by=str(user_id),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Execute purge in background thread
    import threading
    from app.services.retention_scheduler import execute_purge_job
    thread = threading.Thread(
        target=execute_purge_job,
        args=(str(job.job_id), str(policy_id), str(organization_id))
    )
    thread.start()
    
    return job


def initialize_default_policies(db: Session, organization_id: UUID, user_id: UUID) -> List[RetentionPolicy]:
    existing = get_retention_policies(db, organization_id)
    if existing:
        return existing
    
    policies = []
    now = datetime.utcnow()
    
    for p in DEFAULT_POLICIES:
        policy = RetentionPolicy(
            organization_id=organization_id,
            category=p["category"],
            retention_days=p["retention_days"],
            auto_delete=p["auto_delete"],
            archive_before_delete=p["archive_before_delete"],
            next_run_at=now + timedelta(days=30),
        )
        db.add(policy)
        policies.append(policy)
    
    db.commit()
    for policy in policies:
        db.refresh(policy)
    
    return policies