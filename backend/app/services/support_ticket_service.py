from typing import List, Optional
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.system import SupportTicket
from app.schemas.support_ticket_schemas import SupportTicketCreate, SupportTicketUpdate
from app.schemas.support_ticket_schemas import TicketStatus


class SupportTicketService:
    """Service layer for handling support ticket operations."""

    @staticmethod
    def create_ticket(
        db: Session,
        current_user,
        data: SupportTicketCreate
    ) -> SupportTicket:
        """
        Create a new support ticket for the current user.
        """

        ticket = SupportTicket(
            user_id=current_user.user_id,
            organization_id=current_user.organization_id,
            subject=data.subject,
            description=data.description,
            status=TicketStatus.OPEN
        )

        db.add(ticket)
        db.commit()
        db.refresh(ticket)

        return ticket

    @staticmethod
    def list_tickets(
        db: Session,
        current_user,
        status: Optional[TicketStatus] = None
    ) -> List[SupportTicket]:
        """
        Retrieve all support tickets for the current user's organization.
        Optionally filter by ticket status.
        """

        query = select(SupportTicket).where(
            SupportTicket.organization_id == current_user.organization_id
        )

        if status:
            query = query.where(SupportTicket.status == status)

        query = query.order_by(SupportTicket.created_at.desc())

        result = db.execute(query)

        return result.scalars().all()

    @staticmethod
    def update_ticket_status(
        db: Session,
        current_user,
        ticket_id: UUID,
        status_data: SupportTicketUpdate
    ) -> SupportTicket:
        """
        Update the status of a support ticket.
        Only accessible within the same organization.
        """

        query = select(SupportTicket).where(
            SupportTicket.ticket_id == ticket_id,
            SupportTicket.organization_id == current_user.organization_id
        )

        result = db.execute(query)
        ticket = result.scalars().first()

        if not ticket:
            raise HTTPException(
                status_code=404,
                detail="Support ticket not found or access denied"
            )

        ticket.status = status_data.status

        db.commit()
        db.refresh(ticket)

        return ticket