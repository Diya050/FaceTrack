import numpy as np
import cv2
from fastapi import HTTPException
from insightface.app import FaceAnalysis

# Relaxed Constants
MAX_YAW = 40
MAX_PITCH = 40
MAX_IMAGE_SIZE = 8 * 1024 * 1024  # 8MB
BLUR_THRESHOLD = 15  # allow slightly blurry images
MIN_FACE_SIZE = 60

# Initialize InsightFace
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1, det_size=(640, 640))


def estimate_pose(landmarks):
    """Estimate yaw and pitch using facial landmarks"""
    left_eye = landmarks[0]
    right_eye = landmarks[1]
    nose = landmarks[2]

    eye_center = (left_eye + right_eye) / 2
    dx = nose[0] - eye_center[0]
    dy = nose[1] - eye_center[1]

    yaw = np.degrees(np.arctan2(dx, right_eye[0] - left_eye[0]))
    pitch = np.degrees(np.arctan2(dy, right_eye[0] - left_eye[0]))

    return yaw, pitch


def detect_blur(image):
    """Detect blur using Laplacian variance"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()


def extract_face_embedding(image_bytes: bytes, is_admin_approval: bool = False) -> np.ndarray:

    # File Size Check
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(400, "Image too large. Max 8MB.")

    # Decode Image
    file_bytes = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(400, "Invalid image file")

    # Relax thresholds further during admin approval
    blur_threshold = BLUR_THRESHOLD if not is_admin_approval else 10
    pose_threshold = MAX_YAW if not is_admin_approval else 50

    # Blur Check
    blur_score = detect_blur(image)

    if blur_score < blur_threshold:
        raise HTTPException(
            400,
            f"Image too blurry ({int(blur_score)}). Try holding camera steady."
        )

    # Face Detection
    faces = app.get(image)

    if len(faces) == 0:
        raise HTTPException(400, "No face detected")

    if len(faces) > 1:
        raise HTTPException(400, "Multiple faces detected")

    face = faces[0]

    # Pose Validation
    yaw, pitch = estimate_pose(face.kps)

    if abs(yaw) > pose_threshold or abs(pitch) > pose_threshold:
        raise HTTPException(
            400,
            "Face angle too extreme. Try facing the camera."
        )

    # Face Size Check
    bbox = face.bbox.astype(int)

    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]

    if width < MIN_FACE_SIZE or height < MIN_FACE_SIZE:
        raise HTTPException(
            400,
            "Face too small. Move slightly closer."
        )

    return face.embedding