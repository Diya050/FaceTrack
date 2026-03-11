from fastapi import APIRouter, Depends
from app.schemas.camera import CameraIdentify, CameraIdentifyResponse
from app.services.camera_service import CameraService
from app.db.session import get_db
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.post("/identify", response_model=CameraIdentifyResponse)
def identify_camera(
    data: CameraIdentify,
    db=Depends(get_db),
    user=Depends(get_current_user)
):

    camera = CameraService.identify_or_register_camera(
        db,
        data,
        user.organization_id
    )

    return camera