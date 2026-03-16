"""add late status to attendance rules

Revision ID: 9903b1a1a55d
Revises: 608a62719ec9
Create Date: 2026-03-16 20:47:13.860775

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '9903b1a1a55d'
down_revision: Union[str, Sequence[str], None] = '608a62719ec9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    
    # 1. Create new ENUM types explicitly if they don't exist
    # This prevents errors where the type name is changed but not yet recognized by PG
    attendancestatus = postgresql.ENUM('present', 'absent', 'half_day', 'on_leave', 'late', name='attendancestatus')
    attendancestatus.create(op.get_bind(), checkfirst=True)
    
    correctionstatus = postgresql.ENUM('pending', 'approved', 'rejected', name='attendancecorrectionstatus')
    correctionstatus.create(op.get_bind(), checkfirst=True)
    
    eventtype = postgresql.ENUM('check_in', 'check_out', 'passby', name='attendanceeventtype')
    eventtype.create(op.get_bind(), checkfirst=True)
    
    recognitionmethod = postgresql.ENUM('face', 'live_call', name='recognitionmethod')
    recognitionmethod.create(op.get_bind(), checkfirst=True)

    # 2. Alter columns with the USING clause to cast old enum values to the new types
    op.alter_column('attendance', 'status',
               existing_type=postgresql.ENUM('present', 'absent', 'half_day', 'on_leave', name='attendance_status_enum'),
               type_=attendancestatus,
               existing_nullable=False,
               postgresql_using='status::text::attendancestatus')

    op.alter_column('attendance_corrections', 'status',
               existing_type=postgresql.ENUM('pending', 'approved', 'rejected', name='attendance_correction_status_enum'),
               type_=correctionstatus,
               existing_nullable=False,
               postgresql_using='status::text::attendancecorrectionstatus')

    op.alter_column('attendance_events', 'event_type',
               existing_type=postgresql.ENUM('check_in', 'check_out', 'passby', name='attendance_event_type_enum'),
               type_=eventtype,
               existing_nullable=False,
               postgresql_using='event_type::text::attendanceeventtype')

    op.alter_column('attendance_events', 'recognition_method',
               existing_type=postgresql.ENUM('face', 'live_call', name='recognition_method_enum'),
               type_=recognitionmethod,
               existing_nullable=False,
               postgresql_using='recognition_method::text::recognitionmethod')

    # 3. Handle organization_id and foreign keys
    op.alter_column('attendance_rules', 'organization_id',
               existing_type=sa.UUID(),
               nullable=True)
    
    op.create_index(op.f('ix_attendance_rules_organization_id'), 'attendance_rules', ['organization_id'], unique=False)
    
    # Note: If the constraint name in your DB is already 'attendance_rules_organization_id_fkey', drop it first
    op.execute('ALTER TABLE attendance_rules DROP CONSTRAINT IF EXISTS attendance_rules_organization_id_fkey')
    
    op.create_foreign_key(
        'attendance_rules_organization_id_fkey', 
        'attendance_rules', 
        'organizations', 
        ['organization_id'], 
        ['organization_id'], 
        ondelete='RESTRICT'
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('attendance_rules_organization_id_fkey', 'attendance_rules', type_='foreignkey')
    op.create_foreign_key('attendance_rules_organization_id_fkey', 'attendance_rules', 'organizations', ['organization_id'], ['organization_id'])
    op.drop_index(op.f('ix_attendance_rules_organization_id'), table_name='attendance_rules')
    
    op.alter_column('attendance_rules', 'organization_id',
               existing_type=sa.UUID(),
               nullable=False)

    # Note: Downgrade also requires explicit USING for enums if reverting to old names
    op.alter_column('attendance_events', 'recognition_method',
               existing_type=sa.Enum('face', 'live_call', name='recognitionmethod'),
               type_=postgresql.ENUM('face', 'live_call', name='recognition_method_enum'),
               existing_nullable=False,
               postgresql_using='recognition_method::text::recognition_method_enum')

    op.alter_column('attendance_events', 'event_type',
               existing_type=sa.Enum('check_in', 'check_out', 'passby', name='attendanceeventtype'),
               type_=postgresql.ENUM('check_in', 'check_out', 'passby', name='attendance_event_type_enum'),
               existing_nullable=False,
               postgresql_using='event_type::text::attendance_event_type_enum')

    op.alter_column('attendance_corrections', 'status',
               existing_type=sa.Enum('pending', 'approved', 'rejected', name='attendancecorrectionstatus'),
               type_=postgresql.ENUM('pending', 'approved', 'rejected', name='attendance_correction_status_enum'),
               existing_nullable=False,
               postgresql_using='status::text::attendance_correction_status_enum')

    op.alter_column('attendance', 'status',
               existing_type=sa.Enum('present', 'absent', 'half_day', 'on_leave', 'late', name='attendancestatus'),
               type_=postgresql.ENUM('present', 'absent', 'half_day', 'on_leave', name='attendance_status_enum'),
               existing_nullable=False,
               postgresql_using='status::text::attendance_status_enum')