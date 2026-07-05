# Agent Installation

This repo keeps `SKILL.md` as the canonical skill. The primary skill name is `finals-pilot`. Install the whole repository as a skill folder, or use the repo-local wrappers already included under `.agents/`, `.claude/`, and `.opencode/`.

## Codex

Codex supports skills with a `SKILL.md` file and optional `agents/openai.yaml` UI metadata.

Recommended options:

- Global/user install: copy or clone this repo as a skill folder named `finals-pilot` under your Codex skills directory.
- Repo-local install: open this repo directly; `.agents/skills/finals-pilot/SKILL.md` forwards to root `SKILL.md`.
- Explicit invocation: `Use $finals-pilot ...`

Official docs: [OpenAI Codex Skills](https://developers.openai.com/codex/skills).

## Claude Code

Claude Code supports Agent Skills with `SKILL.md` and can discover skills from Claude skill locations.

Recommended options:

- Global/user install: copy or clone this repo as a Claude skill folder named `finals-pilot`.
- Repo-local install: open this repo directly; `.claude/skills/finals-pilot/SKILL.md` forwards to root `SKILL.md`.
- Explicit invocation: ask Claude Code to use `finals-pilot` or paste the root `SKILL.md` if discovery is unavailable.

Official docs: [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills).

## OpenCode

OpenCode supports Agent Skills in `~/.opencode/skill`, project `.opencode/skill`, and compatible `.claude/skills` / `.agents/skills` paths.

Recommended options:

- Global/user install: copy or clone this repo into an OpenCode skill location as `finals-pilot`.
- Repo-local install: open this repo directly; `.opencode/skills/finals-pilot/SKILL.md` forwards to root `SKILL.md`.
- Explicit invocation: `Use the finals-pilot skill ...`

Official docs: [OpenCode Agent Skills](https://opencode.ai/docs/skills/).

## Hermes

Hermes is the preferred target for active FinalsPilot runs when it can persist files, create scheduled tasks, and send reminders through QQ, WeChat, or another message gateway.

Recommended options:

- Install this repo as a plain `SKILL.md` package if your Hermes build supports Agent Skills or skill folders.
- Keep the whole repository available so Hermes can load `references/hermes-agent.md`, `references/knowledge-base-platforms.md`, and `references/evolution-and-incident-review.md` when needed.
- If Hermes exposes cron/reminder/message tools, let the skill propose timed checks after study plans, generated papers, mistake reviews, recitation blocks, sleep blocks, and final sprint sheets.
- Do not let Hermes create reminders silently; confirm time, channel, and purpose first.
- If Hermes can install or enable file-reading tools/plugins, allow FinalsPilot to use that path for PDF/PPT/DOCX/OCR/transcription needs after it explains the reason. If the platform requires approval, approve only the specific tool/capability needed for the provided course materials.

Recommended invocation:

```text
Use $finals-pilot. Start with capability check, source coverage, and current exam rules. Use Hermes scheduled tasks/message reminders when helpful, but ask me before creating them. Do not generate exams until high-priority teacher materials are accounted for.
```

## Knowledge Base Products

For ima, Kimi, Tongyi Tingwu, or similar products:

- Use them as retrieval, storage, or transcription helpers behind an installed agent.
- Keep the installed agent responsible for state, source coverage, exams, correction incidents, and scheduled tasks.
- Treat knowledge-base retrieval as secondary evidence unless the product shows exact original source documents, pages, slides, passages, or timestamps.

## Document Tooling

FinalsPilot expects the active agent to read real course materials, not just filenames or search snippets. On startup it should create a tool-readiness log and, when permitted, install or enable missing tools for:

- PDF extraction
- PPT/PPTX slide extraction
- DOCX parsing
- OCR or vision for homework photos
- audio transcription for review recordings
- spreadsheet and archive parsing

If tool installation is blocked, the agent should ask for exported text, transcripts, clearer images, unpacked archives, an explicit skip, or permission to continue at lower confidence. See `references/tool-readiness.md`.

## Companion Skill: Chaoxing Materials

This repository also includes `chaoxing-materials`, a companion skill for downloading accessible 学习通/超星 chapter resources before FinalsPilot starts source coverage.

Supported wrappers:

- Codex / Agents: `.agents/skills/chaoxing-materials/SKILL.md`
- Claude Code: `.claude/skills/chaoxing-materials/SKILL.md`
- OpenCode: `.opencode/skills/chaoxing-materials/SKILL.md`
- Hermes Agent: use the canonical `skills/chaoxing-materials/SKILL.md` or point Hermes to the repo-local wrapper, depending on its skill loader.

Use it when a student says courseware is inside 学习通 and chapter PPT/PDF files do not have an obvious download button. It reuses browser login state, resolves Chaoxing `objectid` resources through the status endpoint, downloads PDF files by default into a user-approved folder, and creates a manifest for FinalsPilot. Source files and video/audio downloads remain available as explicit opt-in modes.

First-time local setup:

```powershell
npm.cmd install
```

Typical flow:

```powershell
npm.cmd run chaoxing:login
npm.cmd run chaoxing:courses
npm.cmd run chaoxing:open-section -- <course keyword> <chapter keyword>
npm.cmd run chaoxing:download-current -- --output "<course-materials-folder>"
```

Browser/session controls:

```powershell
$env:CHAOXING_BROWSER_CHANNEL="edge"      # prefer Edge
$env:CHAOXING_BROWSER_CHANNEL="chrome"    # prefer Chrome
$env:CHAOXING_BROWSER="C:\Path\To\browser.exe"
$env:CHAOXING_USER_DATA_DIR="D:\private\chaoxing-browser-profile"
```

The default automation profile is `automation/chaoxing/browser-profile`. It is separate from the user's normal browser profile, so the first run may require login even if the user is already logged in through their everyday browser. Keep the same browser and profile during one course run to preserve the session.

The downloader uses direct HTTP fetch with browser cookies and verifies PDF headers. It does not depend on Xunlei, IDM, browser download extensions, or third-party download managers. Extensions are disabled by default; only set `CHAOXING_ALLOW_EXTENSIONS=1` if the user explicitly wants that risk.

The output folder should live outside the Git repository. By default the downloader writes AI-readable PDFs into `01_pdf_for_ai/` and writes `manifest/materials-manifest.md/json`. The manifest uses relative paths and does not store absolute local paths, signed download URLs, cookies, or account identifiers.

After that, start FinalsPilot with the downloaded folder:

```text
Use $finals-pilot.
Use <course-materials-folder> as my course material input. Seed source coverage from manifest/materials-manifest.json and treat 01_pdf_for_ai/ as the default courseware input.
```
