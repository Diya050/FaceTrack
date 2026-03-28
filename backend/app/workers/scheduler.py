"""
APScheduler setup
==================
Manages the lifecycle of the background attendance scheduler.

Startup sequence
----------------
1. start_scheduler() is called from app lifespan (FastAPI startup event).
2. If ENABLE_CATCHUP_ON_STARTUP is True, catch-up runs in a daemon thread.
3. If RUN_JOB_ON_STARTUP is True, yesterday's job runs in a daemon thread.
   A short delay is added so catch-up gets a head start.
4. The daily cron job is registered to fire at the configured IST time.

Thread safety
-------------
Both startup threads are daemon threads — they die when the process exits and
never block a clean shutdown.
Only one instance of any job can run at a time (max_instances=1, coalesce=True).
"""

import logging
import threading
import time as _time
from zoneinfo import ZoneInfo
from app.core.config import settings

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.config import settings
from app.workers.generate_daily_attendance import (
    run_daily_attendance_job,
    run_catchup_jobs,
)

logger = logging.getLogger(__name__)

IST = ZoneInfo(settings.SCHEDULER_TIMEZONE)

scheduler = BackgroundScheduler(
    job_defaults={
        "misfire_grace_time": settings.SCHEDULER_MISFIRE_GRACE_SECONDS,
        "coalesce": True,          # collapse multiple missed runs into one
        "max_instances": 1,        # never run the same job twice concurrently
    },
    timezone=IST,
)

_DAILY_JOB_ID = settings.SCHEDULER_JOB_ID


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------
def _run_catchup_bg() -> None:
    """Daemon thread target: catch-up job with error boundary."""
    try:
        run_catchup_jobs()
    except Exception:
        logger.exception("Catch-up background thread raised an unhandled exception.")


def _run_daily_bg() -> None:
    """
    Daemon thread target: yesterday's job, delayed slightly so catch-up
    gets a head start and they don't race for the same rows.
    """
    _time.sleep(settings.STARTUP_DAILY_JOB_DELAY_SECONDS)   # default: 5 s
    try:
        run_daily_attendance_job()
    except Exception:
        logger.exception("Startup daily-job background thread raised an unhandled exception.")


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
def start_scheduler() -> None:
    """
    Register the daily cron job and optionally fire startup background tasks.
    Call once from the FastAPI lifespan startup handler.
    """
    if scheduler.running:
        logger.warning("Scheduler already running — start_scheduler() called twice?")
        return

    try:
        # ── Optional startup tasks (non-blocking daemon threads) ───────────
        if settings.ENABLE_CATCHUP_ON_STARTUP:
            threading.Thread(target=_run_catchup_bg, daemon=True, name="catchup-job").start()
            logger.info("Catch-up job dispatched in background thread.")

        if settings.RUN_JOB_ON_STARTUP:
            threading.Thread(target=_run_daily_bg, daemon=True, name="daily-startup-job").start()
            logger.info(
                "Daily startup job dispatched (delayed %ds).",
                settings.STARTUP_DAILY_JOB_DELAY_SECONDS,
            )

        # ── Recurring cron job ──────────────────────────────────────────────
        scheduler.add_job(
            run_daily_attendance_job,
            trigger=CronTrigger(
                hour=settings.SCHEDULER_DAILY_HOUR,
                minute=settings.SCHEDULER_DAILY_MINUTE,
                timezone=IST,
            ),
            id=_DAILY_JOB_ID,
            replace_existing=True,
        )

        scheduler.start()

        logger.info(
            "APScheduler started. Daily attendance job at %02d:%02d IST.",
            settings.SCHEDULER_DAILY_HOUR,
            settings.SCHEDULER_DAILY_MINUTE,
        )

    except Exception:
        logger.exception("Failed to start APScheduler.")
        raise


def stop_scheduler() -> None:
    """
    Gracefully stop the scheduler.
    Call from the FastAPI lifespan shutdown handler.
    """
    if not scheduler.running:
        logger.warning("Scheduler is not running — stop_scheduler() called unnecessarily.")
        return

    try:
        scheduler.shutdown(wait=True)
        logger.info("APScheduler stopped gracefully.")
    except Exception:
        logger.exception("Error while stopping APScheduler.")