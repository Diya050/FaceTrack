from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.core import User
from app.core.security import get_current_user
from app.core.permissions import require_roles

from app.services.attendance_service import request_attendance_correction
from app.services.daily_attendance_service import DailyAttendanceService

from app.schemas.attendance_correction import AttendanceCorrectionRequest
from app.schemas.daily_attendance import AttendanceGenerateResponse


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
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
        openapi_examples="2026-03-10",
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