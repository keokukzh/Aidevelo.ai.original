import subprocess
from pathlib import Path
from typing import Optional


def git(cmd: str, cwd: Optional[str] = None) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)


def init_repo(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    git("git init", cwd=str(path))
    git("git config user.email example@example.com", cwd=str(path))
    git("git config user.name local-ai-builder", cwd=str(path))


def commit_all(path: Path, message: str) -> None:
    git("git add -A", cwd=str(path))
    git(f"git commit -m \"{message}\"", cwd=str(path))


def get_diff(path: Path) -> str:
    p = git("git diff --staged", cwd=str(path))
    return p.stdout


