# FinalsPilot

Language: [简体中文](README.md) | English

An Agent Skill that turns messy course materials into a 10-12 hour finals sprint.

FinalsPilot is built for university finals review. It asks the agent to verify what it can actually read, then uses teacher review notes, recordings, slides, homework, past papers, and personal notes to create an executable study route: build the framework, review original courseware, generate mock exams, review mistakes, organize recitation, and compress the course into a final sprint sheet.

The repo also includes the companion `chaoxing-materials` skill for downloading accessible Chaoxing/Learning通 chapter materials into a local folder before handing them to FinalsPilot. It defaults to AI-readable PDFs; source files, video, and audio are opt-in.

This is not a generic course summarizer. FinalsPilot turns the agent into a finals coordinator: it tracks the current phase, checks unread materials, separates current teacher priorities from older materials, and forces review when answers are wrong, workflow state is lost, or output quality is not good enough.

## Core Features

- **Source coverage check**: record what was read, where it came from, and what remains unresolved.
- **Tool readiness check**: for PDF, PPT, DOCX, images, audio, spreadsheets, and archives, the agent explains required tools and installs or enables them when allowed.
- **Teacher-priority workflow**: current exam instructions and review recordings override slides, homework, past papers, and general knowledge.
- **Original-source verification**: before answering, correcting, or explaining concepts and cases, the agent returns to the original slide, question, transcript, or textbook location whenever possible.
- **Staged finals sprint**: knowledge framework, original courseware review, course question bank, three mock exams, mistake review, recitation pack, and final sprint sheet.
- **Active coordination**: in Hermes and other agents with reminders or message gateways, the skill can propose timed check-ins for papers, recitation, sleep, and progress review.
- **Correction incident review**: wrong answers must be source-checked, logged, corrected, and converted into future prevention rules.

## Outputs

A full run usually creates:

```text
logs/
  tool_readiness.md
  source_coverage.md
  source_priority.md
  exam_rules.md
  session_state.json
02_analysis/
  knowledge_framework.md
  courseware_review.md
  course_questions.md
03_exams/
  exam1_foundation/
  exam2_deliberate_practice/
  exam3_sprint/
04_mistakes/
05_recitation/
06_final/
  final_sprint.md
```

## Workflow

| Phase | Purpose |
|---|---|
| 1. Tool and source intake | Identify source types, enable reading tools, and create the coverage ledger |
| 2. Exam rule lock | Extract scope, question types, marks, open/closed-book rules, and current teacher instructions |
| 3. Evidence priority | Rank teacher instructions, recordings, slides, homework, and past papers |
| 4. Knowledge framework | Build a learnable course map with key concepts, traps, and likely exam styles |
| 5. Original courseware review | Review PPT/PDF/handouts after the framework to catch missed details and teacher style |
| 6. Course questions and homework mapping | Extract in-class questions, homework patterns, and variant directions |
| 7. Mock exams and review | Generate staged mock exams and adapt the next steps from mistakes |
| 8. Recitation and final sheet | Produce the recitation pack and a self-contained final sprint sheet |

## Installation

Clone the repository:

```bash
git clone https://github.com/weixueshi04/finals-pilot.git
```

Recommended targets:

- **Hermes Agent**: best for scheduled reminders, message gateways, multi-device review, and persistent study state.
- **Codex**: open the repository and use the repo-local skill wrapper.
- **Claude Code**: use `.claude/skills/finals-pilot/`.
- **OpenCode**: use `.opencode/skills/finals-pilot/`.

See [docs/agent-installation.md](docs/agent-installation.md).

## Example Prompts

```text
Use $finals-pilot.
This is my course review folder. First check which PDFs, PPTs, DOCX files, images, and recordings you can read. If a tool is missing, explain why it is needed and install or enable it. Then create source coverage, exam rules, and the knowledge framework.
```

Hermes mode:

```text
Use $finals-pilot in Hermes mode.
I have 12 hours to review and want to aim as high as possible. After each study block, ask whether I want to start timing now or receive a progress check through the message gateway at a specific time.
```

## Chaoxing / Learning通 Materials

If the courseware is still inside Chaoxing/Learning通 chapter pages, use the companion skill first:

```text
Use $chaoxing-materials.
Open my Chaoxing course, go to the target course and chapter, download accessible courseware into my chosen folder, default to PDF, and generate a manifest.
```

First-time setup:

```powershell
npm.cmd install
```

Common commands:

```powershell
npm.cmd run chaoxing:login
npm.cmd run chaoxing:courses
npm.cmd run chaoxing:open-section -- <course keyword> <chapter keyword>
npm.cmd run chaoxing:download-current -- --output "<course-materials-folder>"
```

Browser and login notes:

- Chrome is preferred by default, then Edge. Set `CHAOXING_BROWSER_CHANNEL=edge` or `CHAOXING_BROWSER_CHANNEL=chrome` to choose explicitly.
- Login state is stored in `automation/chaoxing/browser-profile`, not in the student's normal browser profile. Changing browser or profile can require one more login.
- The student must approve the output folder before download. Without `--output` or `CHAOXING_OUTPUT_DIR`, the download script stops.
- The preferred portable route is HTTP fetch with browser cookies. If the student already has Xunlei, IDM, or a browser download plugin configured, the agent may explain the tradeoff and use it as a fallback after approval.
- Browser extensions follow the automation profile by default. If an extension interferes, rerun with `CHAOXING_DISABLE_EXTENSIONS=1`.

Default output:

```text
<course-materials-folder>/
  01_pdf_for_ai/
  manifest/
    materials-manifest.md
    materials-manifest.json
```

`FinalsPilot` treats `manifest/materials-manifest.json` as the source-coverage seed and `01_pdf_for_ai/` as the default readable courseware input. Source files, video, and audio are not downloaded by default. Use `chaoxing:download-source`, `chaoxing:download-media`, or `chaoxing:download-all` only when the PDF is incomplete, the original file matters, or the student explicitly needs recordings/media.

## Design Principles

FinalsPilot comes from real finals-week use. Earlier versions produced 80+ and 90+ course results, while also exposing common failure modes in AI-assisted review: skipped materials, copied secondary answers, lost workflow state after side questions, over-weighting past papers, and corrections that did not create durable prevention rules.

The skill is built around these principles:

- Confirm source coverage before generating frameworks or exams.
- Prioritize current teacher instructions over historical material and general knowledge.
- Prefer original courseware, original questions, and original transcripts over model inference.
- Maintain phase state so side questions do not derail the workflow.
- Produce directly studyable artifacts, not empty indexes or generic advice.
- Turn mistakes into corrected artifacts and future prevention rules.

## Repository Layout

```text
.
├── SKILL.md
├── README.md
├── README.en.md
├── NOTICE.md
├── CHANGELOG.md
├── AGENTS.md
├── agents/openai.yaml
├── .agents/skills/finals-pilot/
├── .agents/skills/chaoxing-materials/
├── .claude/skills/finals-pilot/
├── .claude/skills/chaoxing-materials/
├── .opencode/skills/finals-pilot/
├── .opencode/skills/chaoxing-materials/
├── skills/chaoxing-materials/
├── tools/chaoxing/
├── docs/
└── references/
```

Root [SKILL.md](SKILL.md) is the canonical FinalsPilot skill body. `skills/chaoxing-materials/SKILL.md` is the canonical companion skill for Chaoxing/Learning通 downloads. Files under `.agents/`, `.claude/`, and `.opencode/` are repo-local wrappers.

## Privacy

Do not commit real course materials, student answers, transcripts, homework photos, generated exams, mistake logs, or any review artifacts containing personal data. `.gitignore` excludes common course-material and generated-output paths, but commits should still be checked manually.

## Ownership And Maintainer Rights

FinalsPilot is created and maintained by [weixueshi04](https://github.com/weixueshi04).

Issues, suggestions, usage reports, and pull requests are welcome. The original author/maintainer retains final control over the project name, core rules, version releases, merge decisions, external listings, and future modifications. See [NOTICE.md](NOTICE.md).

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](LICENSE) license (CC BY-NC-SA 4.0).

You may share and adapt this work for non-commercial purposes with attribution and the same license for adaptations. The original author/maintainer retains final control over the project name, core rules, version releases, merge decisions, external listings, and future modifications. See [NOTICE.md](NOTICE.md).
