import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

BUCKET = "face-images"


def upload_image(file_bytes, path):
    
    try:
        response = supabase.storage.from_(BUCKET).upload(
            path,
            file_bytes,
            {"content-type": "image/jpeg",
             "upsert": "true"
            }
        )
        
        if response is None: 
            raise Exception("Supabase returned empty response")
        
        return response 
    
    except Exception as e:
        print("SUPABASE UPLOAD ERROR", str(e))
        raise