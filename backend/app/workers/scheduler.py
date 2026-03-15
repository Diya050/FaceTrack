import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo

from app.workers.generate_daily_attendance import run_daily_attendance_job


logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = BackgroundScheduler()

# Define timezone explicitly
IST = ZoneInfo("Asia/Kolkata")

JOB_ID = "daily_attendance_generation"


def start_scheduler():
    """
    Initialize and start the APScheduler.

    Schedules the daily attendance generation job
    to run every day at 1:00 AM IST.
    """

    if scheduler.running:
        logger.warning("Scheduler is already running. Skipping initialization.")
        return

    logger.info("Initializing APScheduler...")

    try:
        trigger = CronTrigger(
            hour=1,
            minute=0,
            timezone=IST
        )

        scheduler.add_job(
            run_daily_attendance_job,
            trigger=trigger,
            id=JOB_ID,
            replace_existing=True,
            max_instances=1,   # Prevent multiple simultaneous runs
            coalesce=True,     # Combine missed runs if scheduler was down
        )

        scheduler.start()

        logger.info(
            "APScheduler started successfully",
            extra={
                "job_id": JOB_ID,
                "schedule": "1:00 AM IST",
            },
        )

    except Exception:
        logger.exception("Failed to start APScheduler")
        raise


def stop_scheduler():
    """
    Gracefully shutdown the APScheduler.
    """

    if not scheduler.running:
        logger.warning("Scheduler is not running.")
        return

    try:
        scheduler.shutdown(wait=True)
        logger.info("APScheduler stopped successfully.")

    except Exception:
        logger.exception("Error occurred while stopping APScheduler")