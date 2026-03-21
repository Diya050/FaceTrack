import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.core import TenantMixin

class Consent(TenantMixin, Base):
    __tablename__ = "consents"
    consent_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    consent_type = Column(String, nullable=False) 
    is_granted = Column(Boolean, nullable=False, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="consents")
    
class Notification(TenantMixin, Base):
    __tablename__ = "notifications"
    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(String, nullable=False)
    type = Column(String, nullable=True)

    redirect_path = Column(String, nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    event_type = Column(String, nullable=True)
    
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    
    user = relationship("User", back_populates="notifications")

class SupportTicket(TenantMixin, Base):
    __tablename__ = "support_tickets"
    ticket_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True, index=True)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String,nullable=False, default="Open")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    
    user = relationship("User", back_populates="support_tickets")

class AuditLog(TenantMixin, Base):
    __tablename__ = "audit_logs"
    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    ip_address = Column(String, nullable=True)
    
    user = relationship("User", back_populates="audit_logs")

class LoginHistory(TenantMixin, Base):
    __tablename__ = "login_history"
    login_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id",  ondelete="CASCADE"), nullable=False, index=True)
    login_time = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    logout_time = Column(DateTime(timezone=True), nullable=True)
    login_status = Column(String, nullable=False)
    
    user = relationship("User", back_populates="login_history")


class PasswordResetToken(TenantMixin, Base):
    __tablename__ = "password_reset_tokens"
    token_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)

    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())    
    
    user = relationship("User", back_populates="password_reset_tokens")