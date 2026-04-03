from typing import List, Optional
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.system import SupportTicket
from app.schemas.support_ticket_schemas import SupportTicketCreate, SupportTicketUpdate, TicketStatus
from app.services.notification_service import NotificationService


class SupportTicketService:

    @staticmethod
    def create_ticket(db: Session, current_user, data: SupportTicketCreate) -> SupportTicket:
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

        ticket = db.execute(
            select(SupportTicket).where(
                SupportTicket.ticket_id == ticket_id,
                SupportTicket.organization_id == current_user.organization_id
            )
        ).scalars().first()

        if not ticket:
            raise HTTPException(status_code=404, detail="Support ticket not found")

        ticket.status = status_data.status

        db.commit()
        db.refresh(ticket)

        return ticket

    @staticmethod
    def resolve_with_message(
        db: Session,
        ticket_id: UUID,
        current_user,
        action_key: str
    ):

        ticket = db.query(SupportTicket).filter(
            SupportTicket.ticket_id == ticket_id,
            SupportTicket.organization_id == current_user.organization_id
        ).first()

        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")

        replies = {
            "resolved": "Your issue has been resolved. Thank you!",
            "wait": "We have received your ticket; it will take some time to resolve.",
            "info_needed": "HR Admin needs more details to process your request.",
            "tech_assigned": "A technician has been assigned to your case."
        }

        message_text = replies.get(action_key, "Your ticket status has been updated.")

        # ✅ Proper enum usage
        if action_key == "resolved":
            ticket.status = TicketStatus.RESOLVED
        else:
            ticket.status = TicketStatus.IN_PROGRESS

        # ✅ Notify ONLY ticket creator
        NotificationService.create_notification(
            db=db,
            user_id=ticket.user_id,
            organization_id=current_user.organization_id,
            message=message_text,
            type="TICKET_UPDATE",
            redirect_path="/support-tickets",
            entity_id=ticket.ticket_id,
            event_type="SUPPORT_REPLY"
        )

        db.commit()
        db.refresh(ticket)

        return ticket