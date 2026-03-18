from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import Organization, Role, Department, OrganizationRole
from sqlalchemy.exc import IntegrityError
from app.models.core import OrganizationStatusEnum  # wherever your enum lives



def create_organization(db, data):

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
    db.flush()  # Get organization_id for departments/roles

    hr_department = Department(
        name="HR",
        organization_id=new_org.organization_id,
        description="Human Resources Department"
    )
    db.add(hr_department)

    # Auto-create default roles
    roles = db.execute(
        select(Role).where(
            Role.role_name.in_(["USER", "ADMIN", "HR_ADMIN"])
        )
    ).scalars().all()

    for role in roles:
        org_role = OrganizationRole(
            organization_id=new_org.organization_id,
            role_id=role.role_id
        )
        db.add(org_role)


    # Commit everything together
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Failed to create organization")

    db.refresh(new_org)

    return new_org