from collections import defaultdict
from datetime import date, datetime, timedelta
from typing import Tuple,List, Dict,Optional
from uuid import UUID
from reportlab.lib import styles
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from io import BytesIO
from io import StringIO
import csv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from fastapi.responses import StreamingResponse

from app.models.attendance import Attendance  # adjust import path
from app.models.attendance import AttendanceEvent 
from app.models.biometrics import FacialBiometric

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet

from app.schemas.user_analytics_schema import ProductivityMetricsResponse, RecognitionInsightsResponse, WorkingHoursPoint, AttendanceStat, RecognitionTrendPoint, RecognitionPerformance

def _month_range(year: int, month: int) -> Tuple[date, date]:
    start = date(year, month, 1)
    if month == 12:
        end = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end = date(year, month + 1, 1) - timedelta(days=1)
    return start, end

def calculate_productivity_metrics_for_user(
    db: Session,
    user_id: str,
    year: int,
    month: int
) -> dict:
    """
    Returns:
      - attendance_consistency: percent of working days with a valid present record
      - stability_index: percent of days where working hours are within +/- 1 hour of user's avg
      - peak_arrival: most common first_check_in time bucket (HH:MM)
      - late_frequency_per_week: average number of 'late' statuses per week in the month
    """
    start_date, end_date = _month_range(year, month)

    # 1) Fetch attendance rows for user in month
    stmt = (
        select(
            Attendance.attendance_date,
            Attendance.first_check_in,
            Attendance.last_check_out,
            Attendance.status
        )
        .where(Attendance.user_id == user_id)
        .where(Attendance.attendance_date >= start_date)
        .where(Attendance.attendance_date <= end_date)
        .order_by(Attendance.attendance_date.asc())
    )
    rows = db.execute(stmt).all()

    # Convert rows to list of dicts for easier processing
    records = []
    for r in rows:
        records.append({
            "date": r[0],
            "first_in": r[1],
            "last_out": r[2],
            "status": (r[3] or "").lower()
        })

    total_days = (end_date - start_date).days + 1
    # Consider working days as weekdays (Mon-Fri)
    working_days = [start_date + timedelta(days=i) for i in range(total_days) if (start_date + timedelta(days=i)).weekday() < 5]
    working_days_count = len(working_days)

    # Map date -> record
    rec_map = {rec["date"]: rec for rec in records}

    # Attendance consistency: percent of working days with a record and status 'present' (or not absent)
    present_days = 0
    for wd in working_days:
        rec = rec_map.get(wd)
        if rec and rec["status"] and rec["status"] != "absent":
            present_days += 1
    attendance_consistency = round((present_days / (working_days_count or 1)) * 100, 2)

    # Compute working hours per recorded day
    hours_list = []
    for rec in records:
        if rec["first_in"] and rec["last_out"]:
            dt_in = datetime.combine(rec["date"], rec["first_in"])
            dt_out = datetime.combine(rec["date"], rec["last_out"])
            delta = dt_out - dt_in
            hours = max(0.0, delta.total_seconds() / 3600.0)
            hours_list.append(hours)

    avg_hours = sum(hours_list) / (len(hours_list) or 1)

    # Stability index: percent of recorded days where hours within +/-1 hour of avg_hours
    stable_count = sum(1 for h in hours_list if abs(h - avg_hours) <= 1.0)
    stability_index = round((stable_count / (len(hours_list) or 1)) * 100, 2)

    # Peak arrival: bucket first_check_in times into minute buckets and pick most common
    from collections import Counter
    time_buckets = []
    for rec in records:
        if rec["first_in"]:
            time_buckets.append(rec["first_in"].strftime("%H:%M"))
    peak_arrival = None
    if time_buckets:
        peak_arrival = Counter(time_buckets).most_common(1)[0][0]

    # Late frequency per week: count 'late' statuses and normalize per week in month
    late_count = sum(1 for rec in records if rec["status"] == "late")
    # number of weeks in the month (approx)
    weeks = max(1, round(((end_date - start_date).days + 1) / 7))
    late_frequency_per_week = round(late_count / weeks, 2)

    return {
        "attendance_consistency": attendance_consistency,
        "stability_index": stability_index,
        "peak_arrival": peak_arrival,
        "late_frequency_per_week": late_frequency_per_week,
        "period_start": start_date,
        "period_end": end_date
    }


def get_recognition_trends_for_user(
    db: Session,
    user_id: str,
    hours: int = 72,
    interval_minutes: int = 60
) -> List[RecognitionTrendPoint]:
    """
    Aggregate confidence scores for the user over the past `hours` in `interval_minutes` buckets.
    Returns list of timestamped average confidence (0..1).
    """
    end_ts = datetime.utcnow()
    start_ts = end_ts - timedelta(hours=hours)

    # Simple approach: fetch raw events and compute bucket averages in Python
    stmt = (
        select(
            AttendanceEvent.scan_timestamp,
            AttendanceEvent.confidence_score
        )
        .where(AttendanceEvent.user_id == user_id)
        .where(AttendanceEvent.scan_timestamp >= start_ts)
        .order_by(AttendanceEvent.scan_timestamp.asc())
    )
    rows = db.execute(stmt).all()

    # bucketize
    buckets: Dict[datetime, list] = {}
    for ts, score in rows:
        # normalize to bucket start
        minutes_since_start = int((ts - start_ts).total_seconds() // 60)
        bucket_index = (minutes_since_start // interval_minutes)
        bucket_start = start_ts + timedelta(minutes=bucket_index * interval_minutes)
        buckets.setdefault(bucket_start, []).append(score or 0.0)

    points: List[RecognitionTrendPoint] = []
    for bucket_start in sorted(buckets.keys()):
        scores = buckets[bucket_start]
        avg = sum(scores) / len(scores) if scores else 0.0
        points.append(RecognitionTrendPoint(timestamp=bucket_start, confidence_score=round(avg, 4)))

    return points

def get_recognition_performance_for_user(
    db: Session,
    user_id: str,
    lookback_days: int = 30
) -> RecognitionPerformance:
    """
    Compute simple performance metrics:
    - avg_confidence: average confidence across events
    - success_rate: percent of events with confidence >= 0.75
    - false_rejection_rate: percent of events flagged as 'rejected' or below threshold
    """
    cutoff = datetime.utcnow() - timedelta(days=lookback_days)
    stmt = (
        select(
            AttendanceEvent.confidence_score,
            AttendanceEvent.event_type
        )
        .where(AttendanceEvent.user_id == user_id)
        .where(AttendanceEvent.scan_timestamp >= cutoff)
    )
    rows = db.execute(stmt).all()
    scores = [r[0] or 0.0 for r in rows]
    total = len(scores)
    avg_conf = (sum(scores) / total) if total else 0.0
    success_count = sum(1 for s in scores if s >= 0.75)
    false_rejections = sum(1 for s in scores if s < 0.5)
    success_rate = round((success_count / total) * 100, 2) if total else 0.0
    false_rejection_rate = round((false_rejections / total) * 100, 2) if total else 0.0

    # Optionally fetch latest model version used for this user's biometrics
    model_stmt = select(FacialBiometric.model_version).where(FacialBiometric.user_id == user_id).order_by(FacialBiometric.created_at.desc()).limit(1)
    model_row = db.execute(model_stmt).first()
    model_version = model_row[0] if model_row else None

    return RecognitionPerformance(
        avg_confidence=round(avg_conf, 4),
        success_rate=success_rate,
        false_rejection_rate=false_rejection_rate
    ), model_version


def _month_date_range(year: int, month: int) -> Tuple[date, date]:
    start = date(year, month, 1)
    if month == 12:
        end = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end = date(year, month + 1, 1) - timedelta(days=1)
    return start, end

def get_working_hours_trend_for_user(
    db: Session,
    user_id: str,
    year: int,
    month: int,
    days: int = 7
) -> List[WorkingHoursPoint]:
    """
    Returns up to `days` most recent daily working hours for the user within the month.
    Calculation: difference between last_check_out and first_check_in in hours.
    """
    start_of_month, end_of_month = _month_date_range(year, month)

    # Query last `days` attendance records for the user within the month ordered by date desc
    stmt = (
        select(
            Attendance.attendance_date,
            Attendance.first_check_in,
            Attendance.last_check_out
        )
        .where(Attendance.user_id == user_id)
        .where(Attendance.attendance_date >= start_of_month)
        .where(Attendance.attendance_date <= end_of_month)
        .order_by(Attendance.attendance_date.desc())
        .limit(days)
    )

    rows = db.execute(stmt).all()

    points: List[WorkingHoursPoint] = []
    for row in reversed(rows):  # reverse to return chronological order
        att_date, time_in, time_out = row
        hours = 0.0
        if time_in and time_out:
            # time_in and time_out are time objects; convert to datetime for subtraction
            dt_in = datetime.combine(att_date, time_in)
            dt_out = datetime.combine(att_date, time_out)
            delta = dt_out - dt_in
            hours = round(delta.total_seconds() / 3600.0, 2)
            if hours < 0:
                # guard against negative (overnight) — set to 0 or handle as needed
                hours = 0.0
        points.append(WorkingHoursPoint(date=att_date, actual=hours))

    return points

def get_working_hours_summary(
    db: Session,
    user_id: str,
    year: int,
    month: int,
    days: int = 7
):
    points = get_working_hours_trend_for_user(db, user_id, year, month, days)
    avg = round(sum(p.actual for p in points) / (len(points) or 1), 2)
    return {
        "start_date": points[0].date if points else date(year, month, 1),
        "end_date": points[-1].date if points else date(year, month, 1),
        "points": points,
        "avg_hours": avg
    }


from datetime import date
from typing import List
from uuid import UUID
from collections import defaultdict

from sqlalchemy import select

from app.models.attendance import Attendance
from app.schemas.user_analytics_schema import AttendanceStat 


from datetime import date
from typing import List
from collections import defaultdict

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.schemas.user_analytics_schema import AttendanceStat


def get_monthly_attendance_stats(
    db: Session,
    user_id,
    year: int,
    month: int
) -> List[AttendanceStat]:
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    stmt = (
        select(
            Attendance.attendance_date,
            Attendance.status
        )
        .where(Attendance.user_id == user_id)
        .where(Attendance.attendance_date >= start_date)
        .where(Attendance.attendance_date < end_date)
        .where(Attendance.is_deleted == False)
    )

    rows = db.execute(stmt).all()

    final_counts = {
        "present": 0,
        "absent": 0,
        "late": 0,
        "half_day": 0,   # ✅ kept so schema/frontend don't break
    }

    for att_date, status in rows:
        normalized_status = (status.value if status else "absent").lower()

        if normalized_status in ["present", "on time"]:
            final_counts["present"] += 1
        elif normalized_status == "late":
            final_counts["late"] += 1
        elif normalized_status == "half_day":
            final_counts["absent"] += 1  # ✅ half_day record → counts as absent
        else:
            final_counts["absent"] += 1

    stats = [
        AttendanceStat(status=status, count=count)
        for status, count in final_counts.items()
    ]

    return stats


def _extract_att_and_name(row):
    try:
        # Case 1: SQLAlchemy Row (modern versions)
        if hasattr(row, "_mapping"):
            att = row._mapping.get(Attendance)
            name = row._mapping.get("user_full_name", "-")
            return att, name or "-"

        # Case 2: tuple fallback
        if isinstance(row, tuple):
            att = row[0]
            name = row[1] if len(row) > 1 else "-"
            return att, name or "-"

        # Case 3: direct Attendance object
        att = row
        name = getattr(att, "user_full_name", None) or \
               (getattr(att, "user", None) and getattr(att.user, "full_name", None)) or "-"
        return att, name

    except Exception as e:
        print("Extract Error:", e)
        return row, "-"

def generate_attendance_pdf(rows, organization_id, start_date, end_date) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)

    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph("Attendance Report", styles["Title"]))
    elements.append(Spacer(1, 10))

    # Meta info
    elements.append(Paragraph(f"User: {rows[0].full_name if rows else 'N/A'}", styles["Normal"]))
    elements.append(Paragraph(f"Period: {start_date or 'Start'} to {end_date or 'Today'}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    # Table Data
    data = [["Date", "User Name", "Status", "Check In", "Check Out"]]

    for row in rows:
        data.append([
            str(row.attendance_date or "-"),
            str(row.full_name or "-"),
            str(row.status or "-"),
            str(row.first_check_in or "-"),
            str(row.last_check_out or "-"),
        ])

    # Table
    table = Table(data, repeatRows=1)

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),

        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (3, 1), (-1, -1), "CENTER"),

        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
    ]))

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)
    return buffer.getvalue()

def generate_attendance_csv(rows) -> bytes:
    sio = StringIO()
    writer = csv.writer(sio)

    # Header
    writer.writerow(["Date", "User Name", "Status", "Check In", "Check Out"])

    for row in rows:
        writer.writerow([
            row.attendance_date or "-",
            row.full_name or "-",
            row.status or "-",
            row.first_check_in or "-",
            row.last_check_out or "-",
        ])

    return sio.getvalue().encode("utf-8")