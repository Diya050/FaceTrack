import logging
from datetime import date, datetime, timedelta, timezone, time

from sqlalchemy import select, func
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

from app.models.core import User, UserStatusEnum, Organization
from app.models.attendance import Attendance, AttendanceEvent, AttendanceRule

logger = logging.getLogger(__name__)

class DailyAttendanceService:

    @staticmethod
    def get_status_from_rules(db, organization_id, scan_time: time):
        """Matches first scan against the AttendanceRule table."""
        stmt = select(AttendanceRule).where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.is_deleted == False,
            AttendanceRule.start_time <= scan_time,
            AttendanceRule.end_time >= scan_time
        )
        rule = db.execute(stmt).scalars().first()
        return rule.status_effect if rule else "absent"

    @staticmethod
    def generate_daily_attendance(db, target_date: date, organization_id=None):
        try:
            # 1. Fetch Dynamic Threshold for Organization (Fallback to 4)
            org_stmt = select(Organization).where(Organization.organization_id == organization_id)
            org = db.execute(org_stmt).scalars().first()
            min_hours = org.min_hours_for_present if org and org.min_hours_for_present else 4
            threshold_delta = timedelta(hours=min_hours)

            # 2. Fetch active users
            user_query = select(User).where(
                User.is_active.is_(True),
                User.is_deleted.is_(False),
                User.status == UserStatusEnum.APPROVED,
            )
            if organization_id:
                user_query = user_query.where(User.organization_id == organization_id)

            users = db.execute(user_query).scalars().all()

            start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
            end_of_day = start_of_day + timedelta(days=1)
            counts = {"present": 0, "absent": 0, "half_day": 0, "late": 0}

            for user in users:
                event_stats = db.execute(
                    select(
                        func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                        func.max(AttendanceEvent.scan_timestamp).label("last_out"),
                    ).where(
                        AttendanceEvent.user_id == user.user_id,
                        AttendanceEvent.scan_timestamp >= start_of_day,
                        AttendanceEvent.scan_timestamp < end_of_day,
                    )
                ).first()

                first_in = event_stats.first_in if event_stats else None
                last_out = event_stats.last_out if event_stats else None

                final_status = "absent"
                first_in_time = None
                last_out_time = None

                if first_in:
                    first_in_time = first_in.time()
                    last_out_time = last_out.time() if last_out else first_in_time
                    
                    # Check Arrival Rule
                    arrival_status = DailyAttendanceService.get_status_from_rules(
                        db, user.organization_id, first_in_time
                    )

                    # Dynamic Duration Check
                    duration = (last_out or first_in) - first_in
                    if arrival_status in ["present", "late"] and duration < threshold_delta:
                        final_status = "half_day"
                    else:
                        final_status = arrival_status

                # Upsert
                existing = db.execute(select(Attendance).where(
                    Attendance.user_id == user.user_id,
                    Attendance.attendance_date == target_date
                )).scalars().first()

                if existing:
                    existing.first_check_in = first_in_time
                    existing.last_check_out = last_out_time
                    existing.status = final_status
                else:
                    db.add(Attendance(
                        user_id=user.user_id,
                        organization_id=user.organization_id,
                        attendance_date=target_date,
                        first_check_in=first_in_time,
                        last_check_out=last_out_time,
                        status=final_status,
                    ))

                counts[final_status] = counts.get(final_status, 0) + 1

            db.commit()
            return {"message": "Success", "counts": counts, "applied_threshold": min_hours}

        except Exception as e:
            db.rollback()
            logger.exception(f"Error: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")