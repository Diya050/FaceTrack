from typing import List
from pydantic import BaseModel
from uuid import UUID


class AttendanceStat(BaseModel):
    status: str
    count: int
    color: str | None = None

class AttendanceStatsResponse(BaseModel):
    month: int
    year: int
    organization_id: UUID | None = None
    stats: List[AttendanceStat]