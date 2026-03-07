from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class FaceEnrollmentRequestResponse(BaseModel):
    user_id: UUID
    full_name: str
    email: str
    department: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class FaceEnrollmentDecision(BaseModel):
    user_id: UUID