from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class DepartmentCreate(BaseModel):
    name: str
    description: str | None = None
    organization_id: UUID | None = None

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class DepartmentResponse(BaseModel):
    department_id: UUID
    name: str
    description: str | None = None
    organization_id: UUID

    class Config:
        from_attributes = True