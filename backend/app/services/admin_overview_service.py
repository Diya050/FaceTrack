from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.models.core import User, Department
from app.models.attendance import Attendance

PRESENT_STATUSES = ['present', 'late', 'half_day']


# =========================
# MAIN OVERVIEW API
# =========================
def get_admin_overview_data(db: Session, organization_id: str):
    try:
        dept_summary, stats = get_department_performance(db, organization_id)
        weekly_report = get_weekly_attendance_report(db, organization_id)
        monthly_trend = get_monthly_attendance_trend(db, organization_id)

        return {
            "weekly_report": weekly_report,
            "monthly_trend": monthly_trend,
            "department_summary": dept_summary,
            "stats": stats
        }
    except Exception as e:
        print("ERROR in get_admin_overview_data:", e)
        raise


# =========================
# DEPARTMENT PERFORMANCE
# =========================
def get_department_performance(db: Session, organization_id: str):
    try:
        today = date.today()

        # Departments
        depts = db.query(Department).filter(
            Department.organization_id == organization_id
        ).all()

        # Total users per department
        user_counts = db.query(
            User.department_id,
            func.count(User.user_id)
        ).filter(
            User.organization_id == organization_id,
            User.is_active == True,
            User.is_deleted == False
        ).group_by(User.department_id).all()

        user_map = {str(d): c for d, c in user_counts if d}

        # ✅ FIXED PRESENT QUERY (SAFE JOIN + CONSISTENT LOGIC)
        present_counts = db.query(
            User.department_id,
            func.count(func.distinct(User.user_id))
        ).select_from(Attendance).join(
            User, Attendance.user_id == User.user_id
        ).filter(
            Attendance.organization_id == organization_id,
            Attendance.attendance_date == today,
            Attendance.status.in_(PRESENT_STATUSES),
            User.is_active == True,
            User.is_deleted == False
        ).group_by(User.department_id).all()

        present_map = {str(d): c for d, c in present_counts if d}

        summary = []
        total_staff = 0
        total_present = 0

        for dept in depts:
            dept_id = str(dept.department_id)

            total = user_map.get(dept_id, 0)
            present = present_map.get(dept_id, 0)

            percentage = round((present / total) * 100, 1) if total else 0

            summary.append({
                "department_id": dept_id,
                "department": dept.name,
                "present": present,
                "total": total,
                "percentage": percentage
            })

            total_staff += total
            total_present += present

        stats = {
            "active_staff": total_staff,
            "on_premises": total_present,
            "avg_attendance_rate": round((total_present / total_staff) * 100, 1) if total_staff else 0
        }

        return summary, stats

    except Exception as e:
        print("ERROR in get_department_performance:", e)
        raise


# =========================
# WEEKLY REPORT
# =========================
def get_weekly_attendance_report(db: Session, organization_id: str):
    try:
        today = date.today()
        days = [today - timedelta(days=i) for i in range(6, -1, -1)]

        labels = [d.strftime("%a") for d in days]

        total_staff = db.query(func.count(User.user_id)).filter(
            User.organization_id == organization_id,
            User.is_active == True,
            User.is_deleted == False
        ).scalar() or 0

        present_list, absent_list, late_list = [], [], []

        for d in days:
            records = db.query(Attendance).filter(
                Attendance.organization_id == organization_id,
                Attendance.attendance_date == d
            ).all()

            present = 0
            late = 0

            for rec in records:
                # ✅ SAFE STATUS EXTRACTION
                status = str(rec.status).lower() if rec.status else ""

                if status in ['present', 'half_day', 'early_leave']:
                    present += 1
                elif status == 'late':
                    late += 1

            total_present = present + late
            absent = max(0, total_staff - total_present)

            present_list.append(present)
            late_list.append(late)
            absent_list.append(absent)

        return {
            "labels": labels,
            "present": present_list,
            "absent": absent_list,
            "late": late_list
        }

    except Exception as e:
        print("ERROR in weekly report:", e)
        raise


# =========================
# MONTHLY TREND
# =========================
def get_monthly_attendance_trend(db: Session, organization_id: str):
    try:
        today = date.today()
        start = today - timedelta(days=29)

        days = [today - timedelta(days=i) for i in range(29, -1, -1)]
        labels = [d.strftime("%d %b") for d in days]

        total_users = db.query(func.count(User.user_id)).filter(
            User.organization_id == organization_id,
            User.is_active == True,
            User.is_deleted == False
        ).scalar() or 1

        counts = db.query(
            Attendance.attendance_date,
            func.count(func.distinct(Attendance.user_id))
        ).filter(
            Attendance.organization_id == organization_id,
            Attendance.attendance_date >= start,
            Attendance.attendance_date <= today,
            Attendance.status.in_(PRESENT_STATUSES)
        ).group_by(Attendance.attendance_date).all()

        count_map = {d: c for d, c in counts}

        rates = []
        for d in days:
            c = count_map.get(d, 0)
            rates.append(round((c / total_users) * 100, 1))

        current_avg = sum(rates[-7:]) / 7 if rates else 0
        prev_avg = sum(rates[-14:-7]) / 7 if len(rates) >= 14 else current_avg

        diff = current_avg - prev_avg
        direction = "up" if diff > 0 else "down" if diff < 0 else "flat"

        return {
            "labels": labels,
            "rate": rates,
            "trend_direction": direction,
            "trend_value": f"{abs(round(diff, 1))}% vs last week"
        }

    except Exception as e:
        print("ERROR in monthly trend:", e)
        raise