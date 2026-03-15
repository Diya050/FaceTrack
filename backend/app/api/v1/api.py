from fastapi import APIRouter

from app.api.v1.endpoints import auth, organization, department, profiles, face_enrollment_request, roles, users, unknown_faces, attendance_correction,attendance
from app.api.v1.endpoints import face_enrollment, face_recognition, camera, support_tickets
from app.api.v1.endpoints import notifications

from app.api.v1.endpoints import user_dashboard

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(organization.router)
api_router.include_router(department.router)
api_router.include_router(profiles.router)

api_router.include_router(face_enrollment_request.router)
api_router.include_router(face_enrollment.router)
api_router.include_router(face_recognition.router)

api_router.include_router(roles.router)
api_router.include_router(users.router)
api_router.include_router(attendance_correction.router)
api_router.include_router(unknown_faces.router)
api_router.include_router(attendance.router)
api_router.include_router(camera.router)

api_router.include_router(support_tickets.router)
api_router.include_router(notifications.router)

api_router.include_router(user_dashboard.router)