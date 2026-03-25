from sqlalchemy.orm import Session
from uuid import UUID
from sqlalchemy import func

from app.models.system import Notification


class NotificationService:

    @staticmethod
    def create_notification(
        db: Session,
        user_id: UUID,
        organization_id: UUID,
        message: str,
        type: str = "INFO",
        redirect_path: str = None,
        entity_id: UUID = None,
        event_type: str = None
    ):
        notification = Notification(
            user_id=user_id,
            organization_id=organization_id,
            message=message,
            type=type,
            is_read=False,
            redirect_path=redirect_path,
            entity_id=entity_id,
            event_type=event_type
        )

        db.add(notification)
        db.flush()  # flush so the new one gets an ID and created_at

        # Keep only the latest 10 notifications per user
        # Delete any beyond the 10 most recent
        subquery = (
            db.query(Notification.notification_id)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(10)
            .subquery()
        )

        db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.notification_id.notin_(subquery)
        ).delete(synchronize_session=False)

        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: UUID
    ):

        return db.query(Notification).filter(
            Notification.user_id == user_id
        ).order_by(
            Notification.created_at.desc()
        ).all()


    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: UUID,
        user_id: UUID
    ):

        notification = db.query(Notification).filter(
            Notification.notification_id == notification_id,
            Notification.user_id == user_id
        ).first()

        if notification:
            notification.is_read = True
            db.commit()

        return notification


    @staticmethod
    def unread_count(
        db: Session,
        user_id: UUID
    ):

        return db.query(func.count(Notification.notification_id)).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).scalar()