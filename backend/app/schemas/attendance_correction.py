from pydantic import BaseModel
from datetime import time
from uuid import UUID
from typing import Optional
from typing import Literal

class AttendanceCorrectionRequest(BaseModel):
    attendance_id: UUID
    requested_time_in: Optional[time] = None
    requested_time_out: Optional[time] = None
    reason: str
    
class AttendanceCorrectionReview(BaseModel):
    status: Literal["approved", "rejected"]