from fastapi import APIRouter, Depends
from uuid import UUID
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.permissions import require_roles
from app.services.user_service import UserService


router = APIRouter(prefix="/users", tags=["Users"])


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