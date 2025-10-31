from typing import List, Dict
from pathlib import Path


WORKSPACE_ROOT = Path.cwd() / "workspace"


def resolve_path(rel_path: str) -> Path:
    p = (WORKSPACE_ROOT / rel_path).resolve()
    if WORKSPACE_ROOT not in p.parents and p != WORKSPACE_ROOT:
        raise ValueError("path outside workspace")
    return p


def read_file(rel_path: str) -> str:
    p = resolve_path(rel_path)
    return p.read_text(encoding="utf-8")


def write_file(rel_path: str, content: str) -> None:
    p = resolve_path(rel_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")


def apply_diffs(diffs: List[Dict]) -> None:
    # Simple strategy: replace files per diff entries {path, content}
    for d in diffs:
        write_file(d["path"], d.get("content", ""))


