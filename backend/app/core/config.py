import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "FaceTrack API"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in the environment variables")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    # Attendance config
    ATTENDANCE_DEFAULT_OFFSET_DAYS: int = int(os.getenv("ATTENDANCE_DEFAULT_OFFSET_DAYS", 1))

    # Catch-up control
    ENABLE_CATCHUP_ON_STARTUP: bool = os.getenv("ENABLE_CATCHUP_ON_STARTUP", "true").lower() == "true"
    RUN_JOB_ON_STARTUP: bool = os.getenv("RUN_JOB_ON_STARTUP", "true").lower() == "true"

    ATTENDANCE_CATCHUP_DAYS: int = int(os.getenv("ATTENDANCE_CATCHUP_DAYS", 7))  # LIMIT

    # Scheduler config
    SCHEDULER_TIMEZONE: str = os.getenv("SCHEDULER_TIMEZONE", "Asia/Kolkata")
    SCHEDULER_DAILY_HOUR: int = int(os.getenv("SCHEDULER_DAILY_HOUR", 1))
    SCHEDULER_DAILY_MINUTE: int = int(os.getenv("SCHEDULER_DAILY_MINUTE", 0))

    SCHEDULER_MISFIRE_GRACE_SECONDS: int = int(
        os.getenv("SCHEDULER_MISFIRE_GRACE_SECONDS", 86400)
    )

    SCHEDULER_JOB_ID: str = os.getenv(
        "SCHEDULER_JOB_ID", "daily_attendance_generation"
    )

settings = Settings()