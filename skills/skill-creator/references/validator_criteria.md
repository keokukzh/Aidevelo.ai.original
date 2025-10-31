# Validator Criteria

The packager enforces the following rules before creating a zip:

## Required

- SKILL.md exists at the skill root.
- YAML frontmatter is present and valid YAML.
- Frontmatter includes:
  - `name`: non-empty string
  - `description`: non-empty, ≤120 words, third-person phrasing including “This skill should be used …”.

## Structure

- Optional directories may exist: `scripts/`, `references/`, `assets/`.
- Files in `references/` must be text-based (no binary formats, e.g., images, archives, fonts, media, PDFs).

## Packaging

- On success, produces `<skill-name>.zip` preserving the skill folder name at the root of the archive.

## Guidance

- Keep SKILL.md concise; move detailed docs to `references/`.
- Provide `--help` and non-interactive defaults in scripts.
- Prefer imperative/infinitive voice in SKILL.md.


