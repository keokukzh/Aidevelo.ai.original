#!/usr/bin/env python3
"""
Skill Initializer

Usage:
  scripts/init_skill.py <skill-name> --path <output-directory>

Creates a new skill directory with required structure and a SKILL.md template.
Non-interactive by default; exits with non-zero on errors.
"""

import argparse
import os
from pathlib import Path
import sys
from textwrap import dedent


SKILL_MD_TEMPLATE = """---
name: {name}
description: TODO: One- to two-sentence third-person description. Start with "This skill should be used when ..."
license: TODO: Reference or include license text
---

## Purpose

State the high-level goal in 2–4 sentences.

## When to Use

List the triggers/conditions for when this skill should be used.

## How to Use

1. Outline key steps to accomplish tasks.
2. Reference scripts in `scripts/` for deterministic operations.
3. Keep detailed docs in `references/`.
4. Use `assets/` to ship templates or files used in outputs.

### Initialize

```bash
scripts/init_skill.py <skill-name> --path <output-dir>
```

### Validate and Package

```bash
scripts/package_skill.py <path/to/skill-folder> [./dist]
```
"""


def create_file(path: Path, content: str = "") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(content, encoding="utf-8")


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def init_skill(skill_name: str, output_dir: Path) -> Path:
    skill_dir = output_dir / skill_name
    if skill_dir.exists() and any(skill_dir.iterdir()):
        print(f"Error: Target directory already exists and is not empty: {skill_dir}", file=sys.stderr)
        sys.exit(1)

    # Create structure
    ensure_dir(skill_dir)
    ensure_dir(skill_dir / "scripts")
    ensure_dir(skill_dir / "references")
    ensure_dir(skill_dir / "assets")

    # Placeholders
    create_file(skill_dir / "assets/.keep")
    create_file(skill_dir / "references/.keep")
    create_file(skill_dir / "scripts/.keep")

    # SKILL.md
    create_file(skill_dir / "SKILL.md", SKILL_MD_TEMPLATE.format(name=skill_name))

    print(f"Initialized skill at: {skill_dir}")
    return skill_dir


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize a new skill folder.")
    parser.add_argument("skill_name", metavar="<skill-name>", help="Name of the new skill directory")
    parser.add_argument("--path", dest="output_path", required=True, help="Output directory in which to create the skill")
    args = parser.parse_args()

    output_dir = Path(args.output_path).expanduser().resolve()
    if not output_dir.exists():
        try:
            output_dir.mkdir(parents=True, exist_ok=True)
        except Exception as exc:
            print(f"Error: Unable to create output directory: {exc}", file=sys.stderr)
            sys.exit(1)

    try:
        init_skill(args.skill_name, output_dir)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()


