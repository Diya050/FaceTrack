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
def get_requests(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"]))
):
    return FaceEnrollmentRequestService.get_pending_requests(db, current_user)


@router.post("/{session_id}/approve")
def approve_request(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"]))
):
    return AdminFaceApprovalService.approve_enrollment(
        db,
        session_id
    )


@router.post("/{session_id}/reject")
def reject_request(
    session_id: UUID,
    payload: dict, # This captures {"reason": "..."} from the frontend
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"]))
):
    # Extract reason safely, provide a fallback if it's missing
    reason = payload.get("reason", "No specific reason provided.")

    return AdminFaceApprovalService.reject_enrollment(
        db=db,
        current_user=current_user,
        session_id=session_id,
        reason=reason
    )