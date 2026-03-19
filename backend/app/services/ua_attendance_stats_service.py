from typing import List
from datetime import date, datetime
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models import Attendance  # SQLAlchemy ORM model mapped to public.attendance
from app.schemas.ua_attendance_stats_schema import AttendanceStat

async def get_monthly_attendance_stats(
    db: AsyncSession,
    organization_id: UUID | None,
    year: int,
    month: int
) -> List[AttendanceStat]:
    """
    Group attendance rows by status for the given month/year and return counts.
    """
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    stmt = (
        select(Attendance.status, func.count().label("count"))
        .where(Attendance.attendance_date >= start_date)
        .where(Attendance.attendance_date < end_date)
    )

    if organization_id:
        stmt = stmt.where(Attendance.organization_id == organization_id)

    stmt = stmt.group_by(Attendance.status).order_by(func.count().desc())

    result = await db.execute(stmt)
    rows = result.all()

    stats = [AttendanceStat(status=row[0], count=int(row[1])) for row in rows]
    return stats
