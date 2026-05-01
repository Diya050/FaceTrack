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
from app.models.core import Organization
from app.utils.supabase_storage import supabase
from app.services.notification_service import NotificationService
from app.models.biometrics import FaceEnrollmentImage
from app.utils.supabase_storage import supabase 
from app.services.face_enrollment_admin_service import FaceEnrollmentAdminService
BUCKET = "face-images"


class AdminFaceApprovalService:

    @staticmethod
    def approve_enrollment(db, current_user, session_id):

        session = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.session_id == session_id
            )
        ).scalars().first()

        if not session:
            raise HTTPException(404, "Session not found")
        user = db.execute(
            select(User).where(User.user_id == session.user_id)
        ).scalars().first()

        target_role = user.role.role_name
        actor_role = current_user.role.role_name

        # ❌ HR_ADMIN cannot approve HR_ADMIN
        if target_role == "HR_ADMIN" and actor_role != "ORG_ADMIN":
            raise HTTPException(403, "Only ORG_ADMIN can approve HR_ADMIN")

        images = db.execute(
            select(FaceEnrollmentImage).where(
                FaceEnrollmentImage.session_id == session_id
            )
        ).scalars().all()

        print(f"Found {len(images)} images in DB")

        org_settings = db.execute(
            select(Organization).where(Organization.organization_id == session.organization_id)
        ).scalars().first()

        embeddings = []
        processed_records = []

        for img in images:

            try:
                # Download image from Supabase
                response = supabase.storage.from_(BUCKET).download(img.image_path)

                if not response:
                    print(f"Failed to download {img.image_path}")
                    continue

                embedding = extract_face_embedding(
                    response,
                    is_admin_approval=True,
                    min_face_size=org_settings.min_face_size if org_settings else None,
                )

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
            redirect_path="/user/dashboard",
            event_type="FACE_ENROLLMENT_APPROVED"
        )

        return {"message": "Face enrollment approved successfully"}

    @staticmethod
    def request_enrollment(db, current_user, user_id):
        user = db.execute(
            select(User).where(User.user_id == user_id, User.is_deleted == False)
        ).scalars().first()

        if user.status != UserStatusEnum.APPROVED:
            raise HTTPException(400, "User must be approved before requesting enrollment")
        
        # Logic to create session...
        session = FaceEnrollmentSession(
            user_id=user.user_id,
            organization_id=user.organization_id,
            status="started"
        )
        db.add(session)
        db.commit()
        
        # Notification logic...
        return {"session_id": session.session_id}

    @staticmethod
    def reject_enrollment(db, current_user, session_id, reason: str):
        # 1. Find the current session
        session = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.session_id == session_id
            )
        ).scalars().first()

        if not session:
            raise HTTPException(404, "Session not found")

        user_id = session.user_id

        # 2. Cleanup: Delete images from DB and Storage (Supabase/MinIO)        
        images = db.execute(
            select(FaceEnrollmentImage).where(FaceEnrollmentImage.session_id == session_id)
        ).scalars().all()

        for img in images:
            try:
                supabase.storage.from_("face-images").remove([img.image_path])
            except Exception:
                pass
            db.delete(img)

        # 3. Mark current session as failed
        session.status = "failed"
        db.commit()

        # 4. Trigger a NEW enrollment request automatically
        # This will create a NEW session and send the "HR Admin requested..." notification
        new_request = FaceEnrollmentAdminService.request_enrollment(db, current_user, user_id)

        # 5. Send an ADDITIONAL specific notification for the Rejection Reason
        NotificationService.create_notification(
            db=db,
            user_id=user_id,
            organization_id=current_user.organization_id,
            message=f"Last enrollment rejected: {reason}. Please follow the new request to try again.",
            type="ERROR",
            redirect_path="/user/capture",
            event_type="FACE_ENROLLMENT_REJECTED"
        )

        return {
            "message": "Enrollment rejected and new request generated",
            "new_session_id": new_request["session_id"]
        }