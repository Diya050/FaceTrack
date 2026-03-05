from fastapi import APIRouter, Depends
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.services.department_service import DepartmentService
from app.db.session import get_db
from app.core.permissions import require_roles

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("", response_model=DepartmentResponse)
def create_department(
    data: DepartmentCreate,
    db=Depends(get_db),
    user=Depends(require_roles(["HR_ADMIN"]))
):
    return DepartmentService.create_department(db, data, user)