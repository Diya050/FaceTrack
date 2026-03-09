from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.core import User
from app.db.session import get_db
from app.services.attendance_service import request_attendance_correction
from app.core.security import get_current_user
from app.schemas.attendance_correction import AttendanceCorrectionCreate


router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/corrections")
async def request_correction(
    data: AttendanceCorrectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await request_attendance_correction(db, current_user, data)