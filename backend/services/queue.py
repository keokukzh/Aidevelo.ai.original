"""Async queue worker for processing build runs."""

import asyncio
import logging
import signal
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from ..models import Run, RunLog, QueueItem, RunStatus, LogLevel
from ..services.db import get_db, SessionLocal
from ..services.state import RunStateManager, create_run_state_manager
from ..agents.graph import execute_build

logger = logging.getLogger(__name__)


class QueueWorker:
    """Single-consumer async queue worker with backpressure and graceful shutdown."""
    
    def __init__(self, max_concurrent: int = 2, poll_interval: float = 1.0):
        self.max_concurrent = max_concurrent
        self.poll_interval = poll_interval
        self.running_tasks: Dict[str, asyncio.Task] = {}
        self.shutdown_event = asyncio.Event()
        self.worker_task: Optional[asyncio.Task] = None
        self._setup_signal_handlers()
    
    def _setup_signal_handlers(self):
        """Setup signal handlers for graceful shutdown."""
        def signal_handler(signum, frame):
            logger.info(f"Received signal {signum}, initiating graceful shutdown...")
            self.shutdown_event.set()
        
        signal.signal(signal.SIGTERM, signal_handler)
        signal.signal(signal.SIGINT, signal_handler)
    
    async def start(self):
        """Start the queue worker."""
        logger.info("Starting queue worker...")
        self.worker_task = asyncio.create_task(self._worker_loop())
        await self.worker_task
    
    async def stop(self):
        """Stop the queue worker gracefully."""
        logger.info("Stopping queue worker...")
        self.shutdown_event.set()
        
        if self.worker_task:
            await self.worker_task
        
        # Wait for running tasks to complete (with timeout)
        if self.running_tasks:
            logger.info(f"Waiting for {len(self.running_tasks)} running tasks to complete...")
            try:
                await asyncio.wait_for(
                    asyncio.gather(*self.running_tasks.values(), return_exceptions=True),
                    timeout=30.0
                )
            except asyncio.TimeoutError:
                logger.warning("Timeout waiting for running tasks, canceling...")
                for task in self.running_tasks.values():
                    task.cancel()
        
        logger.info("Queue worker stopped")
    
    async def _worker_loop(self):
        """Main worker loop that processes queued runs."""
        logger.info("Queue worker loop started")
        
        while not self.shutdown_event.is_set():
            try:
                # Check if we can process more runs
                if len(self.running_tasks) >= self.max_concurrent:
                    await asyncio.sleep(self.poll_interval)
                    continue
                
                # Get next queued run
                run_id = await self._get_next_queued_run()
                if not run_id:
                    await asyncio.sleep(self.poll_interval)
                    continue
                
                # Start processing the run
                task = asyncio.create_task(self._process_run(run_id))
                self.running_tasks[run_id] = task
                
                # Clean up completed tasks
                await self._cleanup_completed_tasks()
                
            except Exception as e:
                logger.error(f"Error in worker loop: {e}", exc_info=True)
                await asyncio.sleep(self.poll_interval)
        
        logger.info("Queue worker loop stopped")
    
    async def _get_next_queued_run(self) -> Optional[str]:
        """Get the next queued run from the database."""
        with SessionLocal() as db:
            # Find oldest queued run that hasn't been picked up
            queue_item = db.query(QueueItem).filter(
                and_(
                    QueueItem.picked_at.is_(None),
                    QueueItem.done_at.is_(None)
                )
            ).order_by(QueueItem.enqueued_at.asc()).first()
            
            if not queue_item:
                return None
            
            # Mark as picked up
            queue_item.picked_at = datetime.utcnow()
            db.commit()
            
            return queue_item.run_id
    
    async def _process_run(self, run_id: str):
        """Process a single run asynchronously."""
        logger.info(f"Processing run {run_id}")
        
        try:
            with SessionLocal() as db:
                state_manager = create_run_state_manager(db)
                
                # Transition to running
                if not state_manager.transition_status(run_id, RunStatus.RUNNING):
                    logger.warning(f"Could not transition run {run_id} to running")
                    return
                
                # Add log entry
                self._add_log(db, run_id, LogLevel.INFO, f"Started processing run {run_id}")
            
            # Execute the build (this is the main work)
            result = await self._execute_build_async(run_id)
            
            # Update final status
            with SessionLocal() as db:
                state_manager = create_run_state_manager(db)
                
                if result.get("status") == "ok":
                    state_manager.transition_status(run_id, RunStatus.COMPLETED)
                    self._add_log(db, run_id, LogLevel.INFO, "Build completed successfully")
                else:
                    state_manager.transition_status(run_id, RunStatus.FAILED)
                    self._add_log(db, run_id, LogLevel.ERROR, f"Build failed: {result.get('error', 'Unknown error')}")
                
                # Store diffs if any
                if result.get("diffs"):
                    self._store_diffs(db, run_id, result["diffs"])
                
                # Mark queue item as done
                self._mark_queue_done(db, run_id)
        
        except Exception as e:
            logger.error(f"Error processing run {run_id}: {e}", exc_info=True)
            
            # Mark as failed
            with SessionLocal() as db:
                state_manager = create_run_state_manager(db)
                state_manager.transition_status(run_id, RunStatus.FAILED)
                self._add_log(db, run_id, LogLevel.ERROR, f"Build failed with exception: {str(e)}")
                self._mark_queue_done(db, run_id)
        
        finally:
            # Remove from running tasks
            self.running_tasks.pop(run_id, None)
    
    async def _execute_build_async(self, run_id: str) -> Dict[str, Any]:
        """Execute the build in an async context."""
        # For now, run the synchronous execute_build in a thread pool
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._execute_build_sync, run_id)
    
    def _execute_build_sync(self, run_id: str) -> Dict[str, Any]:
        """Execute the build synchronously (to be run in thread pool)."""
        with SessionLocal() as db:
            run = db.query(Run).filter(Run.id == run_id).first()
            if not run:
                return {"status": "error", "error": "Run not found"}
            
            # Check if canceled
            if run.canceled:
                return {"status": "canceled", "error": "Run was canceled"}
            
            try:
                # Execute the build pipeline
                result = execute_build(run.prompt)
                return result
            except Exception as e:
                return {"status": "error", "error": str(e)}
    
    def _add_log(self, db: Session, run_id: str, level: str, message: str):
        """Add a log entry to the database."""
        log_entry = RunLog(
            run_id=run_id,
            level=level,
            message=message
        )
        db.add(log_entry)
        db.commit()
    
    def _store_diffs(self, db: Session, run_id: str, diffs: list):
        """Store diffs in the database."""
        for idx, diff in enumerate(diffs):
            diff_entry = RunDiff(
                run_id=run_id,
                idx=idx,
                content_json=diff
            )
            db.add(diff_entry)
        db.commit()
    
    def _mark_queue_done(self, db: Session, run_id: str):
        """Mark a queue item as done."""
        queue_item = db.query(QueueItem).filter(QueueItem.run_id == run_id).first()
        if queue_item:
            queue_item.done_at = datetime.utcnow()
            db.commit()
    
    async def _cleanup_completed_tasks(self):
        """Clean up completed tasks from running_tasks."""
        completed_tasks = []
        for run_id, task in self.running_tasks.items():
            if task.done():
                completed_tasks.append(run_id)
        
        for run_id in completed_tasks:
            self.running_tasks.pop(run_id, None)


class QueueManager:
    """Manages the queue and provides enqueue functionality."""
    
    def __init__(self):
        self.worker: Optional[QueueWorker] = None
    
    async def start_worker(self, max_concurrent: int = 2):
        """Start the queue worker."""
        if self.worker:
            return
        
        self.worker = QueueWorker(max_concurrent=max_concurrent)
        asyncio.create_task(self.worker.start())
    
    async def stop_worker(self):
        """Stop the queue worker."""
        if self.worker:
            await self.worker.stop()
            self.worker = None
    
    def enqueue_run(self, run_id: str) -> bool:
        """Enqueue a run for processing."""
        with SessionLocal() as db:
            # Check if already queued
            existing = db.query(QueueItem).filter(QueueItem.run_id == run_id).first()
            if existing:
                return False
            
            # Create queue item
            queue_item = QueueItem(run_id=run_id)
            db.add(queue_item)
            db.commit()
            
            logger.info(f"Enqueued run {run_id}")
            return True
    
    def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status."""
        with SessionLocal() as db:
            total_queued = db.query(QueueItem).filter(
                and_(
                    QueueItem.picked_at.is_(None),
                    QueueItem.done_at.is_(None)
                )
            ).count()
            
            total_processing = db.query(QueueItem).filter(
                and_(
                    QueueItem.picked_at.isnot(None),
                    QueueItem.done_at.is_(None)
                )
            ).count()
            
            total_done = db.query(QueueItem).filter(
                QueueItem.done_at.isnot(None)
            ).count()
            
            return {
                "queued": total_queued,
                "processing": total_processing,
                "done": total_done,
                "worker_running": self.worker is not None
            }


# Global queue manager instance
queue_manager = QueueManager()
