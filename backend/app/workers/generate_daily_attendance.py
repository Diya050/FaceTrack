"""
Attendance Background Workers
==============================
Two entry-points consumed by the APScheduler:

  run_daily_attendance_job(target_date?)
      Processes all active organisations for a single IST calendar date.
      Each org runs inside its own savepoint — one org failing never blocks
      the others.

  run_catchup_jobs()
      Fills gaps for the last N days.
      Checks per (org_id, date) pair — not just by date — so if one org
      already has rows for a date, other orgs are still processed.

Session strategy
----------------
One SQLAlchemy session per worker invocation.
Each org uses a nested transaction (savepoint) for isolation.
db.commit() is called once per date after all orgs for that date are done,
minimising lock duration.
"""

import logging
from contextlib import contextmanager
from datetime import date, timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.core import Organization
from app.models.attendance import Attendance
from app.services.daily_attendance_service import DailyAttendanceService
from app.exceptions.attendance_exceptions import (
    FutureDateError,
    OrganizationNotFoundError,
    AttendanceGenerationError,
)
from app.utils.timezone import today_ist
from app.core.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Session context manager
# ---------------------------------------------------------------------------
@contextmanager
def _db_session():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Single-org processor
# ---------------------------------------------------------------------------
def _process_org(db: Session, org_id: UUID, target_date: date) -> Optional[dict]:
    """
    Run DailyAttendanceService for one org inside a savepoint.

    Returns the result dict on success, or None on any failure.
    The outer session is untouched on failure — only the savepoint rolls back.
    """
    try:
        with db.begin_nested():   # SAVEPOINT
            result = DailyAttendanceService.generate_daily_attendance(
                db=db,
                target_date=target_date,
                organization_id=org_id,
            )
        return result

    except FutureDateError as exc:
        logger.warning("Skipping future date: %s", exc)
        return None

    except OrganizationNotFoundError as exc:
        logger.error("Organisation not found (deleted mid-run?): %s", exc)
        return None

    except AttendanceGenerationError as exc:
        logger.error(
            "Attendance generation failed org=%s date=%s — savepoint rolled back: %s",
            org_id, target_date, exc, exc_info=True,
        )
        return None

    except Exception as exc:
        logger.exception("Unexpected error org=%s date=%s: %s", org_id, target_date, exc)
        return None


# ---------------------------------------------------------------------------
# Daily job
# ---------------------------------------------------------------------------
def run_daily_attendance_job(target_date: Optional[date] = None) -> dict:
    """
    Generate attendance for ALL active organisations for `target_date`.

    target_date defaults to yesterday in IST (today_ist() − OFFSET days).
    Uses today_ist() — never date.today() — to stay consistent with the IST
    calendar dates stored in the Attendance table.
    """
    if target_date is None:
        target_date = today_ist() - timedelta(days=settings.ATTENDANCE_DEFAULT_OFFSET_DAYS)

    logger.info("=== Daily attendance job started | date=%s ===", target_date)

    total_orgs = success_orgs = failed_orgs = 0
    aggregate = {"processed_users_count": 0, "present_count": 0,
                 "absent_count": 0, "half_day_count": 0, "late_count": 0}

    try:
        with _db_session() as db:
            orgs = db.execute(
                select(Organization).where(
                    Organization.is_deleted == False,
                    Organization.status == "active",
                )
            ).scalars().all()

            total_orgs = len(orgs)

            if not orgs:
                logger.warning("No active organisations — nothing to process.")
                return {"status": "ok", "total_orgs": 0}

            for org in orgs:
                result = _process_org(db, org.organization_id, target_date)
                if result is not None:
                    success_orgs += 1
                    for key in aggregate:
                        aggregate[key] += result.get(key, 0)
                else:
                    failed_orgs += 1

            db.commit()   # commit all savepoints at once

    except Exception:
        logger.exception("Fatal error in daily attendance job | date=%s", target_date)
        return {"status": "failed", "target_date": str(target_date)}

    logger.info(
        "=== Daily job done | date=%s | orgs %d/%d ok | "
        "users=%d present=%d late=%d half_day=%d absent=%d ===",
        target_date, success_orgs, total_orgs,
        aggregate["processed_users_count"], aggregate["present_count"],
        aggregate["late_count"], aggregate["half_day_count"], aggregate["absent_count"],
    )

    return {
        "status": "ok",
        "target_date": str(target_date),
        "total_orgs": total_orgs,
        "success_orgs": success_orgs,
        "failed_orgs": failed_orgs,
        **aggregate,
    }


# ---------------------------------------------------------------------------
# Catch-up job
# ---------------------------------------------------------------------------
def run_catchup_jobs() -> None:
    """
    For each of the last ATTENDANCE_CATCHUP_DAYS IST calendar days, check
    whether attendance has been generated for each (org, date) pair.
    Only missing combinations are regenerated.

    Key fix: checks per (organization_id, attendance_date) — the original
    checked only by date, silently skipping all orgs if any one had a row.
    """
    today = today_ist()
    start_date = today - timedelta(days=settings.ATTENDANCE_CATCHUP_DAYS)

    logger.info(
        "=== Catch-up job started | range=%s → %s ===",
        start_date, today - timedelta(days=1),
    )

    generated = skipped = 0

    try:
        with _db_session() as db:
            orgs = db.execute(
                select(Organization).where(
                    Organization.is_deleted == False,
                    Organization.status == "active",
                )
            ).scalars().all()

            if not orgs:
                logger.info("Catch-up: no active organisations.")
                return

            current_date = start_date
            while current_date < today:
                for org in orgs:
                    # Per (org_id, date) check — not just by date
                    exists = db.execute(
                        select(Attendance).where(
                            Attendance.organization_id == org.organization_id,
                            Attendance.attendance_date == current_date,
                        ).limit(1)
                    ).scalars().first()

                    if exists:
                        skipped += 1
                        logger.debug(
                            "Catch-up skip org=%s date=%s", org.organization_id, current_date
                        )
                        continue

                    logger.info(
                        "Catch-up generating org=%s date=%s", org.organization_id, current_date
                    )
                    result = _process_org(db, org.organization_id, current_date)
                    if result is not None:
                        generated += 1

                # Commit after each date — keeps lock window small
                db.commit()
                current_date += timedelta(days=1)

    except Exception:
        logger.exception("Catch-up job encountered a fatal error.")
        return

    logger.info("=== Catch-up done | generated=%d skipped=%d ===", generated, skipped)