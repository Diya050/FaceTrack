import sys
from uuid import uuid4
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from app.models.core import User
from app.models.biometrics import FaceEnrollmentSession
from app.core.config import settings

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

try:
    # Find all approved users without face enrollment and no active session
    users = db.execute(
        select(User).where(
            User.status == "approved",
            User.face_enrolled == False,
            User.is_deleted == False
        )
    ).scalars().all()

    if not users:
        print("No approved users found who need a face enrollment session.")
        sys.exit(0)

    print(f"Found {len(users)} approved user(s) without face enrollment:")
    for user in users:
        print(f"  - {user.full_name} ({user.email})")

    print("\nCreating face enrollment sessions...")

    for user in users:
        # Check if session already exists
        existing = db.execute(
            select(FaceEnrollmentSession).where(
                FaceEnrollmentSession.user_id == user.user_id,
                FaceEnrollmentSession.status.in_(["started", "pending_approval"])
            )
        ).scalars().first()

        if existing:
            print(f"  ✓ {user.full_name} - Session already exists (status: {existing.status})")
            continue

        # Create new session
        session = FaceEnrollmentSession(
            session_id=uuid4(),
            user_id=user.user_id,
            organization_id=user.organization_id,
            status="started"
        )
        db.add(session)
        print(f"  ✓ {user.full_name} - Session created")

    db.commit()
    print("\n✅ All sessions created successfully!")
    print("You can now refresh your browser and upload your face images.")

except Exception as e:
    db.rollback()
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
