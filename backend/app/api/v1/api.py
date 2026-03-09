from fastapi import APIRouter

from app.api.v1.endpoints import auth, organization, department, profiles, face_enrollment_request, roles, users, attendance_correction


api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(organization.router)
api_router.include_router(department.router)
api_router.include_router(profiles.router)
api_router.include_router(face_enrollment_request.router)
api_router.include_router(roles.router)
api_router.include_router(users.router)
api_router.include_router(attendance_correction.router)