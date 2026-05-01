import logging
import time
import threading
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.config import settings
from app.workers.generate_daily_attendance import (
    run_daily_attendance_job,
    run_catchup_jobs,
)

logger = logging.getLogger(__name__)

# Timezone configuration
IST = ZoneInfo(settings.SCHEDULER_TIMEZONE)

# Throttling controls to avoid database pressure
JOB_START_DELAY = 3          # Delay before executing daily job
BETWEEN_JOB_DELAY = 5        # Cooldown after daily job
CATCHUP_COOLDOWN = 5         # Cooldown after catch-up job

# Global lock to prevent concurrent job execution
job_lock = threading.Lock()

# APScheduler configuration
scheduler = BackgroundScheduler(
    job_defaults={
        "misfire_grace_time": settings.SCHEDULER_MISFIRE_GRACE_SECONDS,
        "coalesce": True,
        "max_instances": 1,
    },
    timezone=IST,
)

_DAILY_JOB_ID = settings.SCHEDULER_JOB_ID


def _throttled_daily_job():
    """
    Wrapper for daily attendance job execution.

    Ensures:
    - Only one job runs at a time using a global lock
    - Controlled delay before execution
    - Cooldown after execution
    """
    if not job_lock.acquire(blocking=False):
        logger.warning("Daily job skipped: another job is already running")
        return

    try:
        time.sleep(JOB_START_DELAY)

        result = run_daily_attendance_job()
        logger.info("Daily job completed successfully: %s", result)

    except Exception as exc:
        logger.exception("Daily job failed: %s", exc)

    finally:
        time.sleep(BETWEEN_JOB_DELAY)
        job_lock.release()


def _run_catchup_async():
    """
    Executes catch-up job in a background thread.

    Ensures:
    - No overlap with other jobs using global lock
    - Runs independently of application startup
    """
    if not job_lock.acquire(blocking=False):
        logger.warning("Catch-up job skipped: another job is already running")
        return

    try:
        logger.info("Catch-up job started")
        run_catchup_jobs()
        logger.info("Catch-up job completed successfully")

    except Exception as exc:
        logger.exception("Catch-up job failed: %s", exc)

    finally:
        time.sleep(CATCHUP_COOLDOWN)
        job_lock.release()


def start_scheduler() -> None:
    """
    Initialize and start the scheduler.

    Behavior:
    - Optionally triggers catch-up job asynchronously at startup
    - Registers daily attendance job with cron schedule
    - Starts the scheduler
    """
    if scheduler.running:
        logger.warning("Scheduler is already running")
        return

    try:
        # Start catch-up job in background if enabled
        if settings.ENABLE_CATCHUP_ON_STARTUP:
            threading.Thread(target=_run_catchup_async, daemon=True).start()

        # Register daily attendance job
        scheduler.add_job(
            _throttled_daily_job,
            trigger=CronTrigger(
                hour=settings.SCHEDULER_DAILY_HOUR,
                minute=settings.SCHEDULER_DAILY_MINUTE,
                timezone=IST,
            ),
            id=_DAILY_JOB_ID,
            replace_existing=True,
        )

        scheduler.start()
        logger.info("Scheduler started successfully")

    except Exception as exc:
        logger.exception("Failed to start scheduler: %s", exc)
        raise


def stop_scheduler() -> None:
    """
    Gracefully stop the scheduler.
    """
    if not scheduler.running:
        logger.warning("Scheduler is not running")
        return

    try:
        scheduler.shutdown(wait=True)
        logger.info("Scheduler stopped successfully")

    except Exception as exc:
        logger.exception("Error while stopping scheduler: %s", exc)


def trigger_daily_job_now() -> dict:
    """
    Manually trigger the daily attendance job.

    Returns:
        dict: Status of execution
    """
    try:
        _throttled_daily_job()
        return {"status": "success"}

    except Exception as exc:
        logger.exception("Manual trigger failed: %s", exc)
        return {"status": "failed", "error": str(exc)}