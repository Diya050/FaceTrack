from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.permissions import require_roles
from app.schemas.audit_log_schema import AuditLogResponse
from app.services.audit_log_service import AuditLogService
from app.models.core import User

router = APIRouter(prefix="/audit", tags=["Audit Logs"])


@router.get("/logs", response_model=List[dict])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user: User = Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"])),
    db: Session = Depends(get_db),
):
    """
    Get audit logs for the current organization.
    - HR_ADMIN: sees all organization audit logs
    - ADMIN: sees only audit logs from their department
    """
    try:
        role_name = current_user.role.role_name if hasattr(current_user, "role") and current_user.role else None
        
        logs = AuditLogService.get_audit_logs(
            db=db,
            organization_id=current_user.organization_id,
            limit=limit,
            skip=skip,
            role_name=role_name,
            department_id=current_user.department_id if role_name == "ADMIN" else None
        )
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch audit logs: {str(e)}")
