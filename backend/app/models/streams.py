import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from app.models.core import TenantMixin

class Camera(TenantMixin, Base):
    __tablename__ = "cameras"
    camera_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_name = Column(String, nullable=False)
    camera_type = Column(String) 
    location = Column(String)
    ip_address = Column(String)
    device_identifier=Column(String, nullable=False, unique=True, index=True)
    status = Column(String, nullable=False, server_default="online")
    last_heartbeat = Column(DateTime(timezone=True))

    events = relationship("AttendanceEvent", back_populates="camera", cascade="all, delete", passive_deletes=True)
    streams = relationship("VideoStream", back_populates="camera", cascade="all, delete", passive_deletes=True)

class VideoStream(TenantMixin, Base):
    __tablename__ = "video_streams"
    stream_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_id = Column(UUID(as_uuid=True), ForeignKey("cameras.camera_id", ondelete="CASCADE"), nullable=False,index=True)
    stream_url = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    end_time = Column(DateTime(timezone=True))
    processed_status = Column(String, nullable=False, server_default="processing")

    camera = relationship("Camera", back_populates="streams")
    unknown_faces = relationship("UnknownFace", back_populates="stream", cascade="all, delete", passive_deletes=True)

class UnknownFace(TenantMixin, Base):
    __tablename__ = "unknown_faces"
    unknown_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stream_id = Column(UUID(as_uuid=True), ForeignKey("video_streams.stream_id", ondelete="CASCADE"), nullable=False, index=True)
    detected_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    image_path = Column(String, nullable=False) 
    status = Column(String, default="Unresolved")
    confidence_score = Column(Float)
    
    resolved = Column(Boolean, nullable=False, server_default="false")
    resolved_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    resolved_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
    )
    resolved_at = Column(DateTime(timezone=True))
    stream = relationship("VideoStream", back_populates="unknown_faces")