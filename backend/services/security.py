from pathlib import Path


WORKSPACE_ROOT = Path.cwd() / "workspace"
ALLOWED_PREFIXES = [WORKSPACE_ROOT]


def is_allowed_path(p: Path) -> bool:
    p = p.resolve()
    return any(prefix == p or prefix in p.parents for prefix in ALLOWED_PREFIXES)


