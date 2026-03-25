from sqlalchemy import select, delete
from fastapi import HTTPException
from datetime import datetime, timezone
from typing import List, Dict, Any
import os

from sqlalchemy.orm import joinedload
from app.models.streams import UnknownFace, VideoStream, Camera
from app.models.core import User
from app.services.notification_service import NotificationService

# Ensure trailing slash is handled for clean URL construction
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")

class UnknownFacesService:

    @staticmethod
    def get_unknown_faces(db, current_user) -> List[Dict[str, Any]]:
        """
        Fetches unresolved faces with eager-loaded camera names and Supabase URLs.
        """
        query = (
            select(UnknownFace)
            .join(VideoStream, UnknownFace.stream_id == VideoStream.stream_id)
            .join(Camera, VideoStream.camera_id == Camera.camera_id)
            .where(
                UnknownFace.organization_id == current_user.organization_id,
                UnknownFace.resolved == False
            )
            .options(joinedload(UnknownFace.stream).joinedload(VideoStream.camera))
            .order_by(UnknownFace.detected_time.desc())
        )

        faces = db.execute(query).scalars().all()
    
        formatted_faces = []
        for face in faces:
            # Construct the Supabase Public URL
            image_url = f"{SUPABASE_URL}/storage/v1/object/public/face-images/{face.image_path}"
            
            # Match the 'camera_name' column from your Camera model
            camera_name = face.stream.camera.camera_name if face.stream and face.stream.camera else "Unknown Camera"

            formatted_faces.append({
                "unknown_id": face.unknown_id,
                "stream_id": face.stream_id,
                "camera_name": camera_name,
                "image_path": image_url,
                "detected_time": face.detected_time,
                "confidence_score": face.confidence_score,
                "resolved": face.resolved,
                "status": face.status or "Unresolved"
            })

        return formatted_faces

    @staticmethod
    def resolve_unknown_face(db, current_user, data):
        """
        Maps a face to an existing user or flags it as a security alert.
        """
        result = db.execute(
            select(UnknownFace).where(
                UnknownFace.unknown_id == data.unknown_id,
                UnknownFace.organization_id == current_user.organization_id
            )
        )

        face = result.scalars().first()

        if not face:
            raise HTTPException(404, "Unknown face not found")

        if face.resolved:
            raise HTTPException(400, "Face already resolved")

        # CASE 1: MAP TO EXISTING USER (EMPLOYEE)
        if data.action == "MAP_EMPLOYEE":
            if not data.employee_id:
                raise HTTPException(400, "employee_id required for mapping")

            user_result = db.execute(
                select(User).where(
                    User.user_id == data.employee_id,
                    User.organization_id == current_user.organization_id
                )
            )
            employee = user_result.scalars().first()

            if not employee:
                raise HTTPException(404, "Target user not found in your organization")

            # Link the face to the identified user
            face.resolved_user_id = employee.user_id
            face.status = f"Mapped to {employee.full_name or 'Employee'}"

        # CASE 2: SECURITY ALERT
        elif data.action == "SECURITY_ALERT":
            face.status = "Flagged as Security Risk"
            face.resolved_user_id = None # Remains unlinked to a specific user

        else:
            raise HTTPException(400, "Invalid action specified")

        # Update resolution metadata as per your model
        face.resolved = True
        face.resolved_by = current_user.user_id  # The Admin performing the action
        face.resolved_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(face)

        # Trigger Notification to the Admin or the newly identified User
        notification_target = face.resolved_user_id if face.resolved_user_id else current_user.user_id
        msg_body = f"Detection Resolved: {face.status}"

        NotificationService.create_notification(
            db,
            user_id=notification_target,
            organization_id=current_user.organization_id,
            message=msg_body,
            type="INFO",
            redirect_path="/admin/monitoring#unknown-faces",
            entity_id=str(face.unknown_id),
            event_type="UNKNOWN_FACE_RESOLVED"
        )
        
        return {"message": "Unknown face resolved successfully", "status": face.status}

    @staticmethod
    def delete_unknown_face(db, unknown_id, current_user):
        """
        Permanently removes a face detection record.
        """
        query = delete(UnknownFace).where(
            UnknownFace.unknown_id == unknown_id,
            UnknownFace.organization_id == current_user.organization_id
        )
        
        result = db.execute(query)
        db.commit()

        if result.rowcount == 0:
            raise HTTPException(404, "Face detection record not found")

        return {"message": "Detection record permanently deleted"}