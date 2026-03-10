# app/services/attendance_service.py
from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select, func
from app.models.core import User, UserStatusEnum
from app.models.attendance import Attendance, AttendanceEvent

class AttendanceService:

    @staticmethod
    def generate_daily_attendance(db, target_date: date, organization_id=None):
        # 1. Fetch all active, approved users
        user_query = select(User).where(
            User.is_active == True,
            User.is_deleted == False,
            User.status == UserStatusEnum.APPROVED
        )
        
        if organization_id:
            user_query = user_query.where(User.organization_id == organization_id)
            
        users = db.execute(user_query).scalars().all()

        # Define start and end of the target day for filtering events
        # Note: Using UTC timezone for safety if your DB stores timestamps in UTC
        start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = start_of_day + timedelta(days=1)

        counts = {"present": 0, "absent": 0, "half_day": 0}

        for user in users:
            # 2. Fetch min (first_in) and max (last_out) scan events for the user on this date
            events_query = select(
                func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                func.max(AttendanceEvent.scan_timestamp).label("last_out")
            ).where(
                AttendanceEvent.user_id == user.user_id,
                AttendanceEvent.scan_timestamp >= start_of_day,
                AttendanceEvent.scan_timestamp < end_of_day
            )
            
            event_stats = db.execute(events_query).first()
            first_in = event_stats.first_in
            last_out = event_stats.last_out

            # 3. Determine status based on business rules
            status = "absent"
            first_in_time = None
            last_out_time = None

            if first_in:
                first_in_time = first_in.time()
                last_out_time = last_out.time() if last_out else first_in_time
                
                # Calculate duration in hours
                time_diff = last_out - first_in
                
                # RULES: > 4 hours = Present | > 0 hours = Half Day | No scans = Absent
                if time_diff >= timedelta(hours=4):
                    status = "present"
                else:
                    status = "half_day"
            
            counts[status] += 1

            # 4. Upsert (Update if exists, Insert if new)
            existing_record = db.execute(
                select(Attendance).where(
                    Attendance.user_id == user.user_id,
                    Attendance.attendance_date == target_date
                )
            ).scalars().first()

            if existing_record:
                existing_record.first_check_in = first_in_time
                existing_record.last_check_out = last_out_time
                existing_record.status = status
                existing_record.generated_at = func.now()
            else:
                new_record = Attendance(
                    user_id=user.user_id,
                    attendance_date=target_date,
                    first_check_in=first_in_time,
                    last_check_out=last_out_time,
                    status=status,
                    organization_id=user.organization_id
                )
                db.add(new_record)
        
        db.commit()

        return {
            "message": f"Successfully generated attendance for {target_date}",
            "processed_users_count": len(users),
            "present_count": counts["present"],
            "absent_count": counts["absent"],
            "half_day_count": counts["half_day"]
        }