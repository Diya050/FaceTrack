"""add recognition threshold settings to organizations

Revision ID: 8f9c1a2b3d4e
Revises: db034a9fa9fe
Create Date: 2026-03-22 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8f9c1a2b3d4e"
down_revision: Union[str, Sequence[str], None] = "db034a9fa9fe"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "organizations",
        sa.Column(
            "recognition_confidence",
            sa.Float(),
            nullable=False,
            server_default=sa.text("0.75"),
        ),
    )
    op.add_column(
        "organizations",
        sa.Column(
            "unknown_face_threshold",
            sa.Float(),
            nullable=False,
            server_default=sa.text("0.45"),
        ),
    )
    op.add_column(
        "organizations",
        sa.Column(
            "liveness_threshold",
            sa.Float(),
            nullable=False,
            server_default=sa.text("0.8"),
        ),
    )
    op.add_column(
        "organizations",
        sa.Column(
            "min_face_size",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("60"),
        ),
    )

    op.alter_column("organizations", "recognition_confidence", server_default=None)
    op.alter_column("organizations", "unknown_face_threshold", server_default=None)
    op.alter_column("organizations", "liveness_threshold", server_default=None)
    op.alter_column("organizations", "min_face_size", server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("organizations", "min_face_size")
    op.drop_column("organizations", "liveness_threshold")
    op.drop_column("organizations", "unknown_face_threshold")
    op.drop_column("organizations", "recognition_confidence")
