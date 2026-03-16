"""add attendance_rules table

Revision ID: 608a62719ec9
Revises: 0187fffa9616
Create Date: 2026-03-16 17:49:52.016038

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = '608a62719ec9'
down_revision: Union[str, Sequence[str], None] = '0187fffa9616'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.create_table(
        "attendance_rules",

        sa.Column("rule_id", sa.UUID(), primary_key=True, nullable=False),

        sa.Column(
            "organization_id",
            sa.UUID(),
            sa.ForeignKey("organizations.organization_id"),
            nullable=False
        ),

        sa.Column("rule_name", sa.String(), nullable=False),

        sa.Column("start_time", sa.Time(), nullable=False),

        sa.Column("end_time", sa.Time(), nullable=False),

        sa.Column(
            "status_effect",
            sa.Enum("present", "late", "absent", name="attendancestatus"),
            nullable=False
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False
        ),

        sa.Column(
            "is_deleted",
            sa.Boolean(),
            server_default="false",
            nullable=False
        ),
    )

    op.create_index(
        "ix_attendance_rules_org_time",
        "attendance_rules",
        ["organization_id", "start_time", "end_time"]
    )

    op.create_unique_constraint(
        "uq_attendance_rule_window",
        "attendance_rules",
        ["organization_id", "start_time", "end_time"]
    )

    
def downgrade() -> None:

    op.drop_constraint(
        "uq_attendance_rule_window",
        "attendance_rules",
        type_="unique"
    )

    op.drop_index(
        "ix_attendance_rules_org_time",
        table_name="attendance_rules"
    )

    op.drop_table("attendance_rules")