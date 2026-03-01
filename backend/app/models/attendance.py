import uuid
from sqlalchemy import Column, String, Date, Time, DateTime, Float, ForeignKey, Boolean, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from app.models.core import TenantMixin

attendance_status_enum = Enum(
    "present",
    "absent",
    "half_day",
    "on_leave",
    name="attendance_status_enum"
)

attendance_event_type_enum = Enum(
    "check_in",
    "check_out",
    "passby",
    name="attendance_event_type_enum"
)

recognition_method_enum = Enum(
    "face",
    "live_call",
    name="recognition_method_enum"
)

attendance_correction_status_enum = Enum(
    "pending",
    "approved",
    "rejected",
    name="attendance_correction_status_enum"
)

class AttendanceEvent(TenantMixin, Base):
    __tablename__ = "attendance_events"
    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    camera_id = Column(UUID(as_uuid=True), ForeignKey("cameras.camera_id", ondelete="SET NULL"), nullable=True, index=True)
    scan_timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    event_type = Column(attendance_event_type_enum, nullable=False)
    confidence_score = Column(Float, nullable=True)
    recognition_method = Column(recognition_method_enum,nullable=False, server_default="face")

    user = relationship("User", back_populates="attendance_events")
    camera = relationship("Camera", back_populates="events")

class Attendance(TenantMixin, Base):
    __tablename__ = "attendance"
    attendance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    attendance_date = Column(Date, nullable=False)
    first_check_in = Column(Time)
    last_check_out = Column(Time)
    status = Column(attendance_status_enum, nullable=False) 
    generated_at= Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "attendance_date",
            name="uq_attendance_user_date"
        ),
        Index(
            "ix_attendance_org_user",
            "organization_id",
            "user_id"
        ),
    )
    
    user = relationship("User", back_populates="attendance_records")
    corrections = relationship("AttendanceCorrection", back_populates="attendance_record", cascade="all, delete-orphan")

class AttendanceCorrection(TenantMixin, Base):
    __tablename__ = "attendance_corrections"
    correction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attendance_id = Column(UUID(as_uuid=True), ForeignKey("attendance.attendance_id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    requested_time_in = Column(Time)
    requested_time_out = Column(Time)
    reason = Column(String, nullable=False)
    status = Column(attendance_correction_status_enum, nullable=False, default="pending") 
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    attendance_record = relationship("Attendance", back_populates="corrections")
    user = relationship("User", back_populates="attendance_corrections", foreign_keys=[user_id])