from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.profile import ProfileUpdateRequest, ProfileResponse
from app.services.profile_service import ProfileService
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


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
    return ProfileService.update_profile(
        db,
        current_user.user_id,
        data
    )