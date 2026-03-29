from fastapi import HTTPException, status
from sqlalchemy import func, select
from app.models.core import User, Role, Department, Organization, OrganizationRole
from app.models.core import OrganizationStatusEnum, UserStatusEnum
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token
)
from app.services.email_service import EmailService
from app.services.audit_log_service import AuditLogService
from app.models.system import PasswordResetToken
from datetime import timedelta
import datetime
from datetime import timezone, datetime

from app.services.notification_service import NotificationService


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
            select(Role)
            .join(OrganizationRole)
            .where(
                Role.role_name == role_name,
                OrganizationRole.organization_id == organization.organization_id
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
            is_active=False
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        hr_admins = db.query(User).filter(
            User.organization_id == organization.organization_id,
            User.role.has(role_name="HR_ADMIN")
        ).all()

        for hr in hr_admins:
            NotificationService.create_notification(
                db,
                hr.user_id,
                hr.organization_id,
                f"New user registered: {new_user.full_name}",
                "INFO",
                redirect_path="/admin/manage#requests",
                entity_id=new_user.user_id,
                event_type="NEW_USER_REGISTERED"
            )

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

        token = create_access_token(
            subject=user.user_id,
            organization_id=None,
            role_name=user.role.role_name
        )
        
        return user, token
    
    # Separate login method for organization users (requires org name)
    @staticmethod
    def org_login(db, email: str, password: str, organization_name: str, ip_address: str = None):

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

        if user.status not in [UserStatusEnum.APPROVED, UserStatusEnum.ACTIVE]:
            raise HTTPException(403, "Account not yet approved by Admin")

        user.last_login = datetime.now(timezone.utc)
        db.commit()

        # Log the login action
        try:
            AuditLogService.log_action(
                db=db,
                user_id=user.user_id,
                action="LOGIN",
                organization_id=organization.organization_id,
                ip_address=ip_address
            )
        except Exception as e:
            print(f"Warning: Failed to log login action: {e}")

        token = create_access_token(
            subject=user.user_id,
            organization_id=user.organization_id,
            role_name=user.role.role_name
        )
        
        return user, token
    
    # Forgot password flow for both platform and org users (org name optional)
    @staticmethod
    def forgot_password(db, email: str, organization_name: str | None):

        # Step 1: Resolve user (platform or org)
        query = select(User).where(User.email == email)

        if organization_name:
            org = db.execute(
                select(Organization).where(
                    Organization.name == organization_name,
                    Organization.is_deleted == False
                )
            ).scalars().first()

            if not org:
                return {"message": "If user exists, reset link sent"}

            query = query.where(User.organization_id == org.organization_id)
        else:
            query = query.where(User.organization_id.is_(None))

        user = db.execute(query).scalars().first()

        # Step 2: Prevent user enumeration
        if not user:
            return {"message": "If user exists, reset link sent"}

        # Step 3: Invalidate old tokens
        existing_tokens = db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.user_id == user.user_id,
                PasswordResetToken.is_used == False
            )
        ).scalars().all()

        for t in existing_tokens:
            t.is_used = True

        # Step 4: Create new token
        token = PasswordResetToken(
            user_id=user.user_id,
            organization_id=user.organization_id,
            expires_at=datetime.utcnow() + timedelta(minutes=15)
        )

        db.add(token)
        db.commit()
        db.refresh(token)

        # Step 5: Create reset link
        reset_link = f"http://localhost:5173/reset-password/{token.token_id}"

        # Step 6: Send email
        EmailService.send_reset_email(
            to_email=user.email,
            reset_link=reset_link
        )

        return {"message": "If user exists, reset link sent"}
    
    # Reset password using token (same for platform and org users)
    @staticmethod
    def reset_password(db, token_id: str, new_password: str):

        token = db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.token_id == token_id
            )
        ).scalars().first()

        if not token:
            raise HTTPException(400, "Invalid token")

        if token.is_used:
            raise HTTPException(400, "Token already used")

        if token.expires_at < datetime.now(timezone.utc):
            raise HTTPException(400, "Token expired")

        user = db.get(User, token.user_id)

        if not user:
            raise HTTPException(404, "User not found")

        # Update password
        user.password_hash = get_password_hash(new_password)

        # Mark token as used
        token.is_used = True

        db.commit()

        return {"message": "Password reset successful"}
    
    @staticmethod
    async def initial_admin_approval(db, user_id):
        user = db.execute(select(User).where(User.user_id == user_id)).scalars().first()
        if not user:
            raise HTTPException(404, "User not found")
    
        # Change status to APPROVED so they can now upload images
        user.status = UserStatusEnum.APPROVED
        db.commit()
        return {"message": "User approved. They can now proceed to face enrollment."}