from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.permissions import require_roles
from app.services.face_enrollment_request_service import FaceEnrollmentRequestService
from app.schemas.face_enrollment_request import FaceEnrollmentDecision
from app.schemas.face_enrollment_request import FaceEnrollmentRequestResponse

router = APIRouter(prefix="/face-enrollment-requests", tags=["Face Enrollment Requests"])


@router.get("/requests", response_model=List[FaceEnrollmentRequestResponse])
def get_requests(
    current_user=Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    return FaceEnrollmentRequestService.get_pending_requests(db, current_user)


@router.post("/approve")
def approve_request(
    data: FaceEnrollmentDecision,
    current_user=Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    return FaceEnrollmentRequestService.approve_request(db, current_user, data.user_id)


@router.post("/reject")
def reject_request(
    data: FaceEnrollmentDecision,
    current_user=Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    return FaceEnrollmentRequestService.reject_request(db, current_user, data.user_id)