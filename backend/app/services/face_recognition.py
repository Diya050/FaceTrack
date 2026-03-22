import uuid
import cv2
import numpy as np
from datetime import datetime, timezone
from sqlalchemy import select

from insightface.app import FaceAnalysis
from app.models.streams import Camera, VideoStream, UnknownFace
from app.models.biometrics import FacialBiometric
from app.models.core import User
from app.services.attendance_service import record_attendance_event
from app.utils.supabase_storage import upload_image
from app.enums.attendance_enums import AttendanceEventType
from app.services.face_embedding_service import get_face_app
from app.services.notification_service import NotificationService


THRESHOLD = 0.65
UNKNOWN_SIMILARITY_THRESHOLD = 0.85
UNKNOWN_COOLDOWN_SECONDS = 60
UNKNOWN_FACE_CACHE = {}

def recognize_frame(db, frame, camera_id):

    face_app = get_face_app()

    faces = face_app.get(frame)
    
    if isinstance(camera_id, str):
        from uuid import UUID
        camera_id = UUID(camera_id)

    camera = db.execute(
        select(Camera).where(Camera.camera_id == camera_id)
    ).scalar_one_or_none()

    if not camera:
        return []

    organization_id = camera.organization_id

    # Ensure active VideoStream exists for Foreign Key constraints
    stream = db.query(VideoStream).filter(
        VideoStream.camera_id == camera_id,
        VideoStream.processed_status == "processing",
        VideoStream.organization_id == organization_id
    ).first()

    if not stream:
        stream = VideoStream(
            camera_id=camera_id,
            organization_id=organization_id,
            stream_url=camera.ip_address if camera.ip_address else f"internal://{camera_id}",
            processed_status="processing" 
        )
        db.add(stream)
        db.commit()
        db.refresh(stream)

    faces = face_app.get(frame)
    results = []
    should_commit = False

    for face in faces:
        embedding = face.embedding
        
        # Recognition Query
        result = db.execute(
            select(
                FacialBiometric,
                FacialBiometric.face_encoding.cosine_distance(embedding).label("distance")
            )
            .where(
                FacialBiometric.organization_id == organization_id,
                FacialBiometric.is_active == True
            )
            .order_by("distance")
            .limit(1)
        )

        match = result.first()
        similarity_score = (1 - match.distance) if match else 0

        # Use the helper function for the recognition decision
        recognition_result = process_recognition(
            db=db,
            matched_user=match.FacialBiometric.user if match else None,
            camera_id=camera_id,
            similarity_score=similarity_score
        )

        if recognition_result["status"] == "recognized":
            results.append(recognition_result)
            continue

        # Handle Unknown/Uncertain faces
        if not should_store_unknown(camera_id, embedding):
            results.append({"status": "unknown"})
            continue

        # Image processing for UnknownFace storage
        bbox = face.bbox.astype(int)
        x1, y1, x2, y2 = max(0, bbox[0]), max(0, bbox[1]), bbox[2], bbox[3]
        h, w, _ = frame.shape
        x2, y2 = min(w, x2), min(h, y2)
        
        face_img = frame[y1:y2, x1:x2]
        if face_img.size > 0:
            _, buffer = cv2.imencode(".jpg", face_img)
            image_bytes = buffer.tobytes()
            filename = f"unknown/{organization_id}/{uuid.uuid4()}.jpg"

            upload_image(image_bytes, filename)
            
            unknown = UnknownFace(
                stream_id=stream.stream_id,
                organization_id=organization_id,
                image_path=filename,
                resolved=False,
                confidence_score=similarity_score if match else None,
                status="Unresolved"
            )
            db.add(unknown)
            should_commit = True
            
            results.append({
                "status": "unknown",
                "unknown_id": str(unknown.unknown_id)
            })

    if should_commit:
        db.commit()
        hr_admins = db.query(User).filter(
            User.organization_id == organization_id,
            User.role.has(role_name="HR_ADMIN")
        ).all()

        for hr in hr_admins:
            NotificationService.create_notification(
                db,
                hr.user_id,
                organization_id,
                "Unknown face detected on camera",
                "ALERT",
                redirect_path="/admin/unknown-faces",
                event_type="UNKNOWN_FACE_DETECTED"
            )
        
    
    
    return results

def process_recognition(db, matched_user, camera_id, similarity_score):
    """
    Original logic preserved: Attendance event generated ONLY when face is recognized
    """
    if matched_user and similarity_score >= THRESHOLD:
        try:
            record_attendance_event(
                db=db,
                user_id=matched_user.user_id,
                camera_id=camera_id,
                organization_id=matched_user.organization_id,
                confidence_score=similarity_score,
                recognition_method="face",
                event_type=AttendanceEventType.passby
            )
        except Exception as e:
            print(f"Attendance logging failed: {e}")

        return {
            "status": "recognized",
            "user_id": str(matched_user.user_id),
            "confidence": round(similarity_score, 3)
        }
    
    return {"status": "unknown_store"}

def should_store_unknown(camera_id, embedding):
    now = datetime.now(timezone.utc)
    cache = UNKNOWN_FACE_CACHE.get(camera_id)

    if cache is None:
        UNKNOWN_FACE_CACHE[camera_id] = {"embedding": embedding, "timestamp": now}
        return True

    last_embedding = cache["embedding"]
    last_time = cache["timestamp"]

    similarity = np.dot(embedding, last_embedding) / (
        np.linalg.norm(embedding) * np.linalg.norm(last_embedding)
    )

    if similarity > UNKNOWN_SIMILARITY_THRESHOLD:
        if (now - last_time).total_seconds() < UNKNOWN_COOLDOWN_SECONDS:
            return False

    UNKNOWN_FACE_CACHE[camera_id] = {"embedding": embedding, "timestamp": now}
    return True