"""Status transition utilities and validation for run state management."""

from typing import Set, Optional, Dict, Any
from datetime import datetime

from ..models import RunStatus, Run


class InvalidStatusTransition(Exception):
    """Raised when attempting an invalid status transition."""
    pass


class StatusTransitionValidator:
    """Validates and manages run status transitions."""
    
    # Valid transitions: from_status -> {to_status1, to_status2, ...}
    VALID_TRANSITIONS: Dict[str, Set[str]] = {
        RunStatus.QUEUED: {RunStatus.RUNNING, RunStatus.CANCELED, RunStatus.FAILED},
        RunStatus.RUNNING: {RunStatus.NEEDS_APPROVAL, RunStatus.COMPLETED, RunStatus.FAILED, RunStatus.CANCELED},
        RunStatus.NEEDS_APPROVAL: {RunStatus.APPROVED, RunStatus.CANCELED, RunStatus.FAILED},
        RunStatus.APPROVED: {RunStatus.RUNNING, RunStatus.COMPLETED, RunStatus.FAILED, RunStatus.CANCELED},
        RunStatus.COMPLETED: set(),  # Terminal state
        RunStatus.FAILED: set(),     # Terminal state
        RunStatus.CANCELED: set(),   # Terminal state
    }
    
    @classmethod
    def can_transition(cls, from_status: str, to_status: str) -> bool:
        """Check if a status transition is valid."""
        if from_status not in cls.VALID_TRANSITIONS:
            return False
        return to_status in cls.VALID_TRANSITIONS[from_status]
    
    @classmethod
    def validate_transition(cls, from_status: str, to_status: str) -> None:
        """Validate a status transition, raising exception if invalid."""
        if not cls.can_transition(from_status, to_status):
            raise InvalidStatusTransition(
                f"Invalid transition from '{from_status}' to '{to_status}'. "
                f"Valid transitions from '{from_status}': {cls.VALID_TRANSITIONS.get(from_status, set())}"
            )
    
    @classmethod
    def get_valid_transitions(cls, from_status: str) -> Set[str]:
        """Get all valid transitions from a given status."""
        return cls.VALID_TRANSITIONS.get(from_status, set())
    
    @classmethod
    def is_terminal_status(cls, status: str) -> bool:
        """Check if a status is terminal (no further transitions allowed)."""
        return status in {RunStatus.COMPLETED, RunStatus.FAILED, RunStatus.CANCELED}
    
    @classmethod
    def is_active_status(cls, status: str) -> bool:
        """Check if a status represents an active (non-terminal) state."""
        return status in {RunStatus.QUEUED, RunStatus.RUNNING, RunStatus.NEEDS_APPROVAL, RunStatus.APPROVED}


class RunStateManager:
    """Manages run state transitions and validation."""
    
    def __init__(self, db_session):
        self.db = db_session
    
    def transition_status(self, run_id: str, new_status: str, 
                         current_node: Optional[str] = None,
                         canceled: Optional[bool] = None) -> bool:
        """
        Transition a run to a new status with validation.
        
        Args:
            run_id: The run ID
            new_status: Target status
            current_node: Optional new current node
            canceled: Optional canceled flag
            
        Returns:
            True if transition was successful, False if run not found
            
        Raises:
            InvalidStatusTransition: If transition is not valid
        """
        run = self.db.query(Run).filter(Run.id == run_id).first()
        if not run:
            return False
        
        # Validate transition
        self.validate_transition(run.status, new_status)
        
        # Update run
        run.status = new_status
        run.updated_at = datetime.utcnow()
        
        if current_node is not None:
            run.current_node = current_node
        
        if canceled is not None:
            run.canceled = canceled
        
        self.db.commit()
        return True
    
    def validate_transition(self, from_status: str, to_status: str) -> None:
        """Validate a status transition."""
        StatusTransitionValidator.validate_transition(from_status, to_status)
    
    def can_cancel(self, run_id: str) -> bool:
        """Check if a run can be canceled."""
        run = self.db.query(Run).filter(Run.id == run_id).first()
        if not run:
            return False
        
        return run.status in {RunStatus.QUEUED, RunStatus.RUNNING}
    
    def can_approve(self, run_id: str) -> bool:
        """Check if a run can be approved."""
        run = self.db.query(Run).filter(Run.id == run_id).first()
        if not run:
            return False
        
        return run.status == RunStatus.NEEDS_APPROVAL
    
    def get_run_status(self, run_id: str) -> Optional[str]:
        """Get current status of a run."""
        run = self.db.query(Run).filter(Run.id == run_id).first()
        return run.status if run else None


def create_run_state_manager(db_session):
    """Factory function to create a RunStateManager."""
    return RunStateManager(db_session)
