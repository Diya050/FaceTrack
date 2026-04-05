from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from fastapi import HTTPException

from app.models.system import MagicInviteToken
from app.services.email_service import EmailService


class MagicLinkService:

    @staticmethod
    def create_invite(db, email, role, organization_id, invited_by, department_id=None):

        # Invalidate old unused tokens for same email
        existing_tokens = db.execute(
            select(MagicInviteToken).where(
                MagicInviteToken.email == email,
                MagicInviteToken.organization_id == organization_id,
                MagicInviteToken.is_used == False
            )
        ).scalars().all()

        for t in existing_tokens:
            t.is_used = True

        token = MagicInviteToken(
            email=email,
            role=role,
            organization_id=organization_id,
            invited_by=invited_by,
            department_id=department_id,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=30)
        )

        db.add(token)
        db.commit()
        db.refresh(token)

        invite_link = f"http://localhost:5173/invite/{token.token_id}"

        EmailService.send_invite_email( 
            to_email=email,
            invite_link=invite_link,
            role=role
        )

        return {"message": "Invite sent successfully"}
    

    @staticmethod
    def verify_token(db, token_id):

        token = db.execute(
            select(MagicInviteToken).where(
                MagicInviteToken.token_id == token_id
            )
        ).scalars().first()

        if not token:
            raise HTTPException(400, "Invalid invite")

        if token.is_used:
            raise HTTPException(400, "Invite already used")

        if token.expires_at < datetime.now(timezone.utc):
            raise HTTPException(400, "Invite expired")

        return token