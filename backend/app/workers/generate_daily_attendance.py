import logging
from datetime import date, timedelta
from app.db.session import SessionLocal
from app.services.daily_attendance_service import DailyAttendanceService

logger = logging.getLogger(__name__)

def run_daily_attendance_job():
    """
    Background job to calculate and generate daily attendance.
    Normally runs for the previous day (yesterday).
    """
    target_date = date.today() - timedelta(days=1)
    logger.info(f"Starting scheduled attendance generation for {target_date}...")
    
    db = SessionLocal()
    try:
        result = DailyAttendanceService.generate_daily_attendance(db, target_date=target_date)
        logger.info(f"Attendance generation complete for {target_date}. Results: {result}")
        
    except Exception as e:
        logger.error(f"Failed to generate attendance for {target_date}: {e}", exc_info=True)
    finally:
        db.close()