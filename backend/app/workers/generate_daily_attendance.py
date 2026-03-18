import logging
from datetime import date, timedelta
from contextlib import contextmanager

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.core import Organization
from app.services.daily_attendance_service import DailyAttendanceService

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
        target_date = date.today() - timedelta(days=1)

    logger.info("Attendance job started for date: %s", target_date)

    try:
        with get_db_session() as db:
            # ✅ FIX: LOOP ALL ORGS
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