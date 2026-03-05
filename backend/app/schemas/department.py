from pydantic import BaseModel
from uuid import UUID


class DepartmentCreate(BaseModel):
    name: str
    description: str | None = None

class DepartmentResponse(BaseModel):
    department_id: UUID
    name: str
    description: str | None = None
    organization_id: UUID

    class Config:
        from_attributes = True