---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill or update an existing skill that extends Claude with specialized knowledge, workflows, or tool integrations.
license: See LICENSE.txt
---

## Purpose

Provide clear, imperative guidance to design, initialize, validate, and package modular skills that extend Claude. Emphasize progressive disclosure, reusable resources, and high-quality metadata.

## When to Use

Use when a user requests to create or improve a skill that bundles specialized workflows, tools, domain knowledge, or assets. Trigger when queries mention new skills, packaging skills, initialization, validation, or distribution.

## How to Use

1. Understand concrete usage examples and confirm scope.
2. Plan reusable resources: scripts, references, assets.
3. Initialize a new skill directory using the initializer.
4. Edit SKILL.md in imperative style; keep references in separate files.
5. Validate and package into a distributable zip.

### Initialize a New Skill

Run the initializer to scaffold a skill directory with required structure and a SKILL.md template.

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

Outputs:
- <output-directory>/<skill-name>/
  - SKILL.md (with YAML frontmatter placeholders)
  - scripts/
  - references/
  - assets/

### Edit the Skill

- Write SKILL.md in imperative/infinitive form; third-person phrasing.
- Keep detailed schemas, policies, and API docs in `references/`.
- Store templates, fonts, icons, boilerplate code in `assets/`.
- Add deterministic or frequently reused code to `scripts/`.

### Validate and Package

Run the packager to validate structure and metadata, then create a distributable zip.

```bash
scripts/package_skill.py <path/to/skill-folder> [./dist]
```

Validation checks (summary):
- SKILL.md exists with frontmatter containing `name` and `description`.
- Description is concise (≤120 words) and uses third-person (“This skill should be used when …”).
- Optional folders (`scripts/`, `references/`, `assets/`) are organized; `references/` excludes binaries.

See `references/validator_criteria.md` for full criteria.

## Progressive Disclosure

1. Metadata (name + description) — always loaded.
2. SKILL.md body — load when the skill triggers (<5k words).
3. Bundled resources — load or execute on demand.

## Notes

- Keep SKILL.md lean; move details to `references/`.
- Include grep patterns in SKILL.md only when references are large.
- Maintain non-interactive defaults in scripts; provide `--help`.


