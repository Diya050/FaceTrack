from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.organization_service import create_organization
from app.core.permissions import require_roles
from sqlalchemy import select
from app.models.core import Organization, User # Assuming User model is here

router = APIRouter(prefix="/organizations", tags=["Organizations"])

# --- Existing Endpoints ---

@router.post("", response_model=OrganizationResponse)
def create_org(
    data: OrganizationCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    return create_organization(db, data)

@router.get("", response_model=list[OrganizationResponse])
def list_orgs(
    db: Session = Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    result = db.execute(
        select(Organization).where(Organization.is_deleted == False)
    )
    return result.scalars().all()

# --- New Endpoints for the Rules Engine ---

@router.get("/me", response_model=OrganizationResponse)
def get_my_org(
    db: Session = Depends(get_db),
    # Assuming require_roles or a similar dependency returns the current user
    current_user = Depends(require_roles(["HR_ADMIN"]))
):
    """Fetch the organization details for the logged-in admin."""
    org = db.execute(
        select(Organization).where(Organization.organization_id == current_user.organization_id)
    ).scalars().first()
    
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.put("/me", response_model=OrganizationResponse)
def update_my_org(
    data: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(["HR_ADMIN"]))
):
    """Update organization settings like min_hours_for_present."""
    org = db.execute(
        select(Organization).where(Organization.organization_id == current_user.organization_id)
    ).scalars().first()

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Update only fields that are provided in the request
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(org, key, value)

    db.commit()
    db.refresh(org)
    return org

# --- Public Endpoint ---

@router.get("/public", response_model=list[OrganizationResponse])
def list_orgs_public(
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(Organization).where(Organization.is_deleted == False)
    )
    return result.scalars().all()