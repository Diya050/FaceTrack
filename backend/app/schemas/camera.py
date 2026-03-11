from pydantic import BaseModel
from uuid import UUID

class CameraIdentify(BaseModel):
    device_identifier: str
    camera_name: str
    camera_type: str | None = None
    ip_address: str | None = None

class CameraIdentifyResponse(BaseModel):
    camera_id: UUID
    camera_name: str
    status: str

    class Config:
        from_attributes = True