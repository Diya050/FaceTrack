"""add device_identifier column in cameras

Revision ID: 817236bc15e4
Revises: db5d1044c7ec
Create Date: 2026-03-11 19:03:20.941545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = '817236bc15e4'
down_revision: Union[str, Sequence[str], None] = 'db5d1044c7ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        "cameras",
        sa.Column("device_identifier", sa.String(), nullable=False)
    )

    op.create_unique_constraint(
        "uq_camera_device_identifier",
        "cameras",
        ["device_identifier"]
    )

    op.create_index(
        "ix_cameras_device_identifier",
        "cameras",
        ["device_identifier"]
    )


def downgrade() -> None:

    op.drop_index("ix_cameras_device_identifier", table_name="cameras")

    op.drop_constraint(
        "uq_camera_device_identifier",
        "cameras",
        type_="unique"
    )

    op.drop_column("cameras", "device_identifier")