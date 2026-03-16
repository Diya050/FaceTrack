from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class FaceEnrollmentImageResponse(BaseModel):
    image_path: str

class FaceEnrollmentStatusResponse(BaseModel):
    user_id: UUID
    full_name: str
    session_id: UUID
    face_enrolled: bool
    status: str
    submitted_images: List[FaceEnrollmentImageResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None
