import os
from fastapi import HTTPException
from uuid import uuid4
from sqlalchemy import select
from PIL import Image
import io
import traceback

from app.utils.supabase_storage import upload_image
from app.models.biometrics import FaceEnrollmentSession, FaceEnrollmentImage
from app.models.core import User, Role
from app.services.notification_service import NotificationService
from app.services.admin_face_approval_service import AdminFaceApprovalService

class FaceEnrollmentService:

    @staticmethod
    async def store_images(db, current_user, files):
        print(f"Starting face enrollment for {current_user.full_name}")

        try:
            # 1. Validation for number of images
            if len(files) < 5 or len(files) > 7:
                raise HTTPException(status_code=400, detail="Upload between 5 and 7 images")

            # 2. Check for the session (Bypass 'started' requirement for HR_ADMINs if needed)
            session = db.execute(
                select(FaceEnrollmentSession).where(
                    FaceEnrollmentSession.user_id == current_user.user_id,
                    FaceEnrollmentSession.status == "started"
                )
            ).scalars().first()

            # If user is HR_ADMIN, we can auto-create a session if one doesn't exist
            if not session:
                if current_user.role.role_name == "HR_ADMIN":
                    session = FaceEnrollmentSession(
                        session_id=uuid4(),
                        user_id=current_user.user_id,
                        organization_id=current_user.organization_id,
                        status="started"
                    )
                    db.add(session)
                    db.flush()
                else:
                    raise HTTPException(403, detail="Face enrollment not requested by Admin")

            # 3. Process and Upload Images to Supabase
            MAX_IMAGE_SIZE = 5 * 1024 * 1024
            image_records = []

            for file in files:
                contents = await file.read()
                if len(contents) > MAX_IMAGE_SIZE:
                    raise HTTPException(400, "Image size exceeds 5MB")

                filename = f"{uuid4()}.jpg"
                path = f"{current_user.organization_id}/{current_user.user_id}/{filename}"
                
                upload_image(contents, path)

                img_record = FaceEnrollmentImage(
                    session_id=session.session_id,
                    user_id=current_user.user_id,
                    image_path=path
                )
                db.add(img_record)
                image_records.append(img_record)

            # 4. THE AUTO-APPROVAL LOGIC
            role = current_user.role.role_name

            is_org_admin = role == "ORG_ADMIN"

            if is_org_admin:
                print("DEBUG: ORG_ADMIN detected. Auto-processing embeddings...")
                db.flush()

                AdminFaceApprovalService.approve_enrollment(db, current_user, session.session_id)

                return {
                    "session_id": str(session.session_id),
                    "message": "Success! Your biometric profile is generated and you are now ACTIVE."
                }
            else:
                # Regular User Flow: Requires Manual Admin Approval
                session.status = "pending_approval"
                
                role = current_user.role.role_name

                if role == "HR_ADMIN":
                    approvers = db.query(User).filter(
                        User.organization_id == current_user.organization_id,
                        User.role.has(role_name="ORG_ADMIN")
                    ).all()
                else:
                    approvers = db.query(User).filter(
                        User.organization_id == current_user.organization_id,
                        User.role.has(Role.role_name.in_(["HR_ADMIN", "ORG_ADMIN"]))
                    ).all()
                for hr in approvers:
                    NotificationService.create_notification(
                        db, hr.user_id, hr.organization_id,
                        f"{current_user.full_name} submitted face images for approval",
                        "INFO",
                        redirect_path="/admin/manage#face-enrollment-requests",
                        event_type="FACE_ENROLLMENT_SUBMITTED"
                    )

                db.commit()
                return {
                    "session_id": str(session.session_id),
                    "message": "Images uploaded. Waiting for Admin approval."
                }
                
        except Exception as e:
            db.rollback()
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))
