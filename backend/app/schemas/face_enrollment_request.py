from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List


class FaceEnrollmentRequestResponse(BaseModel):

    session_id: UUID
    user_id: UUID
    full_name: str
    email: str
    status: str
    created_at: datetime
    images: List[str]

    model_config = {
        "from_attributes": True
    }


class FaceEnrollmentDecision(BaseModel):

    session_id: UUID