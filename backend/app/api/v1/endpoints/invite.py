from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.permissions import require_roles
from app.services.magic_link_service import MagicLinkService
from app.schemas.auth import InviteCreateRequest

router = APIRouter(prefix="/invite", tags=["Invite"])


@router.post("")
def invite_user(
    request: InviteCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["ORG_ADMIN", "HR_ADMIN"]))
):
    return MagicLinkService.create_invite(
        db,
        email=request.email,
        role=request.role,
        organization_id=current_user.organization_id,
        invited_by=current_user.user_id,
        department_id=request.department_id
    )