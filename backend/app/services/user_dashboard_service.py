from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import Dict
from app.models.attendance import Attendance

from app.models.attendance import Attendance
from app.models.attendance import AttendanceEvent
from app.models.streams import Camera



def calculate_work_hours(check_in, check_out, reference_date: date) -> float:
    """
    Calculate worked hours between check-in and check-out.
    Handles overnight shifts where check-out < check-in.
    Returns hours as float.
    """
    check_in_dt = datetime.combine(reference_date, check_in)
    check_out_dt = datetime.combine(reference_date, check_out)

    if check_out_dt < check_in_dt:
        check_out_dt += timedelta(days=1)

    return (check_out_dt - check_in_dt).total_seconds() / 3600


def calculate_user_monthly_kpis(db: Session, user_id: str) -> Dict[str, float]:
    today = date.today()
    start_of_month = today.replace(day=1)

    # Query attendance records for the current user for this month
    monthly_records = (
        db.query(Attendance)
        .filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date.between(start_of_month, today),
            Attendance.is_deleted.is_(False),
        )
        .all()
    )

    present_days = absent_days = late_marks = leave_taken = 0
    total_work_hours = 0.0
    days_with_hours_logged = 0

    for record in monthly_records:
        status_val = (record.status or "").lower()

        if "present" in status_val or "on time" in status_val:
            present_days += 1
        elif "absent" in status_val:
            absent_days += 1
        elif "late" in status_val:
            present_days += 1
            late_marks += 1
        elif "leave" in status_val or "approved" in status_val:
            leave_taken += 1

        if record.first_check_in and record.last_check_out:
            hours = calculate_work_hours(record.first_check_in, record.last_check_out, record.attendance_date)
            total_work_hours += hours
            days_with_hours_logged += 1

    total_evaluated_days = present_days + absent_days + leave_taken

    attendance_percentage = (
        round((present_days / total_evaluated_days) * 100, 1) if total_evaluated_days > 0 else 0.0
    )

    avg_work_hours = (
        round(total_work_hours / days_with_hours_logged, 1) if days_with_hours_logged > 0 else 0.0
    )

    return {
        "present_days": present_days,
        "absent_days": absent_days,
        "late_marks": late_marks,
        "leave_taken": leave_taken,
        "attendance_percentage": attendance_percentage,
        "avg_work_hours": avg_work_hours,
    }



"""
get todays attandance services
"""


def get_today_attendance_details(db: Session, user_id: str) -> dict:
    today = date.today()
    
    # 1. Get today's attendance record
    attendance_record = db.query(Attendance).filter(
        Attendance.user_id == user_id,
        Attendance.attendance_date == today,
        Attendance.is_deleted == False
    ).first()

    if not attendance_record:
        # Default empty state if user hasn't checked in yet today
        return {
            "status": "Absent / Not Checked In",
            "check_in": None,
            "check_out": None,
            "work_duration": "--",
            "camera_name": "--",
            "location": "--",
            "recognition_method": "--",
            "frame_id": "--",
            "confidence_score": 0.0,
            "ai_similarity_score": 0.0
        }

    # 2. Get the latest attendance event (facial scan) for today
    latest_event = db.query(AttendanceEvent).filter(
        AttendanceEvent.user_id == user_id
    ).order_by(AttendanceEvent.scan_timestamp.desc()).first()

    # 3. Calculate Work Duration
    work_duration = "--"
    if attendance_record.first_check_in and attendance_record.last_check_out:
        t1 = datetime.combine(today, attendance_record.first_check_in)
        t2 = datetime.combine(today, attendance_record.last_check_out)
        
        if t2 < t1: # Handle overnight shifts
            from datetime import timedelta
            t2 += timedelta(days=1)
            
        diff = t2 - t1
        hours, remainder = divmod(diff.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        work_duration = f"{hours}h {minutes}m"

    # Default camera info
    camera_name = "Unknown Camera"
    location = "Unknown Location"
    
    if latest_event and latest_event.camera_id:
        camera = db.query(Camera).filter(Camera.camera_id == latest_event.camera_id).first()
        if camera:
            camera_name = camera.camera_name
            location = camera.location

    # Format data
    confidence = latest_event.confidence_score if latest_event and latest_event.confidence_score else 0.0

    return {
        "status": str(attendance_record.status).capitalize(),
        "check_in": attendance_record.first_check_in,
        "check_out": attendance_record.last_check_out,
        "work_duration": work_duration,
        "camera_name": camera_name,
        "location": location,
        "recognition_method": str(latest_event.recognition_method) if latest_event else "Unknown",
        "frame_id": f"#FRM-{str(latest_event.event_id)[:5].upper()}" if latest_event else "--",
        "confidence_score": round(confidence * 100, 1) if confidence <= 1.0 else round(confidence, 1), # Assume 0-1 scale or 0-100 scale
        "ai_similarity_score": round(confidence, 3) if confidence <= 1.0 else round(confidence / 100, 3)
    }





