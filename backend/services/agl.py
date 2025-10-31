from __future__ import annotations

import os
from typing import Any, Dict, Optional


AGL_ENABLED = os.getenv("AGL_EMIT", "false").lower() == "true"

try:  # optional dependency guard
    import agentlightning as agl  # type: ignore
except Exception:  # pragma: no cover - gracefully degrade
    agl = None  # type: ignore


def _enabled() -> bool:
    return AGL_ENABLED and agl is not None


def emit_episode_start(episode_id: str, meta: Optional[Dict[str, Any]] = None) -> None:
    if not _enabled():
        return
    try:
        agl.emit_episode_start(episode_id, meta or {})
    except Exception:
        pass


def emit_episode_end(episode_id: str, reward: Optional[float] = None, meta: Optional[Dict[str, Any]] = None) -> None:
    if not _enabled():
        return
    try:
        agl.emit_episode_end(episode_id, reward, meta or {})
    except Exception:
        pass


def emit_prompt(model: str, messages: Any, tools: Optional[Any] = None, meta: Optional[Dict[str, Any]] = None) -> None:
    if not _enabled():
        return
    try:
        agl.emit_prompt(model=model, messages=messages, tools=tools, meta=meta or {})
    except Exception:
        pass


def emit_completion(model: str, output: Any, tokens: Optional[int] = None, latency_ms: Optional[float] = None, meta: Optional[Dict[str, Any]] = None) -> None:
    if not _enabled():
        return
    try:
        agl.emit_completion(model=model, output=output, tokens=tokens, latency=latency_ms, meta=meta or {})
    except Exception:
        pass


def emit_tool_call(name: str, input_obj: Any, output_obj: Any, success: bool, meta: Optional[Dict[str, Any]] = None) -> None:
    if not _enabled():
        return
    try:
        agl.emit_tool_call(name=name, input=input_obj, output=output_obj, success=success, meta=meta or {})
    except Exception:
        pass


def emit_reward(episode_id: str, score: float, reasons: Optional[str] = None, meta: Optional[Dict[str, Any]] = None) -> None:
    if not _enabled():
        return
    try:
        agl.emit_reward(episode_id, score, reasons=reasons, meta=meta or {})
    except Exception:
        pass


