from sqlalchemy import select, and_, extract
from fastapi import HTTPException
from datetime import datetime, date, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.attendance import (
    AttendanceRule,
    Attendance,
    AttendanceCorrection,
    AttendanceEvent,
)

from app.models.core import User, Department

from app.enums.attendance_enums import (
    AttendanceEventType,
    AttendanceStatus,
    AttendanceCorrectionStatus,
)

from app.services.notification_service import NotificationService

from app.utils.timezone import today_ist, utc_to_ist_date
from app.utils.Dep_and_Org_records import serialize_common_fields

COOLDOWN_SECONDS = 60


def ensure_active_user(user):
    if user.status != "active":
        raise HTTPException(
            status_code=403,
            detail="Inactive users cannot perform this action"
        )


def determine_attendance_status(
    db: Session,
    organization_id: UUID,
    check_in_datetime: datetime
):

    check_in_time = check_in_datetime.time()

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

    # UTC aware datetime
    now = datetime.now(timezone.utc)

    # Optional:
    # If attendance should follow IST date instead of UTC date,
    # convert before extracting date.
    today = now.astimezone().date()

    # ------------------------------------------------------------------
    # Cooldown check
    # ------------------------------------------------------------------

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

    # ------------------------------------------------------------------
    # Create attendance event
    # ------------------------------------------------------------------

    event = AttendanceEvent(
        user_id=user_id,
        camera_id=camera_id,
        organization_id=organization_id,
        confidence_score=confidence_score,
        recognition_method=recognition_method,
        event_type=event_type
    )

    db.add(event)

    # ------------------------------------------------------------------
    # Find today's attendance
    # ------------------------------------------------------------------

    attendance = db.execute(
        select(Attendance).where(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today,
            Attendance.is_deleted == False
        )
    ).scalar_one_or_none()

    # ------------------------------------------------------------------
    # First scan of the day
    # ------------------------------------------------------------------

    if not attendance:

        status = determine_attendance_status(
            db=db,
            organization_id=organization_id,
            check_in_datetime=now
        )

        attendance = Attendance(
            user_id=user_id,
            organization_id=organization_id,
            attendance_date=today,

            # NOW STORED AS TIMESTAMPTZ
            first_check_in=now,
            last_check_out=now,

            status=status
        )

        db.add(attendance)

    # ------------------------------------------------------------------
    # Later scans update checkout
    # ------------------------------------------------------------------

    else:
        attendance.last_check_out = now

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
        raise HTTPException(
            status_code=403,
            detail="Inactive users cannot mark attendance"
        )

    query = select(Attendance).where(
        Attendance.user_id == current_user.user_id,
        Attendance.is_deleted == False,
    )

    if start_date:
        query = query.where(
            Attendance.attendance_date >= start_date
        )

    if end_date:
        query = query.where(
            Attendance.attendance_date <= end_date
        )

    if status:
        query = query.where(
            Attendance.status == status
        )

    query = (
        query.order_by(Attendance.attendance_date.desc())
        .offset(skip)
        .limit(limit)
    )

    return db.execute(query).scalars().all()


def list_attendance_corrections(
    db: Session,
    current_user
):

    role = current_user.role.role_name

    query = (
        select(AttendanceCorrection)
        .join(
            Attendance,
            AttendanceCorrection.attendance_id == Attendance.attendance_id
        )
        .join(
            User,
            Attendance.user_id == User.user_id
        )
        .where(
            AttendanceCorrection.organization_id == current_user.organization_id,
            User.status == "active"
        )
    )

    # HR_ADMIN / ORG_ADMIN
    if role in ["HR_ADMIN", "ORG_ADMIN"]:
        pass

    # ADMIN
    elif role == "ADMIN":
        query = query.where(
            User.department_id == current_user.department_id
        )

    # EMPLOYEE
    else:
        query = query.where(
            AttendanceCorrection.user_id == current_user.user_id
        )

    return db.execute(
        query.order_by(AttendanceCorrection.created_at.desc())
    ).scalars().all()


def request_attendance_correction(
    db: Session,
    current_user,
    data
):

    ensure_active_user(current_user)

    attendance = db.execute(
        select(Attendance).where(
            Attendance.attendance_id == data.attendance_id,
            Attendance.user_id == current_user.user_id,
            Attendance.is_deleted == False
        )
    ).scalar_one_or_none()

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    if not data.requested_time_in and not data.requested_time_out:
        raise HTTPException(
            status_code=400,
            detail=(
                "At least one of requested_time_in "
                "or requested_time_out must be provided"
            )
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
            detail="A pending correction already exists"
        )

    correction = AttendanceCorrection(
        attendance_id=data.attendance_id,
        user_id=current_user.user_id,
        organization_id=current_user.organization_id,

        # Should now also be full datetime values
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

    correction = db.execute(
        select(AttendanceCorrection).where(
            AttendanceCorrection.correction_id == correction_id,
            AttendanceCorrection.organization_id == current_user.organization_id
        )
    ).scalar_one_or_none()

    if not correction:
        raise HTTPException(
            status_code=404,
            detail="Correction request not found"
        )

    if correction.status != AttendanceCorrectionStatus.pending:
        raise HTTPException(
            status_code=400,
            detail="Correction already reviewed"
        )

    request_user = db.execute(
        select(User).where(
            User.user_id == correction.user_id,
            User.status == "active"
        )
    ).scalar_one_or_none()

    if not request_user:
        raise HTTPException(
            status_code=404,
            detail="Requesting user not found"
        )

    # ------------------------------------------------------------------
    # Authorization
    # ------------------------------------------------------------------

    if role in ["HR_ADMIN", "ORG_ADMIN"]:
        pass

    elif role == "ADMIN":

        if current_user.department_id != request_user.department_id:
            raise HTTPException(
                status_code=403,
                detail=(
                    "You can only review requests "
                    "from your department"
                )
            )

    else:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    correction.status = AttendanceCorrectionStatus(data.status)

    correction.reviewed_by = current_user.user_id
    correction.reviewed_at = datetime.now(timezone.utc)

    # ------------------------------------------------------------------
    # Apply approved corrections
    # ------------------------------------------------------------------

    if data.status == AttendanceCorrectionStatus.approved.value:

        attendance = db.execute(
            select(Attendance).where(
                Attendance.attendance_id == correction.attendance_id,
                Attendance.is_deleted == False
            )
        ).scalar_one_or_none()

        if not attendance:
            raise HTTPException(
                status_code=404,
                detail="Attendance record not found"
            )

        # Validation
        if (
            correction.requested_time_in
            and correction.requested_time_out
            and correction.requested_time_out < correction.requested_time_in
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "requested_time_out cannot be "
                    "earlier than requested_time_in"
                )
            )

        # Apply
        if correction.requested_time_in:
            attendance.first_check_in = correction.requested_time_in

        if correction.requested_time_out:
            attendance.last_check_out = correction.requested_time_out

        # Recalculate status
        if attendance.first_check_in:

            attendance.status = determine_attendance_status(
                db=db,
                organization_id=attendance.organization_id,
                check_in_datetime=attendance.first_check_in
            )

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


# ----------------------------------------------------------------------
# Department Attendance
# ----------------------------------------------------------------------

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

    role_name = (
        current_user.role.role_name
        if current_user.role
        else None
    )

    if isinstance(target_date, datetime):
        target_date = utc_to_ist_date(target_date)

    if isinstance(start_date, datetime):
        start_date = utc_to_ist_date(start_date)

    if isinstance(end_date, datetime):
        end_date = utc_to_ist_date(end_date)

    if not target_date and not start_date and not end_date:
        target_date = today_ist()

    # Role restriction
    if role_name == "ADMIN":

        if not current_user.department_id:
            raise HTTPException(
                400,
                "Department not assigned"
            )

        if department_id != current_user.department_id:
            raise HTTPException(
                403,
                "Unauthorized"
            )

        effective_dept_id = current_user.department_id

    else:
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

    # Filters
    if target_date:
        query = query.where(
            Attendance.attendance_date == target_date
        )

    else:
        if start_date:
            query = query.where(
                Attendance.attendance_date >= start_date
            )

        if end_date:
            query = query.where(
                Attendance.attendance_date <= end_date
            )

    if status:
        query = query.where(
            Attendance.status == status
        )

    query = (
        query.order_by(
            Attendance.attendance_date.desc(),
            User.full_name.asc()
        )
        .offset(skip)
        .limit(limit)
    )

    rows = db.execute(query).all()

    return [serialize_common_fields(row) for row in rows]


# ----------------------------------------------------------------------
# Organization Attendance
# ----------------------------------------------------------------------

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

    role_name = (
        current_user.role.role_name
        if current_user.role
        else None
    )

    if role_name not in ["HR_ADMIN", "ADMIN", "ORG_ADMIN"]:
        raise HTTPException(
            403,
            "Not authorized"
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
        .outerjoin(
            Department,
            User.department_id == Department.department_id
        )
        .where(
            Attendance.organization_id == current_user.organization_id,
            Attendance.is_deleted == False,
            User.status == "active"
        )
    )

    # Filters
    if attendance_date:
        query = query.where(
            Attendance.attendance_date == attendance_date
        )

    else:
        if start_date:
            query = query.where(
                Attendance.attendance_date >= start_date
            )

        if end_date:
            query = query.where(
                Attendance.attendance_date <= end_date
            )

    if status:
        query = query.where(
            Attendance.status == status
        )

    if department_id:
        query = query.where(
            User.department_id == department_id
        )

    if role_name == "ADMIN":
        query = query.where(
            User.department_id == current_user.department_id
        )

    query = (
        query.order_by(
            Attendance.attendance_date.desc(),
            User.full_name.asc()
        )
        .offset(skip)
        .limit(limit)
    )

    rows = db.execute(query).all()

    return [
        {
            **serialize_common_fields(row),
            "department_name": row.department_name,
            "organization_id": row.organization_id,
        }
        for row in rows
    ]


# ----------------------------------------------------------------------
# Monthly Stats
# ----------------------------------------------------------------------

def get_monthly_attendance_stats(
    db: Session,
    user_id,
    year: int,
    month: int
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

    present_days = len([
        r for r in records
        if r.status == "present"
    ])

    absent_days = len([
        r for r in records
        if r.status == "absent"
    ])

    attendance_percentage = (
        (present_days / total_days) * 100
        if total_days else 0
    )

    return {
        "user_id": user_id,
        "year": year,
        "month": month,
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "attendance_percentage": round(
            attendance_percentage,
            2
        )
    }