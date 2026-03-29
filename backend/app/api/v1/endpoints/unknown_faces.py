from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import select
from app.models.core import User

from app.db.session import get_db
from app.core.permissions import require_roles
from app.services.unknown_faces_service import UnknownFacesService
from app.schemas.unknown_faces import UnknownFaceResponse, ResolveUnknownFaceRequest

router = APIRouter(
    prefix="/unknown-faces",
    tags=["Unknown Faces"]
)

@router.get("/", response_model=List[UnknownFaceResponse])
def get_unknown_faces(
    current_user = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    return UnknownFacesService.get_unknown_faces(db, current_user)


@router.post("/resolve")
def resolve_unknown_face(
    data: ResolveUnknownFaceRequest,
    current_user = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    return UnknownFacesService.resolve_unknown_face(db, current_user, data)


@router.delete("/{unknown_id}")
def delete_unknown_face(
    unknown_id: str,
    current_user = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    return UnknownFacesService.delete_unknown_face(db, unknown_id, current_user)


@router.get("/employees")
def get_employees(
    search: str = "",
    current_user = Depends(require_roles(["HR_ADMIN"])),
    db: Session = Depends(get_db)
):
    query = select(User).where(
        User.organization_id == current_user.organization_id
    )

    if search:
        query = query.where(User.full_name.ilike(f"%{search}%"))

    users = db.execute(query).scalars().all()

    return [
        {
            "user_id": u.user_id,
            "full_name": u.full_name
        }
        for u in users
    ]