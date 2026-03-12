from pydantic import BaseModel
from uuid import UUID

class MonthlyAttendanceStats(BaseModel):
    user_id: UUID
    year: int
    month: int
    total_days: int
    present_days: int
    absent_days: int
    late_days: int
    attendance_percentage: float