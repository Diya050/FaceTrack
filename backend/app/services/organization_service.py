from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import Organization, Role, Department
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
        # is_deleted defaults to False
        # created_at handled by DB
        # updated_at handled by DB
    )

    db.add(new_org)
    db.flush()  # important (get organization_id before commit)

    hr_department=Department(
        name="HR",
        organization_id=new_org.organization_id,
        description="Human Resources Department"
    )
    db.add(hr_department)

        # Auto-create default roles
    default_roles = [
        ("USER", "Standard user role"),
        ("ADMIN", "Department admin role"),
        ("HR_ADMIN", "HR administrator role")
    ]

    for role_name, description in default_roles:
        role = Role(
            role_name=role_name,
            description=description,
            organization_id=new_org.organization_id
        )
        db.add(role)

    # Commit everything together
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Failed to create organization")

    db.refresh(new_org)

    return new_org