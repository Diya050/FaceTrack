from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.ua_attendance_stats_service import get_monthly_attendance_stats_for_ui
from app.schemas.ua_attendance_stats_schema import AttendanceStatsResponse, AttendanceStat

router = APIRouter(prefix="/api/ua/attendance", tags=["user-analytics", "attendance"])

@router.get("/stats/monthly", response_model=AttendanceStatsResponse, summary="Get monthly attendance distribution")
def monthly_attendance_stats(
    organization_id: Optional[UUID] = Query(None),
    year: Optional[int] = Query(None, ge=2000),
    month: Optional[int] = Query(None, ge=1, le=12),
    db: Session = Depends(get_db),
):
    """
    Returns attendance counts grouped by status for the requested month.
    Defaults to current month if year/month not provided.
    """
    now = datetime.utcnow()
    req_year = year or now.year
    req_month = month or now.month

    try:
        
        stats: List[AttendanceStat] = get_monthly_attendance_stats_for_ui(
            db=db, organization_id=organization_id, year=req_year, month=req_month
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
        organization_id=organization_id,
        stats=stats_with_colors
    )
