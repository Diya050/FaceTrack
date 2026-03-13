from fastapi import APIRouter, Depends, Query
from uuid import UUID
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.services.department_service import DepartmentService
from app.db.session import get_db
from app.core.permissions import require_roles
from sqlalchemy import select
from app.models.core import Department, Organization

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("", response_model=DepartmentResponse)
def create_department(
    data: DepartmentCreate,
    db=Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN", "ADMIN", "HR_ADMIN"]))
):
    return DepartmentService.create_department(db, data, user)


@router.get("", response_model=list[DepartmentResponse])
def list_departments(
    organization_id: UUID | None = Query(default=None),
    db=Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN", "ADMIN", "HR_ADMIN"]))
):
    return DepartmentService.list_departments(db, user, organization_id)


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




