import uuid
from sqlalchemy import Column, String, Date, Time, DateTime, Float, ForeignKey, Boolean, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base
from app.models.core import TenantMixin
from app.enums.attendance_enums import (
    AttendanceEventType,
    AttendanceStatus,
    RecognitionMethod,
    AttendanceCorrectionStatus,
)


class AttendanceEvent(TenantMixin, Base):
    __tablename__ = "attendance_events"

    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    camera_id = Column(UUID(as_uuid=True), ForeignKey("cameras.camera_id", ondelete="SET NULL"), nullable=True, index=True)

    scan_timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    event_type = Column(SqlEnum(AttendanceEventType), nullable=False)

    confidence_score = Column(Float)

    recognition_method = Column(
        SqlEnum(RecognitionMethod),
        nullable=False,
        server_default=RecognitionMethod.face.value,
    )

    user = relationship("User", back_populates="attendance_events")
    camera = relationship("Camera", back_populates="events")


class Attendance(TenantMixin, Base):
    __tablename__ = "attendance"

    attendance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    attendance_date = Column(Date, nullable=False)

    first_check_in = Column(Time)

    last_check_out = Column(Time)

    status = Column(SqlEnum(AttendanceStatus), nullable=False)

    generated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    is_deleted = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "attendance_date", name="uq_attendance_user_date"),
        Index("ix_attendance_org_user", "organization_id", "user_id"),
    )

    user = relationship("User", back_populates="attendance_records")

    corrections = relationship(
        "AttendanceCorrection",
        back_populates="attendance_record",
        cascade="all, delete-orphan",
    )


class AttendanceCorrection(TenantMixin, Base):
    __tablename__ = "attendance_corrections"

    correction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    attendance_id = Column(
        UUID(as_uuid=True),
        ForeignKey("attendance.attendance_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)

    requested_time_in = Column(Time)

    requested_time_out = Column(Time)

    reason = Column(String, nullable=False)

    status = Column(
        SqlEnum(AttendanceCorrectionStatus),
        nullable=False,
        default=AttendanceCorrectionStatus.pending,
    )

    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL"))

    reviewed_at = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    attendance_record = relationship("Attendance", back_populates="corrections")

    user = relationship("User", foreign_keys=[user_id])

    reviewer = relationship("User", foreign_keys=[reviewed_by])


class AttendanceRule(TenantMixin, Base):
    __tablename__ = "attendance_rules"

    rule_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    rule_name = Column(String, nullable=False)

    start_time = Column(Time, nullable=False)

    end_time = Column(Time, nullable=False)

    status_effect = Column(
        SqlEnum(AttendanceStatus),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    is_deleted = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )

    __table_args__ = (

        # prevents duplicate time windows in same organization
        UniqueConstraint(
            "organization_id",
            "start_time",
            "end_time",
            name="uq_attendance_rule_window"
        ),

        # faster rule lookup
        Index(
            "ix_attendance_rules_org_time",
            "organization_id",
            "start_time",
            "end_time"
        ),
    )
