from datetime import date
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.core import User
from app.core.security import get_current_user
from app.core.permissions import require_roles


from app.core.dependencies import get_db
from app.services.attendance_service import get_monthly_attendance_stats
from app.schemas.monthly_attendance import MonthlyAttendanceStats

from app.services.attendance_service import (
    request_attendance_correction,
    get_user_attendance,
    get_organization_attendance,
    get_department_attendance,
)
from app.services.daily_attendance_service import DailyAttendanceService

from app.schemas.attendance_correction import AttendanceCorrectionRequest
from app.schemas.daily_attendance import (
    AttendanceGenerateResponse,
    UserAttendanceResponse,
    OrgAttendanceRecord,
    DepartmentAttendanceUserRecord,
)


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


# -------------------------------------------------------------------------
# Get Organization Attendance
# -------------------------------------------------------------------------

@router.get("/organization", response_model=List[OrgAttendanceRecord])
def get_org_attendance(
    attendance_date: Optional[date] = Query(
        None,
        description="Filter by a specific date (YYYY-MM-DD). Overrides start_date/end_date.",
        examples=["2026-03-11"],
    ),
    start_date: Optional[date] = Query(
        None,
        description="Filter attendance from this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-01"],
    ),
    end_date: Optional[date] = Query(
        None,
        description="Filter attendance up to this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-11"],
    ),
    status: Optional[str] = Query(
        None,
        description="Filter by attendance status: present, absent, half_day, on_leave",
        examples=["present"],
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of records to return"),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db),
):
    """
    Retrieve attendance records for the entire organization.

    Restricted to **HR_ADMIN** only. Returns attendance for all users
    in the HR admin's organization, enriched with user and department info.

    Supports optional filtering by date range and attendance status.
    """
    return get_organization_attendance(
        db=db,
        current_user=current_user,
        attendance_date=attendance_date,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )


# -------------------------------------------------------------------------
# Get Department Attendance
# -------------------------------------------------------------------------

@router.get("/department/{department_id}", response_model=List[DepartmentAttendanceUserRecord])
def get_department_attendance_endpoint(
    department_id: UUID,
    target_date: Optional[date] = Query(
        None,
        description="Fetch attendance for a specific date (YYYY-MM-DD). "
                    "Overrides start_date/end_date when provided.",
        examples=["2026-03-10"],
    ),
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
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"])),
):
    """
    Retrieve attendance records for all members of a department.

    **Role Behaviour:**
    - **HR_ADMIN** – Can view attendance for any department within their organization.
    - **ADMIN** – Can only view attendance for their own department.
    """
    return get_department_attendance(
        db=db,
        current_user=current_user,
        department_id=department_id,
        target_date=target_date,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )

# -------------------------------------------------------------------------
# Get Monthly Attendance
# -------------------------------------------------------------------------

@router.get("/monthly/{user_id}", response_model=MonthlyAttendanceStats)
def monthly_attendance(
    user_id: str,
    year: int,
    month: int,
    db: Session = Depends(get_db)
):
    return get_monthly_attendance_stats(db, user_id, year, month)