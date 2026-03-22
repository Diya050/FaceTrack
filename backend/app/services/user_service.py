from sqlalchemy import select
from fastapi import HTTPException
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from app.models.core import User, UserStatusEnum
from app.models.biometrics import FaceEnrollmentSession
from app.models.core import Department, Role, Organization


class UserService:
    
    @staticmethod
    def get_pending_users(db, current_user):

        query = (
            select(User, Department, Role, Organization)
            .join(Department, User.department_id == Department.department_id, isouter=True)
            .join(Role, User.role_id == Role.role_id, isouter=True)
            .join(Organization, User.organization_id == Organization.organization_id, isouter=True)
            .where(
                User.organization_id == current_user.organization_id,
                User.status == UserStatusEnum.PENDING,
                User.is_deleted == False
            )
        )

        if current_user.role.role_name == "ADMIN":
            query = query.where(
                User.department_id == current_user.department_id
            )

        result = db.execute(query).all()

        users = []

        for user, dept, role, org in result:
            users.append({
                "id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "employee_id": getattr(user, "employee_id", None),
                "created_at": user.created_at,
                "department_name": dept.name if dept else None,
                "role": role.role_name if role else None,
                "organization_name": org.name if org else None
            })

        return users
    
    @staticmethod
    def get_assignable_users(db: Session, current_user: User):
        # Fetch users who are either APPROVED or ACTIVE
        result = db.execute(
            select(User).options(joinedload(User.role)).where(
                User.organization_id == current_user.organization_id,
                User.status.in_([UserStatusEnum.APPROVED, UserStatusEnum.ACTIVE]),
                User.is_deleted == False
            )
        ).scalars().all()

        return [{
            "user_id": str(u.user_id),
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role.role_name if u.role else "USER",
            "status": u.status
        } for u in result]
    
    
    @staticmethod
    def approve_user(db, current_user, target_user_id):

        result = db.execute(
            select(User).where(
                User.user_id == target_user_id,
                User.organization_id == current_user.organization_id,
                User.is_deleted == False
            )
        )

        user = result.scalars().first()

        if not user:
            raise HTTPException(404, "User not found")

        # ADMIN restriction (department scoped)
        if current_user.role.role_name == "ADMIN":
            if user.department_id != current_user.department_id:
                raise HTTPException(
                    403,
                    "Cannot approve users outside your department"
                )

        if user.status != UserStatusEnum.PENDING:
            raise HTTPException(400, "User is not pending approval")

        user.status = UserStatusEnum.APPROVED
        user.approved_by = current_user.user_id
        user.approved_at = datetime.utcnow()

        db.commit()
        db.refresh(user)

        return {
            "message": "User approved successfully",
            "user_id": user.user_id
        }
        
    @staticmethod
    def reject_user(db, current_user, user_id):

        user = db.get(User, user_id)

        if not user:
            raise HTTPException(404, "User not found")

        if user.organization_id != current_user.organization_id:
            raise HTTPException(403, "Unauthorized")

        if user.status != UserStatusEnum.PENDING:
            raise HTTPException(400, "User is not pending")

        user.status = UserStatusEnum.REJECTED
        user.approved_by = current_user.user_id
        user.approved_at = datetime.utcnow()

        db.commit()

        return {"message": "User rejected"}
    
    
def get_user_registration_details(db, current_user, user_id):

    if current_user.role.role_name != "HR_ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only HR_ADMIN can verify user registration details"
        )

    result = db.execute(
        select(User).where(
            User.user_id == user_id,
            User.is_deleted == False
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "organization_id": user.organization_id,
        "department_id": user.department_id,
        "status": user.status,
        "face_enrolled": user.face_enrolled,
        "created_at": user.created_at
    }