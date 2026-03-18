from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import RegisterRequest, PlatformLoginRequest, OrgLoginRequest, TokenResponse
from app.services.auth_service import AuthService
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(
    request: RegisterRequest,
    db=Depends(get_db)
):
    user = AuthService.register_user(db, request)
    return {"message": "Registration successful. Awaiting approval."}


@router.post("/platform-login", response_model=TokenResponse)
def platform_login_route(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db)
):
    user, token = AuthService.platform_login(
        db,
        form_data.username,
        form_data.password
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.role_name,
        "organization_id": None
    }


@router.post("/org-login", response_model=TokenResponse)
def org_login_route(
    data: OrgLoginRequest,
    db=Depends(get_db)
):
    user, token = AuthService.org_login(
        db,
        data.email,
        data.password,
        data.organization_name
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.role_name,
        "organization_id": str(user.organization_id)
    }


