import logging
import time
from datetime import timedelta
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.daily_attendance_service import DailyAttendanceService
from app.utils.timezone import today_ist
from app.models.core import Organization

logger = logging.getLogger(__name__)

# 🔥 HARD LIMITS
ORG_DELAY = 3         # delay between orgs
DAY_DELAY = 1          # delay between days


# ---------------------------------------------------------------------------
# GET ORGS (SAFE - 1 SESSION ONLY)
# ---------------------------------------------------------------------------
def _get_active_orgs():
    db: Session = SessionLocal()
    try:
        rows = db.execute(text("""
    SELECT organization_id
    FROM organization
    WHERE is_deleted = false
""")).fetchall()

        return [r[0] for r in rows]

    finally:
        db.close()   # 🚨 CRITICAL


# ---------------------------------------------------------------------------
# DAILY JOB (ONLY YESTERDAY)
# ---------------------------------------------------------------------------
def run_daily_attendance_job():
    logger.info("🚀 Running daily attendance job")

    target_date = today_ist() - timedelta(days=1)
    org_ids = _get_active_orgs()

    for org_id in org_ids:
        db: Session = SessionLocal()

        try:
            DailyAttendanceService.generate_daily_attendance(
                db=db,
                target_date=target_date,
                organization_id=org_id,
            )
            db.commit()

        except Exception as e:
            db.rollback()
            logger.exception(f"❌ Error org={org_id}: {e}")

        finally:
            db.close()   # 🚨 VERY IMPORTANT

        time.sleep(ORG_DELAY)  # 🔥 prevent spike

    return {"status": "done"}


# ---------------------------------------------------------------------------
# CATCH-UP JOB (BIGGEST PROBLEM BEFORE)
# ---------------------------------------------------------------------------
def run_catchup_jobs():
    """
    SAFE catch-up:
    - One DB session per org
    - Fully sequential
    - Controlled delays
    """

    logger.info("🚀 Starting SAFE catch-up job")

    # 🔹 STEP 1: Fetch orgs (single short session)
    db = SessionLocal()
    try:
        org_ids = db.execute(
            select(Organization.organization_id).where(
                Organization.is_deleted == False
            )
        ).scalars().all()
    finally:
        db.close()  # 🔥 CLOSE IMMEDIATELY

    logger.info("📊 Total orgs: %d", len(org_ids))

    # 🔹 STEP 2: Process each org safely
    for org_index, org_id in enumerate(org_ids):

        logger.info("🏢 Processing org %s (%d/%d)", org_id, org_index+1, len(org_ids))

        db = SessionLocal()

        try:
            today = today_ist()

            # 🔹 Example: last 3 days catch-up (adjust if needed)
            for i in range(1, 4):
                target_date = today - timedelta(days=i)

                logger.info("📅 Processing date %s", target_date)

                try:
                    DailyAttendanceService.generate_daily_attendance(
                        db=db,
                        target_date=target_date,
                        organization_id=org_id,
                    )

                    db.commit()

                except Exception as e:
                    logger.exception("❌ Error for org=%s date=%s", org_id, target_date)
                    db.rollback()

                # 🔥 DELAY BETWEEN DATES
                time.sleep(DAY_DELAY)

        finally:
            db.close()  # 🚨 CRITICAL

        # 🔥 DELAY BETWEEN ORGS (VERY IMPORTANT)
        time.sleep(ORG_DELAY)

    logger.info("✅ Catch-up job completed safely")