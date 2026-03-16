import logging
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

from app.models.core import User, UserStatusEnum
from app.models.attendance import Attendance, AttendanceEvent

logger = logging.getLogger(__name__)

# Business rule constants
PRESENT_THRESHOLD_HOURS = 4   # >= 4 hours → Present
HALF_DAY_THRESHOLD_HOURS = 0  # > 0 hours  → Half Day (else Absent)


class DailyAttendanceService:

    @staticmethod
    def generate_daily_attendance(db, target_date: date, organization_id=None):
        try:

            # ----------------------------------------------------------------
            # 1. Fetch active, approved users
            # ----------------------------------------------------------------
            user_query = select(User).where(
                User.is_active.is_(True),
                User.is_deleted.is_(False),
                User.status == UserStatusEnum.APPROVED,
            )

            if organization_id:
                user_query = user_query.where(
                    User.organization_id == organization_id
                )

            users = db.execute(user_query).scalars().all()

            if not users:
                logger.info("No eligible users found for date: %s", target_date)
                return {
                    "message": "No eligible users found",
                    "processed_users_count": 0,
                    "present_count": 0,
                    "absent_count": 0,
                    "half_day_count": 0,
                }

            # ----------------------------------------------------------------
            # 2. Define the time window for the target date (UTC)
            # ----------------------------------------------------------------
            start_of_day = datetime.combine(
                target_date, datetime.min.time()
            ).replace(tzinfo=timezone.utc)

            end_of_day = start_of_day + timedelta(days=1)

            counts = {"present": 0, "absent": 0, "half_day": 0}

            # ----------------------------------------------------------------
            # 3. Process each user
            # ----------------------------------------------------------------
            for user in users:

                # Fetch first scan-in and last scan-out for the day
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

                # ------------------------------------------------------------
                # 4. Determine attendance status
                # ------------------------------------------------------------
                status = "absent"
                first_in_time = None
                last_out_time = None

                if first_in:
                    first_in_time = first_in.time()
                    last_out_time = last_out.time() if last_out else first_in_time

                    duration = (last_out or first_in) - first_in

                    if duration >= timedelta(hours=PRESENT_THRESHOLD_HOURS):
                        status = "present"
                    else:
                        status = "half_day"

                counts[status] += 1

                # ------------------------------------------------------------
                # 5. Upsert: update existing record or create a new one
                # ------------------------------------------------------------
                existing = db.execute(
                    select(Attendance).where(
                        Attendance.user_id == user.user_id,
                        Attendance.attendance_date == target_date,
                    )
                ).scalars().first()

                if existing:
                    existing.first_check_in = first_in_time
                    existing.last_check_out = last_out_time
                    existing.status = status
                    existing.generated_at = func.now()
                else:
                    db.add(Attendance(
                        user_id=user.user_id,
                        attendance_date=target_date,
                        first_check_in=first_in_time,
                        last_check_out=last_out_time,
                        status=status,
                        organization_id=user.organization_id,
                    ))

            # ----------------------------------------------------------------
            # 6. Commit everything in one transaction
            # ----------------------------------------------------------------
            db.commit()

            logger.info(
                "Attendance generated | date=%s | total=%s | present=%s | absent=%s | half_day=%s",
                target_date,
                len(users),
                counts["present"],
                counts["absent"],
                counts["half_day"],
            )

            return {
                "message": f"Attendance generated successfully for {target_date}",
                "processed_users_count": len(users),
                "present_count": counts["present"],
                "absent_count": counts["absent"],
                "half_day_count": counts["half_day"],
            }

        except SQLAlchemyError:
            db.rollback()
            logger.exception("Database error during attendance generation for %s", target_date)
            raise HTTPException(
                status_code=500,
                detail="Database error occurred while generating attendance."
            )

        except HTTPException:
            raise  # Re-raise HTTP exceptions untouched

        except Exception:
            db.rollback()
            logger.exception("Unexpected error during attendance generation for %s", target_date)
            raise HTTPException(
                status_code=500,
                detail="Unexpected error occurred while generating attendance."
            )