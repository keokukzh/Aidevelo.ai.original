#!/usr/bin/env python3
"""
Skill Packager and Validator

Usage:
  scripts/package_skill.py <path/to/skill-folder> [output_dir]

Validates a skill folder (structure, frontmatter, description quality) and
creates a distributable zip in output_dir (default: ./dist).
Non-interactive by default; exits with non-zero on validation errors.
"""

import argparse
import re
import sys
from pathlib import Path
import zipfile

try:
    import yaml
except Exception as exc:  # pragma: no cover
    print("Error: pyyaml is required. Install with: pip install pyyaml", file=sys.stderr)
    raise


def parse_frontmatter(text: str):
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not match:
        return None, text
    meta = yaml.safe_load(match.group(1)) or {}
    body = match.group(2)
    return meta, body


def is_binary_reference(path: Path) -> bool:
    binary_exts = {
        ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".tiff",
        ".pdf", ".zip", ".tar", ".gz", ".7z", ".mp3", ".mp4", ".mov",
        ".woff", ".woff2", ".ttf", ".otf",
    }
    return path.suffix.lower() in binary_exts


def validate(skill_dir: Path) -> None:
    if not skill_dir.exists() or not skill_dir.is_dir():
        raise ValueError(f"Skill directory not found: {skill_dir}")

    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        raise ValueError("SKILL.md is required but missing")

    meta, _ = parse_frontmatter(skill_md.read_text(encoding="utf-8"))
    if not isinstance(meta, dict):
        raise ValueError("YAML frontmatter not found or malformed in SKILL.md")

    name = (meta.get("name") or "").strip()
    desc = (meta.get("description") or "").strip()
    if not name:
        raise ValueError("Frontmatter: 'name' is required and must be non-empty")
    if not desc:
        raise ValueError("Frontmatter: 'description' is required and must be non-empty")

    # Description quality checks
    if len(desc.split()) > 120:
        raise ValueError("Description should be concise (≤120 words)")
    if "this skill should be used" not in desc.lower():
        raise ValueError("Description should use third-person and include 'This skill should be used …'")

    # Optional directories
    refs = skill_dir / "references"
    if refs.exists():
        for p in refs.rglob("*"):
            if p.is_file() and is_binary_reference(p):
                raise ValueError(f"Binary file not allowed in references/: {p}")

    # scripts and assets are optional; no strict checks beyond existence


def package(skill_dir: Path, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    zip_path = out_dir / f"{skill_dir.name}.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in skill_dir.rglob("*"):
            if path.is_file():
                # Store paths relative to the skill_dir's parent to preserve folder name
                arcname = path.relative_to(skill_dir.parent)
                zf.write(path, arcname)
    return zip_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate and package a skill directory.")
    parser.add_argument("skill_path", metavar="<path/to/skill-folder>", help="Path to the skill folder to package")
    parser.add_argument("output_dir", nargs="?", default="./dist", help="Output directory for the zip (default: ./dist)")
    args = parser.parse_args()

    skill_dir = Path(args.skill_path).expanduser().resolve()
    out_dir = Path(args.output_dir).expanduser().resolve()

    try:
        validate(skill_dir)
    except Exception as exc:
        print(f"Validation failed: {exc}", file=sys.stderr)
        sys.exit(1)

    try:
        zip_path = package(skill_dir, out_dir)
    except Exception as exc:
        print(f"Packaging failed: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"Packaged: {zip_path}")


if __name__ == "__main__":
    main()


