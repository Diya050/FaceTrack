"""add notification_config to organizations

Revision ID: 9a2c3d4e5f6g
Revises: 8f9c1a2b3d4e
Create Date: 2026-03-22 00:00:01.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9a2c3d4e5f6g"
down_revision: Union[str, Sequence[str], None] = "8f9c1a2b3d4e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "organizations",
        sa.Column("notification_config", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("organizations", "notification_config")
