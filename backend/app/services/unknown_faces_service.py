from sqlalchemy import select, delete
from fastapi import HTTPException
from datetime import datetime
from typing import List, Dict, Any
import os

from app.models.streams import UnknownFace
from app.models.core import User
from app.services.notification_service import NotificationService

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")

class UnknownFacesService:

    @staticmethod
    def get_unknown_faces(db, current_user) -> List[Dict[str, Any]]:
        """
        Fetches unresolved faces and constructs full Supabase URLs for the frontend.
        """
        query = (
            select(UnknownFace)
            .where(
                UnknownFace.organization_id == current_user.organization_id,
                UnknownFace.resolved == False  # Only return active alerts
            )
            .order_by(UnknownFace.detected_time.desc())
        )

        result = db.execute(query)
        faces = result.scalars().all()

        formatted_faces = []
        for face in faces:
            image_url = f"{SUPABASE_URL}/storage/v1/object/public/face-images/{face.image_path}"
            
            formatted_faces.append({
                "unknown_id": face.unknown_id,
                "stream_id": face.stream_id,
                "organization_id": face.organization_id,
                "image_path": image_url,
                "detected_time": face.detected_time,
                "confidence_score": face.confidence_score,
                "resolved": face.resolved,
                "status": face.status
            })

        return formatted_faces

    @staticmethod
    def resolve_unknown_face(db, current_user, data):
        """
        Maps a face to an existing employee or flags it as a security alert.
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

        # CASE 1: MAP EMPLOYEE
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
                raise HTTPException(404, "Target employee not found in your organization")

            face.resolved_user_id = employee.user_id
            face.status = f"Mapped to {employee.full_name}"

        # CASE 2: SECURITY ALERT
        elif data.action == "SECURITY_ALERT":
            face.status = "Flagged as Security Risk"

        else:
            raise HTTPException(400, "Invalid action specified")

        face.resolved = True
        face.resolved_by = current_user.user_id
        face.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(face)

        # Trigger Notification
        target_id = face.resolved_user_id if face.resolved_user_id else current_user.user_id
        message = (f"Identity confirmed: {face.status}" if face.resolved_user_id 
                   else "Security log updated: Unknown face marked.")

        NotificationService.create_notification(
            db,
            target_id,
            current_user.organization_id,
            message,
            "INFO",
            redirect_path="/admin/unknown-faces",
            entity_id=face.unknown_id,
            event_type="UNKNOWN_FACE_RESOLVED"
        )
        
        return {"message": "Unknown face resolved successfully"}

    @staticmethod
    def delete_unknown_face(db, unknown_id, current_user):
        """
        Permanently removes a face detection record from the organization logs.
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