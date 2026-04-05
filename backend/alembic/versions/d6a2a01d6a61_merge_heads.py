"""merge heads

Revision ID: d6a2a01d6a61
Revises: 8a570aeeb978, f1a2b3c4d5e6
Create Date: 2026-04-05 19:34:39.736309

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = 'd6a2a01d6a61'
down_revision: Union[str, Sequence[str], None] = ('8a570aeeb978', 'f1a2b3c4d5e6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
