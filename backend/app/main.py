from fastapi import FastAPI
# from app.db import init_db

app = FastAPI(title="FaceTrack API")

# @app.on_event("startup")
# def on_startup():
#     print("Connecting to Supabase and initializing tables...")
#     init_db()
#     print("Database ready.")

@app.get("/")
def read_root():
    return {"message": "FaceTrack Backend is operational."}