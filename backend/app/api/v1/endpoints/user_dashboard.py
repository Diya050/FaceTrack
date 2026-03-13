from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import get_current_user
from app.schemas.user_dashboard import UserKPIResponse,TodayAttendanceResponse
from app.services import user_dashboard_service
from app.core.dependencies import User

from app.schemas.user_dashboard import UserSummaryResponse

router = APIRouter(
    prefix="/user-dashboard",
    tags=["user dashboard"]
)

@router.get("/kpi/me", response_model=UserKPIResponse, summary="Get my KPI metrics")
def get_my_kpis(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> UserKPIResponse:
    """
    Retrieve attendance KPIs for the currently logged-in user's personal dashboard.
    """
    try:
        kpi_data = user_dashboard_service.calculate_user_monthly_kpis(
            db=db, user_id=current_user.user_id
        )
        return UserKPIResponse(**kpi_data)
    except Exception as e:
        # Log the error for debugging/monitoring
        # logger.error(f"Failed to fetch KPIs for user {current_user.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Unable to fetch KPI data at this time.")
    

@router.get("/today", response_model=TodayAttendanceResponse)
def get_today_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve detailed attendance and facial recognition data for the current user for today.
    """

    return user_dashboard_service.get_today_attendance_details(db=db, user_id=current_user.user_id)



