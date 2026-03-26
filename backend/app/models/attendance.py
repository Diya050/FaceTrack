"""
========================

Pending improvements (tracked separately — require migration + team sign-off):
  - attendance.department_id  (denormalized FK for dept-admin filtering)
  - attendance.updated_at     (tracks last regeneration time)


Column timezone notes
─────────────────────
scan_timestamp (AttendanceEvent)  → UTC, timezone-aware   (DB stores as timestamptz)
generated_at   (Attendance)       → UTC, timezone-aware   (DB stores as timestamptz)
attendance_date                   → IST calendar date     (naive Date — see timezone.py)
first_check_in / last_check_out   → IST wall-clock time   (naive Time — see timezone.py)
start_time / end_time (Rule)      → IST wall-clock time   (naive Time)
"""

import uuid
from sqlalchemy import (
    Column, String, Date, Time, DateTime, Float, ForeignKey,
    Boolean, UniqueConstraint, Index,
)
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
    """
    Raw scan record produced by the camera when a face is recognised.
    scan_timestamp is UTC (timestamptz). All IST conversion happens in the
    service layer before writing to the Attendance table.
    """
    __tablename__ = "attendance_events"

    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    camera_id = Column(
        UUID(as_uuid=True),
        ForeignKey("cameras.camera_id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
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
    """
    Daily attendance summary — one row per user per day.
    Populated by the morning cron job (DailyAttendanceService).

    Who reads this table
    ────────────────────
    HR Admin  : all rows for their org filtered by date/status.
    Dept Admin: joins to users table on department_id to filter their dept.
    User      : their own rows for personal history.

    NOTE: Dept-admin currently needs a JOIN against users to filter by
    department. The `department_id` denormalization improvement is tracked
    separately and requires a migration + team review before adding here.
    """
    __tablename__ = "attendance"

    attendance_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )

    # IST calendar date — use today_ist() / utc_to_ist_date() to populate
    attendance_date = Column(Date, nullable=False)

    # IST wall-clock times — use utc_to_ist_time() to populate
    first_check_in = Column(Time, nullable=True)
    last_check_out = Column(Time, nullable=True)

    status = Column(SqlEnum(AttendanceStatus), nullable=False)

    # UTC — matches DB default now()
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
    """
    Correction request submitted by a user for a past attendance record.
    Reviewed by HR Admin or Dept Admin.
    """
    __tablename__ = "attendance_corrections"

    correction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attendance_id = Column(
        UUID(as_uuid=True),
        ForeignKey("attendance.attendance_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # IST wall-clock times (same convention as Attendance)
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
    """
    Org-level time windows that determine arrival status.
    start_time / end_time are IST wall-clock times (naive Time).

    Example from the UI:
      Present        09:00–10:30 → present
      Late Threshold 10:30–12:00 → late
      Half Day       12:00–19:00 → half_day
    """
    __tablename__ = "attendance_rules"

    rule_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_name = Column(String, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status_effect = Column(SqlEnum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_deleted = Column(Boolean, nullable=False, default=False, server_default="false")

    __table_args__ = (
        UniqueConstraint(
            "organization_id", "start_time", "end_time",
            name="uq_attendance_rule_window",
        ),
        Index(
            "ix_attendance_rules_org_time",
            "organization_id", "start_time", "end_time",
        ),
    )