from sqlalchemy import select
from fastapi import HTTPException
from datetime import datetime

from app.models.core import User, UserStatusEnum
from app.models.biometrics import FaceEnrollmentSession
import uuid


class FaceEnrollmentRequestService:

    @staticmethod
    def get_pending_requests(db, current_user):

        query = select(User).where(
            User.organization_id == current_user.organization_id,
            User.status == UserStatusEnum.PENDING,
            User.is_deleted == False
        )

        users = db.execute(query).scalars().all()

        pending = []

        for user in users:

            existing = db.execute(
                select(FaceEnrollmentSession.session_id).where(
                    FaceEnrollmentSession.user_id == user.user_id
                )
            ).scalar()

            if not existing:
                pending.append({
                    "user_id": user.user_id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "department": user.department.name if user.department else None,
                    "created_at": user.created_at
                })

        return pending


    @staticmethod
    def approve_request(db, current_user, user_id):

        user = db.execute(
            select(User).where(
                User.user_id == user_id,
                User.organization_id == current_user.organization_id
            )
        ).scalars().first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.status != UserStatusEnum.PENDING:
            raise HTTPException(status_code=400, detail="User is not pending")

        # Check if enrollment session already exists
        existing = db.execute(
            select(FaceEnrollmentSession.session_id).where(
                FaceEnrollmentSession.user_id == user_id
            )
        ).scalar()

        if existing:
            raise HTTPException(status_code=400, detail="Enrollment already approved")

        session = FaceEnrollmentSession(
            session_id=uuid.uuid4(),
            user_id=user.user_id,
            organization_id=user.organization_id,
            status="started"
        )

        db.add(session)

        user.approved_by = current_user.user_id
        user.approved_at = datetime.utcnow()

        db.commit()

        return {"message": "Face enrollment request approved"}


    @staticmethod
    def reject_request(db, current_user, user_id):

        user = db.execute(
            select(User).where(
                User.user_id == user_id,
                User.organization_id == current_user.organization_id
            )
        ).scalars().first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.status = UserStatusEnum.REJECTED

        db.commit()

        return {"message": "Request rejected"}