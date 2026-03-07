from pydantic import BaseModel
from uuid import UUID


class AssignRoleRequest(BaseModel):
    user_id: UUID
    role_name: str