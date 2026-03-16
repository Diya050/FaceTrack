from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, and_

from app.models.attendance import AttendanceRule


def get_rules(db: Session, organization_id: UUID):
    stmt = (
        select(AttendanceRule)
        .where(
            AttendanceRule.organization_id == organization_id,
            AttendanceRule.is_deleted.is_(False)
        )
        .order_by(AttendanceRule.start_time)
    )

    return db.execute(stmt).scalars().all()


def _check_overlap(db: Session, organization_id: UUID, start_time, end_time, exclude_rule_id=None):
    """
    Returns True if the given time range overlaps with any existing rules 
    for the organization.
    """
    stmt = select(AttendanceRule).where(
        AttendanceRule.organization_id == organization_id,
        AttendanceRule.is_deleted == False,
        AttendanceRule.start_time < end_time,
        AttendanceRule.end_time > start_time
    )

    # When updating, we must exclude the current rule from the check
    if exclude_rule_id:
        stmt = stmt.where(AttendanceRule.rule_id != exclude_rule_id)

    result = db.execute(stmt).scalar_one_or_none()
    return result is not None


def create_rule(db: Session, organization_id: UUID, data):
    # Perform overlap check
    if _check_overlap(db, organization_id, data.start_time, data.end_time):
        raise ValueError("Attendance rule time overlaps with an existing rule")

    rule = AttendanceRule(
        organization_id=organization_id,
        rule_name=data.rule_name,
        start_time=data.start_time,
        end_time=data.end_time,
        status_effect=data.status_effect,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    return rule


def update_rule(db: Session, rule_id: UUID, organization_id: UUID, data):
    # Find the existing rule
    stmt = select(AttendanceRule).where(
        AttendanceRule.rule_id == rule_id,
        AttendanceRule.organization_id == organization_id,
        AttendanceRule.is_deleted.is_(False)
    )

    rule = db.execute(stmt).scalar_one_or_none()

    if not rule:
        return None

    # Get data from the Pydantic model
    update_data = data.model_dump(exclude_unset=True)

    # Determine if the times are changing for overlap validation
    new_start = update_data.get("start_time", rule.start_time)
    new_end = update_data.get("end_time", rule.end_time)

    # Check overlap against OTHER rules
    if _check_overlap(db, organization_id, new_start, new_end, exclude_rule_id=rule_id):
        raise ValueError("Updated rule overlaps with an existing rule")

    # Update attributes
    for key, value in update_data.items():
        setattr(rule, key, value)

    db.commit()
    db.refresh(rule)

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

    # Soft delete
    rule.is_deleted = True

    db.commit()

    return rule