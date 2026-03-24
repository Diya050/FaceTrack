from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import datetime, date
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


@router.delete("/live-alerts/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_live_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    org_id: str = Depends(get_org_id)
):
    """Delete a single live alert by ID"""
    alert = db.query(Notification).filter(
        and_(
            Notification.notification_id == alert_id,
            Notification.organization_id == org_id
        )
    ).first()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    db.delete(alert)
    db.commit()


@router.delete("/live-alerts/previous", status_code=status.HTTP_204_NO_CONTENT)
def delete_previous_alerts(
    db: Session = Depends(get_db),
    org_id: str = Depends(get_org_id)
):
    """Delete all alerts from before today"""
    today_start = datetime.combine(date.today(), datetime.min.time())
    
    alerts_to_delete = db.query(Notification).filter(
        and_(
            Notification.organization_id == org_id,
            Notification.created_at < today_start
        )
    ).all()
    
    for alert in alerts_to_delete:
        db.delete(alert)
    
    db.commit()