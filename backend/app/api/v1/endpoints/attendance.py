from datetime import date
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.db.session import get_db
from app.models.core import User, Department
from app.models.attendance import AttendanceEvent
from app.models.streams import Camera, VideoStream, UnknownFace
from app.core.security import get_current_user
from app.core.permissions import require_roles
from app.schemas.attendance_rule import (
    AttendanceRuleCreate,
    AttendanceRuleUpdate,
    AttendanceRuleResponse,
)

from app.services.attendance_rule_service import (
    get_rules,
    create_rule,
    update_rule,
    delete_rule,
)

from app.core.dependencies import get_db
from app.services.attendance_service import get_monthly_attendance_stats
from app.schemas.monthly_attendance import MonthlyAttendanceStats

from app.services.attendance_service import (
    get_user_attendance,
    get_organization_attendance,
    get_department_attendance,
)
from app.services.daily_attendance_service import DailyAttendanceService
from app.models.attendance import AttendanceEvent
from app.models.streams import Camera

from app.schemas.daily_attendance import (
    AttendanceGenerateResponse,
    UserAttendanceResponse,
    OrgAttendanceRecord,
    DepartmentAttendanceUserRecord,
)
from app.schemas.attendance_event import RecognitionEventResponse


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


# -------------------------------------------------------------------------
# Get My Attendance
# -------------------------------------------------------------------------

@router.get("/me", response_model=List[UserAttendanceResponse])
def get_my_attendance(
    start_date: Optional[date] = Query(
        None,
        description="Filter attendance from this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-01"],
    ),
    end_date: Optional[date] = Query(
        None,
        description="Filter attendance up to this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-10"],
    ),
    status: Optional[str] = Query(
        None,
        description="Filter by attendance status: present, absent, half_day, on_leave, late",
        examples=["present"],
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of records to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve the authenticated user's own attendance records.

    Supports optional filtering by date range and attendance status,
    as well as pagination via skip/limit.
    """
    return get_user_attendance(
        db=db,
        current_user=current_user,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )
# -------------------------------------------------------------------------
# Daily Attendance Generation
# -------------------------------------------------------------------------

@router.post(
    "/generate-daily-attendance",
    response_model=AttendanceGenerateResponse,
    summary="Generate daily attendance records",
)
def generate_daily_attendance(
    target_date: date = Query(...),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db),
):
    organization_id = current_user.organization_id

    return DailyAttendanceService.generate_daily_attendance(
        db=db,
        target_date=target_date,
        organization_id=organization_id,
    )


# -------------------------------------------------------------------------
# Get Organization Attendance
# -------------------------------------------------------------------------

@router.get("/organization", response_model=List[OrgAttendanceRecord])
def get_org_attendance(
    attendance_date: Optional[date] = Query(
        None,
        description="Filter by a specific date (YYYY-MM-DD). Overrides start_date/end_date.",
        examples=["2026-03-11"],
    ),
    start_date: Optional[date] = Query(
        None,
        description="Filter attendance from this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-01"],
    ),
    end_date: Optional[date] = Query(
        None,
        description="Filter attendance up to this date (inclusive), format: YYYY-MM-DD",
        examples=["2026-03-11"],
    ),
    status: Optional[str] = Query(
        None,
        description="Filter by attendance status: present, absent, half_day, on_leave, late",
        examples=["present"],
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of records to return"),
    current_user: User = Depends(require_roles(["HR_ADMIN", "ADMIN"])),
    db: Session = Depends(get_db),
):
    """
    Retrieve attendance records for the entire organization.

    Restricted to **HR_ADMIN** only. Returns attendance for all users
    in the HR admin's organization, enriched with user and department info.

    Supports optional filtering by date range and attendance status.
    """
    return get_organization_attendance(
        db=db,
        current_user=current_user,
        attendance_date=attendance_date,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )


# -------------------------------------------------------------------------
# Get Department Attendance
# -------------------------------------------------------------------------

@router.get("/department/{department_id}", response_model=List[DepartmentAttendanceUserRecord])
def get_department_attendance_endpoint(
    department_id: UUID,
    target_date: Optional[date] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN", "ADMIN"])),
):
    return get_department_attendance(
        db, current_user, department_id, target_date, start_date, end_date, status, skip, limit
    )
# -------------------------------------------------------------------------
# Get Monthly Attendance
# -------------------------------------------------------------------------

@router.get("/monthly/{user_id}", response_model=MonthlyAttendanceStats)
def monthly_attendance(
    user_id: str,
    year: int,
    month: int,
    db: Session = Depends(get_db)
):
    return get_monthly_attendance_stats(db, user_id, year, month)


# -------------------------------------------------------------------------
# Manage Attendance Rules
# -------------------------------------------------------------------------

@router.get(
    "/rules",
    response_model=List[AttendanceRuleResponse],
)
def get_attendance_rules(
    current_user: User = Depends(require_roles(["ADMIN", "HR_ADMIN"])),
    db: Session = Depends(get_db),
):

    return get_rules(
        db=db,
        organization_id=current_user.organization_id,
    )

@router.post(
    "/rules",
    response_model=AttendanceRuleResponse,
)
def create_attendance_rule(
    payload: AttendanceRuleCreate,
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db),
):

    return create_rule(
        db=db,
        organization_id=current_user.organization_id,
        data=payload,
    )

@router.put(
    "/rules/{rule_id}",
    response_model=AttendanceRuleResponse,
)
def update_attendance_rule(
    rule_id: UUID,
    payload: AttendanceRuleUpdate,
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db),
):

    return update_rule(
        db=db,
        rule_id=rule_id,
        organization_id=current_user.organization_id,
        data=payload,
    )

@router.delete("/rules/{rule_id}")
def delete_attendance_rule(
    rule_id: UUID,
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db),
):

    delete_rule(
        db=db,
        rule_id=rule_id,
        organization_id=current_user.organization_id,
    )

    return {"message": "Rule deleted successfully"}

# -------------------------------------------------------------------------
# Get Recognition Events (Live Monitoring)
# -------------------------------------------------------------------------

@router.get("/recognition/events", response_model=List[RecognitionEventResponse])
def get_recognition_events(
    limit: int = Query(20, ge=1, le=100, description="Maximum number of events to return"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    current_user: User = Depends(require_roles(["HR_ADMIN", "ADMIN"])),
    db: Session = Depends(get_db),
):
    """
    Retrieve recent recognition events (AttendanceEvents) for live monitoring.
    
    - HR_ADMIN: Returns all events in the organization
    - ADMIN: Returns only events from their department
    
    Events are sorted by timestamp (newest first).
    """
    query = db.query(AttendanceEvent).filter(
        AttendanceEvent.organization_id == current_user.organization_id
    )
    
    # Filter by department if ADMIN
    if hasattr(current_user, "role") and hasattr(current_user.role, "role_name"):
        if current_user.role.role_name == "ADMIN" and current_user.department_id:
            query = query.join(
                User, AttendanceEvent.user_id == User.user_id
            ).filter(User.department_id == current_user.department_id)
    
    events = query.order_by(
        AttendanceEvent.scan_timestamp.desc()
    ).offset(skip).limit(limit).all()
    
    result = []
    for event in events:
        user = db.query(User).filter(User.user_id == event.user_id).first()
        camera = db.query(Camera).filter(Camera.camera_id == event.camera_id).first()
        department = db.query(Department).filter(
            Department.department_id == user.department_id
        ).first() if user else None
        
        result.append({
            "event_id": event.event_id,
            "user_id": event.user_id,
            "person_name": user.full_name if user else "Unknown",
            "confidence": event.confidence_score or 0,
            "camera_id": event.camera_id or "",
            "camera_name": camera.camera_name if camera else "Unknown",
            "location": camera.location if camera else None,
            "department": department.name if department else "Unknown",
            "timestamp": event.scan_timestamp,
            "status": "recognized" if user else "unknown",
        })
    
    return result