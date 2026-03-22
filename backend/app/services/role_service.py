from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException
from uuid import UUID

from app.models.core import User, Role, OrganizationRole


class RoleService:

    @staticmethod
    def assign_role(db: Session, current_user, target_user_id, role_name):
        if current_user.role.role_name != "HR_ADMIN":
            raise HTTPException(403, "Only HR_ADMIN can manage roles")

        user = db.get(User, target_user_id)
        if not user or str(user.user_id) == str(current_user.user_id):
            raise HTTPException(400, "Cannot modify yourself or user not found")

        role = db.execute(select(Role).join(OrganizationRole).where(
            Role.role_name == role_name,
            OrganizationRole.organization_id == current_user.organization_id
        )).scalars().first()

        user.role_id = role.role_id
        db.commit()
        return {"message": "Success"}