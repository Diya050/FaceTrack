from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.core import User, Role
from app.core.security import get_current_user
from app.schemas.role import AssignRoleRequest

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.post("/assign-role")
def assign_role(
    data: AssignRoleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role.role_name != "HR_ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only HR Admin can assign roles"
        )

    role = db.query(Role).filter(Role.role_name == data.role_name).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    user = db.query(User).filter(User.user_id == data.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role_id = role.role_id

    db.commit()
    db.refresh(user)

    return {
        "message": "Role assigned successfully",
        "user_id": str(user.user_id),
        "new_role": role.role_name
    }