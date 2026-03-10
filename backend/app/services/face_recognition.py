from app.services.attendance_service import record_attendance_event


THRESHOLD = 0.75


async def process_recognition(
    db,
    matched_user,
    camera_id,
    similarity_score
):
    """
    Process the result of a face recognition match.
    """

    # Face recognized
    if similarity_score >= THRESHOLD:

        await record_attendance_event(
            db=db,
            user_id=matched_user.user_id,
            camera_id=camera_id,
            organization_id=matched_user.organization_id,
            confidence_score=similarity_score,
            recognition_method="face",
            event_type="passby"
        )

        return {
            "status": "recognized",
            "user_id": str(matched_user.user_id)
        }

    # Face not recognized
    return {
        "status": "unknown"
    }