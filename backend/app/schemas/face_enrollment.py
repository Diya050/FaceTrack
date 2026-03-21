from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class FaceEnrollmentStatusResponse(BaseModel):
    has_request: bool
    status: Optional[str] = None
    session_id: Optional[UUID] = None