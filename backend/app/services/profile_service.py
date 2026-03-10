from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import User

class ProfileService:

    @staticmethod
    def _format_user_dict(db, user):
        """Helper method to format the user object into a dictionary for ProfileResponse"""
        approved_by = None
        if user.approved_by:
            approval_result = db.execute(
                select(User).where(User.user_id == user.approved_by)
            )
            approved_by_user = approval_result.scalars().first()
            approved_by = approved_by_user.full_name if approved_by_user else None

        return {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "role": user.role.role_name if user.role else None,
            "department": user.department.name if user.department else None,
            "organization": user.organization.name if user.organization else None,
            "status": user.status,
            "is_active": user.is_active,
            "face_enrolled": user.face_enrolled,
            "approved_by": approved_by,
            "approved_at": user.approved_at,
            "created_by": user.created_by,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "last_login": user.last_login
        }

    @staticmethod
    def get_profile(db, user_id):
        result = db.execute(select(User).where(User.user_id == user_id))
        user = result.scalars().first()

        if not user:
            raise HTTPException(404, "User not found")
        
        return ProfileService._format_user_dict(db, user)

    @staticmethod
    def update_profile(db, user_id, data):
        result = db.execute(select(User).where(User.user_id == user_id))
        user = result.scalars().first()

        if not user:
            raise HTTPException(404, "User not found")

        if data.full_name is not None:
            user.full_name = data.full_name
        if data.email is not None:
            user.email = data.email
        if data.phone_number is not None:
            user.phone_number = data.phone_number

        db.commit()
        db.refresh(user)

        return ProfileService.get_profile(db, user.user_id)

    @staticmethod
    def get_organization_users(db, current_user, status=None):
        """Fetches users based on Admin privileges"""
       
        query = select(User).where(
            User.organization_id == current_user.organization_id,
            User.is_deleted == False
        )
        
       
        if current_user.role.role_name == "ADMIN":
            query = query.where(User.department_id == current_user.department_id)

       
        if status:
            query = query.where(User.status == status)

        result = db.execute(query)
        users = result.scalars().all()

        return [ProfileService._format_user_dict(db, u) for u in users]

    @staticmethod
    def get_user_details_for_admin(db, current_user, target_user_id):
        """Allows an admin to view a specific user's details"""
        query = select(User).where(
            User.user_id == target_user_id,
            User.organization_id == current_user.organization_id,
            User.is_deleted == False
        )
        
        if current_user.role.role_name == "ADMIN":
            query = query.where(User.department_id == current_user.department_id)

        result = db.execute(query)
        target_user = result.scalars().first()

        if not target_user:
            raise HTTPException(status_code=404, detail="User not found or access denied")

        return ProfileService._format_user_dict(db, target_user)