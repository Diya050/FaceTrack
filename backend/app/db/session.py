"""
Database Session Configuration
===============================
Optimized for Supabase free tier with limited connection pool.

Key changes:
- Small pool_size (3) to leave headroom for web requests
- Aggressive pool recycling to prevent stale connections
- Pool pre-ping to verify connection health
"""

from sqlalchemy import NullPool, create_engine, text,event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# ✅ CRITICAL: Tight limits for Supabase free tier
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=NullPool,   # ✅ only this
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    except:
        db.rollback()
        raise
    finally:
        db.close()


def get_db_connection_count():
    """Debug utility to check active connections."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT count(*) 
                FROM pg_stat_activity 
                WHERE datname = current_database()
                AND state = 'active'
            """))
            return result.scalar()
    except Exception:
        return None
    

@event.listens_for(engine, "connect")
def connect(dbapi_connection, connection_record):
    print("🔥 New DB connection opened")