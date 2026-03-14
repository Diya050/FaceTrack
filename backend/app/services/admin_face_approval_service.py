import numpy as np
from sqlalchemy import select
from fastapi import HTTPException

from app.services.face_embedding_service import extract_face_embedding
from app.models.biometrics import (
    FacialBiometric,
    FaceEnrollmentSession,
    FaceEnrollmentImage
)
from app.models.core import User, UserStatusEnum
from app.utils.supabase_storage import supabase

BUCKET = "face-images"


class AdminFaceApprovalService:

    @staticmethod
    def approve_enrollment(db, session_id):

        session = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.session_id == session_id
            )
        ).scalars().first()

        if not session:
            raise HTTPException(404, "Session not found")

        images = db.execute(
            select(FaceEnrollmentImage).where(
                FaceEnrollmentImage.session_id == session_id
            )
        ).scalars().all()

        print(f"DEBUG: Found {len(images)} images in DB")

        embeddings = []
        processed_records = []

        for img in images:

            try:
                # Download image from Supabase
                response = supabase.storage.from_(BUCKET).download(img.image_path)

                if not response:
                    print(f"DEBUG: Failed to download {img.image_path}")
                    continue

                embedding = extract_face_embedding(response, is_admin_approval=True)

                if embedding is not None:
                    embeddings.append(embedding)
                    processed_records.append(img)
                    print(f"DEBUG: Successfully processed {img.image_path}")

            except Exception as e:
                print(f"DEBUG: Image {img.image_path} failed embedding: {str(e)}")
                continue

        if len(embeddings) < 3:
            raise HTTPException(
                status_code=400,
                detail=f"Only {len(embeddings)} images passed embedding check"
            )

        mean_embedding = np.mean(embeddings, axis=0)

        biometric = FacialBiometric(
            user_id=session.user_id,
            organization_id=session.organization_id,
            face_encoding=mean_embedding.tolist(),
            model_version="buffalo_l",
            is_active=True
        )

        db.add(biometric)
        db.flush()

        # Delete images from Supabase after approval
        for img_record in processed_records:

            try:
                supabase.storage.from_(BUCKET).remove([img_record.image_path])
            except Exception as e:
                print(f"DEBUG: Failed to delete storage file {img_record.image_path}")

            db.delete(img_record)

        session.status = "completed"

        user = db.execute(
            select(User).where(User.user_id == session.user_id)
        ).scalars().first()

        if user:
            user.face_enrolled = True
            user.status = UserStatusEnum.ACTIVE

        db.commit()

        return {"message": "Face enrollment approved successfully"}

    @staticmethod
    def reject_enrollment(db, session_id):

        session = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.session_id == session_id
            )
        ).scalars().first()

        if not session:
            raise HTTPException(404, "Session not found")

        images = db.execute(
            select(FaceEnrollmentImage).where(
                FaceEnrollmentImage.session_id == session_id
            )
        ).scalars().all()

        for img in images:

            try:
                supabase.storage.from_(BUCKET).remove([img.image_path])
            except Exception as e:
                print(f"DEBUG: Failed to delete storage file {img.image_path}")

            db.delete(img)

        session.status = "failed"

        user = db.execute(
            select(User).where(User.user_id == session.user_id)
        ).scalars().first()

        if user:
            user.status = UserStatusEnum.PENDING

        db.commit()

        return {"message": "Enrollment rejected and images cleared"}