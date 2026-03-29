from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.organization_service import create_organization
from app.core.permissions import require_roles
from sqlalchemy import select
from app.models.core import Organization, User 
from sqlalchemy import func


router = APIRouter(prefix="/organizations", tags=["Organizations"])

# --- Existing Endpoints ---

@router.post("", response_model=OrganizationResponse)
def create_org(
    data: OrganizationCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    return create_organization(db, data, created_by=user.user_id)

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


@router.patch("/{org_id}/status", response_model=OrganizationResponse)
def update_org_status(
    org_id: str,
    status: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    org = db.execute(
        select(Organization).where(Organization.organization_id == org_id)
    ).scalars().first()

    if not org:
        raise HTTPException(404, "Organization not found")

    if status not in ["active", "suspended", "inactive"]:
        raise HTTPException(400, "Invalid status")

    org.status = status
    db.commit()
    db.refresh(org)

    return org


@router.delete("/{org_id}")
def delete_org(
    org_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    org = db.execute(
        select(Organization).where(Organization.organization_id == org_id)
    ).scalars().first()

    if not org:
        raise HTTPException(404, "Organization not found")

    org.is_deleted = True
    db.commit()

    return {"message": "Organization deleted"}



@router.get("/stats")
def get_platform_stats(
    db: Session = Depends(get_db),
    user=Depends(require_roles(["SUPER_ADMIN"]))
):
    total_orgs = db.execute(
        select(func.count(Organization.organization_id))
        .where(Organization.is_deleted == False)
    ).scalar()

    active_orgs = db.execute(
        select(func.count(Organization.organization_id))
        .where(
            Organization.status == "active",
            Organization.is_deleted == False
        )
    ).scalar()

    total_users = db.execute(
        select(func.count(User.user_id))
    ).scalar()

    return {
        "total_organizations": total_orgs,
        "active_organizations": active_orgs,
        "total_users": total_users,
    }