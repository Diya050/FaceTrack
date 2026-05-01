from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.core.permissions import require_roles

from app.schemas.support_ticket_schemas import (
    SupportTicketCreate,
    SupportTicketUpdate,
    SupportTicketResponse,
    TicketStatus,
)

from app.services.support_ticket_service import SupportTicketService


router = APIRouter(
    prefix="/support-tickets",
    tags=["Support Tickets"],
)


@router.post(
    "",
    response_model=SupportTicketResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ticket(
    data: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return SupportTicketService.create_ticket(db, current_user, data)


@router.get(
    "",
    response_model=List[SupportTicketResponse],
)
def list_tickets(
    status: Optional[TicketStatus] = Query(None),
    db: Session = Depends(get_db),
    
    current_user=Depends(require_roles(["HR_ADMIN", "ORG_ADMIN"])),
):
    return SupportTicketService.list_tickets(db, current_user, status)


@router.patch(
    "/{ticket_id}/status",
    response_model=SupportTicketResponse,
)
def update_ticket_status(
    ticket_id: UUID,
    data: SupportTicketUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN", "ORG_ADMIN"])),
):
    return SupportTicketService.update_ticket_status(
        db=db,
        current_user=current_user,
        ticket_id=ticket_id,
        status_data=data,
    )


@router.post("/{ticket_id}/respond")
def respond_to_ticket(
    ticket_id: UUID,
    action_key: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["HR_ADMIN"]))
):
    return SupportTicketService.resolve_with_message(
        db=db,
        ticket_id=ticket_id,
        current_user=current_user,
        action_key=action_key
    )