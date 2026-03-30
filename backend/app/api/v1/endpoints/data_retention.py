from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_db
from app.core.permissions import require_roles
from app.models.core import User
from app.services import data_retention_service

router = APIRouter(prefix="/data-retention", tags=["Data Retention"])


class RetentionPolicyResponse(BaseModel):
    id: str
    category: str
    retention_days: int
    auto_delete: bool
    archive_before_delete: bool
    last_run_at: str | None
    next_run_at: str | None
    records_affected: int
    size_mb: float


class RetentionPolicyUpdate(BaseModel):
    retention_days: int
    auto_delete: bool
    archive_before_delete: bool


class PurgeJobResponse(BaseModel):
    id: str
    category: str
    status: str
    started_at: str
    completed_at: str | None
    records_deleted: int
    size_mb: float
    triggered_by: str
    error_message: str | None


@router.get("/policies", response_model=List[RetentionPolicyResponse])
def list_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """List all retention policies for the organization."""
    
    if not current_user.organization_id:
        raise HTTPException(status_code=400, detail="User organization not set")
    
    policies = data_retention_service.get_retention_policies(
        db, current_user.organization_id
    )
    
    response = []
    for policy in policies:
        policy_data = data_retention_service.get_retention_policy_with_storage(
            db, policy.policy_id, current_user.organization_id
        )
        if policy_data:
            response.append(RetentionPolicyResponse(**policy_data))
    
    return response


@router.get("/policies/{policy_id}", response_model=RetentionPolicyResponse)
def get_policy(
    policy_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """Get a specific retention policy."""
    
    policy = data_retention_service.get_retention_policy_with_storage(
        db, policy_id, current_user.organization_id
    )
    
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    return RetentionPolicyResponse(**policy)


@router.put("/policies/{policy_id}", response_model=RetentionPolicyResponse)
def update_policy(
    policy_id: UUID,
    payload: RetentionPolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """Update a retention policy."""
    
    policy = data_retention_service.update_retention_policy(
        db,
        policy_id,
        current_user.organization_id,
        payload.retention_days,
        payload.auto_delete,
        payload.archive_before_delete,
    )
    
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    policy_data = data_retention_service.get_retention_policy_with_storage(
        db, policy_id, current_user.organization_id
    )
    
    return RetentionPolicyResponse(**policy_data)


@router.post("/policies/{policy_id}/purge")
def trigger_purge(
    policy_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """Trigger manual purge for a retention policy."""
    
    policy = data_retention_service.get_retention_policy(
        db, policy_id, current_user.organization_id
    )
    
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    job = data_retention_service.create_purge_job(
        db,
        current_user.organization_id,
        policy_id,
        policy.category,
        current_user.user_id,
    )
    
    return {
        "status": "scheduled",
        "message": f"Purge job scheduled for {policy.category}",
        "policy_id": str(policy_id),
        "job_id": str(job.job_id),
    }


@router.get("/jobs", response_model=List[PurgeJobResponse])
def list_purge_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """List recent purge jobs for the organization."""
    
    jobs = data_retention_service.get_purge_jobs(
        db, current_user.organization_id, limit=50
    )
    
    response = []
    for job in jobs:
        job_data = data_retention_service.get_purge_job_with_details(
            db, job.job_id, current_user.organization_id
        )
        if job_data:
            response.append(PurgeJobResponse(**job_data))
    
    return response


@router.get("/jobs/{job_id}", response_model=PurgeJobResponse)
def get_purge_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """Get details about a specific purge job."""
    
    job_data = data_retention_service.get_purge_job_with_details(
        db, job_id, current_user.organization_id
    )
    
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return PurgeJobResponse(**job_data)


@router.post("/policies/initialize")
def initialize_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["HR_ADMIN"])),
):
    """Initialize default retention policies for the organization if they don't exist."""
    
    data_retention_service.initialize_default_policies(
        db, current_user.organization_id, current_user.user_id
    )
    
    return {"message": "Default policies initialized"}