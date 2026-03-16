import logging
from datetime import date, timedelta
from contextlib import contextmanager

from app.db.session import SessionLocal
from app.services.daily_attendance_service import DailyAttendanceService

logger = logging.getLogger(__name__)


@contextmanager
def get_db_session():
    """
    Provides a transactional DB session.
    Always closes the session after use.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def run_daily_attendance_job(target_date: date = None):
    """
    Scheduled job: generates attendance for the previous day by default.
    Accepts an optional target_date for manual/backfill runs.
    """

    if target_date is None:
        target_date = date.today() - timedelta(days=1)

    logger.info("Attendance job started for date: %s", target_date)

    try:
        with get_db_session() as db:
            result = DailyAttendanceService.generate_daily_attendance(
                db=db,
                target_date=target_date
            )

        logger.info(
            "Attendance job finished | date=%s | users=%s | present=%s | absent=%s",
            target_date,
            result.get("processed_users_count"),
            result.get("present_count"),
            result.get("absent_count"),
        )

        return result

    except Exception:
        logger.exception("Attendance job failed for date: %s", target_date)
        return {
            "status": "failed",
            "target_date": str(target_date),
        }
