from pydantic import BaseModel
from datetime import datetime
from typing import List

class LiveAlertResponse(BaseModel):
    id: str
    source: str
    message: str
    severity: str # "critical" | "warning" | "info"
    timestamp: datetime

    class Config:
        from_attributes = True