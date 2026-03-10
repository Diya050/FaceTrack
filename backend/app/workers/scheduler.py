import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.workers.generate_daily_attendance import run_daily_attendance_job

logger = logging.getLogger(__name__)

# Create a single global instance of the scheduler
scheduler = BackgroundScheduler()

def start_scheduler():
    """Configures jobs and starts the background scheduler."""
    logger.info("Initializing APScheduler...")
    
    scheduler.add_job(
        run_daily_attendance_job,
        trigger='cron',
        hour=1,           # Runs at 1:00 AM
        minute=0,         # Exact start of the hour
        timezone='Asia/Kolkata', # Enforces IST timezone
        id='daily_attendance_generation',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("APScheduler Started: Daily attendance job scheduled for 1:00 AM IST.")

def stop_scheduler():
    """Safely shuts down the background scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler Stopped.")