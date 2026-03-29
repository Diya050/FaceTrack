from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import Organization, Role, Department, OrganizationRole
from sqlalchemy.exc import IntegrityError
from app.models.core import OrganizationStatusEnum  # wherever your enum lives
from app.services.magic_link_service import MagicLinkService


def create_organization(db, data, created_by=None):

    # Check unique name (ignore soft-deleted)
    result = db.execute(
        select(Organization).where(
            Organization.name == data.name,
            Organization.is_deleted == False
        )
    )
    existing_name = result.scalars().first()

    if existing_name:
        raise HTTPException(
            status_code=400,
            detail="Organization name already exists"
        )

    # Check unique email (ignore soft-deleted)
    result = db.execute(
        select(Organization).where(
            Organization.email == data.email,
            Organization.is_deleted == False
        )
    )
    existing_email = result.scalars().first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Organization email already exists"
        )

    new_org = Organization(
        name=data.name,
        email=data.email,
        contact_number=data.contact_number,
        address=data.address,
        status=OrganizationStatusEnum.ACTIVE,
        min_hours_for_present=data.min_hours_for_present 
    )

    db.add(new_org)
    db.flush()

    # Create HR department (unchanged)
    hr_department = Department(
        name="HR",
        organization_id=new_org.organization_id,
        description="Human Resources Department"
    )
    db.add(hr_department)

    # Attach default roles (unchanged)
    roles = db.execute(
        select(Role).where(
            Role.role_name.in_(["USER", "ADMIN", "HR_ADMIN", "ORG_ADMIN"])
        )
    ).scalars().all()

    for role in roles:
        db.add(OrganizationRole(
            organization_id=new_org.organization_id,
            role_id=role.role_id
        ))

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Failed to create organization")

    db.refresh(new_org)

    # Send ORG_ADMIN invite
    MagicLinkService.create_invite(
        db=db,
        email=data.org_admin_email,
        role="ORG_ADMIN",
        organization_id=new_org.organization_id,
        invited_by=created_by  # SUPER_ADMIN
    )

    return new_org