from datetime import datetime
from sqlalchemy import desc

from app.models.streams import VideoStream


def start_stream(db, camera_id):

    stream = VideoStream(
        camera_id=camera_id,
        stream_url=f"/api/v1/cameras/{camera_id}/stream",
        processed_status="processing"
    )

    db.add(stream)
    db.commit()
    db.refresh(stream)

    return stream


def stop_stream(db, camera_id):

    stream = (
        db.query(VideoStream)
        .filter(VideoStream.camera_id == camera_id)
        .order_by(desc(VideoStream.start_time))
        .first()
    )

    if stream:
        stream.end_time = datetime.utcnow()
        stream.processed_status = "finished"

        db.commit()


def ensure_stream(db, camera_id):

    active_stream = (
        db.query(VideoStream)
        .filter(
            VideoStream.camera_id == camera_id,
            VideoStream.end_time == None
        )
        .order_by(desc(VideoStream.start_time))
        .first()
    )

    if not active_stream:
        start_stream(db, camera_id)