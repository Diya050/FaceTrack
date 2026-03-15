from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.face_enrollment_status_service import get_face_enrollment_status
from app.schemas.face_enrollment_status import FaceEnrollmentStatusResponse

router = APIRouter(prefix="/face-enrollment-status", tags=["Face Enrollment Status"])


@router.get("/{user_id}", response_model=FaceEnrollmentStatusResponse)
def view_face_enrollment_status(user_id: str, db: Session = Depends(get_db)):
    return get_face_enrollment_status(db, user_id)
