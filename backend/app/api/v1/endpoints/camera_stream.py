import cv2
import numpy as np
import time

from fastapi import APIRouter, UploadFile, File, Form, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.camera_stream_buffer import update_frame, get_frame
from app.services.video_stream_service import ensure_stream
from app.models.streams import VideoStream

router = APIRouter(prefix="/cameras", tags=["Camera Streaming"])


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
def stream_camera(camera_id: str):

    return StreamingResponse(
        generate_stream(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


# Active streams for HR dashboard

@router.get("/active")
def get_active_streams(db: Session = Depends(get_db)):

    streams = (
        db.query(VideoStream)
        .filter(VideoStream.end_time == None)
        .all()
    )

    return streams