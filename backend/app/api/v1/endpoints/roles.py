from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.role import AssignRoleRequest
from app.services.role_service import RoleService
from app.core.security import get_current_user
from app.db.session import get_db

router = APIRouter()

router = APIRouter(
    prefix="/roles",
    tags=["Role Management"]
)

@router.post("/assign")
def assign_role(
    data: AssignRoleRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return RoleService.assign_role(
        db=db,
        current_user=current_user,
        target_user_id=data.user_id,
        role_name=data.role_name
    )