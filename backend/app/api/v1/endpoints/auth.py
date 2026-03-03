from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await AuthService.register_user(db, request)
    return {"message": "Registration successful. Awaiting approval."}


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    token = await AuthService.login(
        db,
        request.email,
        request.password,
        request.organization_name
    )

    return TokenResponse(access_token=token)