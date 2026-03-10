from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.profile import ProfileUpdateRequest, ProfileResponse
from app.services.profile_service import ProfileService
from app.core.dependencies import get_current_user
from app.core.permissions import require_roles
from app.models.core import UserStatusEnum

router = APIRouter(prefix="/profile", tags=["Profile"])

\

@router.get("/users/me", response_model=ProfileResponse)
def get_my_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ProfileService.get_profile(db, current_user.user_id)


@router.put("/users/me", response_model=ProfileResponse)
def update_profile(
    data: ProfileUpdateRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ProfileService.update_profile(db, current_user.user_id, data)



@router.get("/users", response_model=List[ProfileResponse])
def list_organization_users(
    status: Optional[UserStatusEnum] = Query(None, description="Filter by status (e.g. pending, approved)"),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """Allows HR_ADMIN and ADMIN to list users and view their status."""
    return ProfileService.get_organization_users(db, current_user, status)


@router.get("/users/{target_user_id}", response_model=ProfileResponse)
def get_user_details(
    target_user_id: UUID,
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """Allows HR_ADMIN and ADMIN to view detailed info of a specific user."""
    return ProfileService.get_user_details_for_admin(db, current_user, target_user_id)