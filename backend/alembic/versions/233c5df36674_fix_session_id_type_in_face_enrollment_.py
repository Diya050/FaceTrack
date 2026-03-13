"""fix session_id type in face_enrollment_images

Revision ID: 233c5df36674
Revises: 817236bc15e4
Create Date: 2026-03-13 22:02:37.716610

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = '233c5df36674'
down_revision: Union[str, Sequence[str], None] = '817236bc15e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "face_enrollment_images",
        "session_id",
        existing_type=sa.Integer(),
        type_=sa.UUID(),
        postgresql_using="session_id::uuid",
        nullable=False
    )


def downgrade():
    op.alter_column(
        "face_enrollment_images",
        "session_id",
        existing_type=sa.UUID(),
        type_=sa.Integer(),
        postgresql_using="session_id::integer"
    )
