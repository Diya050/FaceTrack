import logging
from datetime import date, datetime, timedelta, timezone, time
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.core import User, Organization
from app.models.attendance import Attendance, AttendanceEvent, AttendanceRule

logger = logging.getLogger(__name__)

class DailyAttendanceService:

    @staticmethod
    def get_status_from_rules(db: Session, organization_id: UUID, scan_time: time):
        """Matches first scan against the AttendanceRule table."""
        stmt = select(AttendanceRule).where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.is_deleted == False,
            AttendanceRule.start_time <= scan_time,
            AttendanceRule.end_time >= scan_time
        )
        rule = db.execute(stmt).scalars().first()
        # If no rule matches, we assume they arrived too late or outside 
        # allowed windows, effectively making them absent.
        return rule.status_effect if rule else "absent"

    @staticmethod
    def generate_daily_attendance(db: Session, target_date: date, organization_id: Optional[UUID] = None):
        try:
            # 1. Fetch Dynamic Threshold for Organization (Fallback to 4)
            org_stmt = select(Organization).where(Organization.organization_id == organization_id)
            org = db.execute(org_stmt).scalars().first()
            min_hours = org.min_hours_for_present if org and org.min_hours_for_present else 4
            threshold_delta = timedelta(hours=min_hours)

            # 2. Fetch users with "active" status string
            user_query = select(User).where(
                User.is_active.is_(True),
                User.is_deleted.is_(False),
                User.status == "active"  # Corrected to string "active"
            )
            if organization_id:
                user_query = user_query.where(User.organization_id == organization_id)

            users = db.execute(user_query).scalars().all()

            # Time Window Setup
            start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
            end_of_day = start_of_day + timedelta(days=1)
            counts = {"present": 0, "absent": 0, "half_day": 0, "late": 0}

            # 3. Process Users
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

                first_in = event_stats.first_in if event_stats and event_stats.first_in else None
                last_out = event_stats.last_out if event_stats and event_stats.last_out else None

                final_status = "absent"
                first_in_time = None
                last_out_time = None

                if first_in:
                    first_in_time = first_in.time()
                    last_out_time = last_out.time() if last_out else first_in_time
                    
                    # Arrival Logic: Are they Present or Late?
                    arrival_status = DailyAttendanceService.get_status_from_rules(
                        db, user.organization_id, first_in_time
                    )

                    # Duration Logic:
                    # If they only scanned once, (last_out - first_in) is 0.
                    # This will trigger the 'half_day' status as a penalty for not scanning out.
                    duration = (last_out or first_in) - first_in
                    
                    if arrival_status in ["present", "late"] and duration < threshold_delta:
                        final_status = "half_day"
                    else:
                        final_status = arrival_status
                else:
                    final_status = "absent"

                # 4. Upsert Logic
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

                counts[final_status] += 1

            db.commit()
            return {"message": "Success", "counts": counts, "applied_threshold": min_hours}

        except Exception as e:
            db.rollback()
            logger.exception(f"Error in Attendance Generation: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")