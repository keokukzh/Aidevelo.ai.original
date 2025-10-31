from typing import Dict, Any
import asyncio
from ..services.llm_client import LLMClient


PLANNER_SYSTEM = (
    "You are a senior software planner. Break the prompt into atomic, ordered tasks, "
    "with acceptance criteria that are testable. Output concise JSON with {tasks, acceptance}."
)


def plan(prompt: str) -> Dict[str, Any]:
    async def _run() -> Dict[str, Any]:
        client = LLMClient()
        messages = [
            {"role": "system", "content": PLANNER_SYSTEM},
            {"role": "user", "content": prompt},
        ]
        content = await client.chat("reasoning", messages, temperature=0.1, max_tokens=1024)
        # Very lenient parse; if parse fails, return a minimal plan
        try:
            import json
            data = json.loads(content)
            if isinstance(data, dict) and "tasks" in data and "acceptance" in data:
                return data
        except Exception:
            pass
        return {
            "tasks": [
                {"id": "t1", "title": "Analyze prompt", "done": True},
                {"id": "t2", "title": "Propose edits", "done": False},
            ],
            "acceptance": ["Build succeeds", "Basic tests pass"],
        }

    return asyncio.run(_run())


