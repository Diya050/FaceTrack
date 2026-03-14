import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

BUCKET = "face-images"


def upload_image(file_bytes, path):
    supabase.storage.from_(BUCKET).upload(
        path,
        file_bytes,
        {"content-type": "image/jpeg"}
    )