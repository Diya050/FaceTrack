from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class NotificationResponse(BaseModel):

    notification_id: UUID
    message: str
    type: Optional[str]
    is_read: bool
    created_at: datetime
    # redirect_url: Optional[str] = None

    model_config = {
        "from_attributes": True
    }