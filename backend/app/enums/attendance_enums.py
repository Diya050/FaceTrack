from enum import Enum


class AttendanceEventType(str, Enum):
    check_in = "check_in"
    check_out = "check_out"
    passby = "passby"


class AttendanceStatus(str, Enum):
    present = "present"
    absent = "absent"
    half_day = "half_day"
    on_leave = "on_leave"


class RecognitionMethod(str, Enum):
    face = "face"
    live_call = "live_call"


class AttendanceCorrectionStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"