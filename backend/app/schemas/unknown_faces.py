from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from enum import Enum


class UnknownFaceAction(str, Enum):
    MAP_EMPLOYEE = "MAP_EMPLOYEE"
    SECURITY_ALERT = "SECURITY_ALERT"


class UnknownFaceResponse(BaseModel):
    unknown_id: UUID
    stream_id: UUID
    detected_time: datetime
    image_path: str
    confidence_score: Optional[float]
    resolved: bool

    model_config = {
        "from_attributes": True
    }


class ResolveUnknownFaceRequest(BaseModel):
    unknown_id: UUID
    employee_id: Optional[UUID] = None
    action: UnknownFaceAction