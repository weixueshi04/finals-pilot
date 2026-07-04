# University Finals Sprint

Language: [简体中文](README.md) | English

University Finals Sprint is an Agent Skill for university finals review. It turns PPTs, textbooks, review recordings, teacher notes, homework, past papers, and scattered notes into an executable 10-12 hour review sprint, while requiring the agent to verify source coverage, evidence priority, original-source fidelity, and phase state before producing high-impact outputs.

The goal is not to "summarize a course." The goal is to make the agent behave like a reliable finals coordinator: confirm what was actually read, build a knowledge framework, schedule original courseware review, generate mock exams, review mistakes, organize recitation, and produce a final memory sheet.

## Core Features

- **Source coverage ledger**: record every material's type, priority, read status, source location, and unresolved gaps.
- **Tool readiness gate**: identify file types such as PDF, PPT, DOCX, images, audio, spreadsheets, and archives; install or enable the required reading tools when available; smoke-test extraction before using the material.
- **Teacher-first evidence hierarchy**: current exam rules and review recordings override slides, homework, past papers, and general web knowledge.
- **Original-source verification**: answer corrections, concepts, cases, formulas, and examples from the original slide, question, transcript, or textbook location whenever available.
- **Staged finals sprint**: knowledge framework, courseware question bank, Exam 1, Exam 2, Exam 3, mistake review, recitation pack, and final sprint sheet.
- **Active coordination**: in agents with reminders and message gateways, propose timed check-ins for papers, recitation, sleep, and progress review.
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
git clone https://github.com/weixueshi04/qimost_v_0.1.5.git
```

Recommended targets:

- **Hermes Agent**: best for scheduled reminders, message gateways, multi-device review, and persistent study state.
- **Codex**: open the repository and use the repo-local skill wrapper.
- **Claude Code**: use `.claude/skills/university-finals-sprint/`.
- **OpenCode**: use `.opencode/skills/university-finals-sprint/`.

See [docs/agent-installation.md](docs/agent-installation.md).

## Example Prompts

```text
Use $university-finals-sprint.
This is my course review folder. First check which PDFs, PPTs, DOCX files, images, and recordings you can read. If a tool is missing, explain why it is needed and install or enable it. Then create source coverage, exam rules, and the knowledge framework.
```

Hermes mode:

```text
Use $university-finals-sprint in Hermes mode.
I have 12 hours to review and want to aim as high as possible. After each study block, ask whether I want to start timing now or receive a progress check through the message gateway at a specific time.
```

## Design Principles

University Finals Sprint comes from real finals-week use. Earlier versions produced 80+ and 90+ course results, while also exposing common failure modes in AI-assisted review: skipped materials, copied secondary answers, lost workflow state after side questions, over-weighting past papers, and corrections that did not create durable prevention rules.

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
├── .agents/skills/university-finals-sprint/
├── .claude/skills/university-finals-sprint/
├── .opencode/skills/university-finals-sprint/
├── docs/
└── references/
```

Root [SKILL.md](SKILL.md) is the only canonical skill body. Files under `.agents/`, `.claude/`, and `.opencode/` are repo-local wrappers.

## Privacy

Do not commit real course materials, student answers, transcripts, homework photos, generated exams, mistake logs, or any review artifacts containing personal data. `.gitignore` excludes common course-material and generated-output paths, but commits should still be checked manually.

## Ownership And Maintainer Rights

University Finals Sprint is created and maintained by [weixueshi04](https://github.com/weixueshi04).

Issues, suggestions, usage reports, and pull requests are welcome. The original author/maintainer retains final control over the project name, core rules, version releases, merge decisions, external listings, and future modifications. See [NOTICE.md](NOTICE.md).

## License

No open-source license has been granted yet. Unless a separate `LICENSE` file is added, all rights are reserved. See [NOTICE.md](NOTICE.md).
