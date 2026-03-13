from uuid import UUID

from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import Department, Organization

class DepartmentService:
    @staticmethod
    def _resolve_organization_id(db, user, requested_organization_id: UUID | None = None):
        role_name = user.role.role_name if user.role else None

        if role_name == "SUPER_ADMIN":
            if not requested_organization_id:
                raise HTTPException(
                    status_code=400,
                    detail="organization_id is required for SUPER_ADMIN"
                )

            organization = db.execute(
                select(Organization).where(
                    Organization.organization_id == requested_organization_id,
                    Organization.is_deleted == False,
                )
            ).scalars().first()

            if not organization:
                raise HTTPException(status_code=404, detail="Organization not found")

            return organization.organization_id

        if not user.organization_id:
            raise HTTPException(
                status_code=400,
                detail="Current user is not associated with an organization"
            )

        if requested_organization_id and requested_organization_id != user.organization_id:
            raise HTTPException(
                status_code=403,
                detail="You cannot access departments for another organization"
            )

        return user.organization_id

    @staticmethod
    def create_department(db, data, user):
        organization_id = DepartmentService._resolve_organization_id(
            db,
            user,
            data.organization_id,
        )

        #Check duplicate department
        result=db.execute(
            select(Department).where(
                Department.name==data.name,
                Department.organization_id==organization_id,
                # Department.is_deleted==False
            )
        )
        existing=result.scalars().first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Department with this name already exists in your organization"
            )
        
        department = Department(
            name=data.name,
            description=data.description,
            organization_id=organization_id
        )

        db.add(department)
        db.commit()
        db.refresh(department)

        return department

    @staticmethod
    def list_departments(db, user, organization_id: UUID | None = None):
        resolved_organization_id = DepartmentService._resolve_organization_id(
            db,
            user,
            organization_id,
        )

        result = db.execute(
            select(Department)
            .where(Department.organization_id == resolved_organization_id)
            .order_by(Department.name.asc())
        )
        return result.scalars().all()