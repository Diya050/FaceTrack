from sqlalchemy import select
from app.models.streams import Camera

class CameraService:

    @staticmethod
    def identify_or_register_camera(db, data, organization_id):
        
        result=db.execute(
            select(Camera).where(
                Camera.device_identifier == data.device_identifier,
                Camera.organization_id == organization_id
            )
        )
        camera=result.scalars().first()

        if camera:
            return camera
        
        new_camera = Camera(
            camera_name=data.camera_name,
            camera_type=data.camera_type,
            ip_address=data.ip_address,
            device_identifier=data.device_identifier,
            organization_id=organization_id,
            status="online"
        )
        db.add(new_camera)
        db.commit()
        db.refresh(new_camera)
        
        return new_camera