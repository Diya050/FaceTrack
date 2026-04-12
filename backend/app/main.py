"""
FastAPI Application Entry Point

Responsibilities:
- Initialize FastAPI application
- Configure middleware (CORS, security)
- Register API routes
- Manage application startup and shutdown lifecycle
"""

import logging
import warnings

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.workers import scheduler
from app.workers.scheduler import start_scheduler, stop_scheduler
from app.services.face_embedding_service import get_face_app

warnings.filterwarnings("ignore")

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# APPLICATION SETUP
# ---------------------------------------------------------------------------
app = FastAPI(title="FaceTrack API")

security = HTTPBearer()

# ---------------------------------------------------------------------------
# MIDDLEWARE CONFIGURATION
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# ROUTES
# ---------------------------------------------------------------------------
app.include_router(api_router, prefix="/api/v1")
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ---------------------------------------------------------------------------
# STARTUP EVENT
# ---------------------------------------------------------------------------
@app.on_event("startup")
def startup_event():
    """
    Application startup sequence.

    Steps:
    1. Load machine learning model (no database dependency)
    2. Start background scheduler (non-blocking)
    """
    logger.info("Starting application services")

    try:
        # Load ML model
        get_face_app()
        logger.info("ML model loaded successfully")

        # Start scheduler
        start_scheduler()
        logger.info("Scheduler started successfully")

        logger.info("Application startup completed")

    except Exception as exc:
        logger.exception("Startup failed: %s", exc)
        raise


# ---------------------------------------------------------------------------
# SHUTDOWN EVENT
# ---------------------------------------------------------------------------
@app.on_event("shutdown")
def shutdown_event():
    """
    Application shutdown sequence.

    Ensures graceful termination of background services.
    """
    logger.info("Shutting down application services")

    try:
        stop_scheduler()
        logger.info("Shutdown completed successfully")

    except Exception as exc:
        logger.exception("Error during shutdown: %s", exc)


# ---------------------------------------------------------------------------
# ROOT ENDPOINT
# ---------------------------------------------------------------------------
@app.get("/")
def read_root():
    """
    Basic health endpoint for service availability.
    """
    return {
        "message": "FaceTrack Backend is operational",
        "status": "healthy",
    }


# ---------------------------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------------------------
@app.get("/health")
def health_check():
    """
    Extended health check endpoint.

    Provides:
    - Database connectivity status
    - Active connection count
    - Scheduler state
    """
    from app.db.session import get_db_connection_count

    try:
        conn_count = get_db_connection_count()

        return {
            "status": "healthy",
            "database": "connected",
            "active_connections": conn_count,
            "scheduler": "running" if scheduler.running else "stopped",
        }

    except Exception as exc:
        logger.exception("Health check failed: %s", exc)

        return {
            "status": "degraded",
            "error": str(exc),
        }