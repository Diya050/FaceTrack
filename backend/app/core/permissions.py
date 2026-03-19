from fastapi import Depends, HTTPException
from app.core.security import get_current_user


def require_roles(allowed_roles: list):

    def role_checker(user=Depends(get_current_user)):
        # print(f"Checking permissions for user {user.email} with role {user.role.role_name}")
        if user.role.role_name not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )
        return user

    return role_checker