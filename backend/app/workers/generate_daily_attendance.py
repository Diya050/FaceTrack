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

# Delay between processing organizations to avoid database pressure
ORG_DELAY = 1

# Delay between processing individual days in catch-up
DAY_DELAY = 0.3


def _get_active_orgs():
    """
    Fetch all active (non-deleted) organization IDs.

    Uses a short-lived database session to minimize connection usage.
    """
    db: Session = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT organization_id
                FROM organization
                WHERE is_deleted = false
            """)
        ).fetchall()

        return [row[0] for row in rows]

    finally:
        db.close()


def run_daily_attendance_job():
    """
    Generate attendance for all organizations for the previous day.

    - Reuses a single database session for all organizations
    - Commits per organization to isolate failures
    - Applies delay between organizations to prevent connection spikes
    """
    logger.info("Running daily attendance job")

    target_date = today_ist() - timedelta(days=1)
    org_ids = _get_active_orgs()

    db: Session = SessionLocal()

    try:
        for org_id in org_ids:
            try:
                DailyAttendanceService.generate_daily_attendance(
                    db=db,
                    target_date=target_date,
                    organization_id=org_id,
                )
                db.commit()

            except Exception:
                db.rollback()
                logger.exception("Error processing organization %s", org_id)

            time.sleep(ORG_DELAY)

    finally:
        db.close()

    return {"status": "done"}


def run_catchup_jobs():
    """
    Perform catch-up attendance generation for recent days.

    Behavior:
    - Fetches all active organizations
    - Processes each organization sequentially
    - Uses a dedicated session per organization
    - Generates attendance for recent past days (currently last 1 day)
    - Applies delays to control database load
    """
    logger.info("Starting catch-up job")

    # Step 1: Fetch organization IDs using a short-lived session
    db = SessionLocal()
    try:
        org_ids = db.execute(
            select(Organization.organization_id).where(
                Organization.is_deleted == False
            )
        ).scalars().all()
    finally:
        db.close()

    logger.info("Total organizations: %d", len(org_ids))

    # Step 2: Process each organization sequentially
    for index, org_id in enumerate(org_ids, start=1):
        logger.info("Processing organization %s (%d/%d)", org_id, index, len(org_ids))

        db = SessionLocal()

        try:
            today = today_ist()

            # Currently configured to process only the previous day
            for i in range(1, 2):
                target_date = today - timedelta(days=i)

                try:
                    DailyAttendanceService.generate_daily_attendance(
                        db=db,
                        target_date=target_date,
                        organization_id=org_id,
                    )
                    db.commit()

                except Exception:
                    db.rollback()
                    logger.exception(
                        "Error processing organization %s for date %s",
                        org_id,
                        target_date,
                    )

                time.sleep(DAY_DELAY)

        finally:
            db.close()

        time.sleep(ORG_DELAY)

    logger.info("Catch-up job completed")