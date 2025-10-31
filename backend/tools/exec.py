import subprocess
import shlex
from typing import List, Tuple, Optional


DEFAULT_ENV_BLOCKLIST = {"AWS_SECRET_ACCESS_KEY", "GOOGLE_APPLICATION_CREDENTIALS"}


def run_non_interactive(commands: List[str], cwd: Optional[str] = None, timeout: int = 900) -> Tuple[int, str, str]:
    """Run a sequence of commands safely without invoking a shell.

    Each command is split with shlex.split and executed as a separate subprocess.
    Execution stops on first non-zero return code. Stdout/stderr are accumulated.
    """

    combined_out: List[str] = []
    combined_err: List[str] = []

    for command in commands:
        cmd = command.strip()
        if not cmd:
            continue
        args = shlex.split(cmd)
        try:
            result = subprocess.run(
                args,
                cwd=cwd,
                check=False,
                capture_output=True,
                text=True,
                timeout=timeout,
            )
        except subprocess.TimeoutExpired:
            combined_err.append("timeout")
            return 124, "".join(combined_out), "\n".join(combined_err)

        if result.stdout:
            combined_out.append(result.stdout)
        if result.stderr:
            combined_err.append(result.stderr)

        if result.returncode != 0:
            return result.returncode, "".join(combined_out), "\n".join(combined_err)

    return 0, "".join(combined_out), "\n".join(combined_err)


