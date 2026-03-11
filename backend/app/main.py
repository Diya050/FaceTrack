from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import os
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router
from app.workers.scheduler import start_scheduler, stop_scheduler

# --- LIFESPAN: Startup and Shutdown ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize background tasks on server startup
    start_scheduler()
    
    yield  # The FastAPI application runs while yielded here
    
    # Cleanup and shutdown background tasks when server stops
    stop_scheduler()


# --- FASTAPI SETUP ---
app = FastAPI(title="FaceTrack API", lifespan=lifespan)

security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Ensure the directory exists to avoid startup errors
if not os.path.exists("uploads/faces"):
    os.makedirs("uploads/faces", exist_ok=True)

# MOUNT THE STATIC FILES
# This makes http://localhost:8000/uploads/faces/your-image.jpg work
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "FaceTrack Backend is operational."}