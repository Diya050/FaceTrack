from sqlalchemy import not_, select
from fastapi import HTTPException
from typing import List, Dict, Any
import os

from app.models.core import User, Role
from app.models.biometrics import (
    FaceEnrollmentSession,
    FaceEnrollmentImage
)

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")


class FaceEnrollmentRequestService:

    @staticmethod
    def get_pending_requests(db, current_user) -> List[Dict[str, Any]]:

        query = (
            select(FaceEnrollmentSession)
            .join(User, FaceEnrollmentSession.user_id == User.user_id)
            .where(FaceEnrollmentSession.status == "pending_approval")
        )
        if current_user.role.role_name == "HR_ADMIN":
            query = query.where(
                not_(User.role.has(role_name="HR_ADMIN"))
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

            # Convert stored paths to full Supabase URLs
            image_urls = [
                f"{SUPABASE_URL}/storage/v1/object/public/face-images/{img}"
                for img in images
            ]

            pending_requests.append({
                "session_id": session.session_id,
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "status": session.status,
                "created_at": session.created_at,
                "images": image_urls
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