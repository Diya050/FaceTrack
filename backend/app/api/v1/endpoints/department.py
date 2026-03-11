from fastapi import APIRouter, Depends, Query
from uuid import UUID
from datetime import date
from typing import List, Optional
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.schemas.daily_attendance import DepartmentAttendanceUserRecord
from app.services.department_service import DepartmentService
from app.services.attendance_service import get_department_attendance
from app.db.session import get_db
from app.core.permissions import require_roles
from sqlalchemy import select
from app.models.core import Department, Organization
from sqlalchemy.orm import Session

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("", response_model=DepartmentResponse)
def create_department(
    data: DepartmentCreate,
    db=Depends(get_db),
    user=Depends(require_roles(["HR_ADMIN"]))
):
    return DepartmentService.create_department(db, data, user)

from sqlalchemy import select
from app.models.core import Department


@router.get("/public/{organization_id}", response_model=list[DepartmentResponse])
def list_departments_by_org(
    organization_id: UUID,
    db= Depends(get_db)
):
    result = db.execute(
        select(Department).where(
            Department.organization_id == organization_id
        )
    )
    return result.scalars().all()

@router.get("/public/by-org-name/{organization_name}", response_model=list[DepartmentResponse])
def list_departments_by_org_name(
    organization_name: str,
    db = Depends(get_db)
):
    org_result = db.execute(
        select(Organization).where(
            Organization.name == organization_name,
            Organization.is_deleted == False
        )
    )

    organization = org_result.scalars().first()

    if not organization:
        return []

    result = db.execute(
        select(Department).where(
            Department.organization_id == organization.organization_id
        )
    )
    return result.scalars().all()




@router.get(
    "/{department_id}/attendance",
    response_model=List[DepartmentAttendanceUserRecord],
)
def get_department_attendance_endpoint(
    department_id: UUID,
    target_date: Optional[date] = Query(
        None,
        description="Fetch attendance for a specific date (YYYY-MM-DD). "
                    "Overrides start_date/end_date when provided.",
        examples=["2026-03-10"],
    ),
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
        description="Filter by attendance status: present, absent, half_day, on_leave",
        examples=["present"],
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN"])),
):
    """
    Retrieve attendance records for all members of a department.

    **Role Behaviour:**
    - **HR_ADMIN** – Can view attendance for any department within their organization.
    - **ADMIN** – Can only view attendance for their own department.

    **Filtering:**
    - Use `target_date` to fetch records for a single day.
    - Use `start_date` / `end_date` to fetch a date range.
    - Use `status` to filter by attendance status (`present`, `absent`, `half_day`, `on_leave`).

    """
    return get_department_attendance(
        db=db,
        current_user=current_user,
        department_id=department_id,
        target_date=target_date,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )