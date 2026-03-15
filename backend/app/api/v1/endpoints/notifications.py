from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.schemas.notification import NotificationResponse
from app.services.notification_service import NotificationService
from app.core.permissions import require_roles


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get(
    "/",
    response_model=list[NotificationResponse]
)
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user = Depends(
        require_roles(["USER","ADMIN","HR_ADMIN"])
    )
):

    return NotificationService.get_user_notifications(
        db,
        current_user.user_id
    )


@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_roles(["USER","ADMIN","HR_ADMIN"])
    )
):

    return NotificationService.mark_as_read(
        db,
        notification_id,
        current_user.user_id
    )


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user = Depends(
        require_roles(["USER","ADMIN","HR_ADMIN"])
    )
):

    count = NotificationService.unread_count(
        db,
        current_user.user_id
    )

    return {"count": count}