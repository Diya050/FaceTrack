from sqlalchemy import select, and_
from fastapi import HTTPException
from datetime import datetime, date
from typing import Optional
from app.models.core import User
from app.models.attendance import Attendance, AttendanceCorrection


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