import uuid
from sqlalchemy import Column, String, Date, Time, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class AttendanceEvent(Base):
    __tablename__ = "attendance_events"
    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    camera_id = Column(UUID(as_uuid=True), ForeignKey("cameras.camera_id"))
    scan_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    confidence_score = Column(Float)
    recognition_method = Column(String, default="Face")

    user = relationship("User", back_populates="attendance_events")
    camera = relationship("Camera", back_populates="events")

class Attendance(Base):
    __tablename__ = "attendance"
    attendance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    attendance_date = Column(Date, nullable=False)
    time_in = Column(Time)
    time_out = Column(Time)
    status = Column(String) 
    
    user = relationship("User", back_populates="attendance_records")
    corrections = relationship("AttendanceCorrection", back_populates="attendance_record")

class AttendanceCorrection(Base):
    __tablename__ = "attendance_corrections"
    correction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attendance_id = Column(UUID(as_uuid=True), ForeignKey("attendance.attendance_id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    requested_time_in = Column(Time)
    requested_time_out = Column(Time)
    reason = Column(String)
    status = Column(String, default="Pending") 
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance_record = relationship("Attendance", back_populates="corrections")
    user = relationship("User", back_populates="attendance_corrections", foreign_keys=[user_id])