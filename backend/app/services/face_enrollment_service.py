import os
from fastapi import HTTPException
from datetime import datetime
from uuid import uuid4
from sqlalchemy import select
from PIL import Image
import io

from app.models.biometrics import FaceEnrollmentSession, FaceEnrollmentImage

UPLOAD_DIR = "uploads/faces"


class FaceEnrollmentService:

    @staticmethod
    async def store_images(db, current_user, files):

        if len(files) < 5 or len(files) > 7:
            raise HTTPException(
                status_code=400,
                detail="Upload between 5 and 7 images"
            )
        
        existing = db.execute(
                select(FaceEnrollmentSession).where(
                    FaceEnrollmentSession.user_id == current_user.user_id,
                    FaceEnrollmentSession.status.in_(["started", "pending_approval"])
                )
            ).scalars().first()

        if existing:
            raise HTTPException(400, "Enrollment already in progress")

        # Create session FIRST
        session = FaceEnrollmentSession(
            user_id=current_user.user_id,
            organization_id=current_user.organization_id,
            status="started"
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        # Ensure upload folder exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Store images
        for file in files:

            contents = await file.read()
            image = Image.open(io.BytesIO(contents))

            if image.width < 100 or image.height < 100:
                raise HTTPException(400, "Image resolution too small")

            filename = f"{uuid4()}.jpg"
            filepath = os.path.join(UPLOAD_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(contents)

            image_record = FaceEnrollmentImage(
                session_id=session.session_id,
                user_id=current_user.user_id,
                image_path=filename
            )

            db.add(image_record)

        session.status = "pending_approval"
        db.commit()

        return {
            "session_id": str(session.session_id),
            "message": "Images uploaded successfully. Waiting for HR approval."
        }