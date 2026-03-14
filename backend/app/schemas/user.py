from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class UserResponse(BaseModel):

    user_id: UUID
    full_name: str
    email: str
    department_id: Optional[UUID]
    organization_id: Optional[UUID]
    status: str
    face_enrolled: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }