from sqlalchemy import select
from app.db.session import SessionLocal
import app.models
from app.models import Role, User
from app.models.core import UserStatusEnum
from app.core.security import get_password_hash


def create_super_admin():

    db = SessionLocal()

    try:
        # Check if SUPER_ADMIN role exists
        role = db.execute(
            select(Role).where(
                Role.role_name == "SUPER_ADMIN"
            )
        ).scalars().first()

        if not role:
            role = Role(
                role_name="SUPER_ADMIN",
                description="Platform Super Admin"
            )
            db.add(role)
            db.commit()
            db.refresh(role)

        # Check if SUPER_ADMIN user exists
        existing_user = db.execute(
            select(User).where(
                User.email == "burnerformygem@gmail.com",
                User.organization_id.is_(None)
            )
        ).scalars().first()

        if not existing_user:
            superuser = User(
                full_name="Platform Admin",
                email="burnerformygem@gmail.com",
                password_hash=get_password_hash("StrongPassword123"),
                role_id=role.role_id,
                organization_id=None,
                department_id=None,
                status=UserStatusEnum.APPROVED,
                is_active=True,
                face_enrolled=False
            )

            db.add(superuser)
            db.commit()

        print("SUPER_ADMIN created successfully")

    finally:
        db.close()


if __name__ == "__main__":
    create_super_admin()