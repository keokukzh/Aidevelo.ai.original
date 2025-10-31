from typing import Dict, Any


def propose_fix(logs: str) -> Dict[str, Any]:
    return {"action": "retry", "hint": "No-op stub"}


