from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
import os
import warnings

from app.api.v1.api import api_router
from app.workers.scheduler import start_scheduler, stop_scheduler
from app.services.face_embedding_service import get_face_app

warnings.filterwarnings("ignore")

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


# --- STARTUP  ---
@app.on_event("startup")
def startup_event():
    print("Starting FaceTrack services...")
    start_scheduler()
    get_face_app()
    print("InsightFace model loaded successfully")


# --- SHUTDOWN  ---
@app.on_event("shutdown")
def shutdown_event():
    print("Shutting down FaceTrack services...")
    stop_scheduler()


# --- ROOT ---
@app.get("/")
def read_root():
    return {"message": "FaceTrack Backend is operational."}