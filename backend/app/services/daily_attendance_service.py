from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select, func
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
import logging

from app.models.core import User, UserStatusEnum
from app.models.attendance import Attendance, AttendanceEvent

logger = logging.getLogger(__name__)


class DailyAttendanceService:

    @staticmethod
    def generate_daily_attendance(db, target_date: date, organization_id=None):

        try:

            ############################################
            # 1. Fetch active approved users
            ############################################

            user_query = select(User).where(
                User.is_active.is_(True),
                User.is_deleted.is_(False),
                User.status == UserStatusEnum.APPROVED
            )

            if organization_id:
                user_query = user_query.where(User.organization_id == organization_id)

            users = db.execute(user_query).scalars().all()

            if not users:
                logger.info("No active users found for attendance generation")
                return {
                    "message": "No eligible users found",
                    "processed_users_count": 0
                }

            ############################################
            # 2. Calculate time window
            ############################################

            start_of_day = datetime.combine(
                target_date,
                datetime.min.time()
            ).replace(tzinfo=timezone.utc)

            end_of_day = start_of_day + timedelta(days=1)

            counts = {"present": 0, "absent": 0, "half_day": 0}

            ############################################
            # 3. Process each user
            ############################################

            for user in users:

                event_query = select(
                    func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                    func.max(AttendanceEvent.scan_timestamp).label("last_out")
                ).where(
                    AttendanceEvent.user_id == user.user_id,
                    AttendanceEvent.scan_timestamp >= start_of_day,
                    AttendanceEvent.scan_timestamp < end_of_day
                )

                event_stats = db.execute(event_query).first()

                first_in = event_stats.first_in
                last_out = event_stats.last_out

                ########################################
                # 4. Determine attendance status
                ########################################

                status = "absent"
                first_in_time = None
                last_out_time = None

                if first_in:

                    first_in_time = first_in.time()
                    last_out_time = last_out.time() if last_out else first_in_time

                    duration = last_out - first_in

                    if duration >= timedelta(hours=4):
                        status = "present"
                    else:
                        status = "half_day"

                counts[status] += 1

                ########################################
                # 5. Upsert attendance record
                ########################################

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

                    attendance = Attendance(
                        user_id=user.user_id,
                        attendance_date=target_date,
                        first_check_in=first_in_time,
                        last_check_out=last_out_time,
                        status=status,
                        organization_id=user.organization_id
                    )

                    db.add(attendance)

            ############################################
            # 6. Commit transaction
            ############################################

            db.commit()

            logger.info(f"Attendance generated successfully for {target_date}")

            return {
                "message": f"Attendance generated successfully for {target_date}",
                "processed_users_count": len(users),
                "present_count": counts["present"],
                "absent_count": counts["absent"],
                "half_day_count": counts["half_day"]
            }

        ############################################
        # Database Errors
        ############################################

        except SQLAlchemyError as e:

            db.rollback()
            logger.error(f"Database error during attendance generation: {str(e)}")

            raise HTTPException(
                status_code=500,
                detail="Database error occurred while generating attendance"
            )

        ############################################
        # Unexpected Errors
        ############################################

        except Exception as e:

            db.rollback()
            logger.exception("Unexpected error during attendance generation")

            raise HTTPException(
                status_code=500,
                detail="Unexpected error occurred while generating attendance"
            )
