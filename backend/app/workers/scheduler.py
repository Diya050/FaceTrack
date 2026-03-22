import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo
import threading

from app.core.config import settings

from app.workers.generate_daily_attendance import (
    run_daily_attendance_job,
    run_catchup_jobs
)

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(
    job_defaults={
        "misfire_grace_time": settings.SCHEDULER_MISFIRE_GRACE_SECONDS,
        "coalesce": True,
        "max_instances": 1
    }
)

IST = ZoneInfo(settings.SCHEDULER_TIMEZONE)
JOB_ID = settings.SCHEDULER_JOB_ID


def start_scheduler():
    if scheduler.running:
        logger.warning("⚠️ Scheduler already running.")
        return

    try:
        # ✅ Run catch-up in background
        if settings.ENABLE_CATCHUP_ON_STARTUP:
            threading.Thread(
                target=run_catchup_jobs,
                daemon=True
            ).start()

        # ✅ Run yesterday job in background
        if settings.RUN_JOB_ON_STARTUP:
            threading.Thread(
                target=run_daily_attendance_job,
                daemon=True
            ).start()

        scheduler.add_job(
            run_daily_attendance_job,
            trigger=CronTrigger(
                hour=settings.SCHEDULER_DAILY_HOUR,
                minute=settings.SCHEDULER_DAILY_MINUTE,
                timezone=IST
            ),
            id=JOB_ID,
            replace_existing=True,
        )

        scheduler.start()

        logger.info("✅ APScheduler started.")
        logger.info(
            f"📅 Daily job at {settings.SCHEDULER_DAILY_HOUR:02d}:{settings.SCHEDULER_DAILY_MINUTE:02d}"
        )

    except Exception:
        logger.exception("❌ Failed to start scheduler")
        raise

def stop_scheduler():
    if not scheduler.running:
        logger.warning("⚠️ Scheduler is not running.")
        return

    try:
        scheduler.shutdown(wait=True)
        logger.info("🛑 APScheduler stopped gracefully.")
    except Exception:
        logger.exception("❌ Error while stopping APScheduler.")