# from sqlalchemy import text
# from app.db.session import engine, Base
# # IMPORTANT: Import all models here so SQLAlchemy knows about them before creating tables
# import app.models.core
# import app.models.biometrics
# import app.models.attendance
# import app.models.streams
# import app.models.system

# def init_db():
#     with engine.connect() as conn:
#         conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
#         conn.commit()
#     Base.metadata.create_all(bind=engine)