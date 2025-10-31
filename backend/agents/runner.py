from typing import List, Tuple
from ..services import agl


def run_commands(commands: List[str]) -> Tuple[int, str, str]:
    # Stub: pretend success
    agl.emit_tool_call("run_commands", {"commands": commands}, {"rc": 0}, success=True)
    return 0, "ok", ""


