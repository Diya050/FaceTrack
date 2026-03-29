from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse
from jose import jwt, JWTError
from app.schemas.camera import CameraIdentify, CameraIdentifyResponse, CameraResponse
from app.services.camera_service import CameraService
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.core import User

import cv2
import numpy as np
import time
from app.services.camera_stream_buffer import update_frame, get_frame
from app.services.video_stream_service import ensure_stream
from sqlalchemy.orm import Session
from app.models.streams import VideoStream, Camera


router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("", response_model=list[CameraResponse])
def list_cameras(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """List all cameras for the organization"""
    cameras = (
        db.query(Camera)
        .filter(Camera.organization_id == user.organization_id)
        .all()
    )
    return cameras

@router.post("/identify", response_model=CameraIdentifyResponse)
def identify_camera(
    data: CameraIdentify,
    db=Depends(get_db),
    user=Depends(get_current_user)
):

    camera = CameraService.identify_or_register_camera(
        db,
        data,
        user.organization_id
    )

    return camera

# Upload frame from camera client

@router.post("/frame")
async def upload_frame(
    file: UploadFile = File(...),
    camera_id: str = Form(...),
    db: Session = Depends(get_db)
):

    image_bytes = await file.read()

    nparr = np.frombuffer(image_bytes, np.uint8)

    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Update latest frame
    update_frame(camera_id, frame)

    # Ensure stream exists
    ensure_stream(db, camera_id)

    return {"status": "frame received"}


# MJPEG streaming endpoint

def generate_stream(camera_id):

    while True:

        frame = get_frame(camera_id)

        if frame is None:
            time.sleep(0.05)
            continue

        _, jpeg = cv2.imencode(".jpg", frame)

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + jpeg.tobytes()
            + b"\r\n"
        )


@router.get("/{camera_id}/stream")
def stream_camera(
    camera_id: str,
    db: Session = Depends(get_db),
    request: Request = None,
    token: str | None = Query(default=None),
):

    auth_header = request.headers.get("Authorization") if request else None
    bearer_token = None

    if auth_header and auth_header.startswith("Bearer "):
        bearer_token = auth_header.split(" ", 1)[1]
    elif token:
        bearer_token = token

    if not bearer_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
        )

    try:
        payload = jwt.decode(
            bearer_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = (
        db.query(User)
        .filter(
            User.user_id == payload.get("sub"),
            User.is_deleted == False,
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    camera = (
        db.query(Camera)
        .filter(
            Camera.camera_id == camera_id,
            Camera.organization_id == user.organization_id,
        )
        .first()
    )

    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found",
        )

    return StreamingResponse(
        generate_stream(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


# Active streams for HR dashboard

@router.get("/active")
def get_active_streams(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    streams = (
        db.query(VideoStream)
        .join(Camera, Camera.camera_id == VideoStream.camera_id)
        .filter(Camera.organization_id == user.organization_id)
        .filter(VideoStream.end_time == None)
        .all()
    )

    return streams