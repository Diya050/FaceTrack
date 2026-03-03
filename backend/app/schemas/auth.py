from pydantic import BaseModel, EmailStr
from uuid import UUID

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    organization_name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    organization_name: str
    department_name: str