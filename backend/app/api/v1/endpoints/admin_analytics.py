"""
Admin Analytics API
===================
"""

import logging
import traceback
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date

from app.db.session import get_db
from app.core.dependencies import get_current_user, get_org_id
from app.schemas.admin_analytics_schema import AbsentAnalyticsResponse, DepartmentAttendanceItem, DeptCameraAnalyticsResponse, HalfDayAnalyticsResponse, KPIOverviewResponse, LateAnalyticsResponse, RecognitionAnalyticsResponse, TrendItem
from app.services.admin_analytics_service import AdminAnalyticsService
from app.core.dependencies import get_org_id
from app.core.access_control import get_access_scope
from app.core.permissions import require_roles
from app.schemas.admin_reports_schema import RecentDetectionsResponse, WorkingHoursResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["Admin Analytics"])


def build_scope(current_user):
    try:
        role = current_user.role.role_name
        print(f"DEBUG: Building scope for user_id={current_user.user_id}, role={role}, department_id={getattr(current_user, 'department_id', None)}")

        if role == "ADMIN":
            if not current_user.department_id:
                raise HTTPException(
                    status_code=400,
                    detail="Admin missing department"
                )

            return {
                "type": "department",
                "department_id": current_user.department_id,
                "user_id": current_user.user_id  # ✅ Add this for self-visibility
            }

        elif role == "HR_ADMIN":
            return {
                "type": "organization",
                "user_id": current_user.user_id  # ✅ Add for consistency
            }
        
        elif role == "ORG_ADMIN":
            return {
                "type": "organization",
                "user_id": current_user.user_id  # ✅ Add for consistency
            }

        else:
            raise HTTPException(
                status_code=403,
                detail="Not authorized"
            )

    except AttributeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"User object missing required attributes: {str(e)}"
        )


@router.get("/overview", response_model=KPIOverviewResponse)
def get_kpi_overview(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    KPI Overview Endpoint

    Uses:
    - organization_id from dependency (cleaner than current_user)
    - returns TODAY analytics (computed from attendance_events)
    """

    scope = build_scope(current_user)

    try:
        if not organization_id:
            raise HTTPException(
                status_code=400,
                detail={
                    "error_type": "ValidationError",
                    "location": "get_kpi_overview",
                    "detail": "Invalid organization context",
                },
            )
    
        scope = get_access_scope(current_user)

        result = AdminAnalyticsService.get_kpi_overview(
            db=db,
            organization_id=organization_id,
            scope=scope,
        )

        return result

    except ValueError as ve:
        logger.error(
            f"KPI validation error in get_kpi_overview: {str(ve)} | org_id={organization_id}"
        )
        raise HTTPException(
            status_code=404,
            detail={
                "error_type": "ValueError",
                "location": "get_kpi_overview",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_kpi_overview | org_id={organization_id} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_kpi_overview",
                "detail": "Failed to fetch KPI overview. Check logs for traceback.",
            },
        )
    

@router.get("/trend", response_model=List[TrendItem])
def get_attendance_trend(
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Attendance Trend API

    Supports:
    - 7 days
    - 30 days
    """
    scope = build_scope(current_user)

    try:
        result = AdminAnalyticsService.get_attendance_trend(
            db=db,
            organization_id=organization_id,
            days=days,
            scope=scope,
        )
        return result

    except ValueError as ve:
        logger.error(
            f"Validation error in get_attendance_trend: {str(ve)} | org_id={organization_id}, days={days}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_type": "ValueError",
                "location": "get_attendance_trend",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_attendance_trend | org_id={organization_id}, days={days} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_attendance_trend",
                "detail": "Failed to fetch attendance trend. Check logs for traceback.",
            },
        )
    

@router.get("/departments", response_model=List[DepartmentAttendanceItem])
def get_department_attendance(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Department Attendance %

    Uses:
    - TODAY → attendance_events
    """
    scope = build_scope(current_user)
    try:
        result = AdminAnalyticsService.get_department_attendance(
            db=db,
            organization_id=organization_id,
            scope=scope,
        )
        return result

    except ValueError as ve:
        logger.error(
            f"Validation error in get_department_attendance: {str(ve)} | org_id={organization_id}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_type": "ValueError",
                "location": "get_department_attendance",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_department_attendance | org_id={organization_id} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_department_attendance",
                "detail": "Failed to fetch department analytics. Check logs for traceback.",
            },
        )
    

@router.get("/recognition", response_model=RecognitionAnalyticsResponse)
def get_recognition_analytics(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Recognition Quality API

    Returns:
    - recognition_rate (%)
    - today_unknown_faces
    - 7-day unknown trend
    """
    scope = build_scope(current_user)


    
    try:
        result = AdminAnalyticsService.get_recognition_analytics(
            db=db,
            organization_id=organization_id,
            scope=scope,
        )
        return result

    except ValueError as ve:
        logger.error(
            f"Validation error in get_recognition_analytics: {str(ve)} | org_id={organization_id}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_type": "ValueError",
                "location": "get_recognition_analytics",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_recognition_analytics | org_id={organization_id} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_recognition_analytics",
                "detail": "Failed to fetch recognition analytics. Check logs for traceback.",
            },
        )
    

@router.get("/absent", response_model=AbsentAnalyticsResponse)
def get_absent_analytics(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Absent Analytics API

    Returns:
    - Today absent count
    - Trend (7 days)
    """
    scope = build_scope(current_user)

    try:
        result = AdminAnalyticsService.get_absent_analytics(
            db=db,
            organization_id=organization_id,
            scope=scope,
        )
        return result

    except ValueError as ve:
        logger.error(
            f"Validation error in get_absent_analytics: {str(ve)} | org_id={organization_id}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_type": "ValueError",
                "location": "get_absent_analytics",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_absent_analytics | org_id={organization_id} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_absent_analytics",
                "detail": "Failed to fetch absent analytics. Check logs for traceback.",
            },
        )
    
@router.get("/half-day", response_model=HalfDayAnalyticsResponse)
def get_half_day_analytics(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Half-Day Analytics API

    Returns:
    - Today half-day count
    - Trend (7 days)
    """

    scope = build_scope(current_user)

    try:
        result = AdminAnalyticsService.get_half_day_analytics(
            db=db,
            organization_id=organization_id,
            scope=scope,
        )
        return result

    except ValueError as ve:
        logger.error(
            f"Validation error in get_half_day_analytics: {str(ve)} | org_id={organization_id}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_type": "ValueError",
                "location": "get_half_day_analytics",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_half_day_analytics | org_id={organization_id} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_half_day_analytics",
                "detail": "Failed to fetch half-day analytics. Check logs for traceback.",
            },
        )
    

@router.get("/late", response_model=LateAnalyticsResponse)
def get_late_analytics(
    db: Session = Depends(get_db),
    #current_user=Depends(get_current_user),
    organization_id=Depends(get_org_id),
    current_user=Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Late Analytics API

    Returns:
    - Today late count
    - Trend (7 days)
    """

    scope = build_scope(current_user)

    try:
        result = AdminAnalyticsService.get_late_analytics(
            db=db,
            organization_id=organization_id,
            scope=scope,
        )
        return result

    except ValueError as ve:
        logger.error(
            f"Validation error in get_late_analytics: {str(ve)} | org_id={organization_id}, user={getattr(current_user, 'id', None)}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_type": "ValueError",
                "location": "get_late_analytics",
                "detail": str(ve),
            },
        )

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(
            f"Unexpected error in get_late_analytics | org_id={organization_id}, user={getattr(current_user, 'id', None)} | traceback={tb}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_late_analytics",
                "detail": "Failed to fetch late analytics. Check logs for traceback.",
            },
        )
    

@router.get("/working-hours", response_model=WorkingHoursResponse)
def get_working_hours_analytics(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user = Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Get Average Working Hours Metrics
    Silently resolves scopes using JWT claims. Leverages IST translation seamlessly.
    """
    scope = build_scope(current_user)

    try:
        return AdminAnalyticsService.get_working_hours_analytics(
            db=db,
            organization_id=organization_id,
            scope=scope
        )

    except HTTPException as he:
        raise he

    except Exception as e:
        tb = traceback.format_exc()
        logger.exception(f"Unexpected error in get_working_hours_analytics | traceback={tb}")
        raise HTTPException(
            status_code=500,
            detail={
                "error_type": "ServerError",
                "location": "get_working_hours_analytics",
                "detail": "Failed to calculate working hours metrics. See backend logs."
            }
        )
    

@router.get("/recent-detections", response_model=RecentDetectionsResponse)
def get_recent_detections(
    limit: int = Query(10, ge=1, le=50, description="Number of recent detections to fetch"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    _: None = Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    """
    Fetch recent attendance detections for today.
    
    - **HR_ADMIN**: Gets all detections across the organization
    - **ADMIN** (Department Admin): Gets detections only from their department
    """
    try:
        return AdminAnalyticsService.get_recent_detections(
            db=db,
            current_user=current_user,
            limit=limit
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Failed to fetch recent detections: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch recent detections"
        )


@router.get("/export-logs")
def export_attendance_logs(
    format: str = Query("csv", regex="^(csv|pdf)$"),
    target_date: date = Query(None), # Defaults to today if not passed
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user = Depends(require_roles(["HR_ADMIN", "ADMIN", "ORG_ADMIN"]))
):
    scope = build_scope(current_user)
    
    # If no date passed, default to Today in IST
    if not target_date:
        from app.utils.timezone import today_ist
        target_date = today_ist()

    try:
        if format == "csv":
            file_data, filename = AdminAnalyticsService.generate_csv_export(
                db, organization_id, scope, target_date
            )
            media_type = "text/csv"
        else:
            file_data, filename = AdminAnalyticsService.generate_pdf_export(
                db, organization_id, scope, target_date
            )
            media_type = "application/pdf"

        return StreamingResponse(
            file_data,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate export file.")
    

@router.get("/dept-camera-stats", response_model=DeptCameraAnalyticsResponse)
def get_dept_camera_stats(
    db: Session = Depends(get_db),
    organization_id: UUID = Depends(get_org_id),
    current_user = Depends(require_roles(["ADMIN"])) 
):
    scope = build_scope(current_user)
    try:
        # ⬇️ FIXED: Changed _stats to _analytics to match your Service class
        return AdminAnalyticsService.get_dept_camera_analytics(db, organization_id, scope)
    except Exception as e:
        # 💡 PRO TIP: Log the actual error 'e' here so you can see typos in your terminal!
        print(f"CRASH REPORT: {str(e)}") 
        raise HTTPException(status_code=500, detail="Failed to fetch department camera analytics")