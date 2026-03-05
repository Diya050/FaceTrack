from fastapi import HTTPException, status
from sqlalchemy import func, select
from app.models.core import User, Role, Department, Organization
from app.models.core import OrganizationStatusEnum, UserStatusEnum
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token
)
import datetime
from datetime import timezone, datetime


class AuthService:

    @staticmethod
    def register_user(db, data):

        # Resolve organization
        org_result = db.execute(
            select(Organization).where(
                Organization.name == data.organization_name,
                Organization.is_deleted == False
            )
        )
        organization = org_result.scalars().first()

        if not organization:
            raise HTTPException(404, "Organization not found")

        if organization.status != OrganizationStatusEnum.ACTIVE:
            raise HTTPException(403, "Organization is not active")

        # Resolve department
        dept_result = db.execute(
            select(Department).where(
                Department.name == data.department_name,
                Department.organization_id == organization.organization_id
            )
        )
        department = dept_result.scalars().first()

        if not department:
            raise HTTPException(
                404,
                "Department not found in the specified organization"
            )

        # Check if user already exists in this org
        result = db.execute(
            select(User).where(
                User.email == data.email,
                User.organization_id == organization.organization_id,
                User.is_deleted == False
            )
        )
        existing_user = result.scalars().first()

        if existing_user:
            raise HTTPException(
                400,
                "User already exists in this organization"
            )
        
        count_result = db.execute(
            select(func.count(User.user_id)).where(
                User.organization_id == organization.organization_id,
                User.is_deleted == False
            )
        )
        user_count = count_result.scalar()
        if user_count == 0:
            role_name = "HR_ADMIN"
        else:
            role_name = "USER"

        if role_name == "HR_ADMIN":
            hr_dept_result = db.execute(
                select(Department).where(
                    Department.organization_id == organization.organization_id,
                    Department.name == "HR"
                )
            )

            hr_department = hr_dept_result.scalars().first()

            if not hr_department:
                raise HTTPException(500, "HR department missing for organization")

            department = hr_department


        # Fetch default USER role for this organization
        role_result = db.execute(
            select(Role).where(
                Role.role_name == role_name,
                Role.organization_id == organization.organization_id
            )
        )
        user_role = role_result.scalars().first()

        if not user_role:
            raise HTTPException(
                500,
                f"{role_name} role not configured for this organization"
            )

        # Hash password
        hashed_password = get_password_hash(data.password)

        # Create user
        new_user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hashed_password,
            role_id=user_role.role_id,
            department_id=department.department_id,
            organization_id=organization.organization_id,
            status = (
                UserStatusEnum.APPROVED
                if role_name == "HR_ADMIN"
                else UserStatusEnum.PENDING
            ),
            face_enrolled=False,
            is_active=True
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user
    
    # Separate login method for platform users (no org name required)
    @staticmethod
    def platform_login(db, email: str, password: str):

        result = db.execute(
            select(User)
            .where(
                User.email == email,
                User.organization_id == None,
                User.is_deleted == False
            )
        )

        user = result.scalars().first()

        if not user:
            raise HTTPException(401, "Invalid credentials")

        if not verify_password(password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")

        if user.status != UserStatusEnum.APPROVED:
            raise HTTPException(403, "Account not approved")

        user.last_login = datetime.now(timezone.utc)
        db.commit()

        return create_access_token(
            subject=user.user_id,
            organization_id=None,
            role_name=user.role.role_name
        )
    
    # Separate login method for organization users (requires org name)
    @staticmethod
    def org_login(db, email: str, password: str, organization_name: str):

        org_result = db.execute(
            select(Organization).where(
                Organization.name == organization_name,
                Organization.is_deleted == False
            )
        )

        organization = org_result.scalars().first()

        if not organization:
            raise HTTPException(404, "Organization not found")

        result = db.execute(
            select(User)
            .where(
                User.email == email,
                User.organization_id == organization.organization_id,
                User.is_deleted == False
            )
        )

        user = result.scalars().first()

        if not user:
            raise HTTPException(401, "Invalid credentials")

        if not verify_password(password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")

        if user.status != UserStatusEnum.APPROVED:
            raise HTTPException(403, "Account not approved")

        user.last_login = datetime.now(timezone.utc)
        db.commit()

        return create_access_token(
            subject=user.user_id,
            organization_id=user.organization_id,
            role_name=user.role.role_name
        )