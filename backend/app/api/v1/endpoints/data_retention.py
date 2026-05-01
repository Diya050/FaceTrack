from typing import List
from uuid import UUID
from io import BytesIO, StringIO
import csv
import json
from datetime import datetime, date, time
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_db
from app.core.permissions import require_roles
from app.models.core import User, Organization
from app.models.attendance import Attendance
from app.models.biometrics import FacialBiometric
from app.services import data_retention_service

router = APIRouter(prefix="/data-retention", tags=["Data Retention"])

ADMIN_ROLES = ["HR_ADMIN", "ORG_ADMIN", "ADMIN"]


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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
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
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
):
    """Initialize default retention policies for the organization if they don't exist."""
    
    data_retention_service.initialize_default_policies(
        db, current_user.organization_id, current_user.user_id
    )
    
    return {"message": "Default policies initialized"}


def _download_filename(name: str) -> dict[str, str]:
    return {"Content-Disposition": f'attachment; filename="{name}"'}


def _sql_literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (datetime, date, time)):
        return f"'{value.isoformat()}'"
    text_value = str(value).replace("'", "''")
    return f"'{text_value}'"


@router.get("/exports/attendance")
def export_attendance_data(
    format: str = Query("csv", pattern="^(csv|json)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
):
    rows = (
        db.query(
            Attendance.attendance_date,
            Attendance.user_id,
            User.full_name,
            Attendance.status,
            Attendance.first_check_in,
            Attendance.last_check_out,
            Attendance.generated_at,
        )
        .join(User, Attendance.user_id == User.user_id)
        .filter(
            Attendance.organization_id == current_user.organization_id,
            Attendance.is_deleted == False,
        )
        .order_by(Attendance.attendance_date.desc())
        .all()
    )

    date_stamp = datetime.utcnow().date().isoformat()

    if format == "json":
        payload = [
            {
                "attendance_date": row.attendance_date.isoformat() if row.attendance_date else None,
                "user_id": str(row.user_id),
                "full_name": row.full_name,
                "status": str(row.status),
                "first_check_in": row.first_check_in.isoformat() if row.first_check_in else None,
                "last_check_out": row.last_check_out.isoformat() if row.last_check_out else None,
                "generated_at": row.generated_at.isoformat() if row.generated_at else None,
            }
            for row in rows
        ]
        content = json.dumps(payload, indent=2).encode("utf-8")
        return StreamingResponse(
            BytesIO(content),
            media_type="application/json",
            headers=_download_filename(f"attendance_{date_stamp}.json"),
        )

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "attendance_date",
        "user_id",
        "full_name",
        "status",
        "first_check_in",
        "last_check_out",
        "generated_at",
    ])

    for row in rows:
        writer.writerow([
            row.attendance_date.isoformat() if row.attendance_date else "",
            str(row.user_id),
            row.full_name,
            str(row.status),
            row.first_check_in.isoformat() if row.first_check_in else "",
            row.last_check_out.isoformat() if row.last_check_out else "",
            row.generated_at.isoformat() if row.generated_at else "",
        ])

    return StreamingResponse(
        BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers=_download_filename(f"attendance_{date_stamp}.csv"),
    )


@router.get("/exports/embeddings")
def export_embeddings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
):
    rows = (
        db.query(
            FacialBiometric.biometric_id,
            FacialBiometric.user_id,
            User.full_name,
            FacialBiometric.model_version,
            FacialBiometric.is_active,
            FacialBiometric.created_at,
            FacialBiometric.face_encoding,
        )
        .join(User, FacialBiometric.user_id == User.user_id)
        .filter(FacialBiometric.organization_id == current_user.organization_id)
        .order_by(FacialBiometric.created_at.desc())
        .all()
    )

    def serialize_encoding(value):
        if value is None:
            return None
        if hasattr(value, "tolist"):
            return value.tolist()
        if isinstance(value, (list, tuple)):
            return list(value)
        return str(value)

    payload = [
        {
            "biometric_id": str(row.biometric_id),
            "user_id": str(row.user_id),
            "full_name": row.full_name,
            "model_version": row.model_version,
            "is_active": row.is_active,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "face_encoding": serialize_encoding(row.face_encoding),
        }
        for row in rows
    ]

    content = json.dumps(payload, indent=2).encode("utf-8")
    date_stamp = datetime.utcnow().date().isoformat()
    return StreamingResponse(
        BytesIO(content),
        media_type="application/json",
        headers=_download_filename(f"embeddings_{date_stamp}.json"),
    )


@router.get("/exports/sql-dump")
def export_org_sql_snapshot(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ADMIN_ROLES)),
):
    org = db.query(Organization).filter(
        Organization.organization_id == current_user.organization_id
    ).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    policies = data_retention_service.get_retention_policies(db, current_user.organization_id)

    notification_config = org.notification_config
    if isinstance(notification_config, str):
        try:
            notification_config = json.loads(notification_config)
        except json.JSONDecodeError:
            notification_config = None

    escaped_config = (
        json.dumps(notification_config).replace("'", "''")
        if isinstance(notification_config, dict)
        else None
    )

    statements = [
        "-- FaceTrack organization-scoped SQL snapshot",
        f"-- generated_at: {datetime.utcnow().isoformat()}Z",
        "BEGIN;",
        (
            "UPDATE organizations "
            f"SET notification_config = '{escaped_config}'::jsonb "
            f"WHERE organization_id = {_sql_literal(org.organization_id)};"
            if escaped_config is not None
            else f"UPDATE organizations SET notification_config = NULL WHERE organization_id = {_sql_literal(org.organization_id)};"
        ),
    ]

    for policy in policies:
        statements.append(
            "INSERT INTO retention_policies "
            "(policy_id, organization_id, category, retention_days, auto_delete, archive_before_delete) "
            "VALUES "
            f"({_sql_literal(policy.policy_id)}, {_sql_literal(policy.organization_id)}, {_sql_literal(policy.category)}, "
            f"{_sql_literal(policy.retention_days)}, {_sql_literal(policy.auto_delete)}, {_sql_literal(policy.archive_before_delete)}) "
            "ON CONFLICT (policy_id) DO UPDATE SET "
            "retention_days = EXCLUDED.retention_days, "
            "auto_delete = EXCLUDED.auto_delete, "
            "archive_before_delete = EXCLUDED.archive_before_delete;"
        )

    statements.append("COMMIT;")
    dump_content = "\n".join(statements).encode("utf-8")
    date_stamp = datetime.utcnow().date().isoformat()

    return StreamingResponse(
        BytesIO(dump_content),
        media_type="application/sql",
        headers=_download_filename(f"org_snapshot_{date_stamp}.sql"),
    )