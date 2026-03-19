from fastapi import APIRouter, Depends
from uuid import UUID
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.permissions import require_roles
from app.core.security import get_current_user
from app.models.core import User
from app.services.user_service import UserService
from app.services.face_enrollment_admin_service import FaceEnrollmentAdminService
from app.services.user_service import get_user_registration_details



router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/pending")
def get_pending_users(
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"])),
    db: Session = Depends(get_db)
):

    return UserService.get_pending_users(
        db,
        current_user
    )

@router.patch("/{user_id}/approve")
def approve_user(
    user_id: UUID,
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Approve a user after face enrollment is completed.
    """
    return UserService.approve_user(db, current_user, user_id)

@router.post("/{user_id}/request-face-enrollment")
def request_face_enrollment(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(["HR_ADMIN","ADMIN"]))
):

    return FaceEnrollmentAdminService.request_enrollment(
        db,
        current_user,
        user_id
    )
    

@router.get("/{user_id}/registration-details")
def get_registration_details(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_user_registration_details(
        db=db,
        current_user=current_user,
        user_id=user_id
    )
    
    