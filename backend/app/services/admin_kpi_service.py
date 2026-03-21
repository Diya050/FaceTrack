from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, time, datetime, timedelta

from app.models.core import User, Department
from app.models.attendance import Attendance, AttendanceEvent
from app.models.streams import Camera


def get_kpi_stats(db: Session, org_id: str):
    today = date.today()

    # ✅ FIX 1: Proper datetime range (VERY IMPORTANT)
    start = datetime.combine(today, datetime.min.time())
    end = start + timedelta(days=1)

    # 1. Avg Confidence Score (FIXED DATE FILTER)
    avg_conf = db.query(func.avg(AttendanceEvent.confidence_score)).filter(
        AttendanceEvent.organization_id == org_id,
        AttendanceEvent.scan_timestamp >= start,
        AttendanceEvent.scan_timestamp < end
    ).scalar() or 0.0

    # 2. Total Registered Staff
    total_staff = db.query(func.count(User.user_id)).filter(
        User.organization_id == org_id,
        User.is_active == True,
        User.is_deleted == False
    ).scalar() or 0

    # 3. Fetch today's attendance (FIXED DATE FILTER)
    attendance_records = db.query(Attendance).filter(
        Attendance.organization_id == org_id,
        Attendance.attendance_date >= start,
        Attendance.attendance_date < end
    ).all()

    present_count = 0
    late_count = 0
    early_leave_count = 0

    cutoff_time = time(17, 0)  # Your rule

    for rec in attendance_records:
        # ✅ EARLY LEAVE LOGIC (FIRST PRIORITY)
        if rec.last_check_out and rec.last_check_out < cutoff_time:
            early_leave_count += 1

        elif rec.status.value == 'present':
            present_count += 1

        elif rec.status.value == 'late':
            late_count += 1

        # NOTE:
        # half_day is NOT counted as present here
        # because your rule says <4 hrs → half_day

    # ✅ Total people who showed up
    total_detected = present_count + late_count + early_leave_count

    # ✅ True absence
    absent_today = max(0, total_staff - total_detected)

    attendance_rate = (
        round((total_detected / total_staff) * 100, 1)
        if total_staff > 0 else 0
    )

    return {
        "present_today": present_count,
        "absent_today": absent_today,
        "late_today": late_count,
        "early_leave_today": early_leave_count,
        "total_registered": total_staff,
        "attendance_rate": attendance_rate,
        "avg_confidence_score": round(float(avg_conf), 1)
    }


# 🔥 RECENT DETECTIONS (FIXED DATE ISSUE)
def get_recent_detections(db: Session, org_id: str, limit: int = 10):
    today = date.today()

    start = datetime.combine(today, datetime.min.time())
    end = start + timedelta(days=1)

    latest_event_sub = (
        db.query(AttendanceEvent.event_id)
        .filter(AttendanceEvent.user_id == User.user_id)
        .filter(
            AttendanceEvent.scan_timestamp >= start,
            AttendanceEvent.scan_timestamp < end
        )
        .order_by(AttendanceEvent.scan_timestamp.desc())
        .limit(1)
        .correlate(User)
        .scalar_subquery()
    )

    results = db.query(
        Attendance,
        User,
        Department.name.label("dept_name"),
        AttendanceEvent.confidence_score,
        Camera.camera_name
    ).join(User, Attendance.user_id == User.user_id)\
     .outerjoin(Department, User.department_id == Department.department_id)\
     .outerjoin(AttendanceEvent, AttendanceEvent.event_id == latest_event_sub)\
     .outerjoin(Camera, AttendanceEvent.camera_id == Camera.camera_id)\
     .filter(
        Attendance.organization_id == org_id,
        Attendance.attendance_date >= start,
        Attendance.attendance_date < end
     )\
     .order_by(Attendance.generated_at.desc())\
     .limit(limit).all()

    detections = []
    cutoff_time = time(17, 0)

    for att, user, dept_name, conf, cam_name in results:
        display_status = att.status.value

        # ✅ Apply early leave logic dynamically
        if att.last_check_out and att.last_check_out < cutoff_time:
            display_status = "early_leave"

        detections.append({
            "attendance_id": str(att.attendance_id),
            "full_name": user.full_name,
            "department": dept_name or "General",
            "camera_name": cam_name or "Unknown Camera",
            "time_in": att.first_check_in.strftime("%H:%M") if att.first_check_in else None,
            "time_out": att.last_check_out.strftime("%H:%M") if att.last_check_out else "Active",
            "confidence_score": round(conf, 1) if conf else 0.0,
            "status": display_status
        })

    return detections