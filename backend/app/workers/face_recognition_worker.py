from sqlalchemy.ext.asyncio import AsyncSession

from app.services.attendance_service import record_attendance_event


async def process_recognition(
    db: AsyncSession,
    matched_user,
    camera_id,
    similarity
):
    """
    Called when a face match is detected.
    Creates an attendance event.
    """

    await record_attendance_event(
        db=db,
        user_id=matched_user.user_id,
        camera_id=camera_id,
        organization_id=matched_user.organization_id,
        confidence_score=similarity,
        recognition_method="arcface",
    )