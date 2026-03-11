from sqlalchemy import select
from fastapi import HTTPException
from typing import List, Dict, Any

from app.models.core import User
from app.models.biometrics import (
    FaceEnrollmentSession,
    FaceEnrollmentImage
)


class FaceEnrollmentRequestService:


    @staticmethod
    def get_pending_requests(db, current_user) -> List[Dict[str, Any]]:

        query = (
            select(FaceEnrollmentSession)
            .join(User, FaceEnrollmentSession.user_id == User.user_id)
            .where(
                FaceEnrollmentSession.status == "pending_approval"
            )
        )

        sessions = db.execute(query).scalars().all()

        pending_requests = []

        for session in sessions:

            user = session.user

            image_query = (
                select(FaceEnrollmentImage.image_path)
                .where(FaceEnrollmentImage.session_id == session.session_id)
            )

            images = db.execute(image_query).scalars().all()

            pending_requests.append({
                "session_id": session.session_id,
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "status": session.status,
                "created_at": session.created_at,
                "images": images
            })

        return pending_requests


    @staticmethod
    def approve_enrollment(db, session_id):

        session = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.session_id == session_id
            )
        ).scalars().first()

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if session.status != "pending_approval":
            raise HTTPException(status_code=400, detail="Session not pending approval")

        session.status = "completed"

        db.commit()

        return {"message": "Face enrollment approved"}


    @staticmethod
    def reject_enrollment(db, session_id):

        session = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.session_id == session_id
            )
        ).scalars().first()

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        session.status = "failed"

        db.commit()

        return {"message": "Face enrollment rejected"}