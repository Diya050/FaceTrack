import os
from fastapi import HTTPException
from uuid import uuid4
from sqlalchemy import select
from PIL import Image
import io
import traceback

from app.utils.supabase_storage import upload_image
from app.models.biometrics import FaceEnrollmentSession, FaceEnrollmentImage


class FaceEnrollmentService:

    @staticmethod
    async def store_images(db, current_user, files):

        print("Starting face enrollment")

        try:

            if len(files) < 5 or len(files) > 7:
                print("Invalid number of images:", len(files))
                raise HTTPException(
                    status_code=400,
                    detail="Upload between 5 and 7 images"
                )

            print("Checking existing enrollment session")

            existing = db.execute(
                select(FaceEnrollmentSession).where(
                    FaceEnrollmentSession.user_id == current_user.user_id,
                    FaceEnrollmentSession.status.in_(["started", "pending_approval"])
                )
            ).scalars().first()

            if existing:
                print("Enrollment already in progress")
                raise HTTPException(400, "Enrollment already in progress")

            print("Creating enrollment session")

            session = FaceEnrollmentSession(
                user_id=current_user.user_id,
                organization_id=current_user.organization_id,
                status="started"
            )

            db.add(session)
            db.flush()

            print("Session created with ID:", session.session_id)

            MAX_IMAGE_SIZE = 5 * 1024 * 1024

            for idx, file in enumerate(files):

                print(f"Processing file {idx+1}")

                contents = await file.read()

                print("File size:", len(contents))

                if len(contents) > MAX_IMAGE_SIZE:
                    print("Image too large")
                    raise HTTPException(400, "Image size exceeds 5MB")

                try:
                    image = Image.open(io.BytesIO(contents))
                except Exception as e:
                    print("Failed to open image:", e)
                    raise HTTPException(400, "Invalid image format")

                print("Image resolution:", image.width, image.height)

                if image.width < 100 or image.height < 100:
                    raise HTTPException(400, "Image resolution too small")

                filename = f"{uuid4()}.jpg"
                path = f"{current_user.organization_id}/{current_user.user_id}/{filename}"

                print("Uploading image to Supabase path:", path)

                try:
                    upload_image(contents, path)
                    print("Upload successful")
                except Exception as e:
                    print("UPLOAD ERROR:", e)
                    traceback.print_exc()
                    raise HTTPException(500, "Image upload failed")

                image_record = FaceEnrollmentImage(
                    session_id=session.session_id,
                    user_id=current_user.user_id,
                    image_path=path
                )

                db.add(image_record)

            session.status = "pending_approval"

            print("Committing database transaction")

            db.commit()

            print("Enrollment completed successfully")

            return {
                "session_id": str(session.session_id),
                "message": "Images uploaded successfully. Waiting for HR approval."
            }

        except Exception as e:
            print("CRITICAL ERROR:", e)
            traceback.print_exc()
            raise