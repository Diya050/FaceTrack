from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.core.dependencies import get_org_id
from app.models.system import Notification
from app.models.streams import Camera
from app.schemas.live_alerts_schema import LiveAlertResponse
from typing import List

router = APIRouter()

@router.get("/live-alerts", response_model=List[LiveAlertResponse])
def get_live_alerts(
    db: Session = Depends(get_db),
    org_id: str = Depends(get_org_id)
):
    # 1. Fetch recent notifications/alerts for this org
    alerts = db.query(Notification).filter(
        Notification.organization_id == org_id
    ).order_by(desc(Notification.created_at)).limit(20).all()

    # 2. Map DB models to the frontend's expected format
    response = []
    for alert in alerts:
        response.append({
            "id": str(alert.notification_id),
            "source": alert.type or "System",
            "message": alert.message,
            "severity": "warning" if "offline" in alert.message.lower() else "info",
            "timestamp": alert.created_at
        })
        
    return response