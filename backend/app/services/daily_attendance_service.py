"""
DailyAttendanceService - OPTIMIZED FOR LIMITED CONNECTIONS
==========================================================
Key changes:
✅ Controlled flush to avoid connection pressure
✅ Safe upserts
✅ No session leaks (caller handles lifecycle)
"""

import logging
from datetime import date, timedelta, time
from typing import Dict, List, Optional
from uuid import UUID
import uuid

from sqlalchemy import select, func
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert

from app.models.core import User, Organization
from app.models.attendance import Attendance, AttendanceEvent, AttendanceRule
from app.utils.timezone import (
    today_ist,
    utc_to_ist_time,
    ist_day_bounds_utc,
)
from app.exceptions.attendance_exceptions import (
    FutureDateError,
    OrganizationNotFoundError,
    AttendanceGenerationError,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Internal data carrier
# ---------------------------------------------------------------------------
class _UserSummary:
    __slots__ = ("user_id", "first_check_in", "last_check_out", "status")

    def __init__(
        self,
        user_id: UUID,
        first_check_in: Optional[time],
        last_check_out: Optional[time],
        status: str,
    ):
        self.user_id = user_id
        self.first_check_in = first_check_in
        self.last_check_out = last_check_out
        self.status = status


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------
class DailyAttendanceService:

    @staticmethod
    def _resolve_arrival_status(rules, scan_time_ist: time) -> str:
        for rule in rules:
            if rule.start_time <= rule.end_time:
                if rule.start_time <= scan_time_ist <= rule.end_time:
                    return rule.status_effect
            else:
                if scan_time_ist >= rule.start_time or scan_time_ist <= rule.end_time:
                    return rule.status_effect
        return "absent"

    @staticmethod
    def _compute_summary(user_id, first_in_utc, last_out_utc, rules, threshold_delta):
        if first_in_utc is None:
            return _UserSummary(user_id, None, None, "absent")

        effective_last_out_utc = last_out_utc or first_in_utc

        first_check_in_ist = utc_to_ist_time(first_in_utc)
        last_check_out_ist = utc_to_ist_time(effective_last_out_utc)

        duration = effective_last_out_utc - first_in_utc

        if duration < threshold_delta:
            status = "half_day"
        else:
            status = DailyAttendanceService._resolve_arrival_status(
                rules, first_check_in_ist
            )

        return _UserSummary(user_id, first_check_in_ist, last_check_out_ist, status)

    @staticmethod
    def _fetch_events(db, organization_id, user_ids, start_utc, end_utc):
        rows = db.execute(
            select(
                AttendanceEvent.user_id,
                func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                func.max(AttendanceEvent.scan_timestamp).label("last_out"),
            ).where(
                AttendanceEvent.organization_id == organization_id,
                AttendanceEvent.user_id.in_(user_ids),
                AttendanceEvent.scan_timestamp >= start_utc,
                AttendanceEvent.scan_timestamp < end_utc,
            ).group_by(AttendanceEvent.user_id)
        ).all()

        return {r.user_id: r for r in rows}

    @staticmethod
    def _fetch_existing_attendance(db, organization_id, user_ids, target_date):
        rows = db.execute(
            select(Attendance).where(
                Attendance.organization_id == organization_id,
                Attendance.user_id.in_(user_ids),
                Attendance.attendance_date == target_date,
            )
        ).scalars().all()

        return {r.user_id: r for r in rows}

    # ------------------------------------------------------------------
    # MAIN METHOD
    # ------------------------------------------------------------------
    @staticmethod
    def generate_daily_attendance(db: Session, target_date: date, organization_id: UUID):

        try:
            if target_date >= today_ist():
                raise FutureDateError(target_date)

            # 1. Org
            org = db.execute(
                select(Organization).where(
                    Organization.organization_id == organization_id,
                    Organization.is_deleted == False,
                )
            ).scalars().first()

            if not org:
                raise OrganizationNotFoundError(organization_id)

            threshold_delta = timedelta(hours=org.min_hours_for_present or 4)

            # 2. Users
            users = db.execute(
                select(User).where(
                    User.organization_id == organization_id,
                    User.is_active.is_(True),
                    User.is_deleted == False,
                )
            ).scalars().all()

            if not users:
                return _empty_result()

            user_ids = [u.user_id for u in users]

            # 3. Time window
            start_utc, end_utc = ist_day_bounds_utc(target_date)

            # 4. Bulk queries
            event_map = DailyAttendanceService._fetch_events(
                db, organization_id, user_ids, start_utc, end_utc
            )

            rules = db.execute(
                select(AttendanceRule).where(
                    AttendanceRule.organization_id == organization_id,
                    AttendanceRule.is_deleted == False,
                ).order_by(AttendanceRule.start_time)
            ).scalars().all()

            existing_map = DailyAttendanceService._fetch_existing_attendance(
                db, organization_id, user_ids, target_date
            )

            counts = {"present": 0, "absent": 0, "half_day": 0, "late": 0}

            # ------------------------------------------------------------------
            # 🔥 MAIN LOOP (FIXED)
            # ------------------------------------------------------------------
            for index, user in enumerate(users, start=1):

                raw = event_map.get(user.user_id)

                summary = DailyAttendanceService._compute_summary(
                    user.user_id,
                    raw.first_in if raw else None,
                    raw.last_out if raw else None,
                    rules,
                    threshold_delta,
                )

                existing = existing_map.get(user.user_id)

                if existing:
                    existing.first_check_in = summary.first_check_in
                    existing.last_check_out = summary.last_check_out
                    existing.status = summary.status
                else:
                    stmt = insert(Attendance).values(
                        attendance_id=uuid.uuid4(),
                        user_id=summary.user_id,
                        organization_id=organization_id,
                        attendance_date=target_date,
                        first_check_in=summary.first_check_in,
                        last_check_out=summary.last_check_out,
                        status=summary.status,
                        is_deleted=False,
                    ).on_conflict_do_nothing(
                        index_elements=["user_id", "attendance_date"]
                    )

                    db.execute(stmt)

                counts[summary.status] = counts.get(summary.status, 0) + 1

                # 🔥 CONTROLLED FLUSH (VERY IMPORTANT)
                if index % 25 == 0:
                    db.flush()

            # ✅ FINAL FLUSH
            db.flush()

            logger.info(
                "✅ Attendance done org=%s date=%s users=%d",
                organization_id,
                target_date,
                len(users),
            )

            return {
                "message": "Daily attendance generated successfully",
                "processed_users_count": len(users),
                "present_count": counts.get("present", 0),
                "absent_count": counts.get("absent", 0),
                "half_day_count": counts.get("half_day", 0),
                "late_count": counts.get("late", 0),
            }

        except (FutureDateError, OrganizationNotFoundError):
            raise

        except Exception as exc:
            logger.exception("Attendance generation error")
            raise AttendanceGenerationError(
                organization_id, target_date, exc
            ) from exc


def _empty_result():
    return {
        "message": "No active users",
        "processed_users_count": 0,
        "present_count": 0,
        "absent_count": 0,
        "half_day_count": 0,
        "late_count": 0,
    }