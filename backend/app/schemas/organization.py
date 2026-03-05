from pydantic import BaseModel, EmailStr
from uuid import UUID


class OrganizationCreate(BaseModel):
    name: str
    email: EmailStr
    contact_number: str
    address: str


class OrganizationResponse(BaseModel):
    organization_id: UUID
    name: str
    email: EmailStr
    contact_number: str
    address: str

    class Config:
        from_attributes = True