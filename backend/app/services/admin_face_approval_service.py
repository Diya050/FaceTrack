import numpy as np
import os
from sqlalchemy import select
from fastapi import HTTPException
from datetime import datetime

from app.services.face_embedding_service import extract_face_embedding
from app.models.biometrics import (
    FacialBiometric,
    FaceEnrollmentSession,
    FaceEnrollmentImage
)
from app.models.core import User, UserStatusEnum

class AdminFaceApprovalService:
    @staticmethod
    async def approve_enrollment(db, session_id):
        session = db.execute(
            select(FaceEnrollmentSession).where(FaceEnrollmentSession.session_id == session_id)
        ).scalars().first()

        if not session:
            print(f"DEBUG: Session {session_id} not found in DB")
            raise HTTPException(404, "Session not found")
        
        images = db.execute(
            select(FaceEnrollmentImage).where(FaceEnrollmentImage.session_id == session_id)
        ).scalars().all()

        print(f"DEBUG: Found {len(images)} image records in DB for this session.")

        embeddings = []
        processed_records = []

        for img in images:
            # --- CRITICAL CHECK: Path Construction ---
            # Try absolute path to be 100% sure
            base_dir = os.path.abspath(os.getcwd())
            filepath = os.path.join(base_dir, "uploads", "faces", img.image_path)
            
            if not os.path.exists(filepath):
                print(f"DEBUG: FILE MISSING! Checked: {filepath}")
                continue
                
            try:
                with open(filepath, "rb") as f:
                    image_bytes = f.read()

                embedding = extract_face_embedding(image_bytes, is_admin_approval=True)
                
                if embedding is not None:
                    embeddings.append(embedding)
                    processed_records.append((filepath, img))
                    print(f"DEBUG: Successfully processed {img.image_path}")
            except Exception as e:
                print(f"DEBUG: Image {img.image_path} failed embedding: {str(e)}")
                continue

        # This is where your 400 is coming from
        if len(embeddings) < 3:
            error_msg = f"Only {len(embeddings)} images passed. Check terminal DEBUG logs."
            print(f"DEBUG: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)

        # Success path
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

        for filepath, img_record in processed_records:
            if os.path.exists(filepath):
                os.remove(filepath)
            db.delete(img_record)

        session.status = "completed"
        user.face_enrolled = True
        user = db.execute(select(User).where(User.user_id == session.user_id)).scalars().first()
        if user:
            user.status = UserStatusEnum.ACTIVE

        db.commit()
        return {"message": "Success"}
    
    @staticmethod
    async def reject_enrollment(db, session_id):
        # 1. Fetch Session
        session = db.execute(
            select(FaceEnrollmentSession).where(FaceEnrollmentSession.session_id == session_id)
        ).scalars().first()

        if not session:
            raise HTTPException(404, "Session not found")

        # 2. Get images to clean up disk space
        images = db.execute(
            select(FaceEnrollmentImage).where(FaceEnrollmentImage.session_id == session_id)
        ).scalars().all()

        for img in images:
            filepath = os.path.join("uploads", "faces", img.image_path)
            if os.path.exists(filepath):
                os.remove(filepath)
            db.delete(img)

        # 3. Update status to rejected
        session.status = "failed"
        
        # 4. Optional: Reset User status so they can try again
        user = db.execute(select(User).where(User.user_id == session.user_id)).scalars().first()
        if user:
            user.status = UserStatusEnum.PENDING

        db.commit()
        return {"message": "Enrollment rejected and images cleared."}