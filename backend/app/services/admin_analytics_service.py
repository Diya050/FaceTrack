"""
Admin Analytics Service 
===================================

"""

from http.client import HTTPException
import logging
import traceback
from datetime import timedelta,date
from typing import Dict, List
from uuid import UUID
import csv
from xhtml2pdf import pisa
import io

from sqlalchemy.orm import Session
from sqlalchemy import select, func
from sqlalchemy.exc import NoResultFound,SQLAlchemyError,DataError,OperationalError

from app.models.core import User, Organization, Department
from app.models.streams import Camera, UnknownFace
from app.models.attendance import Attendance, AttendanceEvent, AttendanceRule
from app.utils.timezone import today_ist, ist_day_bounds_utc, utc_to_ist_time
from app.schemas.admin_analytics_schema import LateAnalyticsResponse, LateTrendItem
from app.services.daily_attendance_service import DailyAttendanceService

logger = logging.getLogger(__name__)


class AdminAnalyticsService:

    # ==========================================================
    #  COMMON HELPERS
    # ==========================================================
    
    @staticmethod
    def _get_active_users(db, organization_id: UUID, scope: dict):

        try:
            if not scope or "type" not in scope:
                raise ValueError("Invalid scope")

            query = select(User).where(
                User.organization_id == organization_id,
                User.is_active == True,
                User.is_deleted == False,
            )

            if scope["type"] == "department":
                dept_id = scope.get("department_id")
                if not dept_id:
                    raise ValueError("Missing department_id in scope")

                query = query.where(User.department_id == dept_id)

            return db.execute(query).scalars().all()

        except OperationalError as e:
            logger.critical(f"[ACTIVE_USERS] DB error: {e}", exc_info=True)
            raise RuntimeError("Database unavailable")

        except SQLAlchemyError as e:
            logger.error(f"[ACTIVE_USERS] Query error: {e}", exc_info=True)
            raise RuntimeError("Database query failed")

        except Exception as e:
            logger.exception(f"[ACTIVE_USERS] Unexpected error: {e}")
            raise

    @staticmethod
    def _get_org_and_threshold(db: Session, organization_id: UUID):
        try:
            org = db.execute(
                select(Organization).where(
                    Organization.organization_id == organization_id,
                    Organization.is_deleted == False,
                )
            ).scalar_one()

            threshold = timedelta(hours=org.min_hours_for_present or 4)
            return org, threshold

        except NoResultFound:
            logger.error(
                f"No organization found in _get_org_and_threshold | org_id={organization_id}"
            )
            raise HTTPException(
                status_code=404,
                detail={
                    "error_type": "NotFound",
                    "location": "_get_org_and_threshold",
                    "detail": f"Organization {organization_id} not found",
                },
            )
        except Exception as e:
            tb = traceback.format_exc()
            logger.exception(
                f"Unexpected error in _get_org_and_threshold | org_id={organization_id} | traceback={tb}"
            )
            raise HTTPException(
                status_code=500,
                detail={
                    "error_type": "ServerError",
                    "location": "_get_org_and_threshold",
                    "detail": "Failed to fetch organization and threshold. Check logs for traceback.",
                },
            )

    
    @staticmethod
    def _get_rules(db: Session, organization_id: UUID):
        try:
            return db.execute(
                select(AttendanceRule).where(
                    AttendanceRule.organization_id == organization_id,
                    AttendanceRule.is_deleted == False,
                ).order_by(AttendanceRule.start_time)
            ).scalars().all()

        except OperationalError as e:
            logger.critical(
                f"[RULES] DB connection error | org_id={organization_id} | error={e}",
                exc_info=True
            )
            raise HTTPException(
                status_code=503,
                detail="Database unavailable while fetching attendance rules",
            )

        except SQLAlchemyError as e:
            logger.error(
                f"[RULES] SQLAlchemy error | org_id={organization_id} | error={e}",
                exc_info=True
            )
            raise HTTPException(
                status_code=500,
                detail="Database query failed while fetching attendance rules",
            )

        except Exception as e:
            tb = traceback.format_exc()
            logger.exception(
                f"[RULES] Unexpected error | org_id={organization_id} | traceback={tb}"
            )
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch attendance rules",
            )

    @staticmethod
    def _get_event_map(
        db: Session,
        organization_id: UUID,
        user_ids: List[UUID],
        target_date
    ):
        try:
            # 🔒 SAFETY: Empty user_ids → return early
            if not user_ids:
                return {}

            start_utc, end_utc = ist_day_bounds_utc(target_date)

            rows = db.execute(
                select(
                    AttendanceEvent.user_id,
                    func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                    func.max(AttendanceEvent.scan_timestamp).label("last_out"),
                ).where(
                    AttendanceEvent.organization_id == organization_id,
                    AttendanceEvent.user_id.in_(user_ids),
                    AttendanceEvent.scan_timestamp >= start_utc,
                    AttendanceEvent.scan_timestamp < end_utc,
                ).group_by(AttendanceEvent.user_id)
            ).all()

            return {r.user_id: r for r in rows}

        except OperationalError as e:
            logger.critical(
                f"[EVENT_MAP] DB connection error | org_id={organization_id}, date={target_date} | error={e}",
                exc_info=True
            )
            raise HTTPException(
                status_code=503,
                detail="Database unavailable while fetching attendance events",
            )

        except SQLAlchemyError as e:
            logger.error(
                f"[EVENT_MAP] SQLAlchemy error | org_id={organization_id}, date={target_date} | error={e}",
                exc_info=True
            )
            raise HTTPException(
                status_code=500,
                detail="Database query failed while fetching attendance events",
            )

        except Exception as e:
            tb = traceback.format_exc()
            logger.exception(
                f"[EVENT_MAP] Unexpected error | org_id={organization_id}, date={target_date} | traceback={tb}"
            )
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch attendance event map",
            )

    @staticmethod
    def _compute_status_counts(
        users: List[User],
        event_map,
        rules,
        threshold,
    ) -> Dict[str, int]:

        counts = {"present": 0, "absent": 0, "late": 0, "half_day": 0}

        # 🔒 Safety checks
        if rules is None or threshold is None:
            logger.error("[STATUS_COUNTS] Missing rules or threshold")
            return counts

        if not isinstance(event_map, dict):
            logger.error("[STATUS_COUNTS] Invalid event_map type")
            return counts

        try:
            for user in users:
                try:
                    raw = event_map.get(user.user_id)

                    summary = DailyAttendanceService._compute_summary(
                        user_id=user.user_id,
                        first_in_utc=raw.first_in if raw else None,
                        last_out_utc=raw.last_out if raw else None,
                        rules=rules,
                        threshold_delta=threshold,
                    )

                    if not summary or not hasattr(summary, "status"):
                        logger.warning(
                            f"[STATUS_COUNTS] Invalid summary for user_id={user.user_id}"
                        )
                        continue

                    if summary.status not in counts:
                        logger.warning(
                            f"[STATUS_COUNTS] Unknown status '{summary.status}' for user_id={user.user_id}"
                        )
                        continue

                    counts[summary.status] += 1

                except Exception as user_error:
                    logger.exception(
                        f"[STATUS_COUNTS] Error processing user_id={user.user_id}: {user_error}"
                    )
                    continue

            return counts

        except Exception as e:
            logger.critical(f"[STATUS_COUNTS] Critical failure: {e}", exc_info=True)
            return counts

    @staticmethod
    def _compute_today_counts(db: Session, organization_id: UUID, scope) -> Dict[str, int]:

        EMPTY = {"present": 0, "absent": 0, "late": 0, "half_day": 0}

        try:
            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)

            if not users:
                return EMPTY

            today = today_ist()

            # Threshold
            try:
                _, threshold = AdminAnalyticsService._get_org_and_threshold(db, organization_id)
            except Exception as e:
                logger.exception(f"[TODAY_COUNTS] Threshold fetch failed: {e}")
                return EMPTY

            # Rules
            try:
                rules = AdminAnalyticsService._get_rules(db, organization_id)
            except Exception as e:
                logger.exception(f"[TODAY_COUNTS] Rules fetch failed: {e}")
                return EMPTY

            # Events
            try:
                event_map = AdminAnalyticsService._get_event_map(
                    db,
                    organization_id,
                    [u.user_id for u in users],
                    today
                )
            except Exception as e:
                logger.exception(f"[TODAY_COUNTS] Event map fetch failed: {e}")
                return EMPTY

            return AdminAnalyticsService._compute_status_counts(
                users, event_map, rules, threshold
            )

        except Exception as e:
            logger.critical(f"[TODAY_COUNTS] Critical failure: {e}", exc_info=True)
            return EMPTY

    # ==========================================================
    # KPI OVERVIEW
    # ==========================================================
    @staticmethod
    def get_kpi_overview(db: Session, organization_id: UUID, scope) -> Dict:
        try:
            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
            total = len(users)

            if total == 0:
                return AdminAnalyticsService._empty_kpi()

            counts = AdminAnalyticsService._compute_today_counts(db, organization_id, scope)

            return {
                **counts,
                "total": total
            }

        except Exception as e:
            logger.exception(f"[KPI] KPI overview failed: {e}", exc_info=True)
            raise

    # ==========================================================
    # TREND
    # ==========================================================
    @staticmethod
    def get_attendance_trend(db: Session, organization_id: UUID, scope, days: int = 7):

        try:
            today = today_ist()

            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)

            if not users:
                return []

            user_ids = [u.user_id for u in users]
            total_users = len(users)

            _, threshold = AdminAnalyticsService._get_org_and_threshold(db, organization_id)
            rules = AdminAnalyticsService._get_rules(db, organization_id)

            results = []

            for i in range(days):
                try:
                    target_date = today - timedelta(days=(days - 1 - i))

                    if target_date == today:
                        event_map = AdminAnalyticsService._get_event_map(
                            db, organization_id, user_ids, target_date
                        )

                        counts = AdminAnalyticsService._compute_status_counts(
                            users, event_map, rules, threshold
                        )

                    else:
                        # 🔥 FIX: FILTER USING USER_IDS (NO DATA LEAK)
                        rows = db.execute(
                            select(Attendance.status, func.count()).where(
                                Attendance.organization_id == organization_id,
                                Attendance.attendance_date == target_date,
                                Attendance.user_id.in_(user_ids),
                                Attendance.is_deleted == False,
                            ).group_by(Attendance.status)
                        ).all()

                        status_map = {r.status: r.count for r in rows}

                        counts = {
                            "present": status_map.get("present", 0),
                            "late": status_map.get("late", 0),
                            "half_day": status_map.get("half_day", 0),
                            "absent": total_users - (
                                status_map.get("present", 0)
                                + status_map.get("late", 0)
                                + status_map.get("half_day", 0)
                            ),
                        }

                    results.append({
                        "date": target_date.strftime("%d %b"),
                        **counts,
                    })

                except Exception as loop_error:
                    logger.exception(f"[TREND] Error processing {target_date}: {loop_error}")
                    continue

            return results

        except Exception as e:
            logger.exception(f"[TREND] Trend failed: {e}", exc_info=True)
            raise
    # ==========================================================
    # DEPARTMENT ANALYTICS
    # ==========================================================
    @staticmethod
    def get_department_attendance(db: Session, organization_id: UUID, scope):

        try:
            today = today_ist()

            departments = db.execute(
                select(Department).where(
                    Department.organization_id == organization_id
                )
            ).scalars().all()

            if scope["type"] == "department":
                departments = [
                    d for d in departments
                    if d.department_id == scope["department_id"]
                ]

            users = db.execute(
                select(User.user_id, User.department_id).where(
                    User.organization_id == organization_id,
                    User.is_active == True,
                    User.is_deleted == False,
                )
            ).all()

            if not users:
                return []

            dept_map = {}
            for u in users:
                dept_map.setdefault(u.department_id, []).append(u.user_id)

            _, threshold = AdminAnalyticsService._get_org_and_threshold(db, organization_id)
            rules = AdminAnalyticsService._get_rules(db, organization_id)

            event_map = AdminAnalyticsService._get_event_map(
                db, organization_id,
                [u.user_id for u in users],
                today
            )

            result = []

            for dept in departments:
                ids = dept_map.get(dept.department_id, [])
                total = len(ids)

                if total == 0:
                    result.append({"department": dept.name, "attendance": 0})
                    continue

                present = 0

                for uid in ids:
                    raw = event_map.get(uid)

                    summary = DailyAttendanceService._compute_summary(
                        uid,
                        raw.first_in if raw else None,
                        raw.last_out if raw else None,
                        rules,
                        threshold,
                    )

                    if summary and summary.status in ["present", "late"]:
                        present += 1

                result.append({
                    "department": dept.name,
                    "attendance": round((present / total) * 100, 2),
                })

            return result

        except Exception as e:
            logger.exception(f"[DEPT] Failed: {e}", exc_info=True)
            raise

    # ==========================================================
    #  RECOGNITION
    # ==========================================================
    @staticmethod
    def get_recognition_analytics(db: Session, organization_id: UUID, scope, days: int = 7):

        try:
            today = today_ist()

            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
            user_ids = [u.user_id for u in users]

            if not user_ids:
                return {
                    "recognition_rate": 100,
                    "today_unknown_faces": 0,
                    "trend": []
                }

            start_utc, end_utc = ist_day_bounds_utc(today)

            recognized = db.execute(
                select(func.count()).where(
                    AttendanceEvent.organization_id == organization_id,
                    AttendanceEvent.user_id.in_(user_ids),
                    AttendanceEvent.scan_timestamp >= start_utc,
                    AttendanceEvent.scan_timestamp < end_utc,
                )
            ).scalar() or 0

            unknown = db.execute(
                select(func.count()).where(
                    UnknownFace.organization_id == organization_id,
                    UnknownFace.detected_time >= start_utc,
                    UnknownFace.detected_time < end_utc,
                )
            ).scalar() or 0

            rate = (recognized / (recognized + unknown) * 100) if (recognized + unknown) else 100

            trend = []

            for i in range(days):
                d = today - timedelta(days=(days - 1 - i))
                s, e = ist_day_bounds_utc(d)

                count = db.execute(
                    select(func.count()).where(
                        UnknownFace.organization_id == organization_id,
                        UnknownFace.detected_time >= s,
                        UnknownFace.detected_time < e,
                    )
                ).scalar() or 0

                trend.append({
                    "date": d.strftime("%d %b"),
                    "unknown_count": count
                })

            return {
                "recognition_rate": round(rate, 2),
                "today_unknown_faces": unknown,
                "trend": trend,
            }

        except Exception as e:
            logger.exception(f"[RECOG] Failed: {e}", exc_info=True)
            raise

    # ==========================================================
    # ABSENT
    # ==========================================================
    @staticmethod
    def get_absent_analytics(db: Session, organization_id: UUID, scope, days: int = 7):

        try:
            today = today_ist()

            # ✅ STEP 1: Get scoped users
            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
            user_ids = [u.user_id for u in users]

            total_users = len(users)

            if total_users == 0:
                return {"today_absent": 0, "trend": []}

            # ✅ STEP 2: Today's present users (SCOPED)
            start_utc, end_utc = ist_day_bounds_utc(today)

            present_today = db.execute(
                select(func.count(func.distinct(AttendanceEvent.user_id))).where(
                    AttendanceEvent.organization_id == organization_id,
                    AttendanceEvent.user_id.in_(user_ids),   # ✅ FIX
                    AttendanceEvent.scan_timestamp >= start_utc,
                    AttendanceEvent.scan_timestamp < end_utc,
                )
            ).scalar() or 0

            today_absent = total_users - present_today

            trend = []

            for i in range(days):
                try:
                    d = today - timedelta(days=(days - 1 - i))

                    if d == today:
                        count = today_absent

                    else:
                        # ✅ FIX: join with User for department filtering
                        count = db.execute(
                            select(func.count()).select_from(Attendance).join(User).where(
                                Attendance.organization_id == organization_id,
                                Attendance.attendance_date == d,
                                Attendance.status == "absent",
                                Attendance.is_deleted == False,
                                User.user_id == Attendance.user_id,
                                User.user_id.in_(user_ids),  # ✅ FIX
                            )
                        ).scalar() or 0

                    trend.append({
                        "date": d.strftime("%d %b"),
                        "count": count
                    })

                except Exception as loop_error:
                    logger.exception(f"[ABSENT] Loop error for {d}: {str(loop_error)}")
                    continue

            return {
                "today_absent": today_absent,
                "trend": trend
            }

        except Exception as e:
            logger.exception(f"[ABSENT] Absent failed: {str(e)}")
            raise

    # ==========================================================
    # HALF DAY
    # ==========================================================
    @staticmethod
    def get_half_day_analytics(db: Session, organization_id: UUID, scope, days: int = 7):

        try:
            today = today_ist()

            # ✅ scoped counts (already correct)
            counts_today = AdminAnalyticsService._compute_today_counts(db, organization_id, scope)
            today_half_day = counts_today.get("half_day", 0)

            # ✅ Get scoped users for historical queries
            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
            user_ids = [u.user_id for u in users]

            if not user_ids:
                return {"today_half_day": 0, "trend": []}

            trend = []

            for i in range(days):
                try:
                    d = today - timedelta(days=(days - 1 - i))

                    if d == today:
                        count = today_half_day

                    else:
                        # ✅ FIX: join with User
                        count = db.execute(
                            select(func.count()).select_from(Attendance).join(User).where(
                                Attendance.organization_id == organization_id,
                                Attendance.attendance_date == d,
                                Attendance.status == "half_day",
                                Attendance.is_deleted == False,
                                User.user_id == Attendance.user_id,
                                User.user_id.in_(user_ids),  # ✅ FIX
                            )
                        ).scalar() or 0

                    trend.append({
                        "date": d.strftime("%d %b"),
                        "count": count
                    })

                except Exception as loop_error:
                    logger.exception(f"[HALF_DAY] Loop error for {d}: {str(loop_error)}")
                    continue

            return {
                "today_half_day": today_half_day,
                "trend": trend
            }

        except Exception as e:
            logger.exception(f"[HALF_DAY] Half-day analytics failed: {str(e)}")
            raise

    # ==========================================================
    #  LATE
    # ==========================================================
    @staticmethod
    def get_late_analytics(
        db: Session,
        organization_id: UUID,
        scope,
        days: int = 7,
    ) -> LateAnalyticsResponse:

        try:
            # ✅ STEP 1: Today
            try:
                today = today_ist()
            except Exception as e:
                logger.exception(f"[LATE] Failed to get today IST: {str(e)}")
                raise

            # ✅ STEP 2: Today's late (already scoped correctly)
            try:
                counts_today = AdminAnalyticsService._compute_today_counts(db, organization_id, scope)
                today_late = counts_today.get("late", 0)
            except Exception as e:
                logger.exception(f"[LATE] Failed to compute today's counts: {str(e)}")
                raise

            # ✅ STEP 3: Get scoped users (IMPORTANT)
            try:
                users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
                user_ids = [u.user_id for u in users]
            except Exception as e:
                logger.exception(f"[LATE] Failed to fetch scoped users: {str(e)}")
                raise

            if not user_ids:
                return LateAnalyticsResponse(today_late=0, trend=[])

            trend = []

            for i in range(days - 1, -1, -1):
                try:
                    d = today - timedelta(days=i)
                except Exception as e:
                    logger.exception(f"[LATE] Date calculation failed at index {i}: {str(e)}")
                    continue

                try:
                    if d == today:
                        count = today_late
                    else:
                        try:
                            # ✅ FIX: JOIN with User + scope filter
                            count = db.execute(
                                select(func.count())
                                .select_from(Attendance)
                                .join(User)
                                .where(
                                    Attendance.organization_id == organization_id,
                                    Attendance.attendance_date == d,
                                    Attendance.status == "late",
                                    Attendance.is_deleted == False,
                                    User.user_id == Attendance.user_id,
                                    User.user_id.in_(user_ids),  # ✅ CRITICAL FIX
                                )
                            ).scalar() or 0
                        except Exception as e:
                            logger.exception(f"[LATE] DB query failed for {d}: {str(e)}")
                            continue

                except Exception as e:
                    logger.exception(f"[LATE] Failed to compute count for {d}: {str(e)}")
                    continue

                try:
                    trend.append(LateTrendItem(
                        date=d.strftime("%d %b"),
                        late_count=count
                    ))
                except Exception as e:
                    logger.exception(f"[LATE] Failed to append trend item for {d}: {str(e)}")
                    continue

            try:
                return LateAnalyticsResponse(
                    today_late=today_late,
                    trend=trend
                )
            except Exception as e:
                logger.exception(f"[LATE] Failed to build response: {str(e)}")
                raise

        except Exception as e:
            logger.exception(f"[LATE] Late analytics failed: {str(e)}")
            raise

    @staticmethod
    def get_working_hours_analytics(db: Session, organization_id: UUID, scope: dict):
        try:
            # 🕒 Using your helper for server-wide consistent IST date
            today = today_ist()

            # Local helper to cleanly calculate decimal hours from a time object
            def time_to_hours(t) -> float:
                if not t:
                    return 0.0
                return t.hour + (t.minute / 60.0) + (t.second / 3600.0)

            # 🏢 BRANCH 1: Department Admin Scope (Last 7 Days Day-by-Day)
            if scope["type"] == "department":
                days = 7
                trend_data = []

                users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
                user_ids = [u.user_id for u in users]

                if not user_ids:
                    return {"data": [], "systemWideAvg": None}

                for i in range(days):
                    target_date = today - timedelta(days=(days - 1 - i))

                    if target_date == today:
                        # 🛰️ Using your day-bounds helper to scan UTC database columns accurately!
                        start_utc, end_utc = ist_day_bounds_utc(target_date)

                        # Single query reading the raw live Attendance events 
                        rows = db.execute(
                            select(
                                AttendanceEvent.user_id,
                                func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                                func.max(AttendanceEvent.scan_timestamp).label("last_out")
                            )
                            .where(
                                AttendanceEvent.organization_id == organization_id,
                                AttendanceEvent.user_id.in_(user_ids),
                                AttendanceEvent.scan_timestamp >= start_utc,
                                AttendanceEvent.scan_timestamp < end_utc
                            )
                            .group_by(AttendanceEvent.user_id)
                        ).all()

                        total_hours = 0.0
                        counted_users = len(rows)

                        for row in rows:
                            if row.first_in and row.last_out:
                                # Convert UTC database records directly to naive IST Time objects using your helper!
                                check_in_ist = utc_to_ist_time(row.first_in)
                                check_out_ist = utc_to_ist_time(row.last_out)

                                h_in = time_to_hours(check_in_ist)
                                h_out = time_to_hours(check_out_ist)

                                if h_out >= h_in:
                                    total_hours += (h_out - h_in)

                        avg = round(total_hours / counted_users, 2) if counted_users > 0 else 0.0

                    else:
                        # Pre-aggregated historical attendance data
                        rows = db.execute(
                            select(Attendance.first_check_in, Attendance.last_check_out)
                            .where(
                                Attendance.organization_id == organization_id,
                                Attendance.user_id.in_(user_ids),
                                Attendance.attendance_date == target_date,
                                Attendance.is_deleted == False
                            )
                        ).all()

                        total_hours = 0.0
                        counted_users = 0

                        for row in rows:
                            if row.first_check_in and row.last_check_out:
                                h_in = time_to_hours(row.first_check_in)
                                h_out = time_to_hours(row.last_check_out)
                                if h_out >= h_in:
                                    total_hours += (h_out - h_in)
                                    counted_users += 1

                        avg = round(total_hours / counted_users, 2) if counted_users > 0 else 0.0

                    trend_data.append({
                        "label": target_date.strftime("%d %b"),
                        "avgHours": avg
                    })

                return {"data": trend_data, "systemWideAvg": None}

            # 👥 BRANCH 2: HR Admin Scope (Compare Departments Today)
            elif scope["type"] == "organization":
                departments = db.execute(
                    select(Department).where(Department.organization_id == organization_id)
                ).scalars().all()

                active_users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
                user_ids = [u.user_id for u in active_users]

                if not user_ids:
                    return {"data": [], "systemWideAvg": 0.0}

                # Resolve today's UTC bounds using your helper
                start_utc, end_utc = ist_day_bounds_utc(today)

                rows = db.execute(
                    select(
                        AttendanceEvent.user_id,
                        func.min(AttendanceEvent.scan_timestamp).label("first_in"),
                        func.max(AttendanceEvent.scan_timestamp).label("last_out")
                    )
                    .where(
                        AttendanceEvent.organization_id == organization_id,
                        AttendanceEvent.user_id.in_(user_ids),
                        AttendanceEvent.scan_timestamp >= start_utc,
                        AttendanceEvent.scan_timestamp < end_utc
                    )
                    .group_by(AttendanceEvent.user_id)
                ).all()

                user_hours = {}
                global_sum = 0.0
                global_count = 0

                for row in rows:
                    if row.first_in and row.last_out:
                        in_ist = utc_to_ist_time(row.first_in)
                        out_ist = utc_to_ist_time(row.last_out)

                        h_in = time_to_hours(in_ist)
                        h_out = time_to_hours(out_ist)

                        if h_out >= h_in:
                            diff = h_out - h_in
                            user_hours[row.user_id] = diff
                            global_sum += diff
                            global_count += 1

                system_avg = round(global_sum / global_count, 1) if global_count > 0 else 0.0

                dept_data = []
                for dept in departments:
                    dept_users = [u for u in active_users if u.department_id == dept.department_id]
                    dept_sum = 0.0
                    dept_count = 0

                    for u in dept_users:
                        if u.user_id in user_hours:
                            dept_sum += user_hours[u.user_id]
                            dept_count += 1

                    avg = round(dept_sum / dept_count, 2) if dept_count > 0 else 0.0
                    dept_data.append({"label": dept.name, "avgHours": avg})

                return {"data": dept_data, "systemWideAvg": system_avg}

        except Exception as e:
            logger.exception(f"[WORKING_HOURS] Analytics aggregation failed: {str(e)}")
            raise



    @staticmethod
    def get_recent_detections(db: Session, organization_id: UUID, scope: dict, limit: int = 10):
        try:
            today = today_ist()
            start_utc, end_utc = ist_day_bounds_utc(today)

            # Base query pulling Today's scans
            query = (
                select(
                    AttendanceEvent.event_id,
                    User.full_name,
                    Department.name.label("department_name"),
                    Camera.camera_name,
                    AttendanceEvent.scan_timestamp,
                    AttendanceEvent.confidence_score
                )
                .join(User, User.user_id == AttendanceEvent.user_id)
                .join(Department, Department.department_id == User.department_id)
                .outerjoin(Camera, Camera.camera_id == AttendanceEvent.camera_id)
                .where(
                    AttendanceEvent.organization_id == organization_id,
                    AttendanceEvent.scan_timestamp >= start_utc,
                    AttendanceEvent.scan_timestamp < end_utc
                )
            )

            # 🏢 Apply Department filtering if scope is limited
            if scope["type"] == "department":
                query = query.where(User.department_id == scope["department_id"])

            # Order by newest events first
            query = query.order_by(AttendanceEvent.scan_timestamp.desc()).limit(limit)
            rows = db.execute(query).all()

            detections = []
            for row in rows:
                # Convert scan (UTC) to localized display string using your custom utility
                ist_time_obj = utc_to_ist_time(row.scan_timestamp)
                
                detections.append({
                    "event_id": row.event_id,
                    "full_name": row.full_name,
                    "department_name": row.department_name,
                    "camera_name": row.camera_name or "Unknown Camera",
                    "time_ist": ist_time_obj.strftime("%I:%M %p"), # "02:30 PM"
                    "confidence_score": round(row.confidence_score or 0.0, 2)
                })

            return {"detections": detections}

        except Exception as e:
            logger.exception(f"[DETECTIONS] API fetch failed: {str(e)}")
            raise

    
    @staticmethod
    def _get_export_data(db: Session, organization_id: UUID, scope: dict, target_date: date):
        """Standardizes whether we extract data from live Events vs historical Attendance tables"""
        users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
        user_ids = [u.user_id for u in users]

        from app.utils.timezone import today_ist
        
        # Today's data (Live from events stream)
        if target_date == today_ist():
            event_map = AdminAnalyticsService._get_event_map(db, organization_id, user_ids, target_date)
            results = []
            for u in users:
                raw = event_map.get(u.user_id)
                check_in = utc_to_ist_time(raw.first_in).strftime("%I:%M %p") if raw else "--"
                check_out = utc_to_ist_time(raw.last_out).strftime("%I:%M %p") if raw else "--"
                results.append({
                    "name": u.full_name,
                    "date": target_date.strftime("%Y-%m-%d"),
                    "check_in": check_in,
                    "check_out": check_out,
                    "status": "Present" if raw else "Absent"
                })
            return results

        # Historical data (Pre-calculated in Attendance daily table)
        else:
            rows = db.execute(
                select(User.full_name, Attendance.attendance_date, Attendance.first_check_in, Attendance.last_check_out, Attendance.status)
                .join(User, User.user_id == Attendance.user_id)
                .where(Attendance.organization_id == organization_id, Attendance.attendance_date == target_date, Attendance.user_id.in_(user_ids))
            ).all()

            return [{
                "name": r.full_name,
                "date": r.attendance_date.strftime("%Y-%m-%d"),
                "check_in": r.first_check_in.strftime("%I:%M %p") if r.first_check_in else "--",
                "check_out": r.last_check_out.strftime("%I:%M %p") if r.last_check_out else "--",
                "status": r.status.capitalize()
            } for r in rows]


    @staticmethod
    def generate_csv_export(db: Session, organization_id: UUID, scope: dict, target_date: date):
        logs = AdminAnalyticsService._get_export_data(db, organization_id, scope, target_date)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Employee Name", "Date", "Check-In", "Check-Out", "Status"])

        for log in logs:
            writer.writerow([log["name"], log["date"], log["check_in"], log["check_out"], log["status"]])

        output.seek(0)
        # Convert text stream to standard bytes stream for FastAPI StreamingResponse
        bytes_output = io.BytesIO(output.getvalue().encode("utf-8"))
        
        filename = f"attendance_report_{target_date.strftime('%Y%m%d')}.csv"
        return bytes_output, filename


    @staticmethod
    def generate_pdf_export(db: Session, organization_id: UUID, scope: dict, target_date: date):
        logs = AdminAnalyticsService._get_export_data(db, organization_id, scope, target_date)

        # Inline simple HTML template converted to PDF
        html_content = f"""
        <html>
        <head><style>
            body {{ font-family: Helvetica, sans-serif; padding: 20px; }}
            h2 {{ color: #343B55; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }}
            th {{ background-color: #f2f2f2; font-weight: bold; }}
        </style></head>
        <body>
            <h2>Attendance Daily Summary Log ({target_date.strftime('%d %B %Y')})</h2>
            <table>
                <tr><th>Employee</th><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th></tr>
                {"".join([f"<tr><td>{l['name']}</td><td>{l['date']}</td><td>{l['check_in']}</td><td>{l['check_out']}</td><td>{l['status']}</td></tr>" for l in logs])}
            </table>
        </body>
        </html>
        """
        
        pdf_output = io.BytesIO()
        pisa.CreatePDF(html_content, dest=pdf_output)
        pdf_output.seek(0)

        filename = f"attendance_report_{target_date.strftime('%Y%m%d')}.pdf"
        return pdf_output, filename
    

    @staticmethod
    def get_dept_camera_analytics(db: Session, organization_id: UUID, scope: dict):
        try:
            if scope["type"] != "department":
                raise ValueError("Scope must be department-specific")

            dept_id = scope["department_id"]
            
            from app.utils.timezone import today_ist, ist_day_bounds_utc
            start_utc, end_utc = ist_day_bounds_utc(today_ist())

            # 1. Get all active users in this department
            users = AdminAnalyticsService._get_active_users(db, organization_id, scope)
            user_ids = [u.user_id for u in users]

            if not user_ids:
                return {
                    "active_cameras_count": 0,
                    "avg_confidence_score": 0.0,
                    "total_department_scans_today": 0
                }

            # 2. Find distinct cameras used by this department's users TODAY & average confidence
            result = db.execute(
                select(
                    func.count(func.distinct(AttendanceEvent.camera_id)).label("active_cameras"),
                    func.avg(AttendanceEvent.confidence_score).label("avg_confidence"),
                    func.count(AttendanceEvent.event_id).label("total_scans")
                )
                .where(
                    AttendanceEvent.organization_id == organization_id,
                    AttendanceEvent.user_id.in_(user_ids),
                    AttendanceEvent.scan_timestamp >= start_utc,
                    AttendanceEvent.scan_timestamp < end_utc
                )
            ).first()

            return {
                "active_cameras_count": result.active_cameras or 0,
                "avg_confidence_score": round(result.avg_confidence or 0.0, 2),
                "total_department_scans_today": result.total_scans or 0
            }

        except Exception as e:
            logger.exception(f"[DEPT_CAMERA] Analytics failed: {str(e)}")
            raise


    # ==========================================================
    # UTIL
    # ==========================================================
    def _empty_kpi():
     return {
        "present": 0,
        "absent": 0,
        "late": 0,
        "half_day": 0,
        "total": 0,
    }