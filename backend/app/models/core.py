import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Department(Base):
    __tablename__ = "departments"
    department_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    
    users = relationship("User", back_populates="department")

class Role(Base):
    __tablename__ = "roles"
    role_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = Column(String, nullable=False, unique=True)
    description = Column(String)
    
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String)
    password_hash = Column(String, nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.role_id"))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.department_id"))
    status = Column(String, default="Pending") 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))

    role = relationship("Role", back_populates="users")
    department = relationship("Department", back_populates="users")
    face_biometrics = relationship("FacialBiometric", back_populates="user", cascade="all, delete-orphan")
    voice_biometrics = relationship("VoiceBiometric", back_populates="user", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="user")
    attendance_events = relationship("AttendanceEvent", back_populates="user")
    attendance_corrections = relationship("AttendanceCorrection", back_populates="user")