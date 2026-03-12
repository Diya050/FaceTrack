from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.core.permissions import require_roles
from app.services.admin_face_approval_service import AdminFaceApprovalService
from app.services.face_enrollment_request_service import FaceEnrollmentRequestService
from app.schemas.face_enrollment_request import FaceEnrollmentRequestResponse


router = APIRouter(
    prefix="/admin/face-enrollment",
    tags=["Admin Face Enrollment"]
)


@router.get(
    "/requests",
    response_model=List[FaceEnrollmentRequestResponse]
)
async def get_requests(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"]))
):
    return FaceEnrollmentRequestService.get_pending_requests(db, current_user)


@router.post("/{session_id}/approve")
async def approve_request(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"]))
):
    return await AdminFaceApprovalService.approve_enrollment(
        db,
        session_id
    )


@router.post("/{session_id}/reject")
async def reject_request(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"]))
):
    return await AdminFaceApprovalService.reject_enrollment(
        db,
        session_id
    )