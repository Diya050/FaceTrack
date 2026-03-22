from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional

class PlatformLoginRequest(BaseModel):
    email: str
    password: str


class OrgLoginRequest(BaseModel):
    email: str
    password: str
    organization_name: str
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    organization_id: Optional[str] = None

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    organization_name: str
    department_name: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    organization_name: str

class ResetPasswordRequest(BaseModel):
    token_id: str
    new_password: str
