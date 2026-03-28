

from uuid import UUID

from pydantic import UUID4, BaseModel
from typing import List, Optional

class WorkingHoursDataPoint(BaseModel):
    label: str # For HR: Department Name | For Admin: "04 Mar"
    avgHours: float

class WorkingHoursResponse(BaseModel):
    data: List[WorkingHoursDataPoint]
    systemWideAvg: Optional[float] = None # Only populated for HR Admins


class DetectionItem(BaseModel):
    event_id: UUID4
    full_name: str
    department_name: str
    camera_name: str
    time_ist: str
    confidence_score: float

class RecentDetectionsResponse(BaseModel):
    detections: List[DetectionItem]