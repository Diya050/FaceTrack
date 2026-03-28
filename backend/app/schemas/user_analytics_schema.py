from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime,date
from uuid import UUID
class ProductivityMetricsResponse(BaseModel):
    attendance_consistency: float  # percent 0-100
    stability_index: float         # percent 0-100
    peak_arrival: Optional[str]    # e.g., "08:52"
    late_frequency_per_week: float # e.g., 1.2
    period_start: date
    period_end: date

class RecognitionTrendPoint(BaseModel):
    timestamp: datetime
    confidence_score: float

class RecognitionPerformance(BaseModel):
    avg_confidence: float
    success_rate: float
    false_rejection_rate: float

class RecognitionInsightsResponse(BaseModel):
    model_version: str | None
    trends: List[RecognitionTrendPoint]
    performance: RecognitionPerformance


class WorkingHoursPoint(BaseModel):
    date: date
    actual: float

class WorkingHoursResponse(BaseModel):
    start_date: date
    end_date: date
    points: List[WorkingHoursPoint]
    avg_hours: float

class AttendanceStat(BaseModel):
    status: str
    count: int
    color: str | None = None

class AttendanceStatsResponse(BaseModel):
    month: int
    year: int
    user_id: UUID | None = None
    organization_id: UUID | None = None
    stats: List[AttendanceStat]

class Config:
        from_attributes = True