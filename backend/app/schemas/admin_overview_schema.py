from pydantic import BaseModel
from typing import List
from uuid import UUID

class WeeklyAttendanceData(BaseModel):
    labels: List[str]
    present: List[int]
    absent: List[int]
    late: List[int]

class MonthlyTrendData(BaseModel):
    labels: List[str]
    rate: List[float]
    trend_direction: str  # "up", "down", "flat"
    trend_value: str      # e.g., "-2.1% vs last month"

class DepartmentSummary(BaseModel):
    department_id: UUID
    department: str
    present: int
    total: int
    percentage: float

class OverviewStats(BaseModel):
    active_staff: int
    on_premises: int
    avg_attendance_rate: float

class AdminOverviewResponse(BaseModel):
    weekly_report: WeeklyAttendanceData
    monthly_trend: MonthlyTrendData
    department_summary: List[DepartmentSummary]
    stats: OverviewStats

    class Config:
        from_attributes = True