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
    def get_status_from_rules(db: Session, organization_id: UUID, scan_time: time) -> str:
        """
        Determines the status (Present, Late, Half Day) based on the first scan time.
        """
        stmt = select(AttendanceRule).where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.is_deleted == False,
            AttendanceRule.start_time <= scan_time,
            AttendanceRule.end_time >= scan_time
        )
        rule = db.execute(stmt).scalars().first()
        # If no rule window matches, default to absent
        return rule.status_effect if rule else "absent"

    @staticmethod
    def generate_daily_attendance(db: Session, target_date: date, organization_id: UUID):
        """
        Finalizes attendance for a specific day. 
        Synchronizes Live Camera scans with the Night Shift scheduler logic.
        """
        try:
            # 1. FETCH DYNAMIC THRESHOLD FROM ORGANIZATION
            # Pulls 'min_hours_for_present' directly from the database
            org = db.execute(
                select(Organization).where(Organization.organization_id == organization_id)
            ).scalars().first()
            
            if not org:
                raise ValueError("Organization not found")

            min_hours = org.min_hours_for_present if org.min_hours_for_present else 4
            threshold_delta = timedelta(hours=min_hours)

            # 2. FETCH ALL ACTIVE USERS
            users = db.execute(
                select(User).where(
                    User.organization_id == organization_id,
                    User.is_active.is_(True),
                    User.status == "active"
                )
            ).scalars().all()

            # Time boundaries for the target day
            start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
            end_of_day = start_of_day + timedelta(days=1)
            
            summary_counts = {"present": 0, "absent": 0, "half_day": 0, "late": 0}

            for user in users:
                # 3. FETCH RAW SCANS (Source of Truth from Camera)
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

                first_in_dt = event_stats.first_in if event_stats else None
                last_out_dt = event_stats.last_out if event_stats else None

                # Calculate proposed status based on arrival and duration
                calculated_status = "absent"
                first_in_time = None
                last_out_time = None

                if first_in_dt:
                    first_in_time = first_in_dt.time()
                    last_out_time = last_out_dt.time() if last_out_dt else first_in_time
                    
                    # Arrival check (Late vs Present)
                    arrival_status = DailyAttendanceService.get_status_from_rules(
                        db, organization_id, first_in_time
                    )

                    # Duration check (Half Day penalty)
                    duration = (last_out_dt or first_in_dt) - first_in_dt
                    if arrival_status in ["present", "late"] and duration < threshold_delta:
                        calculated_status = "half_day"
                    else:
                        calculated_status = arrival_status

                # 4. SMART UPSERT (The "Dhruvit Protection" Layer)
                # Check if a record was already created by your Live Tracking service
                existing = db.execute(
                    select(Attendance).where(
                        Attendance.user_id == user.user_id,
                        Attendance.attendance_date == target_date
                    )
                ).scalars().first()

                if existing:
                    # Sync times from raw scans to the record
                    existing.first_check_in = first_in_time
                    existing.last_check_out = last_out_time
                    
                    # Logic: Do not overwrite a 'late' or 'half_day' tag with 'present'
                    # if the live tracker already flagged a violation.
                    if existing.status in ["absent", None]:
                        existing.status = calculated_status
                    elif calculated_status == "half_day":
                        # Duration penalty always overrides a live 'present' or 'late'
                        existing.status = "half_day"
                    # If it was 'late' and new calc is 'present', keep 'late'
                    
                    existing.updated_at = func.now()
                else:
                    # Create record for those the camera missed (the true absentees)
                    db.add(Attendance(
                        user_id=user.user_id,
                        organization_id=organization_id,
                        attendance_date=target_date,
                        first_check_in=first_in_time,
                        last_check_out=last_out_time,
                        status=calculated_status
                    ))

                final_status = existing.status if existing else calculated_status
                summary_counts[final_status] += 1

            db.commit()
            return {
                "status": "success", 
                "date": target_date, 
                "counts": summary_counts, 
                "threshold_used": min_hours
            }

        except Exception as e:
            db.rollback()
            logger.error(f"Attendance Generation Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Could not process daily attendance.")