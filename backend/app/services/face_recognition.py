import cv2
import numpy as np
from sqlalchemy import select
from insightface.app import FaceAnalysis
from datetime import datetime, timedelta, timezone

from app.models.streams import Camera
from app.models.biometrics import FacialBiometric
from app.services.attendance_service import record_attendance_event
from app.enums.attendance_enums import AttendanceEventType

THRESHOLD = 0.65

face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=-1, det_size=(640, 640))


def recognize_frame(db, frame, camera_id):

    camera = db.execute(
        select(Camera).where(Camera.camera_id == camera_id)
    ).scalar_one_or_none()

    if not camera:
        return []

    organization_id = camera.organization_id
    faces = face_app.get(frame)

    results = []

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
            results.append({"status": "unknown"})
            continue

        matched_user = match.FacialBiometric.user
        similarity_score = 1 - match.distance

        recognition_result = process_recognition(
            db=db,
            matched_user=matched_user,
            camera_id=camera_id,
            similarity_score=similarity_score
        )

        results.append(recognition_result)

    return results


def process_recognition(db, matched_user, camera_id, similarity_score):

    if similarity_score < THRESHOLD:
        return {"status": "unknown"}

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