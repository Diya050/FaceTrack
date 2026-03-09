from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.db.session import get_db
from app.schemas.attendance_correction import AttendanceCorrectionRequest
from app.schemas.attendance_correction import AttendanceCorrectionReview
from app.services.attendance_service import review_attendance_correction, list_attendance_corrections
from app.services.attendance_service import request_attendance_correction
from app.core.security import get_current_user

router = APIRouter(prefix="/attendance-corrections", tags=["Attendance Corrections"])

@router.get("")
async def get_corrections(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await list_attendance_corrections(
        db,
        current_user
    )

@router.post("")
async def request_correction(
    data: AttendanceCorrectionRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await request_attendance_correction(
        db,
        current_user,
        data
    )
    
@router.patch("/{correction_id}/review")
async def review_correction(
    correction_id: UUID,
    data: AttendanceCorrectionReview,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await review_attendance_correction(
        db,
        current_user,
        correction_id,
        data
    )