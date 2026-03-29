from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class AuditLogResponse(BaseModel):
    log_id: UUID
    actor: Optional[str] = None
    actor_role: Optional[str] = None
    email: Optional[str] = None
    action: str
    timestamp: datetime
    ip_address: Optional[str] = None
    resource: str = "System"
    resource_id: Optional[str] = None
    category: str = "system"
    severity: str = "info"
    details: Optional[str] = None

    class Config:
        from_attributes = True
