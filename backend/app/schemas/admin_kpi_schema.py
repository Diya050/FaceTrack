from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class KpiStatsResponse(BaseModel):
    present_today: int
    absent_today: int
    late_today: int
    early_leave_today: int
    total_registered: int
    attendance_rate: float
    avg_confidence_score: float

class LiveAttendanceRecord(BaseModel):
    attendance_id: UUID
    full_name: str
    department: str
    camera_name: str
    time_in: Optional[str]
    time_out: Optional[str]
    confidence_score: Optional[float]
    status: str # "present", "absent", "late", "early_leave"

class KpiSummaryResponse(BaseModel):
    stats: KpiStatsResponse
    recent_detections: List[LiveAttendanceRecord]