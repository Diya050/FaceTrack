"""add data retention tables

Revision ID: f1a2b3c4d5e6
Revises: 9a2c3d4e5f6g
Create Date: 2026-03-30 04:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = '9a2c3d4e5f6g'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create retention_policies and purge_jobs tables."""
    op.create_table('retention_policies',
        sa.Column('policy_id', sa.UUID(), nullable=False),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('retention_days', sa.Integer(), nullable=False, server_default='365'),
        sa.Column('auto_delete', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('archive_before_delete', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('last_run_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('next_run_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.organization_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('policy_id')
    )
    op.create_index('ix_retention_policies_category', 'retention_policies', ['category'], unique=False)
    op.create_index('ix_retention_policies_organization_id', 'retention_policies', ['organization_id'], unique=False)

    op.create_table('purge_jobs',
        sa.Column('job_id', sa.UUID(), nullable=False),
        sa.Column('organization_id', sa.UUID(), nullable=False),
        sa.Column('policy_id', sa.UUID(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='scheduled'),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('records_deleted', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('size_mb', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('triggered_by', sa.String(), nullable=False, server_default='Scheduler'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.organization_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['policy_id'], ['retention_policies.policy_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('job_id')
    )
    op.create_index('ix_purge_jobs_policy_id', 'purge_jobs', ['policy_id'], unique=False)
    op.create_index('ix_purge_jobs_organization_id', 'purge_jobs', ['organization_id'], unique=False)


def downgrade() -> None:
    """Drop retention_policies and purge_jobs tables."""
    op.drop_index('ix_purge_jobs_organization_id', table_name='purge_jobs')
    op.drop_index('ix_purge_jobs_policy_id', table_name='purge_jobs')
    op.drop_table('purge_jobs')
    op.drop_index('ix_retention_policies_organization_id', table_name='retention_policies')
    op.drop_index('ix_retention_policies_category', table_name='retention_policies')
    op.drop_table('retention_policies')
