# Repository Agent Guide

This repository maintains the `university-finals-sprint` Agent Skill. Treat `SKILL.md` as the canonical source.

## Editing Rules

- Keep the full workflow in root `SKILL.md`.
- Keep `.agents/`, `.claude/`, and `.opencode/` skill files as wrappers only; do not duplicate the full skill body there.
- Update `CHANGELOG.md` for every behavior-changing edit.
- Preserve the three hard guarantees: source coverage, teacher-priority evidence, and stateful phase control.
- Do not commit real course materials, student answers, transcripts, homework photos, generated exams, or extracted text.

## Validation Checklist

- Frontmatter includes `name` and `description`; keep description concise for cross-agent compatibility.
- `SKILL.md` version and `CHANGELOG.md` latest version match.
- All Markdown code fences are balanced.
- Agent wrapper paths still point to `../../../SKILL.md`.
- Installation docs mention current support status for Codex, Claude Code, OpenCode, and Hermes.

## Release Checklist

- Decide license before public release.
- Tag releases as `vX.Y.Z`.
- Test at least one file-based agent and one repo-local wrapper/legacy alias path before recommending a release.
