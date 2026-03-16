from datetime import time
from uuid import UUID
from pydantic import BaseModel
from app.enums.attendance_enums import AttendanceStatus


class AttendanceRuleBase(BaseModel):
    rule_name: str
    start_time: time
    end_time: time
    status_effect: AttendanceStatus


class AttendanceRuleCreate(AttendanceRuleBase):
    pass


class AttendanceRuleUpdate(BaseModel):
    rule_name: str | None = None
    start_time: time | None = None
    end_time: time | None = None
    status_effect: AttendanceStatus | None = None


class AttendanceRuleResponse(AttendanceRuleBase):
    rule_id: UUID

    class Config:
        from_attributes = True