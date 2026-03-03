from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router

app = FastAPI(title="FaceTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "FaceTrack Backend is operational."}