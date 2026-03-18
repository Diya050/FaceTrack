from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.services.face_enrollment_service import FaceEnrollmentService
from app.schemas.face_enrollment import FaceEnrollmentStatusResponse
from app.services.face_enrollment_user_service import FaceEnrollmentUserService

router = APIRouter(prefix="/face-enrollment", tags=["Face Enrollment"])

@router.post("/capture")
async def capture_faces(
    files: List[UploadFile],
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return await FaceEnrollmentService.store_images(
        db,
        current_user,
        files
    )
    
@router.get("/my-status", response_model=FaceEnrollmentStatusResponse)
def get_my_enrollment_status(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return FaceEnrollmentUserService.get_my_status(db, current_user)