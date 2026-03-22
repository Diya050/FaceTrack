from pydantic import BaseModel, EmailStr
from uuid import UUID

class OrganizationCreate(BaseModel):
    name: str
    email: EmailStr
    contact_number: str
    address: str
    # Added default of 4 to match your business logic
    min_hours_for_present: int = 4
    recognition_confidence: float = 0.75
    unknown_face_threshold: float = 0.45
    liveness_threshold: float = 0.8
    min_face_size: int = 60

class OrganizationResponse(BaseModel):
    organization_id: UUID
    name: str
    email: EmailStr
    contact_number: str
    address: str
    # Added this so the frontend can read the setting
    min_hours_for_present: int 
    recognition_confidence: float
    unknown_face_threshold: float
    liveness_threshold: float
    min_face_size: int

    class Config:
        from_attributes = True

# Recommended: Add an Update schema for the "Deploy All Settings" button
class OrganizationUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    contact_number: str | None = None
    address: str | None = None
    min_hours_for_present: int | None = None
    recognition_confidence: float | None = None
    unknown_face_threshold: float | None = None
    liveness_threshold: float | None = None
    min_face_size: int | None = None