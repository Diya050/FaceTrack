from sqlalchemy import select
from app.models.core import Department
from app.services.profile_service import ProfileService
from app.models.core import User
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

class DepartmentService:

    @staticmethod
    def create_department(db, data, user):
        if user.role.role_name != "HR_ADMIN":
            raise HTTPException(status_code=403)

        existing = db.execute(
            select(Department).where(
                Department.name == data.name,
                Department.organization_id == user.organization_id,
            )
        ).scalars().first()

        if existing:
            raise HTTPException(status_code=400, detail="Already exists")

        dept = Department(
            name=data.name,
            description=data.description,
            organization_id=user.organization_id,
        )

        db.add(dept)
        db.commit()
        db.refresh(dept)
        return dept

    @staticmethod
    def list_departments(db, user):
        role = user.role.role_name

        if role == "SUPER_ADMIN":
            raise HTTPException(status_code=403)

        if role == "HR_ADMIN" or role == "ORG_ADMIN":
            result = db.execute(
                select(Department).where(
                    Department.organization_id == user.organization_id,
                    Department.is_deleted == False
                )
            )
            return result.scalars().all()

        if role == "ADMIN":
            result = db.execute(
                select(Department).where(
                    Department.department_id == user.department_id,
                    Department.is_deleted == False
                )
            )
            dept = result.scalars().first()
            return [dept] if dept else []

        raise HTTPException(status_code=403)
    
    @staticmethod
    def get_department_users(db, user):
        if not user.department_id:
            return []

        result = db.execute(
            select(User).where(
                User.department_id == user.department_id,
                User.is_deleted == False
            )
        )
        users = result.scalars().all()
        
        # Use the same formatting logic as Organization Users
        return [ProfileService._format_user_dict(db, u) for u in users]
    
    

    def update_department(db: Session, department_id: UUID, organization_id: UUID, data: dict):
        # Ensure the department exists and belongs to the correct organization
        db_dept = db.query(Department).filter(
            Department.department_id == department_id,
            Department.organization_id == organization_id,
            Department.is_deleted == False
        ).first()

        if not db_dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Department not found"
            )

        # Update fields dynamically
        for key, value in data.items():
            if value is not None:
                setattr(db_dept, key, value)

        db.commit()
        db.refresh(db_dept)
        return db_dept

    def delete_department(db: Session, department_id: UUID, organization_id: UUID):
        db_dept = db.query(Department).filter(
            Department.department_id == department_id,
            Department.organization_id == organization_id
        ).first()

        if not db_dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Department not found"
            )

        # Soft Delete: Just mark it as deleted so historical data stays intact
        db_dept.is_deleted = True
        db.commit()
        return True