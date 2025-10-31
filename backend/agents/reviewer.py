from typing import List, Dict, Any
from ..services import agl


def review(diffs: List[Dict[str, Any]]) -> Dict[str, Any]:
    approved = True
    notes: List[str] = []
    agl.emit_tool_call("review", {"diffs": len(diffs)}, {"approved": approved}, success=True)
    return {"approved": approved, "notes": notes}


