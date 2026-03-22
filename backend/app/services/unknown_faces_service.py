from sqlalchemy import select
from fastapi import HTTPException
from datetime import datetime

from app.models.streams import UnknownFace
from app.models.core import User
from app.services.notification_service import NotificationService


class UnknownFacesService:

    @staticmethod
    def get_unknown_faces(db, current_user):

        query = select(UnknownFace).where(
            UnknownFace.organization_id == current_user.organization_id,
            UnknownFace.resolved == False
        ).order_by(UnknownFace.detected_time.desc())

        result = db.execute(query)

        faces = result.scalars().all()

        return faces


    @staticmethod
    def resolve_unknown_face(db, current_user, data):

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
                raise HTTPException(400, "employee_id required")

            user_result = db.execute(
                select(User).where(
                    User.user_id == data.employee_id,
                    User.organization_id == current_user.organization_id
                )
            )

            employee = user_result.scalars().first()

            if not employee:
                raise HTTPException(404, "Employee not found")

            face.resolved_user_id = employee.user_id
            face.status = "Mapped to employee"


        # CASE 2: SECURITY ALERT

        elif data.action == "SECURITY_ALERT":

            face.status = "Security alert"


        else:
            raise HTTPException(400, "Invalid action")


        face.resolved = True
        face.resolved_by = current_user.user_id
        face.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(face)

    
        if face.resolved_user_id:
            message = "You were identified from an unknown face detection"
        else:
            message = "Security alert: Unknown face marked"

        NotificationService.create_notification(
            db,
            face.resolved_user_id if face.resolved_user_id else current_user.user_id,
            current_user.organization_id,
            message,
            "INFO",
            redirect_path="/admin/unknown-faces",
            entity_id=face.unknown_id,
            event_type="UNKNOWN_FACE_RESOLVED"
        )
        
        return {"message": "Unknown face resolved"}