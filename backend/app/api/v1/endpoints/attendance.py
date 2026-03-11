from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.core import User
from app.core.security import get_current_user
from app.core.permissions import require_roles

from app.services.attendance_service import request_attendance_correction, get_user_attendance
from app.services.daily_attendance_service import DailyAttendanceService

from app.schemas.attendance_correction import AttendanceCorrectionRequest
from app.schemas.daily_attendance import AttendanceGenerateResponse, UserAttendanceResponse


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


# -------------------------------------------------------------------------
# Get My Attendance
# -------------------------------------------------------------------------

@router.get("/me", response_model=List[UserAttendanceResponse])
def get_my_attendance(
    start_date: Optional[date] = Query(
        None,
        description="Filter attendance from this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-01"],
    ),
    end_date: Optional[date] = Query(
        None,
        description="Filter attendance up to this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-10"],
    ),
    status: Optional[str] = Query(
        None,
        description="Filter by attendance status: present, absent, half_day, on_leave",
        examples=["present"],
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of records to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve the authenticated user's own attendance records.

    Supports optional filtering by date range and attendance status,
    as well as pagination via skip/limit.
    """
    return get_user_attendance(
        db=db,
        current_user=current_user,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )


# -------------------------------------------------------------------------
# Attendance Correction Endpoint
# -------------------------------------------------------------------------

@router.post("/corrections")
async def request_correction(
    data: AttendanceCorrectionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Allows a user to request an attendance correction.

    The request is forwarded to the attendance service which handles
    validation, persistence, and workflow logic.
    """

    return await request_attendance_correction(
        db=db,
        current_user=current_user,
        data=data,
    )


# -------------------------------------------------------------------------
# Daily Attendance Generation
# -------------------------------------------------------------------------

@router.post(
    "/generate-daily-attendance",
    response_model=AttendanceGenerateResponse,
)
def generate_daily_attendance(
    target_date: date = Query(
        ...,
        description="Date for which attendance should be generated (YYYY-MM-DD)",
        examples=["2026-03-10"],
    ),
    current_user: User = Depends(
        require_roles(["SUPER_ADMIN", "HR_ADMIN"])
    ),
    db: Session = Depends(get_db),
):
    """
    Generate structured daily attendance records from raw attendance events.

    Role Behavior:
    - SUPER_ADMIN → Can generate attendance for all organizations.
    - HR_ADMIN → Generates attendance only for their organization.

    The service aggregates scan events (first_in / last_out) and
    determines attendance status based on business rules.
    """

    organization_id = None

    if current_user.role.role_name == "HR_ADMIN":
        organization_id = current_user.organization_id

    result = DailyAttendanceService.generate_daily_attendance(
        db=db,
        target_date=target_date,
        organization_id=organization_id,
    )

    return result

