from typing import Dict, Any, List
import asyncio
from ..services.llm_client import LLMClient


IMPLEMENTER_SYSTEM = (
    "You generate atomic file edits for a codebase. Output JSON array of diffs: "
    "[{path, content}] replacing file contents completely. Keep changes minimal."
)


def propose_edits(plan_out: Dict[str, Any]) -> List[Dict[str, Any]]:
    async def _run() -> List[Dict[str, Any]]:
        client = LLMClient()
        plan_text = str(plan_out)
        messages = [
            {"role": "system", "content": IMPLEMENTER_SYSTEM},
            {"role": "user", "content": plan_text},
        ]
        content = await client.chat("coding", messages, temperature=0.2, max_tokens=1024)
        try:
            import json
            diffs = json.loads(content)
            if isinstance(diffs, list):
                # sanitize minimal schema
                out = []
                for d in diffs:
                    if isinstance(d, dict) and "path" in d and "content" in d:
                        out.append({"path": d["path"], "content": d["content"]})
                return out
        except Exception:
            pass
        return []

    return asyncio.run(_run())


