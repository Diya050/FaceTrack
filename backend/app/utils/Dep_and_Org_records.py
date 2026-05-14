from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
UTC = ZoneInfo("UTC")


def serialize_datetime(dt: Optional[datetime]) -> Optional[str]:
    """
    Convert datetime to IST ISO string
    """

    if not dt:
        return None

    # Safety fallback if DB returns naive datetime
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UTC)

    # Convert UTC -> IST
    ist_dt = dt.astimezone(IST)

    return ist_dt.isoformat()


def serialize_common_fields(row):
    """
    Common serializer used across APIs
    """

    return {
        "user_id": str(row.user_id),

        "full_name": row.full_name,

        "attendance_id": str(row.attendance_id),

        "attendance_date": (
            row.attendance_date.isoformat()
            if row.attendance_date
            else None
        ),

        "first_check_in": serialize_datetime(
            row.first_check_in
        ),

        "last_check_out": serialize_datetime(
            row.last_check_out
        ),

        "status": (
            row.status.value
            if hasattr(row.status, "value")
            else row.status
        ),
    }