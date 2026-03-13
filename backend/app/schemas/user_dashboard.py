from pydantic import BaseModel
from typing import Optional
from datetime import time

class UserKPIResponse(BaseModel):
    present_days: int
    absent_days: int
    late_marks: int
    leave_taken: int
    attendance_percentage: float
    avg_work_hours: float

class TodayAttendanceResponse(BaseModel):
    status: str
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    work_duration: str
    camera_name: str
    location: str
    recognition_method: str
    frame_id: str
    confidence_score: float
    ai_similarity_score: float

