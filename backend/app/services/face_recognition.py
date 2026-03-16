from uuid import uuid4

import cv2
import numpy as np
from sqlalchemy import select
from insightface.app import FaceAnalysis
from datetime import datetime, timedelta

from app.models.streams import Camera, VideoStream, UnknownFace
from app.models.biometrics import FacialBiometric
from app.services.attendance_service import record_attendance_event
from app.utils.supabase_storage import upload_image
from app.enums.attendance_enums import AttendanceEventType

THRESHOLD = 0.65

UNKNOWN_FACE_CACHE = {}
UNKNOWN_SIMILARITY_THRESHOLD = 0.85
UNKNOWN_COOLDOWN_SECONDS = 60

face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=-1, det_size=(640, 640))


def recognize_frame(db, frame, camera_id):

    camera = db.execute(
        select(Camera).where(Camera.camera_id == camera_id)
    ).scalar_one_or_none()

    if not camera:
        return []

    organization_id = camera.organization_id

    # get or create active video stream
    stream = db.query(VideoStream).filter(
        VideoStream.camera_id == camera_id,
        VideoStream.processed_status == "processing"
    ).first()

    if not stream:
        stream = VideoStream(
            camera_id=camera_id,
            organization_id=organization_id
        )
        db.add(stream)
        db.commit()
        db.refresh(stream)

    faces = face_app.get(frame)

    results = []
    unknown_faces_added = False

    for face in faces:

        embedding = face.embedding

        result = db.execute(
            select(
                FacialBiometric,
                FacialBiometric.face_encoding.cosine_distance(embedding).label("distance")
            )
            .where(
                FacialBiometric.organization_id == organization_id,
                FacialBiometric.is_active == True
            )
            .order_by(FacialBiometric.face_encoding.cosine_distance(embedding))
            .limit(1)
        )

        match = result.first()

        if not match:

            # crop face
            bbox = face.bbox.astype(int)
            x1, y1, x2, y2 = bbox

            h, w, _ = frame.shape

            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)

            face_img = frame[y1:y2, x1:x2]

            if face_img.size == 0:
                continue

            _, buffer = cv2.imencode(".jpg", face_img)
            image_bytes = buffer.tobytes()

            filename = f"unknown/{organization_id}/{uuid4()}.jpg"

            if not should_store_unknown(camera_id, embedding):
                results.append({"status": "unknown"})
                continue

            upload_image(image_bytes, filename)

            unknown = UnknownFace(
                stream_id=stream.stream_id,
                organization_id=organization_id,
                image_path=filename,
                confidence_score=None
            )

            db.add(unknown)
            unknown_faces_added = True
            
            results.append({
                "status": "unknown",
                "unknown_id": str(unknown.unknown_id)
            })

            continue

        matched_user = match.FacialBiometric.user
        similarity_score = 1 - match.distance

        recognition_result = process_recognition(
            db=db,
            matched_user=matched_user,
            camera_id=camera_id,
            similarity_score=similarity_score
        )

        if recognition_result["status"] == "unknown_store":

            bbox = face.bbox.astype(int)
            x1, y1, x2, y2 = bbox

            h, w, _ = frame.shape

            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)

            face_img = frame[y1:y2, x1:x2]

            if face_img.size != 0:

                _, buffer = cv2.imencode(".jpg", face_img)
                image_bytes = buffer.tobytes()

                filename = f"unknown/{organization_id}/{uuid4()}.jpg"

                if should_store_unknown(camera_id, embedding):

                    upload_image(image_bytes, filename)

                    unknown = UnknownFace(
                        stream_id=stream.stream_id,
                        organization_id=organization_id,
                        image_path=filename,
                        confidence_score=similarity_score
                    )

                    db.add(unknown)
                    unknown_faces_added = True

                    results.append({
                        "status": "unknown",
                        "unknown_id": str(unknown.unknown_id)
                    })

        else:
            results.append(recognition_result)

    if unknown_faces_added:
        db.commit()
    
    return results


def process_recognition(db, matched_user, camera_id, similarity_score):

    if similarity_score < THRESHOLD:
        return {"status": "unknown_store"}

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
        print("Attendance logging failed:", e)

    return {
        "status": "recognized",
        "user_id": str(matched_user.user_id),
        "confidence": round(similarity_score, 3)
    }
    
    
def should_store_unknown(camera_id, embedding):

    now = datetime.utcnow()

    cache = UNKNOWN_FACE_CACHE.get(camera_id)

    if cache is None:
        UNKNOWN_FACE_CACHE[camera_id] = {
            "embedding": embedding,
            "timestamp": now
        }
        return True

    last_embedding = cache["embedding"]
    last_time = cache["timestamp"]

    similarity = np.dot(embedding, last_embedding) / (
        np.linalg.norm(embedding) * np.linalg.norm(last_embedding)
    )

    if similarity > UNKNOWN_SIMILARITY_THRESHOLD:
        if (now - last_time).total_seconds() < UNKNOWN_COOLDOWN_SECONDS:
            return False

    UNKNOWN_FACE_CACHE[camera_id] = {
        "embedding": embedding,
        "timestamp": now
    }

    if len(UNKNOWN_FACE_CACHE) > 200:
        oldest_camera = min(
            UNKNOWN_FACE_CACHE,
            key=lambda k: UNKNOWN_FACE_CACHE[k]["timestamp"]
        )
        del UNKNOWN_FACE_CACHE[oldest_camera]

    return True