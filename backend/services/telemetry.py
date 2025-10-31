import json
import os
from pathlib import Path
from typing import Dict, Any


def runs_dir() -> Path:
    root = Path.cwd() / "workspace" / ".ai_builder" / "runs"
    root.mkdir(parents=True, exist_ok=True)
    return root


def write_run_report(run_id: str, data: Dict[str, Any]) -> None:
    path = runs_dir() / f"{run_id}.json"
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def log_event(event: str, fields: Dict[str, Any]) -> None:
    record = {"event": event, **fields}
    print(json.dumps(record, ensure_ascii=False))


