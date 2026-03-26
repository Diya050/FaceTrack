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

    

      # ── Attendance logic ──────────────────────────────────────────────────────────
    # process yesterday by default
    ATTENDANCE_DEFAULT_OFFSET_DAYS: int = int(os.getenv("ATTENDANCE_DEFAULT_OFFSET_DAYS", 1))

    # look back 7 days on startup
    ATTENDANCE_CATCHUP_DAYS: int = int(os.getenv("ATTENDANCE_CATCHUP_DAYS", 7))


    # ── Scheduler ─────────────────────────────────────────────────────────────────
    SCHEDULER_TIMEZONE: str = os.getenv("SCHEDULER_TIMEZONE", "Asia/Kolkata")

    # midnight IST (00:30)
    SCHEDULER_DAILY_HOUR: int = int(os.getenv("SCHEDULER_DAILY_HOUR", 0))
    SCHEDULER_DAILY_MINUTE: int = int(os.getenv("SCHEDULER_DAILY_MINUTE", 30))

    # 1 hour grace window (3600 seconds)
    SCHEDULER_MISFIRE_GRACE_SECONDS: int = int(os.getenv("SCHEDULER_MISFIRE_GRACE_SECONDS", 3600))

    SCHEDULER_JOB_ID: str = os.getenv("SCHEDULER_JOB_ID", "daily_attendance_job")


    # ── Startup behaviour ─────────────────────────────────────────────────────────
    ENABLE_CATCHUP_ON_STARTUP: bool = os.getenv("ENABLE_CATCHUP_ON_STARTUP", "true").lower() == "true"
    RUN_JOB_ON_STARTUP: bool = os.getenv("RUN_JOB_ON_STARTUP", "true").lower() == "true"

    # New variable: delay daily job so catchup starts first
    STARTUP_DAILY_JOB_DELAY_SECONDS: int = int(os.getenv("STARTUP_DAILY_JOB_DELAY_SECONDS", 5))
   
   
   
settings = Settings()