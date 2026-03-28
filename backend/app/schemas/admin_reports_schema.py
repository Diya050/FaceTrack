

from uuid import UUID

from pydantic import BaseModel
from typing import List, Optional

class WorkingHoursDataPoint(BaseModel):
    label: str # For HR: Department Name | For Admin: "04 Mar"
    avgHours: float

class WorkingHoursResponse(BaseModel):
    data: List[WorkingHoursDataPoint]
    systemWideAvg: Optional[float] = None # Only populated for HR Admins


class RecentDetection(BaseModel):
    event_id: UUID
    full_name: str
    department_name: str
    camera_name: str
    time_ist: str # Handled as "HH:MM AM/PM"
    confidence_score: float

class RecentDetectionsResponse(BaseModel):
    detections: List[RecentDetection]