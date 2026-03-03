"""fix users updated_at server default

Revision ID: c6e97cd30cc0
Revises: 37de22c53b83
Create Date: 2026-03-04 01:40:19.705575

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = 'c6e97cd30cc0'
down_revision: Union[str, Sequence[str], None] = '37de22c53b83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "users",
        "updated_at",
        server_default=sa.text("now()"),
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=False,
    )

def downgrade():
    op.alter_column(
        "users",
        "updated_at",
        server_default=None,
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=False,
    )