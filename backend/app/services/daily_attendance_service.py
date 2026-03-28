"""
DailyAttendanceService
======================
Generates (or regenerates) the Attendance summary row for every active user
in an organisation for a given past date.

Design principles
-----------------
- Zero HTTP-layer dependencies — raises domain exceptions only.
- All timezone logic delegated to app.utils.timezone (single source of truth).
- No N+1 queries: events, rules, and existing records fetched in bulk
  before the per-user loop — exactly 3 queries before the upsert loop.
- Idempotent: safe to call multiple times for the same org+date; it upserts.
- Does NOT call db.commit() — the caller owns the transaction boundary.

Dept-admin filtering note
--------------------------
The Attendance table does not currently have a department_id column.
Dept-admin attendance queries must JOIN attendance → users on user_id and
filter on users.department_id. This is acceptable at current scale.
A denormalized department_id migration is tracked separately.
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
    now_utc,
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
    """Computed attendance result for one user on one day."""
    __slots__ = ("user_id", "first_check_in", "last_check_out", "status")

    def __init__(
        self,
        user_id: UUID,
        first_check_in: Optional[time],   # IST wall-clock
        last_check_out: Optional[time],   # IST wall-clock
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
    def _resolve_arrival_status(
        rules: List[AttendanceRule],
        scan_time_ist: time,
    ) -> str:
        """
        Match first-scan IST time against attendance rules.

        Rules are stored with IST start/end times (Time columns, no tz offset),
        and scan_time_ist is already converted to IST by the caller — so both
        sides are the same unit. No further conversion needed here.

        Supports midnight-wrapping windows (e.g. night shift 22:00 → 02:00).
        Falls back to 'absent' if no rule covers the time.
        """
        for rule in rules:
            if rule.start_time <= rule.end_time:
                # Normal window e.g. 09:00 → 10:30
                if rule.start_time <= scan_time_ist <= rule.end_time:
                    return rule.status_effect
            else:
                # Midnight-wrapping e.g. 22:00 → 02:00
                if scan_time_ist >= rule.start_time or scan_time_ist <= rule.end_time:
                    return rule.status_effect
        return "absent"

    @staticmethod
    def _compute_summary(
        user_id: UUID,
        first_in_utc,          # UTC-aware datetime | None
        last_out_utc,          # UTC-aware datetime | None
        rules: List[AttendanceRule],
        threshold_delta: timedelta,
    ) -> _UserSummary:
        """
        Status decision tree
        ────────────────────
        1. No scan              → absent, no times stored
        2. Single scan          → last_out = first_in, duration = 0 → half_day
        3. duration < threshold → half_day  (overrides arrival rule)
        4. duration ≥ threshold → arrival rule result (present / late / half_day)

        UTC → IST conversion happens here via utc_to_ist_time() from
        app.utils.timezone. The resulting time objects are in IST wall-clock
        format, matching the Time columns in the DB. The frontend reads them
        as-is — no further conversion needed on the API response side.
        """
        if first_in_utc is None:
            return _UserSummary(user_id, None, None, "absent")

        # Single scan: use it as both check-in and check-out
        effective_last_out_utc = last_out_utc if last_out_utc is not None else first_in_utc

        # Convert UTC datetimes → IST Time objects for DB storage
        first_check_in_ist: time = utc_to_ist_time(first_in_utc)
        last_check_out_ist: time = utc_to_ist_time(effective_last_out_utc)

        duration = effective_last_out_utc - first_in_utc

        if duration < threshold_delta:
            status = "half_day"
        else:
            # Both scan_time_ist and rule times are IST — safe to compare directly
            status = DailyAttendanceService._resolve_arrival_status(
                rules, first_check_in_ist
            )

        return _UserSummary(user_id, first_check_in_ist, last_check_out_ist, status)

    @staticmethod
    def _fetch_events(
        db: Session,
        organization_id: UUID,
        user_ids: List[UUID],
        start_utc,
        end_utc,
    ) -> Dict[UUID, object]:
        """
        One aggregated query → {user_id: row(first_in UTC, last_out UTC)}.

        start_utc / end_utc come from ist_day_bounds_utc() — they represent
        the IST calendar day's midnight boundaries translated to UTC, ensuring
        all scans for the IST day are captured regardless of the +5:30 offset.
        """
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
    def _fetch_existing_attendance(
        db: Session,
        organization_id: UUID,
        user_ids: List[UUID],
        target_date: date,
    ) -> Dict[UUID, Attendance]:
        rows = db.execute(
            select(Attendance).where(
                Attendance.organization_id == organization_id,
                Attendance.user_id.in_(user_ids),
                Attendance.attendance_date == target_date,
            )
        ).scalars().all()
        return {r.user_id: r for r in rows}
    
    def _safe_upsert_attendance(
        db: Session,
        user_id: UUID,
        organization_id: UUID,
        target_date: date,
        first_check_in: Optional[time],
        last_check_out: Optional[time],
        status: str
    ) -> None:
        """
        Insert Attendance row safely using PostgreSQL ON CONFLICT DO NOTHING.

        If the (user_id, attendance_date) row already exists, it is skipped.
        """
        try:
            stmt = insert(Attendance).values(
                attendance_id=uuid.uuid4(),
                user_id=user_id,
                organization_id=organization_id,
                attendance_date=target_date,
                first_check_in=first_check_in,
                last_check_out=last_check_out,
                status=status,
                is_deleted=False,
            ).on_conflict_do_nothing(
                index_elements=['user_id', 'attendance_date']  # match your unique constraint
            )
            db.execute(stmt)
            db.flush()  # flush to session without committing
        except Exception as exc:
            logger.exception(
                "Failed safe insert Attendance user=%s date=%s: %s",
                user_id, target_date, exc
            )
            raise  # optional: propagate if you want the outer savepoint to rollback

    # ------------------------------------------------------------------
    # MAIN PUBLIC METHOD
    # ------------------------------------------------------------------
    @staticmethod
    def generate_daily_attendance(
        db: Session,
        target_date: date,
        organization_id: UUID,
    ) -> dict:
        """
        Generate (upsert) Attendance rows for all active users in the org.

        target_date must be an IST calendar date in the past.
        Caller must call db.commit() after this returns successfully.
        On exception, caller must rollback.

        Raises
        ──────
        FutureDateError            target_date >= today IST
        OrganizationNotFoundError  org missing or soft-deleted
        AttendanceGenerationError  unexpected error (wraps original cause)
        """
        try:
            # Guard: no future/today dates — compare in IST
            if target_date >= today_ist():
                raise FutureDateError(target_date)

            # 1. Org settings
            org: Optional[Organization] = db.execute(
                select(Organization).where(
                    Organization.organization_id == organization_id,
                    Organization.is_deleted == False,
                )
            ).scalars().first()

            if not org:
                raise OrganizationNotFoundError(organization_id)

            threshold_delta = timedelta(hours=org.min_hours_for_present or 4)

            # 2. Active users
            users: List[User] = db.execute(
                select(User).where(
                    User.organization_id == organization_id,
                    User.is_active.is_(True),
                    User.is_deleted == False,
                )
            ).scalars().all()

            if not users:
                logger.info("No active users org=%s date=%s — skipping.", organization_id, target_date)
                return _empty_result()

            user_ids = [u.user_id for u in users]

            # 3. Translate IST calendar day → UTC bounds for scan_timestamp query
            # scan_timestamp is stored as UTC (timestamptz).
            # IST midnight = UTC 18:30 previous day — without this translation,
            # a naive WHERE scan_timestamp >= '2024-03-15 00:00:00' on a UTC column
            # would miss all scans between UTC 18:30 and UTC 23:59 (IST 00:00–05:30).
            start_utc, end_utc = ist_day_bounds_utc(target_date)

            # 4. Bulk reads — exactly 3 queries total
            event_map = DailyAttendanceService._fetch_events(
                db, organization_id, user_ids, start_utc, end_utc
            )

            rules: List[AttendanceRule] = db.execute(
                select(AttendanceRule).where(
                    AttendanceRule.organization_id == organization_id,
                    AttendanceRule.is_deleted == False,
                ).order_by(AttendanceRule.start_time)
            ).scalars().all()

            existing_map = DailyAttendanceService._fetch_existing_attendance(
                db, organization_id, user_ids, target_date
            )

            # 5. Per-user compute + upsert — zero additional DB calls in the loop
            counts: Dict[str, int] = {"present": 0, "absent": 0, "half_day": 0, "late": 0}

            for user in users:
                raw = event_map.get(user.user_id)
                summary = DailyAttendanceService._compute_summary(
                    user_id=user.user_id,
                    first_in_utc=raw.first_in if raw else None,
                    last_out_utc=raw.last_out if raw else None,
                    rules=rules,
                    threshold_delta=threshold_delta,
                )

                existing: Optional[Attendance] = existing_map.get(user.user_id)
                if existing:
                    existing.first_check_in = summary.first_check_in
                    existing.last_check_out = summary.last_check_out
                    existing.status = summary.status
                else:
                    DailyAttendanceService._safe_upsert_attendance(
                        db=db,
                        user_id=summary.user_id,
                        organization_id=organization_id,
                        target_date=target_date,
                        first_check_in=summary.first_check_in,
                        last_check_out=summary.last_check_out,
                        status=summary.status
                    )

                counts[summary.status] = counts.get(summary.status, 0) + 1

            logger.info(
                "Attendance computed org=%s date=%s | "
                "users=%d present=%d late=%d half_day=%d absent=%d",
                organization_id, target_date, len(users),
                counts.get("present", 0), counts.get("late", 0),
                counts.get("half_day", 0), counts.get("absent", 0),
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
            raise AttendanceGenerationError(organization_id, target_date, exc) from exc


def _empty_result() -> dict:
    return {
        "message": "No active users",
        "processed_users_count": 0,
        "present_count": 0,
        "absent_count": 0,
        "half_day_count": 0,
        "late_count": 0,
    }