from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class AttendanceEventCreate(BaseModel):
    user_id: UUID
    camera_id: UUID
    organization_id: UUID
    confidence_score: float
    recognition_method: str
    event_type: str


class AttendanceEventResponse(BaseModel):
    event_id: UUID
    user_id: UUID
    camera_id: UUID
    organization_id: UUID
    scan_timestamp: datetime
    confidence_score: float
    recognition_method: str
    event_type: str

    class Config:
        from_attributes = True