"""Database engine and session utilities for SQLite persistence."""

import logging
import os
from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

from ..models import Base

logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/app.db")

# Ensure data directory exists
os.makedirs(os.path.dirname(DATABASE_URL.replace("sqlite:///", "")), exist_ok=True)

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DB_ECHO", "false").lower() == "true",
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables() -> None:
    """Create all tables if they don't exist."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_health() -> bool:
    """Check if database is accessible and writable."""
    try:
        with engine.begin() as conn:
            # Test read
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
            
            # Test write (create a temporary table)
            conn.execute(text("CREATE TEMPORARY TABLE health_check (id INTEGER)"))
            conn.execute(text("INSERT INTO health_check VALUES (1)"))
            conn.execute(text("SELECT id FROM health_check"))
            conn.execute(text("DROP TABLE health_check"))
            
            # Transaction commits automatically when exiting 'with' block
            return True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}", exc_info=True)
        return False


def init_db() -> None:
    """Initialize database with tables."""
    create_tables()
    print(f"Database initialized at {DATABASE_URL}")
