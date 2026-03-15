from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FaceEnrollmentImageResponse(BaseModel):
    image_path: str

class FaceEnrollmentStatusResponse(BaseModel):
    user_id: str
    full_name: str
    session_id: str
    status: str
    submitted_images: List[FaceEnrollmentImageResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None
