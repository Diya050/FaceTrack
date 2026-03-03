from pydantic import BaseModel, EmailStr


class OrganizationCreate(BaseModel):
    name: str
    email: EmailStr
    contact_number: str
    address: str


class OrganizationResponse(BaseModel):
    organization_id: str
    name: str
    email: EmailStr
    contact_number: str
    address: str

    class Config:
        from_attributes = True