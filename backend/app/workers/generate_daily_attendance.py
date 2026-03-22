import logging
from datetime import date, timedelta
from contextlib import contextmanager

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.core import Organization
from app.services.daily_attendance_service import DailyAttendanceService
from app.models.attendance import Attendance

from app.core.config import settings

logger = logging.getLogger(__name__)


@contextmanager
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def run_daily_attendance_job(target_date: date = None):
    if target_date is None:
        target_date = date.today() - timedelta(days=settings.ATTENDANCE_DEFAULT_OFFSET_DAYS)

    logger.info("Attendance job started for date: %s", target_date)

    try:
        with get_db_session() as db:
            orgs = db.execute(select(Organization)).scalars().all()

            total_summary = []

            for org in orgs:
                result = DailyAttendanceService.generate_daily_attendance(
                    db=db,
                    target_date=target_date,
                    organization_id=org.organization_id
                )
                total_summary.append(result)

        logger.info("Attendance job finished for all organizations")
        return total_summary

    except Exception:
        logger.exception("Attendance job failed for date: %s", target_date)
        return {
            "status": "failed",
            "target_date": str(target_date),
        }
    

from app.core.config import settings
from datetime import date, timedelta

def run_catchup_jobs():
    """
    Catch-up only recent N days (config-driven, safe)
    """

    logger.info("Running LIMITED catch-up attendance job...")

    try:
        with get_db_session() as db:

            today = date.today()

            # Only last N days
            start_date = today - timedelta(days=settings.ATTENDANCE_CATCHUP_DAYS)

            current_date = start_date

            while current_date < today:
                logger.info(f"Processing {current_date}")

                exists = db.query(Attendance).filter(
                    Attendance.attendance_date == current_date
                ).first()

                if not exists:
                    logger.info(f" Missing: {current_date} → generating...")
                    run_daily_attendance_job(current_date)
                else:
                    logger.info(f"Exists: {current_date}")

                current_date += timedelta(days=1)

        logger.info("Limited catch-up completed")

    except Exception:
        logger.exception(" Catch-up job failed")