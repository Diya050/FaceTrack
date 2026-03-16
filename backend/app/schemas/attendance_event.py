from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.enums.attendance_enums import AttendanceEventType, RecognitionMethod


class AttendanceEventCreate(BaseModel):
    user_id: UUID
    camera_id: UUID
    organization_id: UUID
    confidence_score: float
    recognition_method: RecognitionMethod
    event_type: AttendanceEventType


class AttendanceEventResponse(BaseModel):
    event_id: UUID
    user_id: UUID
    camera_id: UUID
    organization_id: UUID
    scan_timestamp: datetime
    confidence_score: float
    recognition_method: RecognitionMethod
    event_type: AttendanceEventType

    class Config:
        from_attributes = True