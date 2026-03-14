from sqlalchemy import select
from fastapi import HTTPException
from app.models.biometrics import FaceEnrollmentSession
from app.models.core import User, UserStatusEnum


class FaceEnrollmentAdminService:

    @staticmethod
    def request_enrollment(db, current_user, user_id):

        user = db.execute(
            select(User).where(
                User.user_id == user_id,
                User.organization_id == current_user.organization_id,
                User.is_deleted == False
            )
        ).scalars().first()

        if not user:
            raise HTTPException(404, "User not found")

        if user.status != UserStatusEnum.APPROVED:
            raise HTTPException(
                400,
                "User must be approved before enrollment"
            )

        existing = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.user_id == user_id,
                FaceEnrollmentSession.status.in_(["started", "pending_approval"])
            )
        ).scalars().first()

        if existing:
            raise HTTPException(
                400,
                "Enrollment already in progress"
            )

        session = FaceEnrollmentSession(
            user_id=user.user_id,
            organization_id=user.organization_id,
            status="started"
        )

        db.add(session)
        db.commit()

        return {
            "message": "Face enrollment requested",
            "session_id": session.session_id
        }