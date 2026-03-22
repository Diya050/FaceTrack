import uuid
import enum
from sqlalchemy import Integer, Column, String, DateTime, ForeignKey, Boolean, Enum, UniqueConstraint, Index, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declared_attr
from sqlalchemy.sql import func
from app.db.session import Base

#ENUMS 
class OrganizationStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"

class UserStatusEnum(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ACTIVE = "active"
    INACTIVE = "inactive"
    
#Tenant Mixins
class TenantMixin:
    @declared_attr
    def organization_id(cls):
        return Column(
            UUID(as_uuid=True),
            ForeignKey("organizations.organization_id", ondelete="RESTRICT"),
            nullable=True,
            index=True,
        )
    
class Organization(Base):
    __tablename__ = "organizations"

    organization_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    contact_number = Column(String(20))
    address = Column(String(500))

    min_hours_for_present = Column(Integer, default=4, nullable=False)
    recognition_confidence = Column(Float, default=0.75, nullable=False)
    unknown_face_threshold = Column(Float, default=0.45, nullable=False)
    liveness_threshold = Column(Float, default=0.8, nullable=False)
    min_face_size = Column(Integer, default=60, nullable=False)
    status = Column(
        Enum(
            OrganizationStatusEnum,
            name="organization_status_enum",
            values_callable=lambda x: [e.value for e in x],
        ),
        nullable=False,
        default=OrganizationStatusEnum.ACTIVE,
    )
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    departments = relationship("Department", back_populates="organization")
    users = relationship("User", back_populates="organization")
    roles = relationship(
        "OrganizationRole",
        back_populates="organization",
        cascade="all, delete-orphan",
    )


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = Column(String(100), nullable=False, unique=True)
    description = Column(String)
    organizations = relationship(
        "OrganizationRole",
        back_populates="role",
        cascade="all, delete-orphan",
    )
    

class OrganizationRole(Base):
    __tablename__ = "organization_roles"

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.organization_id", ondelete="CASCADE"),
        primary_key=True,
    )

    role_id = Column(
        UUID(as_uuid=True),
        ForeignKey("roles.role_id", ondelete="CASCADE"),
        primary_key=True,
    )

    organization = relationship("Organization", back_populates="roles")

    role = relationship("Role", back_populates="organizations")



class Department(Base, TenantMixin):
    __tablename__ = "departments"
    department_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(String)
    
    organization = relationship("Organization", back_populates="departments")
    users = relationship("User", back_populates="department")
    
    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_department_org_name"),
        Index("ix_department_org_name", "organization_id", "name"),
    )

    
class User(Base, TenantMixin):
    __tablename__ = "users"
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    role_id = Column(
        UUID(as_uuid=True),
        ForeignKey("roles.role_id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    department_id = Column(
        UUID(as_uuid=True),
        ForeignKey("departments.department_id", ondelete="RESTRICT"),
        nullable=True,  # SUPER_ADMIN has no department
        index=True,
    )
    status = Column(
        Enum(UserStatusEnum, name="user_status_enum", values_callable=lambda enum_cls: [e.value for e in enum_cls]),
        nullable=False,
        default=UserStatusEnum.PENDING,
        index=True,
    )
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    face_enrolled = Column(Boolean, default=False, nullable=False)
    approved_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
    )
    approved_at = Column(DateTime(timezone=True))
    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    last_login = Column(DateTime(timezone=True))

    # Relationships
    organization = relationship("Organization", back_populates="users")
    role = relationship("Role")
    department = relationship("Department", back_populates="users")

    approver = relationship("User", remote_side=[user_id], foreign_keys=[approved_by])
    creator = relationship("User", remote_side=[user_id], foreign_keys=[created_by])

    face_biometrics = relationship("FacialBiometric", back_populates="user")
    voice_biometrics = relationship("VoiceBiometric", back_populates="user")
    attendance_records = relationship("Attendance", back_populates="user")
    attendance_events = relationship("AttendanceEvent", back_populates="user")
    attendance_corrections = relationship("AttendanceCorrection", foreign_keys="AttendanceCorrection.user_id", back_populates="user")
    face_enrollment_sessions = relationship("FaceEnrollmentSession",back_populates="user",cascade="all, delete-orphan")
    consents = relationship("Consent", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    support_tickets = relationship("SupportTicket", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    login_history = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship(
        "PasswordResetToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("organization_id", "email", name="uq_user_org_email"),
        Index("ix_user_org_role", "organization_id", "role_id"),
        Index("ix_user_org_department", "organization_id", "department_id"),
    )