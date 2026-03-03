"""Add partial unique index for platform super admin role

Revision ID: 37de22c53b83
Revises: 96e8d69405fc
Create Date: 2026-03-04 00:00:40.695148

"""
from typing import Sequence, Union
from sqlalchemy import text
from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = '37de22c53b83'
down_revision: Union[str, Sequence[str], None] = '96e8d69405fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_index(
        "uq_super_admin_platform",
        "roles",
        ["role_name"],
        unique=True,
        postgresql_where=text("organization_id IS NULL")
    )

def downgrade():
    op.drop_index("uq_super_admin_platform", table_name="roles")
