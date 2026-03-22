from pydantic import BaseModel, EmailStr
from uuid import UUID

from app.models.core import OrganizationStatusEnum

class OrganizationCreate(BaseModel):
    name: str
    email: EmailStr
    contact_number: str
    address: str
    # Added default of 4 to match your business logic
    min_hours_for_present: int = 4

class OrganizationResponse(BaseModel):
    organization_id: UUID
    name: str
    email: EmailStr
    contact_number: str
    address: str
    # Added this so the frontend can read the setting
    min_hours_for_present: int
    status: OrganizationStatusEnum

    class Config:
        from_attributes = True

# Recommended: Add an Update schema for the "Deploy All Settings" button
class OrganizationUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    contact_number: str | None = None
    address: str | None = None
    min_hours_for_present: int | None = None