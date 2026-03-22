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
from app.services.notification_service import NotificationService

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

        print(f"Found {len(images)} images in DB")

        embeddings = []
        processed_records = []

        for img in images:

            try:
                # Download image from Supabase
                response = supabase.storage.from_(BUCKET).download(img.image_path)

                if not response:
                    print(f"Failed to download {img.image_path}")
                    continue

                embedding = extract_face_embedding(response, is_admin_approval=True)

                if embedding is not None:
                    embeddings.append(embedding)
                    processed_records.append(img)
                    print(f"Successfully processed {img.image_path}")

            except Exception as e:
                print(f"Image {img.image_path} failed embedding: {str(e)}")
                continue

        # Ensure enough embeddings exist BEFORE activating user
        if len(embeddings) < 5:
            raise HTTPException(
                status_code=400,
                detail=f"Only {len(embeddings)} images passed embedding check"
            )

        # Generate final embedding
        mean_embedding = np.mean(embeddings, axis=0)

        # Store biometric
        biometric = FacialBiometric(
            user_id=session.user_id,
            organization_id=session.organization_id,
            face_encoding=mean_embedding.tolist(),
            model_version="buffalo_l",
            is_active=True
        )

        db.add(biometric)
        db.flush()

        # Delete images from Supabase after successful embedding generation
        for img_record in processed_records:

            try:
                supabase.storage.from_(BUCKET).remove([img_record.image_path])
            except Exception:
                print(f"Failed to delete storage file {img_record.image_path}")

            db.delete(img_record)

        # Mark session completed
        session.status = "completed"

        # Activate user ONLY AFTER biometric creation
        user = db.execute(
            select(User).where(User.user_id == session.user_id)
        ).scalars().first()

        if user:
            
            if user.status != UserStatusEnum.APPROVED:
                raise HTTPException(400, "User must be approved before activation")
            
            user.face_enrolled = True
            user.status = UserStatusEnum.ACTIVE
            user.is_active = True

        db.commit()

        NotificationService.create_notification(
            db,
            user.user_id,
            user.organization_id,
            "Face enrollment approved. Your biometric data has been generated.",
            "SUCCESS",
            redirect_path="/dashboard",
            event_type="FACE_ENROLLMENT_APPROVED"
        )

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
                print(f"Failed to delete storage file {img.image_path}")

            db.delete(img)

        session.status = "failed"

        user = db.execute(
            select(User).where(User.user_id == session.user_id)
        ).scalars().first()

        if user:
            user.status = UserStatusEnum.PENDING

        db.commit()

        NotificationService.create_notification(
            db,
            user.user_id,
            user.organization_id,
            "Face enrollment rejected. Please upload new images.",
            "ERROR",
            redirect_path="/face-enrollment",
            event_type="FACE_ENROLLMENT_REJECTED"
        )

        return {"message": "Enrollment rejected and images cleared"}