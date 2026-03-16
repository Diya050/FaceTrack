import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo

from app.workers.generate_daily_attendance import run_daily_attendance_job

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(
    job_defaults={
        "misfire_grace_time": 60 * 60,  # 1 hour grace if server was down
        "coalesce": True,               # Merge missed runs into one
        "max_instances": 1              # Never run the same job twice simultaneously
    }
)

IST = ZoneInfo("Asia/Kolkata")
JOB_ID = "daily_attendance_generation"


def start_scheduler():
    if scheduler.running:
        logger.warning("Scheduler already running. Skipping.")
        return

    try:
        scheduler.add_job(
            run_daily_attendance_job,
            trigger=CronTrigger(hour=1, minute=0, timezone=IST),
            id=JOB_ID,
            replace_existing=True,
        )

        scheduler.start()
        logger.info("APScheduler started. Job '%s' scheduled at 1:00 AM IST.", JOB_ID)

    except Exception:
        logger.exception("Failed to start APScheduler.")
        raise


def stop_scheduler():
    if not scheduler.running:
        logger.warning("Scheduler is not running.")
        return

    try:
        scheduler.shutdown(wait=True)
        logger.info("APScheduler stopped gracefully.")
    except Exception:
        logger.exception("Error while stopping APScheduler.")