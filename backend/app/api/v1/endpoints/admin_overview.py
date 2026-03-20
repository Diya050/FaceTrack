# app/api/v1/endpoints/admin_overview.py
import logging
import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.admin_overview_schema import AdminOverviewResponse
from app.services.admin_overview_service import (
    get_department_performance,
    get_weekly_attendance_report,
    get_monthly_attendance_trend
)
from app.core.security import get_current_user
from app.core.dependencies import get_org_id

# Configure logger
logger = logging.getLogger("overview")
logger.setLevel(logging.INFO)

router = APIRouter(prefix="/admin/analytics", tags=["admin-analytics"])

@router.get("/overview", response_model=AdminOverviewResponse)
def get_admin_overview(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    org_id: str = Depends(get_org_id)
):
    try:
        logger.info("Fetching overview for org_id=%s, user_id=%s", org_id, current_user.user_id)

        # 1. Fetch Department & Summary Stats
        dept_summary, stats = get_department_performance(db, org_id)
        logger.info("Department summary: %s", dept_summary)
        logger.info("Overview stats: %s", stats)

        # 2. Fetch Weekly Bar Data
        weekly = get_weekly_attendance_report(db, org_id)
        logger.info("Weekly report: %s", weekly)

        # 3. Fetch Monthly Line Data
        monthly = get_monthly_attendance_trend(db, org_id)
        logger.info("Monthly trend: %s", monthly)

        return {
            "weekly_report": weekly,
            "monthly_trend": monthly,
            "department_summary": dept_summary,
            "stats": stats
        }
    except Exception as e:
        logger.error("Error in /overview: %s", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
