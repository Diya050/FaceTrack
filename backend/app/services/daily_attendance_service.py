import logging
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.core import User
from app.models.attendance import Attendance, AttendanceEvent

logger = logging.getLogger(__name__)


class DailyAttendanceService:

    @staticmethod
    def generate_daily_attendance(
        db: Session,
        target_date: date,
        organization_id: Optional[UUID] = None,
    ):
        try:

            # 1️⃣ Fetch users
            user_query = select(User).where(
                User.is_active.is_(True),
                User.is_deleted.is_(False),
                User.status == "active",
            )

            if organization_id:
                user_query = user_query.where(
                    User.organization_id == organization_id
                )

            users = db.execute(user_query).scalars().all()

            if not users:
                return {
                    "message": "No eligible users found",
                    "processed_users_count": 0,
                    "present_count": 0,
                    "absent_count": 0,
                }

            user_ids = [u.user_id for u in users]

            # 2️⃣ Time window
            start_of_day = datetime.combine(
                target_date, datetime.min.time()
            ).replace(tzinfo=timezone.utc)

            end_of_day = start_of_day + timedelta(days=1)

            # 3️⃣ Fetch events grouped by user
            event_rows = db.execute(
                select(
                    AttendanceEvent.user_id,
                    func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                    func.max(AttendanceEvent.scan_timestamp).label("last_out"),
                )
                .where(
                    AttendanceEvent.user_id.in_(user_ids),
                    AttendanceEvent.scan_timestamp >= start_of_day,
                    AttendanceEvent.scan_timestamp < end_of_day,
                )
                .group_by(AttendanceEvent.user_id)
            ).all()

            event_map = {
                row.user_id: row
                for row in event_rows
            }

            # 4️⃣ Existing attendance
            existing_rows = db.execute(
                select(Attendance).where(
                    Attendance.user_id.in_(user_ids),
                    Attendance.attendance_date == target_date,
                    Attendance.is_deleted == False,
                )
            ).scalars().all()

            existing_map = {
                a.user_id: a
                for a in existing_rows
            }

            present_count = 0
            absent_count = 0

            # 5️⃣ Process users
            for user in users:

                event = event_map.get(user.user_id)

                if event:
                    status = "present"
                    present_count += 1

                    first_check_in = event.first_in.time()
                    last_check_out = (
                        event.last_out.time()
                        if event.last_out
                        else first_check_in
                    )

                else:
                    status = "absent"
                    absent_count += 1
                    first_check_in = None
                    last_check_out = None

                existing = existing_map.get(user.user_id)

                if existing:
                    existing.first_check_in = first_check_in
                    existing.last_check_out = last_check_out
                    existing.status = status
                    existing.generated_at = func.now()

                else:
                    db.add(
                        Attendance(
                            user_id=user.user_id,
                            attendance_date=target_date,
                            first_check_in=first_check_in,
                            last_check_out=last_check_out,
                            status=status,
                            organization_id=user.organization_id,
                        )
                    )

            db.commit()

            return {
                "message": f"Attendance generated successfully for {target_date}",
                "processed_users_count": len(users),
                "present_count": present_count,
                "absent_count": absent_count,
            }

        except SQLAlchemyError:
            db.rollback()
            logger.exception("Database error while generating attendance")
            raise HTTPException(
                status_code=500,
                detail="Database error occurred while generating attendance",
            )

        except Exception:
            db.rollback()
            logger.exception("Unexpected error during attendance generation")
            raise HTTPException(
                status_code=500,
                detail="Unexpected error occurred",
            )
