from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from datetime import datetime, date
from app.db.session import get_db
from app.core.dependencies import get_org_id
from app.core.security import get_current_user
from app.models.system import Notification
from app.models.streams import Camera
from app.schemas.live_alerts_schema import LiveAlertResponse
from typing import List
from app.models.core import User

def build_scope(current_user):
    try:
        role = current_user.role.role_name

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

router = APIRouter()

@router.get("/live-alerts", response_model=List[LiveAlertResponse])
def get_live_alerts(
    db: Session = Depends(get_db),
    org_id: str = Depends(get_org_id),
    current_user = Depends(get_current_user) # Add this to get the specific user
):
    # ✅ FIX: Filter by BOTH organization AND the specific logged-in user
    alerts = db.query(Notification).filter(
        Notification.organization_id == org_id,
        Notification.user_id == current_user.user_id  # Only show my notifications
    ).order_by(desc(Notification.created_at)).limit(20).all()

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