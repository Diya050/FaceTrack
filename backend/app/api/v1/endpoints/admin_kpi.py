from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.admin_kpi_schema import KpiSummaryResponse
from app.services.admin_kpi_service import get_kpi_stats, get_recent_detections
from app.core.dependencies import get_org_id

router = APIRouter(prefix="/admin/kpi", tags=["kpi-summary"])

@router.get("/summary", response_model=KpiSummaryResponse)
def get_kpi_summary(
    db: Session = Depends(get_db),
    org_id: str = Depends(get_org_id)
):
    try:
        stats = get_kpi_stats(db, org_id)
        detections = get_recent_detections(db, org_id)

        return {
            "stats": stats,
            "recent_detections": detections
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))