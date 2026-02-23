import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Camera(Base):
    __tablename__ = "cameras"
    camera_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_name = Column(String, nullable=False)
    camera_type = Column(String) 
    location = Column(String)
    ip_address = Column(String)
    status = Column(String, default="Online")
    last_heartbeat = Column(DateTime(timezone=True))

    events = relationship("AttendanceEvent", back_populates="camera")
    streams = relationship("VideoStream", back_populates="camera")

class VideoStream(Base):
    __tablename__ = "video_streams"
    stream_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_id = Column(UUID(as_uuid=True), ForeignKey("cameras.camera_id"))
    stream_url = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True))
    processed_status = Column(String)

    camera = relationship("Camera", back_populates="streams")
    unknown_faces = relationship("UnknownFace", back_populates="stream")

class UnknownFace(Base):
    __tablename__ = "unknown_faces"
    unknown_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stream_id = Column(UUID(as_uuid=True), ForeignKey("video_streams.stream_id"))
    detected_time = Column(DateTime(timezone=True), server_default=func.now())
    image_path = Column(String, nullable=False) 
    status = Column(String, default="Unresolved")
    confidence_score = Column(Float)

    stream = relationship("VideoStream", back_populates="unknown_faces")