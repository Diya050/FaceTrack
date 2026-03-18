from sqlalchemy import select
from app.models.biometrics import FaceEnrollmentSession

class FaceEnrollmentUserService:

    @staticmethod
    def get_my_status(db, user):
        session = db.execute(
            select(FaceEnrollmentSession)
            .where(
                FaceEnrollmentSession.user_id == user.user_id,
                FaceEnrollmentSession.status.in_([
                    "started",
                    "pending_approval"
                ])
            )
            .order_by(FaceEnrollmentSession.created_at.desc())
        ).scalars().first()

        if not session:
            return {
                "has_request": False,
                "status": None,
                "session_id": None
            }

        return {
            "has_request": True,
            "status": session.status,
            "session_id": session.session_id
        }