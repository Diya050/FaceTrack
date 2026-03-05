from fastapi import APIRouter
from app.api.v1.endpoints import auth, organization, department, profiles

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(organization.router)
api_router.include_router(department.router)
api_router.include_router(profiles.router)