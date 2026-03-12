from datetime import datetime
from typing import Optional
from uuid import UUID
from enum import Enum

from pydantic import BaseModel, Field


class TicketStatus(str, Enum):
    """Allowed support ticket statuses."""
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class SupportTicketCreate(BaseModel):
    """Schema for creating a new support ticket."""

    subject: str = Field(
        ...,
        min_length=5,
        max_length=255,
        description="Short summary of the issue",
        examples=["Camera not detecting face"],
    )

    description: str = Field(
        ...,
        min_length=10,
        description="Detailed description of the problem",
        examples=["The camera at the main entrance is blurry and not detecting faces."],
    )


class SupportTicketUpdate(BaseModel):
    """Schema for updating a support ticket."""

    status: TicketStatus = Field(
        ...,
        description="Updated status of the support ticket",
        examples=["Resolved"],
    )


class SupportTicketResponse(BaseModel):
    """Schema returned in API responses for support tickets."""

    ticket_id: UUID = Field(..., description="Unique identifier of the ticket")
    user_id: Optional[UUID] = Field(None, description="User who created the ticket")
    organization_id: Optional[UUID] = Field(None, description="Organization associated with the ticket")

    subject: str = Field(..., description="Ticket subject")
    description: str = Field(..., description="Ticket description")
    status: TicketStatus = Field(..., description="Current ticket status")

    created_at: datetime = Field(..., description="Timestamp when the ticket was created")

    class Config:
        from_attributes = True