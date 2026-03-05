from sqlalchemy import select
from fastapi import HTTPException
from app.models.core import Department

class DepartmentService:
    @staticmethod
    def create_department(db, data, user):

        #Check duplicate department
        result=db.execute(
            select(Department).where(
                Department.name==data.name,
                Department.organization_id==user.organization_id,
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
            organization_id=user.organization_id
        )

        db.add(department)
        db.commit()
        db.refresh(department)

        return department