from fastapi import APIRouter, Depends,Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from datetime import date


from app.models.core import User
from app.db.session import get_db
from app.services.attendance_service import request_attendance_correction
from app.core.security import get_current_user
from app.schemas.attendance_correction import AttendanceCorrectionRequest
from app.core.permissions import require_roles
from app.services.daily_attendance_service import DailyAttendanceService
from app.schemas.daily_attendance import AttendanceGenerateResponse


router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/corrections")
async def request_correction(
    data: AttendanceCorrectionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await request_attendance_correction(db, current_user, data)

@router.post("/generate-daily-attendance", response_model=AttendanceGenerateResponse)
def generate_daily_attendance(
    target_date: date = Query(..., description="The date to generate attendance for (YYYY-MM-DD)"),
    current_user = Depends(require_roles(["SUPER_ADMIN", "HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Analyzes raw CCTV events and generates structured daily attendance records.
    - HR_ADMIN runs this for their own organization.
    - SUPER_ADMIN runs this globally for all organizations.
    """
    
    org_id = None
    if current_user.role.role_name == "HR_ADMIN":
        org_id = current_user.organization_id
        
    result = DailyAttendanceService.generate_daily_attendance(db, target_date, org_id)
    return result