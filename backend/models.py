"""SQLAlchemy models for persistent run state."""

from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean, JSON, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Run(Base):
    """Main run entity representing a build execution."""
    __tablename__ = "runs"
    
    id = Column(String(36), primary_key=True)  # UUID
    prompt = Column(Text, nullable=False)
    settings_json = Column(JSON, nullable=True)
    status = Column(String(20), nullable=False, default="queued")
    current_node = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    canceled = Column(Boolean, default=False, nullable=False)
    request_id = Column(String(36), nullable=True)  # Optional client-provided idempotency key
    
    # Indices for common queries
    __table_args__ = (
        Index("idx_runs_status", "status"),
        Index("idx_runs_created_at", "created_at"),
        Index("idx_runs_request_id", "request_id"),
    )


class RunLog(Base):
    """Log entries for a run."""
    __tablename__ = "run_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(36), nullable=False)
    ts = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    level = Column(String(10), nullable=False, default="info")  # info, warn, error
    message = Column(Text, nullable=False)
    
    # Indices for efficient querying
    __table_args__ = (
        Index("idx_run_logs_run_id", "run_id"),
        Index("idx_run_logs_ts", "ts"),
    )


class RunDiff(Base):
    """File diffs for a run."""
    __tablename__ = "run_diffs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(36), nullable=False)
    idx = Column(Integer, nullable=False)  # Order of diff in the run
    content_json = Column(JSON, nullable=False)  # Diff content as JSON
    
    # Indices for efficient querying
    __table_args__ = (
        Index("idx_run_diffs_run_id", "run_id"),
        Index("idx_run_diffs_run_id_idx", "run_id", "idx"),
    )


class QueueItem(Base):
    """Queue items for async processing."""
    __tablename__ = "queue_items"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(36), nullable=False, unique=True)
    enqueued_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    picked_at = Column(DateTime(timezone=True), nullable=True)
    done_at = Column(DateTime(timezone=True), nullable=True)
    
    # Indices for queue processing
    __table_args__ = (
        Index("idx_queue_enqueued_at", "enqueued_at"),
        Index("idx_queue_picked_at", "picked_at"),
    )


# Status constants for type safety
class RunStatus:
    QUEUED = "queued"
    RUNNING = "running"
    NEEDS_APPROVAL = "needs_approval"
    APPROVED = "approved"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELED = "canceled"


class LogLevel:
    INFO = "info"
    WARN = "warn"
    ERROR = "error"
