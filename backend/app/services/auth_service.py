from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.core import User
from app.models.core import Role, Department, Organization
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token
)


class AuthService:

    @staticmethod
    async def register_user(db: AsyncSession, data):
        org_result = await db.execute(
            select(Organization).where(
                Organization.name==data.organization_name,
                Organization.is_deleted == False
            )
        )
        organization = org_result.scalars().first()

        if not organization:
            raise HTTPException(
                status_code=404,
                detail="Organization not found"
            )
        
        dept_result = await db.execute(
            select(Department).where(
                Department.name==data.department_name,
                Department.organization_id == organization.id,
            )
        )
        department = dept_result.scalars().first()
        if not department:
            raise HTTPException(
                status_code=404,
                detail="Department not found in the specified organization"
            )

        # Check if user already exists in org
        result = await db.execute(
            select(User).where(
                User.email == data.email,
                User.organization_id == data.organization_id,
                User.is_deleted == False
            )
        )
        existing_user = result.scalars().first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User already exists in this organization"
            )

        hashed_password = get_password_hash(data.password)

        new_user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hashed_password,
            department_id=data.department_id,
            organization_id=data.organization_id,
            status="pending",
            face_enrolled=False
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return new_user

    @staticmethod
    async def login(db: AsyncSession, email, password, organization_name):

        org_result = await db.execute(
            select(Organization).where(
                Organization.name==organization_name,
                Organization.is_deleted == False
            )
        )
        organization = org_result.scalars().first()
        if not organization:
            raise HTTPException(
                status_code=404,
                detail="Organization not found"
            )
        organization_id = organization.id

        result = await db.execute(
            select(User)
            .join(Role)
            .where(
                User.email == email,
                User.organization_id == organization_id,
                User.is_deleted == False
            )
        )

        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if user.status != "approved":
            raise HTTPException(
                status_code=403,
                detail="Account not approved"
            )

        token = create_access_token(
            subject=user.id,
            organization_id=user.organization_id,
            role_name=user.role.name
        )

        return token