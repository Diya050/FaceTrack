from sqlalchemy import select, and_
from fastapi import HTTPException
from datetime import datetime, date
from typing import Optional
from uuid import UUID
from app.models.core import User, Department
from app.models.attendance import Attendance, AttendanceCorrection
from app.models.attendance import AttendanceEvent
from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import extract, func



def get_user_attendance(
    db,
    current_user,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
):
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

def list_attendance_corrections(db, current_user):
    query = (
        select(AttendanceCorrection)
        .join(User, AttendanceCorrection.user_id == User.user_id)
        .where(
            AttendanceCorrection.organization_id == current_user.organization_id
        )
    )
    if current_user.role == "HR_ADMIN":
        pass
    elif current_user.role == "ADMIN":
        query = query.where(
            User.department_id == current_user.department_id
        )
    else:  # USER
        query = query.where(
            AttendanceCorrection.user_id == current_user.user_id
        )
    result = db.execute(query.order_by(AttendanceCorrection.created_at.desc()))
    return result.scalars().all()

def request_attendance_correction(db, current_user, data):
    result = db.execute(
        select(Attendance).where(
            Attendance.attendance_id == data.attendance_id,
            Attendance.user_id == current_user.user_id,
            Attendance.is_deleted == False
        )
    )
    attendance = result.scalar_one_or_none()

    if not attendance:
        raise HTTPException(404, "Attendance record not found")
    
    result = db.execute(
        select(AttendanceCorrection).where(
            and_(
                AttendanceCorrection.attendance_id == data.attendance_id,
                AttendanceCorrection.status == "pending"
            )
        )
    )
    existing = result.scalar_one_or_none()
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
        reason=data.reason,
    )
    db.add(correction)
    db.commit()
    db.refresh(correction)
    return correction

def review_attendance_correction(db, current_user, correction_id, data):
    result = db.execute(
        select(AttendanceCorrection).where(
            AttendanceCorrection.correction_id == correction_id,
            AttendanceCorrection.organization_id == current_user.organization_id
        )
    )
    correction = result.scalar_one_or_none()

    if not correction:
        raise HTTPException(404, "Correction request not found")

    if correction.status != "pending":
        raise HTTPException(400, "Correction already reviewed")

    # Fetch user who made the request
    result = db.execute(
        select(User).where(User.user_id == correction.user_id)
    )
    request_user = result.scalar_one()

    # Authorization
    if current_user.role == "HR_ADMIN":
        pass
    elif current_user.role == "ADMIN":
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
    # Update correction
    correction.status = data.status
    correction.reviewed_by = current_user.user_id
    correction.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(correction)
    return correction



def get_department_attendance(
    db,
    current_user,
    department_id: UUID,
    target_date: Optional[date] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
):
    role_name = current_user.role.role_name

    # ADMIN can only access their own department
    if role_name == "ADMIN":
        if str(current_user.department_id) != str(department_id):
            raise HTTPException(
                status_code=403,
                detail="You can only view attendance for your own department",
            )

    # Verify the department belongs to the current user's organization
    dept = db.execute(
        select(Department).where(
            Department.department_id == department_id,
            Department.organization_id == current_user.organization_id,
        )
    ).scalar_one_or_none()

    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    query = (
        select(Attendance, User)
        .join(User, Attendance.user_id == User.user_id)
        .where(
            User.department_id == department_id,
            User.organization_id == current_user.organization_id,
            User.is_deleted == False,
            Attendance.is_deleted == False,
        )
    )

    if target_date:
        query = query.where(Attendance.attendance_date == target_date)
    if start_date:
        query = query.where(Attendance.attendance_date >= start_date)
    if end_date:
        query = query.where(Attendance.attendance_date <= end_date)
    if status:
        query = query.where(Attendance.status == status)

    query = query.order_by(Attendance.attendance_date.desc(), User.full_name).offset(skip).limit(limit)

    rows = db.execute(query).all()

    return [
        {
            "user_id": row.User.user_id,
            "full_name": row.User.full_name,
            "attendance_id": row.Attendance.attendance_id,
            "attendance_date": row.Attendance.attendance_date,
            "first_check_in": row.Attendance.first_check_in,
            "last_check_out": row.Attendance.last_check_out,
            "status": row.Attendance.status,
        }
        for row in rows
    ]

def get_organization_attendance(
    db,
    current_user,
    attendance_date: Optional[date] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
):
    query = (
        select(Attendance, User, Department)
        .join(User, Attendance.user_id == User.user_id)
        .outerjoin(Department, User.department_id == Department.department_id)
        .where(
            User.organization_id == current_user.organization_id,
            Attendance.is_deleted == False,
            User.is_deleted == False,
        )
    )

    if attendance_date:
        query = query.where(Attendance.attendance_date == attendance_date)
    if start_date:
        query = query.where(Attendance.attendance_date >= start_date)
    if end_date:
        query = query.where(Attendance.attendance_date <= end_date)
    if status:
        query = query.where(Attendance.status == status)

    query = query.order_by(Attendance.attendance_date.desc(), User.full_name).offset(skip).limit(limit)

    rows = db.execute(query).all()

    return [
        {
            "user_id": row.User.user_id,
            "full_name": row.User.full_name,
            "department_name": row.Department.name if row.Department else None,
            "attendance_id": row.Attendance.attendance_id,
            "attendance_date": row.Attendance.attendance_date,
            "first_check_in": row.Attendance.first_check_in,
            "last_check_out": row.Attendance.last_check_out,
            "status": row.Attendance.status,
            "organization_id": row.Attendance.organization_id,
        }
        for row in rows
    ]


async def record_attendance_event(
    db,
    user_id,
    camera_id,
    organization_id,
    confidence_score,
    recognition_method,
    event_type="scan",
):
    event = AttendanceEvent(
        user_id=user_id,
        camera_id=camera_id,
        organization_id=organization_id,
        scan_timestamp=datetime.utcnow(),
        confidence_score=confidence_score,
        recognition_method=recognition_method,
        event_type=event_type,
    )

    db.add(event)
    await db.commit()
    await db.refresh(event)

    return event


def get_monthly_attendance_stats(db: Session, user_id, year: int, month: int):

    records = (
        db.query(Attendance)
        .filter(
            Attendance.user_id == user_id,
            extract("year", Attendance.attendance_date) == year,
            extract("month", Attendance.attendance_date) == month,
            Attendance.is_deleted == False
        )
        .all()
    )

    total_days = len(records)

    present_days = len([r for r in records if r.status == "present"])
    absent_days = len([r for r in records if r.status == "absent"])
    late_days = len([r for r in records if r.status == "late"])

    attendance_percentage = 0
    if total_days > 0:
        attendance_percentage = (present_days / total_days) * 100

    return {
        "user_id": user_id,
        "year": year,
        "month": month,
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "late_days": late_days,
        "attendance_percentage": round(attendance_percentage, 2)
    }
