"""
Script to update ORG_ADMIN accounts from 'approved' to 'active' status
since ORG_ADMIN doesn't require face enrollment.
"""
import sys
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from app.models.core import User, UserStatusEnum
from app.core.config import settings

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

try:
    # Find all ORG_ADMIN users who are approved but not active
    users = db.execute(
        select(User).where(
            User.status == UserStatusEnum.APPROVED,
            User.is_deleted == False
        ).join(User.role)
    ).scalars().all()

    org_admins = [u for u in users if u.role.role_name == "ORG_ADMIN"]

    if not org_admins:
        print("No ORG_ADMIN users found with 'approved' status.")
        print("\nChecking for any ORG_ADMIN users...")
        all_org_admins = db.execute(
            select(User).where(
                User.is_deleted == False
            ).join(User.role)
        ).scalars().all()
        
        all_org_admins = [u for u in all_org_admins if u.role.role_name == "ORG_ADMIN"]
        
        if all_org_admins:
            print(f"\nFound {len(all_org_admins)} ORG_ADMIN user(s):")
            for user in all_org_admins:
                print(f"  - {user.full_name} ({user.email}) - Status: {user.status.value}")
        else:
            print("No ORG_ADMIN users found in the system.")
        
        sys.exit(0)

    print(f"Found {len(org_admins)} ORG_ADMIN user(s) with 'approved' status:")
    for user in org_admins:
        print(f"  - {user.full_name} ({user.email})")

    print("\nUpdating status to 'active'...")

    for user in org_admins:
        user.status = UserStatusEnum.ACTIVE
        print(f"  ✓ {user.full_name} - Status updated to ACTIVE")

    db.commit()
    print("\n✅ All ORG_ADMIN accounts updated successfully!")
    print("You can now log in and access the admin dashboard without face enrollment.")

except Exception as e:
    db.rollback()
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
