# Agent Installation

This repo keeps `SKILL.md` as the canonical skill. The primary skill name is `university-finals-sprint`. Install the whole repository as a skill folder, or use the repo-local wrappers already included under `.agents/`, `.claude/`, and `.opencode/`.

## Codex

Codex supports skills with a `SKILL.md` file and optional `agents/openai.yaml` UI metadata.

Recommended options:

- Global/user install: copy or clone this repo as a skill folder named `university-finals-sprint` under your Codex skills directory.
- Repo-local install: open this repo directly; `.agents/skills/university-finals-sprint/SKILL.md` forwards to root `SKILL.md`.
- Explicit invocation: `Use $university-finals-sprint ...`

Official docs: [OpenAI Codex Skills](https://developers.openai.com/codex/skills).

## Claude Code

Claude Code supports Agent Skills with `SKILL.md` and can discover skills from Claude skill locations.

Recommended options:

- Global/user install: copy or clone this repo as a Claude skill folder named `university-finals-sprint`.
- Repo-local install: open this repo directly; `.claude/skills/university-finals-sprint/SKILL.md` forwards to root `SKILL.md`.
- Explicit invocation: ask Claude Code to use `university-finals-sprint` or paste the root `SKILL.md` if discovery is unavailable.

Official docs: [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills).

## OpenCode

OpenCode supports Agent Skills in `~/.opencode/skill`, project `.opencode/skill`, and compatible `.claude/skills` / `.agents/skills` paths.

Recommended options:

- Global/user install: copy or clone this repo into an OpenCode skill location as `university-finals-sprint`.
- Repo-local install: open this repo directly; `.opencode/skills/university-finals-sprint/SKILL.md` forwards to root `SKILL.md`.
- Explicit invocation: `Use the university-finals-sprint skill ...`

Official docs: [OpenCode Agent Skills](https://opencode.ai/docs/skills/).

## Hermes

Hermes is the preferred target for active University Finals Sprint runs when it can persist files, create scheduled tasks, and send reminders through QQ, WeChat, or another message gateway.

Recommended options:

- Install this repo as a plain `SKILL.md` package if your Hermes build supports Agent Skills or skill folders.
- Keep the whole repository available so Hermes can load `references/hermes-agent.md`, `references/knowledge-base-platforms.md`, and `references/evolution-and-incident-review.md` when needed.
- If Hermes exposes cron/reminder/message tools, let the skill propose timed checks after study plans, generated papers, mistake reviews, recitation blocks, sleep blocks, and final sprint sheets.
- Do not let Hermes create reminders silently; confirm time, channel, and purpose first.
- If Hermes can install or enable file-reading tools/plugins, allow University Finals Sprint to use that path for PDF/PPT/DOCX/OCR/transcription needs after it explains the reason. If the platform requires approval, approve only the specific tool/capability needed for the provided course materials.

Recommended invocation:

```text
Use university-finals-sprint. Start with capability check, source coverage, and current exam rules. Use Hermes scheduled tasks/message reminders when helpful, but ask me before creating them. Do not generate exams until high-priority teacher materials are accounted for.
```

## Knowledge Base Products

For ima, Kimi, Tongyi Tingwu, or similar products:

- Use them as retrieval, storage, or transcription helpers behind an installed agent.
- Keep the installed agent responsible for state, source coverage, exams, correction incidents, and scheduled tasks.
- Treat knowledge-base retrieval as secondary evidence unless the product shows exact original source documents, pages, slides, passages, or timestamps.

Ordinary web AI without skill installation, file access, and persistent state is not a supported University Finals Sprint target.

## Document Tooling

University Finals Sprint expects the active agent to read real course materials, not just filenames or search snippets. On startup it should create a tool-readiness log and, when permitted, install or enable missing tools for:

- PDF extraction
- PPT/PPTX slide extraction
- DOCX parsing
- OCR or vision for homework photos
- audio transcription for review recordings
- spreadsheet and archive parsing

If tool installation is blocked, the agent should ask for exported text, transcripts, clearer images, unpacked archives, an explicit skip, or permission to continue at lower confidence. See `references/tool-readiness.md`.
