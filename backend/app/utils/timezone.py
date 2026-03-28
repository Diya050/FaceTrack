"""
=====================
Single source of truth for the project's IST ↔ UTC contract.

─────────────────────────────────────────────────────────────────────
TIMEZONE CONTRACT  (read this once, follow it everywhere)
─────────────────────────────────────────────────────────────────────

DB column type              Stored value          Responsibility
─────────────────────────── ───────────────────── ──────────────────
DateTime(timezone=True)     UTC                   SQLAlchemy/psycopg2
Date  (attendance_date)     IST calendar date     This module
Time  (first_check_in,      IST wall-clock time   This module
       last_check_out)
─────────────────────────────────────────────────────────────────────

Rules for every developer
─────────────────────────
1. Never import `pytz` or `ZoneInfo` directly in service/worker files.
   Use the helpers below instead.

2. DateTime columns are always UTC in the database.
   SQLAlchemy/psycopg2 handles the UTC storage automatically when the
   column is declared with `timezone=True`.

3. Date and Time columns are always IST values.
   Convert using `utc_to_ist_time()` / `utc_to_ist_date()` before writing.
   The frontend reads them as-is — no further conversion needed.

4. "Today" and "now" in business logic always mean IST.
   Use `today_ist()` and `now_ist()` — never `date.today()` or
   `datetime.utcnow()` for business date decisions.

5. Day-boundary queries against scan_timestamp (UTC column) must use
   `ist_day_bounds_utc(date)` to translate the IST midnight boundaries
   back to UTC before hitting the DB.

─────────────────────────────────────────────────────────────────────
"""

from datetime import date, datetime, time, timedelta
from typing import Tuple

import pytz

# ── Canonical timezone objects ───────────────────────────────────────────────
IST: pytz.BaseTzInfo = pytz.timezone("Asia/Kolkata")
UTC: pytz.BaseTzInfo = pytz.utc


# ── Current moment helpers ───────────────────────────────────────────────────

def now_ist() -> datetime:
    """Return the current datetime in IST (timezone-aware)."""
    return datetime.now(IST)


def now_utc() -> datetime:
    """Return the current datetime in UTC (timezone-aware)."""
    return datetime.now(UTC)


def today_ist() -> date:
    """Return today's calendar date in IST (naive date object)."""
    return datetime.now(IST).date()


# ── Conversion helpers ───────────────────────────────────────────────────────

def utc_to_ist_time(utc_dt: datetime) -> time:
    """
    Convert a UTC-aware datetime to an IST wall-clock time.

    This is the correct way to populate `first_check_in` / `last_check_out`
    before writing to the database.

    Example
    -------
    scan_timestamp = 2024-03-15 03:30:00+00:00  (UTC)
    → utc_to_ist_time(scan_timestamp) → time(09, 00, 00)   # IST
    """
    if utc_dt.tzinfo is None:
        # Defensive: treat naive datetimes as UTC
        utc_dt = UTC.localize(utc_dt)
    return utc_dt.astimezone(IST).time()


def utc_to_ist_date(utc_dt: datetime) -> date:
    """
    Convert a UTC-aware datetime to an IST calendar date.

    Example
    -------
    scan_timestamp = 2024-03-15 20:00:00+00:00  (UTC, after IST midnight)
    → utc_to_ist_date(scan_timestamp) → date(2024, 3, 16)  # next IST day
    """
    if utc_dt.tzinfo is None:
        utc_dt = UTC.localize(utc_dt)
    return utc_dt.astimezone(IST).date()


# ── Day-boundary helper for DB queries ───────────────────────────────────────

def ist_day_bounds_utc(target_date: date) -> Tuple[datetime, datetime]:
    """
    Return (start_utc, end_utc) for an IST calendar day as UTC-aware datetimes.

    Use these as the bounds when querying `scan_timestamp` (UTC column) to
    ensure you capture all scans that belong to `target_date` in IST, even
    when the UTC equivalent crosses midnight.

    Example
    -------
    target_date = 2024-03-15  (IST)
    → start_utc = 2024-03-14 18:30:00+00:00  (UTC, IST midnight − 5:30)
    → end_utc   = 2024-03-15 18:30:00+00:00  (UTC, next IST midnight)
    """
    start_ist = IST.localize(datetime.combine(target_date, time.min))
    end_ist = start_ist + timedelta(days=1)
    return start_ist.astimezone(UTC), end_ist.astimezone(UTC)