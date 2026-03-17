from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from app.models.attendance import AttendanceRule
from datetime import datetime
import pytz

# Configuration
ORG_TZ = pytz.timezone("Asia/Kolkata")

# -------------------- Helpers --------------------

def convert_to_utc(time_obj):
    """Converts IST time object from Frontend to UTC for Database"""
    if time_obj is None:
        return None
    local_dt = ORG_TZ.localize(datetime.combine(datetime.today(), time_obj))
    utc_dt = local_dt.astimezone(pytz.utc)
    return utc_dt.time()

def convert_to_ist(time_obj):
    """Converts UTC time object from Database back to IST for Frontend"""
    if time_obj is None:
        return None
    utc_dt = pytz.utc.localize(datetime.combine(datetime.today(), time_obj))
    ist_dt = utc_dt.astimezone(ORG_TZ)
    return ist_dt.time()

# -------------------- CRUD --------------------

def get_rules(db: Session, organization_id: UUID):
    stmt = (
        select(AttendanceRule)
        .where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.is_deleted == False
        )
        .order_by(AttendanceRule.start_time)
    )

    rules = db.execute(stmt).scalars().all()
    
    # Convert UTC data from DB back to IST for the UI
    for rule in rules:
        rule.start_time = convert_to_ist(rule.start_time)
        rule.end_time = convert_to_ist(rule.end_time)
        
    return rules


def _check_overlap(db: Session, organization_id: UUID, start_time, end_time, exclude_rule_id=None):
    """
    Returns True if the given time range overlaps with any existing rules 
    for the organization. Expects UTC times for comparison.
    """
    stmt = select(AttendanceRule).where(
        AttendanceRule.organization_id == organization_id,
        AttendanceRule.is_deleted == False,
        AttendanceRule.start_time < end_time, 
        AttendanceRule.end_time > start_time  
    )

    if exclude_rule_id:
        stmt = stmt.where(AttendanceRule.rule_id != exclude_rule_id)

    result = db.execute(stmt).scalar_one_or_none()
    return result is not None


def create_rule(db: Session, organization_id: UUID, data):
    # Convert incoming IST to UTC
    start_utc = convert_to_utc(data.start_time)
    end_utc = convert_to_utc(data.end_time)

    # CHECK FOR EXACT DUPLICATE FIRST (Avoids the UniqueViolation error)
    existing_exact = db.execute(
        select(AttendanceRule).where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.start_time == start_utc,
            AttendanceRule.end_time == end_utc,
            AttendanceRule.is_deleted == False
        )
    ).scalars().first()

    if existing_exact:
        # Instead of crashing, we just update the existing one's name/effect
        # OR you can raise a ValueError that the frontend can show
        raise ValueError(f"A rule for {data.start_time}-{data.end_time} already exists.")

    # Check for general overlaps
    if _check_overlap(db, organization_id, start_utc, end_utc):
        raise ValueError("Attendance rule time overlaps with an existing rule")

    rule = AttendanceRule(
        organization_id=organization_id,
        rule_name=data.rule_name,
        start_time=start_utc,
        end_time=end_utc,
        status_effect=data.status_effect,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    rule.start_time = convert_to_ist(rule.start_time)
    rule.end_time = convert_to_ist(rule.end_time)
    return rule

def update_rule(db: Session, rule_id: UUID, organization_id: UUID, data):
    stmt = select(AttendanceRule).where(
        AttendanceRule.rule_id == rule_id,
        AttendanceRule.organization_id == organization_id,
        AttendanceRule.is_deleted.is_(False)
    )

    rule = db.execute(stmt).scalar_one_or_none()
    if not rule:
        return None

    update_data = data.model_dump(exclude_unset=True)

    # Convert incoming IST times to UTC if they are being updated
    new_start_utc = convert_to_utc(update_data.get("start_time")) if "start_time" in update_data else rule.start_time
    new_end_utc = convert_to_utc(update_data.get("end_time")) if "end_time" in update_data else rule.end_time

    # Check overlap against OTHER rules in UTC
    if _check_overlap(db, organization_id, new_start_utc, new_end_utc, exclude_rule_id=rule_id):
        raise ValueError("Updated rule overlaps with an existing rule")

    # Apply updates (ensuring times are saved as UTC)
    for key, value in update_data.items():
        if key == "start_time":
            setattr(rule, key, new_start_utc)
        elif key == "end_time":
            setattr(rule, key, new_end_utc)
        else:
            setattr(rule, key, value)

    db.commit()
    db.refresh(rule)

    # Convert back to IST for the response body
    rule.start_time = convert_to_ist(rule.start_time)
    rule.end_time = convert_to_ist(rule.end_time)
    return rule


def delete_rule(db: Session, rule_id: UUID, organization_id: UUID):
    stmt = select(AttendanceRule).where(
        AttendanceRule.rule_id == rule_id,
        AttendanceRule.organization_id == organization_id,
        AttendanceRule.is_deleted.is_(False)
    )

    rule = db.execute(stmt).scalar_one_or_none()
    if not rule:
        return None

    rule.is_deleted = True
    db.commit()
    return rule