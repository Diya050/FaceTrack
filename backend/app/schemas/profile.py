from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from datetime import datetime

from app.models.core import UserStatusEnum


class ProfileResponse(BaseModel):
    user_id: UUID
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None

    # Organization Info
    role: Optional[str] = None
    department: Optional[str] = None
    organization: Optional[str] = None

    # Status
    status: UserStatusEnum
    is_active: bool
    face_enrolled: bool

    # Activity
    approved_by: Optional[str] = None
    created_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None