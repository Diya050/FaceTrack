

from typing import List
from pydantic import BaseModel


class KPIOverviewResponse(BaseModel):
    present: int
    absent: int
    late: int
    half_day: int
    total: int


class TrendItem(BaseModel):
    date: str  # "25 Mar"
    present: int
    absent: int
    late: int
    half_day: int


class AttendanceTrendResponse(BaseModel):
    data: List[TrendItem]

class DepartmentAttendanceItem(BaseModel):
    department: str
    attendance: float  # percentage


class DepartmentAttendanceResponse(BaseModel):
    data: list[DepartmentAttendanceItem]


class RecognitionTrendItem(BaseModel):
    date: str
    unknown_count: int


class RecognitionAnalyticsResponse(BaseModel):
    recognition_rate: float
    today_unknown_faces: int
    trend: List[RecognitionTrendItem]


class AbsentTrendItem(BaseModel):
    date: str
    count: int


class AbsentAnalyticsResponse(BaseModel):
    today_absent: int
    trend: List[AbsentTrendItem]


class HalfDayTrendItem(BaseModel):
    date: str
    count: int


class HalfDayAnalyticsResponse(BaseModel):
    today_half_day: int
    trend: list[HalfDayTrendItem]


class LateTrendItem(BaseModel):
    date: str
    late_count: int


class LateAnalyticsResponse(BaseModel):
    today_late: int
    trend: List[LateTrendItem]


class DeptCameraAnalyticsResponse(BaseModel):
    active_cameras_count: int
    avg_confidence_score: float
    total_department_scans_today: int