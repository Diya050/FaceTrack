from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import RegisterRequest, PlatformLoginRequest, OrgLoginRequest, TokenResponse
from app.services.auth_service import AuthService
# from app.services.auth_service import platform_login, org_login
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(
    request: RegisterRequest,
    db=Depends(get_db)
):
    user = AuthService.register_user(db, request)
    return {"message": "Registration successful. Awaiting approval."}


@router.post("/platform-login")
def platform_login_route(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db)
):
    token = AuthService.platform_login(
        db,
        form_data.username,
        form_data.password
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/org-login")
def org_login_route(
    data: OrgLoginRequest,
    db=Depends(get_db)
):
    token = AuthService.org_login(
        db,
        data.email,
        data.password,
        data.organization_name
    )
    return {
        "access_token": token,
        "token_type": "bearer"
    }