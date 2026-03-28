from sqlalchemy import select, and_, extract
from fastapi import HTTPException
from datetime import datetime, date, timezone, time
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.attendance import AttendanceRule
from app.models.core import User, Department
from app.models.attendance import Attendance, AttendanceCorrection, AttendanceEvent
from app.enums.attendance_enums import AttendanceEventType
from app.enums.attendance_enums import AttendanceStatus
from app.enums.attendance_enums import AttendanceCorrectionStatus
from app.services.notification_service import NotificationService


COOLDOWN_SECONDS = 60


def ensure_active_user(user):
    if user.status != "active":
        raise HTTPException(status_code=403, detail="Inactive users cannot perform this action")


def determine_attendance_status(db, organization_id, check_in_time):

    rules = db.execute(
        select(AttendanceRule)
        .where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.is_deleted == False
        )
        .order_by(AttendanceRule.start_time)
    ).scalars().all()

    for rule in rules:

        if rule.start_time <= check_in_time <= rule.end_time:
            return rule.status_effect

    return AttendanceStatus.absent

def record_attendance_event(
    db: Session,
    user_id: UUID,
    camera_id: UUID,
    organization_id: UUID,
    confidence_score: float,
    recognition_method: str,
    event_type
):

    user = db.execute(
        select(User).where(
            User.user_id == user_id,
            User.status == "active"
        )
    ).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=403,
            detail="Inactive users cannot record attendance"
        )

    now = datetime.now(timezone.utc)
    today = now.date()

    # cooldown check
    last_event = db.execute(
        select(AttendanceEvent)
        .where(AttendanceEvent.user_id == user_id)
        .order_by(AttendanceEvent.scan_timestamp.desc())
        .limit(1)
    ).scalar_one_or_none()

    if last_event:
        diff = (now - last_event.scan_timestamp).total_seconds()
        if diff < COOLDOWN_SECONDS:
            return last_event

    # create event
    event = AttendanceEvent(
        user_id=user_id,
        camera_id=camera_id,
        organization_id=organization_id,
        confidence_score=confidence_score,
        recognition_method=recognition_method,
        event_type=event_type
    )

    db.add(event)

    # check today's attendance
    attendance = db.execute(
        select(Attendance).where(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today,
            Attendance.is_deleted == False
        )
    ).scalar_one_or_none()

    current_time = now.time()

    # first detection of the day
    if not attendance:

        status = determine_attendance_status(
            db,
            organization_id,
            current_time
        )

        attendance = Attendance(
            user_id=user_id,
            organization_id=organization_id,
            attendance_date=today,
            first_check_in=current_time,
            last_check_out=current_time,
            status=status
        )

        db.add(attendance)

    # later detections update last_checkout
    else:
        attendance.last_check_out = current_time

    db.commit()
    db.refresh(event)

    return event


def get_user_attendance(
    db,
    current_user,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
):
    if current_user.status != "active":
        raise HTTPException(status_code=403, detail="Inactive users cannot mark attendance")

    query = select(Attendance).where(
        Attendance.user_id == current_user.user_id,
        Attendance.is_deleted == False,
    )

    if start_date:
        query = query.where(Attendance.attendance_date >= start_date)
    if end_date:
        query = query.where(Attendance.attendance_date <= end_date)
    if status:
        query = query.where(Attendance.status == status)

    query = query.order_by(Attendance.attendance_date.desc()).offset(skip).limit(limit)
    return db.execute(query).scalars().all()


def list_attendance_corrections(db: Session, current_user):

    role = current_user.role.role_name

    query = (
        select(AttendanceCorrection)
        .join(Attendance, AttendanceCorrection.attendance_id == Attendance.attendance_id)
        .join(User, Attendance.user_id == User.user_id)
        .where(
            AttendanceCorrection.organization_id == current_user.organization_id,
            User.status == "active"
        )
    )

    # HR_ADMIN → sees all corrections in org
    if role == "HR_ADMIN":
        pass

    # ADMIN → only their department
    elif role == "ADMIN":
        query = query.where(User.department_id == current_user.department_id)

    # EMPLOYEE → only their own requests
    else:
        query = query.where(AttendanceCorrection.user_id == current_user.user_id)

    return db.execute(
        query.order_by(AttendanceCorrection.created_at.desc())
    ).scalars().all()

def request_attendance_correction(db: Session, current_user, data):

    ensure_active_user(current_user)

    attendance = db.execute(
        select(Attendance).where(
            Attendance.attendance_id == data.attendance_id,
            Attendance.user_id == current_user.user_id,
            Attendance.is_deleted == False
        )
    ).scalar_one_or_none()

    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    if not data.requested_time_in and not data.requested_time_out:
        raise HTTPException(
        status_code=400,
        detail="At least one of requested_time_in or requested_time_out must be provided"
    )

    existing = db.execute(
        select(AttendanceCorrection).where(
            and_(
                AttendanceCorrection.attendance_id == data.attendance_id,
                AttendanceCorrection.status == AttendanceCorrectionStatus.pending
            )
        )
    ).scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="A pending correction already exists for this attendance"
        )

    correction = AttendanceCorrection(
        attendance_id=data.attendance_id,
        user_id=current_user.user_id,
        organization_id=current_user.organization_id,
        requested_time_in=data.requested_time_in,
        requested_time_out=data.requested_time_out,
        reason=data.reason
    )

    db.add(correction)
    db.commit()
    db.refresh(correction)

    return correction

def review_attendance_correction(
    db: Session,
    current_user,
    correction_id: UUID,
    data
):
    role = current_user.role.role_name

    # Fetch correction
    correction = db.execute(
        select(AttendanceCorrection).where(
            AttendanceCorrection.correction_id == correction_id,
            AttendanceCorrection.organization_id == current_user.organization_id
        )
    ).scalar_one_or_none()

    if not correction:
        raise HTTPException(status_code=404, detail="Correction request not found")


    if correction.status != AttendanceCorrectionStatus.pending:
        raise HTTPException(status_code=400, detail="Correction already reviewed")

    # Fetch requesting user
    request_user = db.execute(
        select(User).where(
            User.user_id == correction.user_id,
            User.status == "active"
        )
    ).scalar_one_or_none()

    if not request_user:
        raise HTTPException(status_code=404, detail="Requesting user not found or inactive")

    # Authorization
    if role == "HR_ADMIN":
        pass

    elif role == "ADMIN":
        if current_user.department_id != request_user.department_id:
            raise HTTPException(
                status_code=403,
                detail="You can only review requests from your department"
            )

    else:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to review correction requests"
        )

    correction.status = AttendanceCorrectionStatus(data.status)
    correction.reviewed_by = current_user.user_id
    correction.reviewed_at = datetime.now(timezone.utc)

    # Apply attendance update ONLY if approved
    if data.status == AttendanceCorrectionStatus.approved.value:

        attendance = db.execute(
            select(Attendance).where(
                Attendance.attendance_id == correction.attendance_id,
                Attendance.is_deleted == False
            )
        ).scalar_one_or_none()

        if not attendance:
            raise HTTPException(status_code=404, detail="Attendance record not found")

        # Validate time logic
        if (
            correction.requested_time_in and
            correction.requested_time_out and
            correction.requested_time_out < correction.requested_time_in
        ):
            raise HTTPException(
                status_code=400,
                detail="requested_time_out cannot be earlier than requested_time_in"
            )

        # Apply corrections
        if correction.requested_time_in:
            attendance.first_check_in = correction.requested_time_in

        if correction.requested_time_out:
            attendance.last_check_out = correction.requested_time_out

        if attendance.first_check_in:
            attendance.status = determine_attendance_status(attendance.first_check_in)
    db.commit()
    db.refresh(correction)
    
    NotificationService.create_notification(
        db,
        correction.user_id,
        current_user.organization_id,
        f"Your attendance correction has been {correction.status.value}",
        "INFO",
        redirect_path="/admin/attendance/corrections",
        entity_id=correction.correction_id,
        event_type="ATTENDANCE_CORRECTION_REVIEWED"
    )

    return correction

def get_department_attendance(
    db: Session,
    current_user: User,
    department_id: UUID,
    target_date: Optional[date] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    ensure_active_user(current_user)
    role_name = current_user.role.role_name if current_user.role else None

    # Logic: ADMIN can ONLY view their own department.
    # We override the requested department_id with the admin's own ID to be safe.
    if role_name == "ADMIN":
        if not current_user.department_id:
            raise HTTPException(status_code=400, detail="Department not assigned to admin")
        
        if department_id != current_user.department_id:
             raise HTTPException(status_code=403, detail="Unauthorized: Admins can only view their own department")
        
        effective_dept_id = current_user.department_id
    else:
        # HR_ADMIN can view any department
        effective_dept_id = department_id

    query = (
        select(
            Attendance.user_id,
            User.full_name,
            Attendance.attendance_id,
            Attendance.attendance_date,
            Attendance.first_check_in,
            Attendance.last_check_out,
            Attendance.status,
        )
        .join(User, Attendance.user_id == User.user_id)
        .where(
            Attendance.organization_id == current_user.organization_id,
            User.department_id == effective_dept_id,
            User.status == "active",
            Attendance.is_deleted == False
        )
    )

    if target_date:
        query = query.where(Attendance.attendance_date == target_date)
    else:
        if start_date:
            query = query.where(Attendance.attendance_date >= start_date)
        if end_date:
            query = query.where(Attendance.attendance_date <= end_date)

    if status:
        query = query.where(Attendance.status == status)

    query = query.order_by(Attendance.attendance_date.desc(), User.full_name.asc()).offset(skip).limit(limit)
    rows = db.execute(query).all()

    return [
        {
            "user_id": row.user_id,
            "full_name": row.full_name,
            "attendance_id": row.attendance_id,
            "attendance_date": row.attendance_date,
            "first_check_in": row.first_check_in,
            "last_check_out": row.last_check_out,
            "status": row.status.value if hasattr(row.status, "value") else row.status,
        }
        for row in rows
    ]

def get_organization_attendance(
    db: Session,
    current_user,
    attendance_date: Optional[date] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    department_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 50
):

    ensure_active_user(current_user)

    role_name = current_user.role.role_name if current_user.role else None

    if role_name not in ["HR_ADMIN", "ADMIN"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view organization attendance"
        )

    query = (
        select(
            Attendance.user_id,
            User.full_name,
            Department.name.label("department_name"),
            Attendance.attendance_id,
            Attendance.attendance_date,
            Attendance.first_check_in,
            Attendance.last_check_out,
            Attendance.status,
            Attendance.organization_id,
        )
        .join(User, Attendance.user_id == User.user_id)
        .outerjoin(Department, User.department_id == Department.department_id)
        .where(
            Attendance.organization_id == current_user.organization_id,
            Attendance.is_deleted == False,
            User.status == "active"
        )
    )

    if attendance_date:
        query = query.where(Attendance.attendance_date == attendance_date)
    else:
        if start_date:
            query = query.where(Attendance.attendance_date >= start_date)

        if end_date:
            query = query.where(Attendance.attendance_date <= end_date)

    if status:
        query = query.where(Attendance.status == status)

    if department_id:
        query = query.where(User.department_id == department_id)

    if role_name == "ADMIN":
        query = query.where(User.department_id == current_user.department_id)

    query = query.order_by(
        Attendance.attendance_date.desc(),
        User.full_name.asc(),
    ).offset(skip).limit(limit)

    rows = db.execute(query).all()

    return [
        {
            "user_id": row.user_id,
            "full_name": row.full_name,
            "department_name": row.department_name,
            "attendance_id": row.attendance_id,
            "attendance_date": row.attendance_date,
            "first_check_in": row.first_check_in,
            "last_check_out": row.last_check_out,
            "status": row.status.value if hasattr(row.status, "value") else row.status,
            "organization_id": row.organization_id,
        }
        for row in rows
    ]


def get_monthly_attendance_stats(db: Session, user_id, year: int, month: int):

    user = db.execute(
        select(User).where(
            User.user_id == user_id,
            User.status == "active"
        )
    ).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=403,
            detail="Inactive users cannot have attendance stats"
        )

    records = db.execute(
        select(Attendance).where(
            Attendance.user_id == user_id,
            extract("year", Attendance.attendance_date) == year,
            extract("month", Attendance.attendance_date) == month,
            Attendance.is_deleted == False
        )
    ).scalars().all()

    total_days = len(records)

    present_days = len([r for r in records if r.status == "present"])
    absent_days = len([r for r in records if r.status == "absent"])

    attendance_percentage = (present_days / total_days * 100) if total_days else 0

    return {
        "user_id": user_id,
        "year": year,
        "month": month,
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "attendance_percentage": round(attendance_percentage, 2)
    }

