from sqlalchemy import select
from fastapi import HTTPException
from datetime import datetime

from app.models.core import User, UserStatusEnum
from app.models.biometrics import FaceEnrollmentSession


class UserService:

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

        # Verify face enrollment completed
        enrollment = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.user_id == user.user_id,
                FaceEnrollmentSession.organization_id == current_user.organization_id,
                FaceEnrollmentSession.status == "completed"
            )
        ).scalars().first()

        if not enrollment:
            raise HTTPException(
                400,
                "Face enrollment not completed"
            )

        user.status = UserStatusEnum.APPROVED
        user.approved_by = current_user.user_id
        user.approved_at = datetime.utcnow()

        db.commit()
        db.refresh(user)

        return {
            "message": "User approved successfully",
            "user_id": user.user_id
        }