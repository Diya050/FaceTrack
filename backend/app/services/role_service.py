from sqlalchemy.orm import Session
from app.models.core import User, Role


def assign_role(db: Session, user_id, role_name):

    # find role
    role = db.query(Role).filter(Role.role_name == role_name).first()

    if not role:
        raise Exception("Role not found")

    # find user
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise Exception("User not found")

    # assign role
    user.role_id = role.role_id

    db.commit()
    db.refresh(user)

    return user