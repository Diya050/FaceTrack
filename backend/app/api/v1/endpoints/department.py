from fastapi import APIRouter, Depends, Query
from uuid import UUID
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.services.department_service import DepartmentService
from app.db.session import get_db
from app.core.permissions import require_roles
from sqlalchemy import select
from app.models.core import Department, Organization, User
from sqlalchemy.orm import Session
from app.schemas.profile import ProfileResponse
from app.schemas.department import DepartmentResponse, DepartmentUpdate

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("", response_model=DepartmentResponse)
def create_department(
    data: DepartmentCreate,
    db=Depends(get_db),
    user=Depends(require_roles([ "HR_ADMIN"]))
):
    return DepartmentService.create_department(db, data, user)


@router.get("", response_model=list[DepartmentResponse])
def list_departments(
    db=Depends(get_db),
    user=Depends(require_roles([ "ADMIN", "HR_ADMIN"]))
):
    return DepartmentService.list_departments(db, user)


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


@router.get("/department-users", response_model=list[ProfileResponse])
def get_department_users(
    db: Session = Depends(get_db),
    user=Depends(require_roles(["ADMIN"])) 
):
    return DepartmentService.get_department_users(db, user)


@router.put("/{department_id}", response_model=DepartmentResponse)
def edit_department(
    department_id: UUID,
    payload: DepartmentUpdate, # Ensure you have a schema with optional name/desc
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"]))
):
    return DepartmentService.update_department(
        db=db,
        department_id=department_id,
        organization_id=current_user.organization_id,
        data=payload.dict(exclude_unset=True)
    )

@router.delete("/{department_id}")
def remove_department(
    department_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"]))
):
    DepartmentService.delete_department(
        db=db,
        department_id=department_id,
        organization_id=current_user.organization_id
    )
    return {"message": "Department successfully removed"}
