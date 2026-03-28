from fastapi import HTTPException


def get_access_scope(user):
    role = user.role.role_name

    if role == "HR_ADMIN":
        return {
            "type": "org"
        }

    elif role == "ADMIN":
        return {
            "type": "department",
            "department_id": user.department_id
        }

    else:
        raise HTTPException(status_code=403, detail="Unauthorized role")