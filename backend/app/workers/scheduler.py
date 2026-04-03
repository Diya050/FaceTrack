"""
APScheduler Setup - HARD THROTTLED (Supabase Safe)
=================================================

Key improvements:
✅ Strict sequential execution (NO concurrency)
✅ Global execution lock (prevents overlapping runs)
✅ Increased delays to prevent connection spikes
✅ Per-org delay safety for catch-up
✅ Safe startup (no DB flood)
"""

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

IST = ZoneInfo(settings.SCHEDULER_TIMEZONE)

# 🔥 GLOBAL THROTTLE SETTINGS (SUPABASE SAFE)
JOB_START_DELAY = 5
BETWEEN_JOB_DELAY = 10
CATCHUP_COOLDOWN = 10

# 🚨 GLOBAL LOCK (VERY IMPORTANT)
job_lock = threading.Lock()

scheduler = BackgroundScheduler(
    job_defaults={
        "misfire_grace_time": settings.SCHEDULER_MISFIRE_GRACE_SECONDS,
        "coalesce": True,
        "max_instances": 1,  # 🚨 APScheduler-level safety
    },
    timezone=IST,
)

_DAILY_JOB_ID = settings.SCHEDULER_JOB_ID


# ---------------------------------------------------------------------------
# THROTTLED JOB WRAPPER
# ---------------------------------------------------------------------------
def _throttled_daily_job():
    """
    Fully safe wrapper:
    - Prevents overlapping execution
    - Adds delay before and after execution
    """

    # 🚨 Prevent parallel execution manually
    if not job_lock.acquire(blocking=False):
        logger.warning("⚠️ Job already running, skipping this run")
        return

    try:
        logger.info("⏳ Throttling before daily job...")
        time.sleep(JOB_START_DELAY)

        logger.info("🚀 Running daily attendance job...")
        result = run_daily_attendance_job()

        logger.info("✅ Daily job finished: %s", result)

    except Exception as exc:
        logger.exception("❌ Daily job failed: %s", exc)

    finally:
        logger.info("⏳ Cooling down after job...")
        time.sleep(BETWEEN_JOB_DELAY)

        job_lock.release()


# ---------------------------------------------------------------------------
# START SCHEDULER
# ---------------------------------------------------------------------------
def start_scheduler() -> None:
    """
    Safe startup sequence:
    1. Run catch-up SYNCHRONOUSLY (with delays)
    2. Register daily job
    3. Start scheduler
    """

    if scheduler.running:
        logger.warning("Scheduler already running")
        return

    try:
        # 🔥 STEP 1: SAFE CATCH-UP
        if settings.ENABLE_CATCHUP_ON_STARTUP:
            logger.info("⏳ Starting catch-up with throttling...")

            time.sleep(3)  # initial delay

            # 🚨 LOCK even for catch-up
            if job_lock.acquire(blocking=False):
                try:
                    run_catchup_jobs()
                    logger.info("✅ Catch-up completed")

                except Exception as exc:
                    logger.exception("❌ Catch-up failed (continuing): %s", exc)

                finally:
                    logger.info("⏳ Cooling down after catch-up...")
                    time.sleep(CATCHUP_COOLDOWN)
                    job_lock.release()
            else:
                logger.warning("⚠️ Skipping catch-up (another job running)")

        # 🔥 STEP 2: REGISTER DAILY JOB
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

        # 🔥 STEP 3: START
        scheduler.start()

        logger.info(
            "✅ Scheduler started (SAFE MODE). Daily job at %02d:%02d IST",
            settings.SCHEDULER_DAILY_HOUR,
            settings.SCHEDULER_DAILY_MINUTE,
        )

    except Exception as exc:
        logger.exception("❌ Failed to start scheduler: %s", exc)
        raise


# ---------------------------------------------------------------------------
# STOP SCHEDULER
# ---------------------------------------------------------------------------
def stop_scheduler() -> None:
    if not scheduler.running:
        logger.warning("Scheduler not running")
        return

    try:
        scheduler.shutdown(wait=True)
        logger.info("✅ Scheduler stopped")

    except Exception as exc:
        logger.exception("❌ Error stopping scheduler: %s", exc)


# ---------------------------------------------------------------------------
# MANUAL TRIGGER (SAFE)
# ---------------------------------------------------------------------------
def trigger_daily_job_now() -> dict:
    """
    Manual trigger with full safety
    """
    logger.info("⚡ Manual trigger requested")

    try:
        _throttled_daily_job()
        return {"status": "success"}

    except Exception as exc:
        logger.exception("❌ Manual trigger failed: %s", exc)
        return {"status": "failed", "error": str(exc)}