import logging
from datetime import date, timedelta
from contextlib import contextmanager

from app.db.session import SessionLocal
from app.services.daily_attendance_service import DailyAttendanceService


logger = logging.getLogger(__name__)


@contextmanager
def get_db_session():
    """
    Context manager for handling database sessions safely.
    Ensures proper cleanup and rollback in case of failure.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def run_daily_attendance_job():
    """
    Scheduled background job to generate daily attendance.

    Default behavior:
    - Runs for the previous day (yesterday).
    - Aggregates raw attendance events into structured records.

    This function is intended to be triggered by a scheduler
    such as cron, Celery beat, or APScheduler.
    """

    target_date = date.today() - timedelta(days=1)

    logger.info(
        "Starting scheduled attendance generation",
        extra={"target_date": str(target_date)}
    )

    try:
        with get_db_session() as db:

            result = DailyAttendanceService.generate_daily_attendance(
                db=db,
                target_date=target_date
            )

            logger.info(
                "Attendance generation completed successfully",
                extra={
                    "target_date": str(target_date),
                    "processed_users": result.get("processed_users_count"),
                    "present": result.get("present_count"),
                    "absent": result.get("absent_count"),
                    "half_day": result.get("half_day_count"),
                },
            )

            return result

    except Exception as exc:

        logger.exception(
            "Attendance generation job failed",
            extra={"target_date": str(target_date)}
        )

        return {
            "status": "failed",
            "target_date": str(target_date),
            "error": str(exc),
        }