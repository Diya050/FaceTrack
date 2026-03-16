from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from uuid import UUID

class AttendanceGenerateResponse(BaseModel):
    message: str
    processed_users_count: int
    present_count: int
    absent_count: int


class AttendanceRecordResponse(BaseModel):
    attendance_id : UUID
    user_id : UUID
    attendace_date : date
    first_check_in : Optional[time] = None
    last_check_out : Optional[time] = None
    status: str
    organization_id : UUID

    class Config:
        from_attributes = True

class UserAttendanceResponse(BaseModel):
    attendance_id: UUID
    user_id: UUID
    attendance_date: date
    first_check_in: Optional[time] = None
    last_check_out: Optional[time] = None
    status: str
    organization_id: Optional[UUID] = None

    class Config:
        from_attributes = True

class DepartmentAttendanceUserRecord(BaseModel):
    user_id: UUID
    full_name: str
    attendance_id: Optional[UUID] = None
    attendance_date: Optional[date] = None
    first_check_in: Optional[time] = None
    last_check_out: Optional[time] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True

class OrgAttendanceRecord(BaseModel):
    user_id: UUID
    full_name: str
    department_name: Optional[str] = None
    attendance_id: UUID
    attendance_date: date
    first_check_in: Optional[time] = None
    last_check_out: Optional[time] = None
    status: str
    organization_id: Optional[UUID] = None

    class Config:
        from_attributes = True
