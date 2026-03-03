from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.organization import OrganizationCreate, OrganizationResponse
from app.services.organization_service import create_organization
from app.core.permissions import require_roles

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("",response_model=OrganizationResponse)
def create_org(
    data: OrganizationCreate,
    db=Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    return create_organization(db, data)