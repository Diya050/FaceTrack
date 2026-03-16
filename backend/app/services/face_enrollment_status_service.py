from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.core import User
from app.models.biometrics import FaceEnrollmentSession, FaceEnrollmentImage

def get_face_enrollment_status(db: Session, user_id: str):
    # Fetch user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch enrollment session
    session = db.query(FaceEnrollmentSession).filter(FaceEnrollmentSession.user_id == user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="No enrollment session found")

    # Fetch submitted images
    images = db.query(FaceEnrollmentImage).filter(FaceEnrollmentImage.session_id == session.session_id).all()

    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "session_id": str(session.session_id),
        "face_enrolled": user.face_enrolled,
        "status": session.status,
        "submitted_images": [{"image_path": img.image_path} for img in images],
        "created_at": session.created_at,
        "updated_at": session.updated_at
    }
