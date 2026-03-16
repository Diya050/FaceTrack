"""refactor attendance enums and models

Revision ID: 0187fffa9616
Revises: 233c5df36674
Create Date: 2026-03-16 13:01:11.444276

"""
from typing import Sequence, Union
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '0187fffa9616'
down_revision: Union[str, Sequence[str], None] = '233c5df36674'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.drop_constraint(
        op.f('uq_camera_device_identifier'),
        'cameras',
        type_='unique'
    )

    op.drop_index(
        op.f('ix_cameras_device_identifier'),
        table_name='cameras'
    )

    op.create_index(
        op.f('ix_cameras_device_identifier'),
        'cameras',
        ['device_identifier'],
        unique=True
    )

def downgrade() -> None:

    op.drop_index(
        op.f('ix_cameras_device_identifier'),
        table_name='cameras'
    )

    op.create_index(
        op.f('ix_cameras_device_identifier'),
        'cameras',
        ['device_identifier'],
        unique=False
    )

    op.create_unique_constraint(
        op.f('uq_camera_device_identifier'),
        'cameras',
        ['device_identifier']
    )