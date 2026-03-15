from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
import os
import warnings
from contextlib import asynccontextmanager

from app.api.v1.api import api_router
from app.workers.scheduler import start_scheduler, stop_scheduler
from app.services.face_embedding_service import get_face_app

# Optional: silence unnecessary warnings
warnings.filterwarnings("ignore")


# --- LIFESPAN: Startup and Shutdown ---
@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting FaceTrack services...")

    # Start background scheduler
    start_scheduler()

    # Preload InsightFace model (loads only once)
    get_face_app()
    print("InsightFace model loaded successfully")

    yield

    print("Shutting down FaceTrack services...")

    # Stop background scheduler
    stop_scheduler()


# --- FASTAPI SETUP ---
app = FastAPI(
    title="FaceTrack API",
    lifespan=lifespan
)

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

# Mount static files (kept for backward compatibility)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# --- ROOT ENDPOINT ---
@app.get("/")
def read_root():
    return {"message": "FaceTrack Backend is operational."}