from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException
from uuid import UUID

from app.models.core import User, Role, OrganizationRole


class RoleService:

    @staticmethod
    def assign_role(db: Session, current_user, target_user_id: UUID, role_name: str):

        # Only HR_ADMIN can assign roles
        if current_user.role.role_name != "HR_ADMIN":
            raise HTTPException(
                status_code=403,
                detail="Only HR_ADMIN can manage roles"
            )

        # Get target user
        user = db.get(User, target_user_id)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Prevent modifying yourself
        if str(user.user_id) == str(current_user.user_id):
            raise HTTPException(
                status_code=400,
                detail="You cannot modify your own role"
            )

        # Get role using role_name
        role = db.execute(
            select(Role)
            .join(OrganizationRole)
            .where(
                Role.role_name == role_name,
                OrganizationRole.organization_id == current_user.organization_id
            )
        ).scalars().first()

        if not role:
            raise HTTPException(
                status_code=404,
                detail="Role not found in this organization"
            )

        # Assign role_id internally
        user.role_id = role.role_id

        db.commit()
        db.refresh(user)

        return {
            "message": "Role assigned successfully",
            "user_id": str(user.user_id),
            "role_id": str(role.role_id),
            "role_name": role.role_name
        }