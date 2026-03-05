from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import User


class ProfileService:

    @staticmethod
    def get_profile(db, user_id):

        result = db.execute(
            select(User).where(User.user_id == user_id)
        )

        user = result.scalars().first()

        if not user:
            raise HTTPException(404, "User not found")
        
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

            # Role & Organization Info
            "role": user.role.role_name if user.role else None,
            "department": user.department.name if user.department else None,
            "organization": user.organization.name if user.organization else None,


            # Status & Activity
            "status": user.status,
            "is_active": user.is_active,
            "face_enrolled": user.face_enrolled,

            # Approval Metadata
            "approved_by": approved_by,
            "approved_at": user.approved_at,

            # Audit Fields
            "created_by": user.created_by,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "last_login": user.last_login
        }


    @staticmethod
    def update_profile(db, user_id, data):

        result = db.execute(
            select(User).where(User.user_id == user_id)
        )

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