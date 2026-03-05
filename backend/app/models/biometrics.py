import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Index, UniqueConstraint, text 
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects.postgresql import ENUM
from app.db.session import Base
from app.models.core import TenantMixin 

face_enrollment_status_enum = ENUM(
    "started",
    "completed",
    "failed",
    name="face_enrollment_status_enum",
    create_type=False
)

class FacialBiometric(TenantMixin, Base):
    __tablename__ = "facial_biometrics"
    biometric_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    face_encoding = Column(Vector(512), nullable=False) 
    model_version = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        # Only one active embedding per user(Use average of multiple embeddings-backend logic)
        Index(
            "uq_facial_biometrics_user_active_true",
            "organization_id",
            "user_id",
            unique=True,
            postgresql_where=text("is_active = true"),
        ),
        # Fast tenant filtering
        Index(
            "ix_facial_biometrics_org_user",
            "organization_id",
            "user_id",
        ),
        # HNSW similarity search index
        Index(
            "ix_facial_biometrics_face_encoding",
            "face_encoding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"face_encoding": "vector_cosine_ops"},
        )
    )
    user = relationship("User", back_populates="face_biometrics")
    enrollment_sessions = relationship("FaceEnrollmentSession", back_populates="embedding")

class VoiceBiometric(TenantMixin, Base):
    __tablename__ = "voice_biometrics"
    voice_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    voice_encoding = Column(Vector(512), nullable=False) 
    model_version = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index(
            
            "ix_voice_biometrics_org_user",
            "organization_id",
            "user_id",
        ),
        Index(
            "ix_voice_biometrics_encoding",
            "voice_encoding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"voice_encoding": "vector_cosine_ops"},
        ),
    )
    user = relationship("User", back_populates="voice_biometrics")
    
class FaceEnrollmentSession(TenantMixin, Base):
    __tablename__ = "face_enrollment_sessions"
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(face_enrollment_status_enum, nullable=False, default="started")
    embedding_id = Column(UUID(as_uuid=True), ForeignKey("facial_biometrics.biometric_id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index(
            "ix_face_enrollment_org_user",
            "organization_id",
            "user_id"
        ),
        Index(
            "ix_face_enrollment_sessions_status",
            "status",
        )
    )
    user = relationship("User", back_populates="face_enrollment_sessions")
    embedding = relationship("FacialBiometric", back_populates="enrollment_sessions")
