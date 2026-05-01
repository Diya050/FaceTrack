from datetime import datetime
from typing import Optional

IST_OFFSET = "+05:30"


def combine_ist_datetime(attendance_date, time_value) -> Optional[str]:
    """
    Combine date + time and attach IST timezone.
    Returns ISO string with +05:30
    """
    if not attendance_date or not time_value:
        return None

    return datetime.combine(attendance_date, time_value).isoformat() + IST_OFFSET


def serialize_common_fields(row):
    """
    Common serializer used across APIs
    """
    return {
        "user_id": row.user_id,
        "full_name": row.full_name,
        "attendance_id": row.attendance_id,
        "attendance_date": row.attendance_date.isoformat() if row.attendance_date else None,
        "first_check_in": combine_ist_datetime(row.attendance_date, row.first_check_in),
        "last_check_out": combine_ist_datetime(row.attendance_date, row.last_check_out),
        "status": row.status.value if hasattr(row.status, "value") else row.status,
    }