"""
FastAPI Main Application - FIXED STARTUP SEQUENCE
=================================================
Key changes:
✅ Sequential startup (no concurrent DB access)
✅ ML model loads first (no DB)
✅ Scheduler handles catch-up internally
✅ Clean separation of concerns
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
import warnings
import logging

from app.api.v1.api import api_router
from app.workers.scheduler import start_scheduler, stop_scheduler
from app.services.face_embedding_service import get_face_app

warnings.filterwarnings("ignore")

logger = logging.getLogger(__name__)

# --- FASTAPI SETUP ---
app = FastAPI(title="FaceTrack API")

security = HTTPBearer()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API ROUTES ---
app.include_router(api_router, prefix="/api/v1")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# --- STARTUP - SEQUENTIAL EXECUTION ---
@app.on_event("startup")
def startup_event():
    """
    Startup sequence:
    1. Load ML model (no DB needed)
    2. Start scheduler (handles catch-up internally)
    
    ⚠️  CRITICAL: Everything runs sequentially to prevent
    connection pool exhaustion on Supabase free tier.
    """
    logger.info("🚀 Starting FaceTrack services...")

    try:
        # ✅ Step 1: Load ML model (no database connection)
        logger.info("Loading InsightFace model...")
        get_face_app()
        logger.info("✅ InsightFace model loaded")

        # ✅ Step 2: Start scheduler (handles catch-up internally if enabled)
        logger.info("Starting scheduler...")
        start_scheduler()  # This runs catch-up synchronously if configured
        logger.info("✅ Scheduler started")

        logger.info("✅ FaceTrack startup complete")

    except Exception as exc:
        logger.exception("❌ Startup failed: %s", exc)
        raise


# --- SHUTDOWN ---
@app.on_event("shutdown")
def shutdown_event():
    """Clean shutdown sequence."""
    logger.info("🛑 Shutting down FaceTrack services...")
    
    try:
        stop_scheduler()
        logger.info("✅ Shutdown complete")
    except Exception as exc:
        logger.exception("Error during shutdown: %s", exc)


# --- ROOT ---
@app.get("/")
def read_root():
    return {
        "message": "FaceTrack Backend is operational.",
        "status": "healthy"
    }


# --- HEALTH CHECK ---
@app.get("/health")
def health_check():
    """
    Health check endpoint.
    Can be extended to check DB connection, scheduler status, etc.
    """
    from app.db.session import get_db_connection_count
    
    try:
        conn_count = get_db_connection_count()
        return {
            "status": "healthy",
            "database": "connected",
            "active_connections": conn_count,
            "scheduler": "running" if scheduler.running else "stopped"
        }
    except Exception as exc:
        return {
            "status": "degraded",
            "error": str(exc)
        }