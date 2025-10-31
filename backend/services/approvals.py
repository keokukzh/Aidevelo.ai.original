from typing import List


DESTRUCTIVE_COMMANDS = {"rm", "mkfs", "dd", "shutdown", "reboot", "format"}


def requires_approval(command: str) -> bool:
    tokens = command.strip().split()
    return any(tok in DESTRUCTIVE_COMMANDS for tok in tokens)


def filter_commands(commands: List[str]) -> List[str]:
    return [c for c in commands if not requires_approval(c)]


