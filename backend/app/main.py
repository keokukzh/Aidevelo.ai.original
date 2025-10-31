"""FastAPI application with persistent database and async queue processing."""

import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any

import httpx
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..models import Run, RunLog, RunDiff, RunStatus, LogLevel
from ..services.db import get_db, init_db, check_db_health
from ..services.queue import queue_manager
from ..services.state import create_run_state_manager
from ..services.telemetry import write_run_report, log_event

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BuildRequest(BaseModel):
    prompt: str
    settings: Optional[Dict[str, Any]] = None
    request_id: Optional[str] = None  # Optional idempotency key


class ApproveRequest(BaseModel):
    step_id: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown."""
    # Startup
    logger.info("Starting application...")
    
    # Initialize database
    init_db()
    logger.info("Database initialized")
    
    # Start queue worker
    await queue_manager.start_worker(max_concurrent=2)
    logger.info("Queue worker started")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await queue_manager.stop_worker()
    logger.info("Application shutdown complete")


app = FastAPI(
    title="Local Replit-like Builder", 
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration: restrict by env, default to local Next.js UI (port 3000)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/health")
def health() -> Dict[str, Any]:
    """Basic health check including database connectivity."""
    db_healthy = check_db_health()
    queue_status = queue_manager.get_queue_status()
    
    return {
        "status": "ok" if db_healthy else "degraded",
        "database": "ok" if db_healthy else "error",
        "queue": queue_status
    }


@app.get("/health/full")
async def health_full() -> Dict[str, Any]:
    """Full health check including model hosts."""
    hosts = get_model_hosts()
    out: Dict[str, Any] = {
        "status": "ok", 
        "models": {},
        "database": "ok" if check_db_health() else "error"
    }
    
    async with httpx.AsyncClient(timeout=5) as client:
        # vLLM health
        try:
            r = await client.get(f"{hosts['vllm']}/health")
            out["models"]["vllm"] = (r.status_code == 200)
        except Exception:
            out["models"]["vllm"] = False
        # Ollama health
        try:
            r = await client.get(f"{hosts['ollama']}/api/tags")
            out["models"]["ollama"] = (r.status_code == 200)
        except Exception:
            out["models"]["ollama"] = False
    
    if not all(out["models"].values()) or not check_db_health():
        out["status"] = "degraded"
    
    return out


@app.post("/build")
def build(req: BuildRequest, db: Session = Depends(get_db)) -> Dict[str, str]:
    """Create a new build run and enqueue it for processing."""
    # Check for idempotency
    if req.request_id:
        existing_run = db.query(Run).filter(Run.request_id == req.request_id).first()
        if existing_run:
            return {"run_id": existing_run.id}
    
    # Create new run
    run_id = str(uuid.uuid4())
    run = Run(
        id=run_id,
        prompt=req.prompt,
        settings_json=req.settings or {},
        status=RunStatus.QUEUED,
        current_node="planner",
        request_id=req.request_id
    )
    
    db.add(run)
    db.commit()
    
    # Add initial log
    log_entry = RunLog(
        run_id=run_id,
        level=LogLevel.INFO,
        message=f"Created run {run_id} with prompt: {req.prompt[:100]}..."
    )
    db.add(log_entry)
    db.commit()
    
    # Enqueue for processing
    if queue_manager.enqueue_run(run_id):
        logger.info(f"Enqueued run {run_id}")
    else:
        logger.warning(f"Failed to enqueue run {run_id}")
    
    return {"run_id": run_id}


@app.post("/e2e")
def e2e(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """End-to-end test endpoint."""
    test_prompt = "Create a README.md with a one-line description."
    
    # Create test run
    run_id = str(uuid.uuid4())
    run = Run(
        id=run_id,
        prompt=test_prompt,
        settings_json={},
        status=RunStatus.QUEUED,
        current_node="planner"
    )
    
    db.add(run)
    db.commit()
    
    # Enqueue for processing
    queue_manager.enqueue_run(run_id)
    
    return {"run_id": run_id, "status": RunStatus.QUEUED}


@app.get("/runs/{run_id}")
def get_run(run_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get run status and logs."""
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="run not found")
    
    # Get recent logs (last 50)
    logs = db.query(RunLog).filter(
        RunLog.run_id == run_id
    ).order_by(RunLog.ts.desc()).limit(50).all()
    
    log_messages = [log.message for log in reversed(logs)]
    
    return {
        "run_id": run_id,
        "status": run.status,
        "current_node": run.current_node,
        "logs": log_messages,
        "created_at": run.created_at.isoformat(),
        "updated_at": run.updated_at.isoformat(),
        "canceled": run.canceled
    }


@app.get("/runs/{run_id}/diffs")
def get_diffs(run_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get run diffs."""
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="run not found")
    
    diffs = db.query(RunDiff).filter(
        RunDiff.run_id == run_id
    ).order_by(RunDiff.idx).all()
    
    diff_contents = [diff.content_json for diff in diffs]
    
    return {"run_id": run_id, "diffs": diff_contents}


@app.post("/runs/{run_id}/approve")
def approve(run_id: str, req: ApproveRequest, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Approve a run step."""
    state_manager = create_run_state_manager(db)
    
    if not state_manager.can_approve(run_id):
        raise HTTPException(
            status_code=400, 
            detail="Run cannot be approved in current state"
        )
    
    # Transition to approved
    if state_manager.transition_status(run_id, RunStatus.APPROVED):
        # Add log entry
        log_entry = RunLog(
            run_id=run_id,
            level=LogLevel.INFO,
            message=f"Approved step {req.step_id}"
        )
        db.add(log_entry)
        db.commit()
        
        return {"ok": True}
    else:
        raise HTTPException(status_code=404, detail="run not found")


@app.post("/runs/{run_id}/cancel")
def cancel(run_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Cancel a run."""
    state_manager = create_run_state_manager(db)
    
    if not state_manager.can_cancel(run_id):
        raise HTTPException(
            status_code=400, 
            detail="Run cannot be canceled in current state"
        )
    
    # Mark as canceled
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="run not found")
    
    run.canceled = True
    if state_manager.transition_status(run_id, RunStatus.CANCELED):
        # Add log entry
        log_entry = RunLog(
            run_id=run_id,
            level=LogLevel.INFO,
            message="Run canceled by user"
        )
        db.add(log_entry)
        db.commit()
        
        return {"ok": True}
    else:
        raise HTTPException(status_code=500, detail="Failed to cancel run")


@app.get("/metrics")
def metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Basic metrics endpoint."""
    # Count runs by status
    status_counts = {}
    for status in [RunStatus.QUEUED, RunStatus.RUNNING, RunStatus.COMPLETED, 
                   RunStatus.FAILED, RunStatus.CANCELED]:
        count = db.query(Run).filter(Run.status == status).count()
        status_counts[status] = count
    
    # Queue status
    queue_status = queue_manager.get_queue_status()
    
    return {
        "runs_by_status": status_counts,
        "queue": queue_status,
        "total_runs": sum(status_counts.values())
    }


def get_model_hosts() -> Dict[str, str]:
    """Get model host URLs from environment."""
    return {
        "vllm": os.getenv("MODEL_HOST_VLLM", "http://localhost:8000"),
        "ollama": os.getenv("MODEL_HOST_OLLAMA", "http://localhost:11434"),
    }


@app.get("/config/models")
def model_config() -> Dict[str, Any]:
    """Get model configuration."""
    return {
        "hosts": get_model_hosts(),
        "reasoning_model": os.getenv("REASONING_MODEL", ""),
        "coding_model": os.getenv("CODING_MODEL", ""),
    }


# Serve static UI (ui/) at root
try:
    app.mount("/", StaticFiles(directory=os.path.abspath(os.path.join(os.path.dirname(__file__), "../../ui")), html=True), name="ui")
except Exception:
    # During dev if path not found, skip
    pass