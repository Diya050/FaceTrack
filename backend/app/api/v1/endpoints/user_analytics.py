from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional,List
from datetime import datetime,date
from sqlalchemy import desc
from sqlalchemy.orm import Session
from uuid import UUID
from io import BytesIO
from app.models.attendance import Attendance

from app.db.session import get_db
from app.core.security import get_current_user
from app.core.dependencies import User

from app.schemas.user_analytics_schema import ProductivityMetricsResponse,RecognitionInsightsResponse,WorkingHoursPoint,WorkingHoursResponse,AttendanceStat,AttendanceStatsResponse
from app.services.user_analytics_service import get_recognition_trends_for_user, get_recognition_performance_for_user, get_working_hours_summary, get_monthly_attendance_stats ,calculate_productivity_metrics_for_user, generate_attendance_csv,generate_attendance_pdf     

router = APIRouter(prefix="/user-analytics", tags=["user-analytics", "productivity"])

@router.get("/productivity", response_model=ProductivityMetricsResponse, summary="Get productivity & stability metrics for current user")
def get_productivity_metrics(
    year: Optional[int] = Query(None, ge=2000),
    month: Optional[int] = Query(None, ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.utcnow()
    req_year = year or now.year
    req_month = month or now.month

    try:
        metrics = calculate_productivity_metrics_for_user(
            db=db,
            user_id=str(current_user.user_id),
            year=req_year,
            month=req_month
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to compute productivity metrics.")

    return ProductivityMetricsResponse(**metrics)

@router.get("/insights", response_model=RecognitionInsightsResponse, summary="Get recognition trends and performance for current user")
def recognition_insights(
    hours: int = Query(72, ge=1, le=168),
    interval_minutes: int = Query(60, ge=5, le=360),
    lookback_days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        trends = get_recognition_trends_for_user(db=db, user_id=str(current_user.user_id), hours=hours, interval_minutes=interval_minutes)
        perf, model_version = get_recognition_performance_for_user(db=db, user_id=str(current_user.user_id), lookback_days=lookback_days)
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to fetch recognition insights.")

    return RecognitionInsightsResponse(
        model_version=model_version,
        trends=trends,
        performance=perf
    )


@router.get("/trend", response_model=WorkingHoursResponse, summary="Get working hours trend for current user")
def working_hours_trend(
    days: int = Query(7, ge=1, le=31, description="Number of days to return"),
    year: Optional[int] = Query(None, ge=2000),
    month: Optional[int] = Query(None, ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.utcnow()
    req_year = year or now.year
    req_month = month or now.month

    try:
        summary = get_working_hours_summary(
            db=db,
            user_id=str(current_user.user_id),
            year=req_year,
            month=req_month,
            days=days
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unable to fetch working hours trend.")

    return WorkingHoursResponse(**summary)


@router.get("/stats/monthly", response_model=AttendanceStatsResponse, summary="Get monthly attendance distribution")
def monthly_attendance_stats(
    organization_id: Optional[UUID] = Query(None),
    year: Optional[int] = Query(None, ge=2000),
    month: Optional[int] = Query(None, ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.utcnow()
    req_year = year or now.year
    req_month = month or now.month

    try:
        stats: List[AttendanceStat] = get_monthly_attendance_stats(
            db=db,
            user_id=current_user.user_id,  # ✅ was passing organization_id before
            year=req_year,
            month=req_month,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unable to fetch attendance statistics.")

    color_map = {"present": "#2ECC71", "absent": "#E74C3C", "late": "#F39C12"}
    stats_with_colors = [
        AttendanceStat(status=s.status, count=s.count, color=color_map.get(s.status.lower()))
        for s in stats
    ]

    return AttendanceStatsResponse(
        month=req_month,
        year=req_year,
        user_id=current_user.user_id,
        organization_id=organization_id,
        stats=stats_with_colors,
    )


@router.get("/export")
def export_attendance(
    type: str = Query(..., regex="^(pdf|csv)$"),
    organization_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # Build query that selects Attendance plus the user's full_name
    query = db.query(
    Attendance.attendance_date.label("attendance_date"),
    User.full_name.label("full_name"),
    Attendance.status.label("status"),
    Attendance.first_check_in.label("first_check_in"),
    Attendance.last_check_out.label("last_check_out"),
).join(User, Attendance.user_id == User.user_id)

# ✅ IMPORTANT: restrict to current user
    query = query.filter(Attendance.user_id == current_user.user_id)

    # Optional filters
    if organization_id:
        query = query.filter(Attendance.organization_id == organization_id)

    if start_date:
        query = query.filter(Attendance.attendance_date >= start_date)

    if end_date:
        query = query.filter(Attendance.attendance_date <= end_date)

    # Avoid deleted records
    query = query.filter(Attendance.is_deleted == False)

    rows = query.order_by(desc(Attendance.attendance_date)).all()# rows are tuples (Attendance, user_full_name)

    try:
        if type == "pdf":
            content = generate_attendance_pdf(rows, organization_id, start_date, end_date)
            media_type = "application/pdf"
            filename = f"attendance_{date.today().isoformat()}.pdf"
        else:
            content = generate_attendance_csv(rows)
            media_type = "text/csv"
            filename = f"attendance_{date.today().isoformat()}.csv"

        return StreamingResponse(
            BytesIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        print(f"Export Error: {e}")
        raise HTTPException(status_code=500, detail="Error generating export file")