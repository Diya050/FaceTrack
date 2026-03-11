import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.face_recognition import recognize_frame

router = APIRouter(prefix="/recognition", tags=["Face Recognition"])


@router.post("/camera")
async def recognize_camera_frame(
    file: UploadFile = File(...),
    camera_id: str = Form(...),
    organization_id: str = Form(...),
    db: AsyncSession = Depends(get_db)
):

    image_bytes = await file.read()

    nparr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = await recognize_frame(
        db=db,
        frame=frame,
        camera_id=camera_id,
        organization_id=organization_id
    )

    return {"faces": results}