---
name: finals-pilot
description: Build a 10-12 hour finals sprint workflow from messy course materials. Use when a student needs a source-checked cram plan from PPTs, PDFs, textbooks, review recordings/transcripts, homework, past exams, figures, Chaoxing/Learning通 downloads, and notes; FinalsPilot enforces source coverage, tool readiness and auto-install, original-source verification, original courseware review, teacher-priority evidence, staged mock exams, active coaching, mistake review, recitation, final sprint sheets, correction-incident review, and scheduled follow-up tasks. Designed for installed/file-based agents such as Hermes, Codex, Claude Code, and OpenCode, especially Hermes-style agents with cron/message gateways.
---

# FinalsPilot (v0.2.3)

Use this skill to turn messy course materials into a compact, evidence-backed finals review path. The practical goal is 60+ as the floor and around 80 as the stretch target after 10-12 focused hours, assuming the materials contain enough exam signal.

## On-Activation User Guide (MANDATORY)

When this skill is activated (loaded via `use_skill`), the assistant MUST immediately present the user with a clear, step-by-step workflow guide before doing anything else. This is the student's onboarding — they need to see the whole path before starting.

The guide must include:

1. **Greeting + version**: State the skill name and version (e.g., "FinalsPilot v0.2.3 已激活").
2. **What this skill does** (1-2 sentences): Turn your course materials into a structured 10-12 hour finals review path.
3. **What the student needs to provide**: Course materials (PPT, textbook, recordings, homework, past exams, review notes) — can be unsorted, dumped into one folder or knowledge base.
   If the materials are still inside Chaoxing/Learning通, tell the student that the companion `chaoxing-materials` skill can download accessible chapter courseware into a local folder before FinalsPilot starts source coverage.
4. **The full workflow as a numbered checklist** the student can follow, in plain language:

   | Step | What happens | What you do | Estimated time |
   |------|-------------|-------------|----------------|
   | 1 | Material intake & classification | Upload materials, point to a folder, or use `chaoxing-materials` first for Learning通/Chaoxing courseware | 0.5h |
   | 2 | Knowledge framework | Review the framework, ask questions | 1.5-2h |
   | 3 | Courseware question bank | Browse indexed Q&A, self-test | 1h |
   | 4 | Homework mapping (if applicable) | Review homework solutions & mappings | 0.5h |
   | 5 | Exam 1 (foundation) | Take the exam, then review mistakes | 1.5-2h |
   | 6 | Exam 2 (deliberate practice) | Take the exam, then review | 2-2.5h |
   | 7 | Recitation pack | Memorize must-know items, rolling recall | 1h |
   | 8 | Sleep block | Rest to consolidate memory | — |
   | 9 | Exam 3 (sprint) + Final memory sheet | Morning retrieval + final sprint | 1.5-2h |

5. **Ask the student to start**: "准备好了吗？把你的课程材料发给我，我们从第1步开始。"
6. **Flexibility note**: Mention that the workflow adapts to available time (2h / 6h / 10h+ modes) and that steps can be skipped or reordered.

Do NOT begin processing materials until the user confirms they want to start. The guide is a roadmap, not a barrier — keep it concise and scannable.

## Core Rules

- Ground every important claim in the user's materials. If you infer from web or general subject knowledge, label it as inference and keep it subordinate to course evidence.
- **Evidence completeness before synthesis (先读全，再判断)**: Before building the framework, answering high-impact questions, or generating exams, create and maintain `logs/source_coverage.md`. For every provided file or knowledge-base item, record its path/name, material type, priority tier, extraction method, read status, completeness, and unresolved gaps. If any teacher review recording/transcript, current exam rule, PPT, review sheet, or homework source is unreadable, stop and ask the user to transcribe/export/skip it explicitly before treating the course as covered.
- **Teacher priority hierarchy (老师当次说明最高)**: Resolve conflicts by this order: S0 current teacher exam instructions and scope; S1 teacher review recordings/transcripts and spoken emphasis; S2 current PPT/courseware/review sheets; S3 assigned homework, in-class questions, and textbook exercises; S4 textbook/reference materials; S5 past exams and senior-student notes; S6 web/general knowledge. Higher tiers override lower tiers. Past-paper marks, question types, and emphasis are historical hints only unless S0/S1 says the same rule still applies.
- **Current-exam rules lock (本次考试规则锁定)**: Extract the latest exam scope, question types, marks, open/closed-book rule, teacher exclusions, and special instructions into `logs/exam_rules.md`. Do not use past-paper score distribution or old emphasis to design papers when it conflicts with `logs/exam_rules.md`.
- **Stateful execution (状态机执行)**: Maintain `logs/session_state.json` throughout the workflow. The assistant must know the current phase, completed phases, allowed next actions, unread high-priority sources, current weak points, and exam progress before responding. Student side questions are handled as side questions, then the assistant returns to the saved phase instead of jumping ahead.
- **Hermes-first active coordination (Hermes 主动编排)**: When running in Hermes Agent or any file-based agent with scheduled tasks, cron, reminders, or message gateways, use agent-native mode: persist state in files, propose timed follow-ups after every study block or generated paper, and route short check-ins through the user's approved QQ/WeChat/app channel. Read `references/hermes-agent.md` before creating or proposing scheduled tasks.
- **Quality over volume (宁可少产出，不要垃圾产出)**: Every artifact must pass the Quality Checks before delivery. If an output is shallow, unverifiable, too generic, badly aligned with the exam, or not directly studyable, rewrite it or block delivery. A bad framework, bad mock exam, or bad answer key wastes the student's scarce pre-exam time and is treated as a workflow failure.
- **Original-source fidelity (忠于原始课件/原文)**: When answering student questions about cases, concepts, terms, formulas, events, named theories, examples, or rules, the FIRST and PRIMARY source must be the original course material: PPT/PDF page, textbook passage, lecture transcript, teacher review sheet, homework source, or original question. Do NOT substitute general knowledge, web snippets, extracted indexes, second-hand notes, or your own reasoning for what the course material actually says. If the original source can be checked, check it before answering. If it cannot be checked, say so explicitly and lower confidence.
- **No second-hand answer copying (不抄二手答案字母/摘要)**: If a question, example, or case exists in the original courseware, verify the original stem, options, answer, and explanation against the original slide/page before giving the answer. Do not trust an index, search result, extracted question list, or previous generated answer unless it has been rechecked against the original source. If option letters differ between sources, ignore the old letters and answer from the current visible options.
- **Knowledge-base discipline (知识库只作检索，不作已读证明)**: When using Tencent ima, Kimi, Tongyi Tingwu, or any knowledge-base/transcription product, treat retrieval as secondary until the original source location is visible. Maintain batch manifests and retrieval receipts. Read `references/knowledge-base-platforms.md` before relying on a knowledge base for analysis or correction.
- **Subject/entity relationship clarity (主体/对象/变量/关系不可模糊)**: For any user question about a concept, case, term, event, mechanism, formula, theorem, experiment, policy, literary text, or historical process, identify the relevant subjects/entities and their relationships before explaining. In law/management this means party-action-responsibility; in engineering/science it means object-variable-condition-mechanism; in economics/management it means actor-incentive-constraint-outcome; in humanities/social science it means person/institution/concept/event-cause-effect. The answer must move the student from vague confusion to a clear mental model.
- **Special-case explicit treatment (特殊情况特殊解释)**: Many exam questions involve situations where a general rule, formula, model, theory, or historical pattern has an exception, boundary condition, special assumption, or modified application. When this happens, explicitly separate: (1) the general rule/model, (2) what is special in THIS question, (3) what the course material says about that specialness, (4) how the conclusion changes. Never apply a general rule to a special case without flagging the specialness.
- **Discipline adaptation (按学科适配解释方式)**: FinalsPilot is not limited to construction, contract management, law, or any single course. Determine the subject and exam style from the user's materials. For STEM and quantitative courses, prioritize definitions, variables, assumptions, formulas, diagrams, units, procedures, and calculation traps. For humanities and social sciences, prioritize actors, concepts, texts, institutions, causes, evidence, comparison, argument structure, and exam-language expression. Use the course's own style, not a fixed template from another subject.
- **Correction incidents create memory (答错必须留痕进化)**: When the user challenges an answer or a source mismatch appears, do not only apologize. Re-check the original source, classify the incident, correct affected artifacts, and write a prevention rule. Read `references/evolution-and-incident-review.md` for the required template.
- **Autonomous evolution with user control (自主进化但不擅自改核心规则)**: Within a course run, adapt drills, reminders, difficulty, recitation, and mock exams from mistakes and replies. Across course runs, propose skill improvements in `logs/skill_improvement_candidates.md`. Do not modify the canonical skill during an active exam run unless the user explicitly asks.
- Preserve source traceability. Assign every knowledge point an ID and cite source file/page/slide/timestamp/homework question when available.
- Treat paper homework photos, textbook after-class exercises, and homework screenshots as raw course materials. If homework exists, parse all visible questions before exam generation.
- Before writing exams, analyze homework question logic, style, difficulty, and knowledge-point coverage. Knowledge points that appear in homework and also match review-recording/transcript emphasis are very high-probability final-exam candidates and should be transformed into exam variants.
- Do not promise a score. State that the workflow is designed to raise readiness, not guarantee an exam result.
- Keep student interaction gates. Do not generate Exam 2 until Exam 1 has been reviewed or the user explicitly skips review; do not generate Exam 3 until Exam 1/2 mistakes and questions are summarized or explicitly unavailable.
- Avoid repeating exact questions across exams. Reuse important knowledge points through changed angle, condition, scenario, wording, or question type.
- Match the real exam format first. If the user provides question types, marks, duration, open/closed-book rules, or scope, follow those over generic defaults.
- For recent or externally variable course/exam conventions, use web search only when available and useful, and cite sources. Never let internet material override the teacher's materials.
- If the student is sleep-deprived, protect the memory window: include a sleep block and a small morning retrieval review rather than endless new content.
- Run the Tool Readiness and Auto-Install Gate before reading materials. Identify which file types require PDF/PPT/DOCX/OCR/audio/web/filesystem tooling, tell the student what needs to be installed or enabled and why, then install or enable the missing tools automatically when the current agent/platform permits it. If approval, network, package manager, or sandbox limits block installation, request the minimum required permission once; if installation still cannot happen, mark the source unreadable and use the fallback path. Never claim to have read a source that the available tools cannot access.
- Support Auto Intake: if the user drops all materials for a course into one folder, classify and route files automatically before analysis. Do not require the student to manually sort files.
- Support Chaoxing/Learning通 material intake through the companion `chaoxing-materials` skill when available. Ask the student to choose a local output folder, download accessible chapter/courseware PDFs there by default, and use `manifest/materials-manifest.md/json` as the first source coverage seed. Source files, video, and audio are optional downloads, not defaults. Do not treat a Chaoxing chapter as read until the downloaded file or manifest evidence exists.
- Optimize material organization from Chaoxing manifests. If a downloaded folder contains `manifest/materials-manifest.json`, initialize source coverage from that manifest first: treat `01_pdf_for_ai/` as the primary AI-reading copy, `02_source_files/` as optional original-courseware evidence, `03_video_audio/` as optional recording evidence, and manifest fields such as relative path, objectid, mode, bytes, and download timestamp as traceability metadata. Do not re-ask the student to manually classify manifest-covered files unless a high-priority item failed, a filename is ambiguous, or the manifest conflicts with visible materials.
- Support Chart Agent Protocol for engineering and quantitative courses: extract chart/table/diagram evidence, map figures to knowledge points, and generate reproducible chart assets for exam questions when tools allow.
- Extract courseware example questions: When PPT slides, lecture notes, or other courseware contain in-class practice questions (choice, short-answer, case analysis, calculation), extract ALL of them into a dedicated question bank. Do not cherry-pick; completeness is the point. Each question must include the full stem, all options, the correct answer, a detailed explanation, and a source trace (file name + slide/section/page number).
- Build a navigable question index: The question bank file must open with a categorized index table. Each entry has a short keyword and an anchor link (`[→](#anchor)`) that jumps to the full question. Categories should follow the course's knowledge structure, not slide order. The index is the student's entry point — it must be scannable in under 30 seconds.
- Do not produce index-only learning artifacts. A finals speedrun is a teaching workflow, not a file catalog. The knowledge framework, answer keys, recitation pack, and final sprint must be directly learnable without forcing the student to re-open the textbook for basic explanations.
- When the user criticizes an artifact as shallow, update the skill outputs and the relevant templates, not just the current course file.

## Operational Hard Gates

These gates are mandatory because agents and knowledge-base platforms can skip files, lose state, overfit old papers, or keep repeating the same answer mistakes.

This skill is intended for installed or file-based agents. Do not add workflow burden for users who paste the skill into ordinary web AI without installation, file access, or persistent state. A Hermes message gateway is part of an installed agent workflow and is supported.

### Tool Readiness and Auto-Install Gate

Before source synthesis, create or update `logs/tool_readiness.md`. The agent must inspect the provided file list, infer the material types, map each type to the required reading capability, and install or enable missing tools when the platform allows it.

Required readiness log fields:

| Field | Required content |
|---|---|
| Material type | PDF, PPT/PPTX, DOCX, image/homework photo, audio/video, spreadsheet, archive, web page, local folder, other |
| Needed capability | PDF text extraction, slide extraction, document parsing, OCR/vision, transcription, spreadsheet parsing, archive extraction, browser/search, filesystem write |
| Current status | available, missing, installable, needs approval, blocked, user-provided export needed |
| Proposed tool | built-in parser, workspace dependency, agent plugin, OCR/transcription tool, package/library, or manual export fallback |
| Why needed | the source tier or file type that would be unreadable without it |
| Install action/result | installed/enabled, smoke-tested, failed, skipped by user, unavailable |
| Remaining risk | unreadable pages/slides/images/audio, weak OCR, no timestamps, low-confidence extraction |

Student-facing message before installation:

```markdown
Tool readiness:
- Materials found: <counts by type>
- Missing capability: <capability>
- Tool to install/enable: <tool or plugin>
- Why: <which source would otherwise be unreadable>
- Action: installing/enabling now / requesting platform approval / blocked
```

Auto-install rules:

- Prefer existing built-in tools, bundled workspace dependencies, and agent-native plugins before adding new packages.
- If a package manager, network request, plugin install, or filesystem permission requires approval, ask for the minimum required approval with a concise reason, then proceed after approval.
- Install into the project workspace, agent cache, virtual environment, or user-approved tool location when possible. Avoid global/system-wide installation unless the agent platform requires it and the user approves.
- After installing or enabling a tool, run a small extraction smoke test on one representative file type before marking the capability as available.
- Do not silently install unknown, untrusted, unrelated, or paid tools. Do not install tools only for convenience when a reliable built-in capability already exists.
- If installation fails, mark the affected sources as unreadable or partial in `logs/source_coverage.md`, explain the missing capability, and ask the student for a text export/transcript/clearer image, an explicit skip, or permission to continue at lower confidence.
- Read `references/tool-readiness.md` when choosing tools for PDF, PPT/PPTX, DOCX, images, audio, spreadsheets, archives, web pages, or local folders.

### Source Coverage Gate

Before any framework, question bank, exam, or final sprint is produced, `logs/source_coverage.md` must exist and include:

| Field | Required content |
|---|---|
| Source | File name, knowledge-base item, link, or pasted transcript name |
| Type | PPT, PDF, textbook, review recording, transcript, homework, past exam, note, image, web, other |
| Priority tier | S0-S6 using the teacher priority hierarchy |
| Extraction method | Native read, OCR, slide export, audio transcript, user paste, manual summary, unavailable |
| Read status | complete, partial, unreadable, skipped by user |
| Evidence locations | slide/page/timestamp/question number when available |
| Action needed | none, needs transcription, needs clearer image, needs user confirmation, skip accepted |

Hard rules:

- Do not claim "all materials have been read" unless every source is marked complete or explicitly skipped by the user.
- Do not generate exams while an S0/S1/S2 source is unreadable unless the user explicitly says to continue without it.
- If audio exists but no transcript exists, say the recording is not read. Ask for a transcript, key timestamps, or permission to continue at lower confidence.
- If the platform cannot inspect PPT/PDF/image/audio directly, it must say so before analysis and use exported text, screenshots, OCR, or user transcription.

### Source Priority Gate

Create `logs/source_priority.md` after intake. It must list:

- All S0 current exam rules and the source where the teacher stated them.
- All S1 review-recording priorities with timestamp or transcript location.
- Conflicts between S0/S1 and lower-tier sources.
- Past-paper patterns that are usable only as weak hints.

When generating priorities or exams:

- S0/S1 evidence must be visibly represented first.
- S5 past exams may suggest style, but they cannot override current teacher scope, marks, or emphasis.
- If a knowledge point is important in past papers but absent from current teacher emphasis, label it "historical hint, current priority uncertain."
- If the teacher says "this year changed," erase the old weighting and rebuild from S0/S1/S2.

### Original Source Verification Gate

This gate prevents the repeated failure pattern: answering from memory, guessing from general logic, or copying second-hand indexes without opening the original course material.

Before answering or correcting any user question about a specific question, case, concept, term, event, formula, or teacher example, the assistant must produce a short verification receipt internally and, when useful, show it briefly:

```markdown
Source verification:
- Original source checked: file + slide/page/timestamp/question number
- User question matches source: yes / partial / no
- Stem/options/case facts verified: yes / partial / unavailable
- Course answer or rule found: yes / no / conflicting
- Confidence: high / medium / low
```

Hard rules:

- If the original source is available, open it before answering. Do not ask the student what they think the answer should be when the material can be checked.
- For objective questions, verify the current stem, every option, and the answer. Option letters are not portable across versions; answer by option content if letters conflict.
- For courseware examples and cases, first retrieve the course's original analysis or marking logic. Do not add conclusions that the course material does not support, such as remedies, formulas, causal links, or responsibilities invented from general knowledge.
- If two PPTs, transcripts, or notes conflict, list both source versions and explain which has higher priority under S0-S6. Let the course materials speak before giving a final recommendation.
- If only an extracted index, knowledge-base snippet, OCR fragment, or search result is available, label it as secondary evidence and do not treat it as verified original evidence.
- If the original source cannot be accessed in the current platform, say `original source not verified`, give only a low-confidence explanation, and ask the user to provide the relevant slide/page/transcript before finalizing.

### Original Courseware Review Gate

Original courseware review is a required human calibration step, not optional decoration. The goal is to let the student audit the AI-generated map against the teacher's actual PPT/PDF/handout style, catch details that extraction or transcripts missed, and rebuild trust before deeper mock exams.

Read `references/courseware-review.md` when planning or running this step.

Hard rules:

- Do not put the main full-PPT review at the very beginning. First build enough framework so the student has a map.
- Do not postpone all courseware review until after Exam 3 unless the user explicitly chooses emergency mode.
- After `knowledge_framework.md`, schedule a primary 60-80 minute guided courseware review before Exam 1 when time allows.
- After Exam 1 review, schedule a 30-40 minute targeted courseware review against wrong questions, uncertain concepts, and suspicious AI explanations.
- After Exam 3 or before the final sprint, schedule a 20-30 minute sweep for teacher-style details, tables, figures, examples, formula conditions, and final-sheet additions.
- Produce or update `02_analysis/courseware_review.md` with omissions, teacher-style signals, source pages/slides, details to add to exams, and AI claims needing correction.

### State Machine Gate

Maintain `logs/session_state.json` with at least:

```json
{
  "current_phase": "intake",
  "current_step_label": "1/21 capability check",
  "completed_phases": [],
  "allowed_next_actions": ["finish_source_coverage", "collect_exam_rules"],
  "blocked_by": [],
  "attention_points": [],
  "user_action_needed": null,
  "exam_progress": {
    "exam1": {"paper_generated": false, "reviewed": false},
    "exam2": {"paper_generated": false, "reviewed": false},
    "exam3": {"paper_generated": false, "reviewed": false}
  },
  "courseware_review": {
    "primary_after_framework": false,
    "targeted_after_exam1": false,
    "final_sweep": false
  },
  "coaching_signals": {
    "memorization_difficulty": false,
    "framework_unclear": false,
    "fatigue_or_low_initiative": false,
    "pace_risk": false
  },
  "active_user_question": null,
  "last_state_update": "ISO-8601 timestamp"
}
```

Allowed phase order:

```text
intake
→ capability_check
→ source_coverage
→ exam_rules_lock
→ evidence_index
→ knowledge_framework
→ primary_courseware_review
→ course_questions
→ homework_mapping
→ exam1_generated
→ exam1_reviewed
→ targeted_courseware_review
→ exam2_generated
→ exam2_reviewed
→ recitation
→ exam3_generated
→ final_courseware_sweep
→ final_sprint
```

Hard rules:

- Do not move to a later phase unless the previous phase is complete or explicitly skipped by the user.
- Do not generate Exam 2 until Exam 1 is generated and reviewed/skipped.
- Do not generate Exam 3 until Exam 1 and Exam 2 mistakes/questions are summarized or explicitly unavailable.
- Do not generate the final sprint until recitation inputs exist or the user requests emergency mode.
- When the student interrupts with a conceptual question, answer it with source citations, log it to `02_analysis/weak_points.md` if it reveals confusion, then resume the saved `current_phase`.
- At the start or end of every major response, show a status block:

```text
Current step:
Done:
Attention:
User action:
Next:
Blocked:
```

`Attention` must name the concrete risk or focus right now, such as unread S1 transcript, original courseware review due, Exam 1 mistake pattern, memorization fatigue, unclear framework, or pace risk.

### Hermes Agent / Scheduled Follow-up Gate

If the agent can create cron jobs, reminders, scheduled tasks, or message-gateway follow-ups, use them as part of the study workflow. Read `references/hermes-agent.md` before proposing or creating these tasks.

Hard rules:

- Do not create tasks silently. Ask the user to confirm time, channel, and purpose.
- After a plan, paper, mistake review, recitation pack, sleep block, or final sprint sheet is produced, ask whether to create a follow-up check.
- After generating a timed paper, ask whether to start timing now or check at a chosen time.
- Record accepted tasks in `logs/followup_tasks.md`.
- Keep message reminders short: progress check, recall prompt, stuck-point collection, or next-action reminder.
- When the user replies through QQ/WeChat/app messages, update `logs/session_state.json`, `02_analysis/weak_points.md`, `04_mistakes/mistake_log.md`, and `logs/followup_tasks.md` as appropriate.

### Active Coaching Feedback Gate

Many students will not diagnose their own learning problems. The agent must infer likely problems from feedback, pace, mistakes, silence, and repeated `stuck` signals, then offer concrete next actions.

Read `references/active-coaching.md` when the student reports fatigue, low initiative, memorization difficulty, unclear framework, slow progress, repeated mistakes, or anxiety.

Hard rules:

- Do not wait for the user to name the problem. If the pattern is visible, state the likely learning bottleneck gently and propose one next action.
- If concepts or recitation are hard to memorize, suggest low-friction movement recall: walk outside, pace in the hallway, or use voice recall while reviewing 3-5 items.
- If the framework is unclear, pause new questions and rebuild a concept chain or relation map before continuing.
- If the student keeps missing details, schedule or run targeted original courseware review.
- If the student is tired or low-initiative, reduce the next task to a 5-15 minute action and propose a reminder rather than pushing a long artifact.
- If pace risk appears, compress the plan and explicitly say what will be skipped, what is protected, and why.
- Log inferred signals in `logs/session_state.json` and update `02_analysis/weak_points.md` or `05_recitation/recitation_pack.md` when useful.

### External Knowledge Base Gate

If materials are accessed through Tencent ima, Kimi, Tongyi Tingwu, or another knowledge-base/transcription product, read `references/knowledge-base-platforms.md` and maintain retrieval discipline.

Hard rules:

- A knowledge-base upload is not proof of full reading.
- A retrieved generated answer or vague snippet is secondary evidence, not original evidence.
- Important claims require a retrieval receipt with platform, query, retrieved document, original source location, evidence type, and confidence.
- For objective questions, verify the current stem, every option, and the original source before using answer letters.
- Review recordings count as S1 only after transcript/timestamp evidence exists.

### Correction Incident And Evolution Gate

If the user challenges an answer, a source conflict appears, a correction is needed, or the agent discovers a previous artifact is wrong, read `references/evolution-and-incident-review.md` and run the Correction Incident Gate.

Hard rules:

- An apology is not enough. Re-check the original source, classify the error, correct the answer, and record the prevention rule.
- Record incidents in `logs/correction_incidents.md`.
- Correct any affected question bank, exam, answer key, recitation pack, or final sprint sheet.
- Use incidents, weak points, and message replies to adapt the next drill, reminder, paper, or recitation item.
- At the end of a course run, create `logs/post_run_retrospective.md` and `logs/skill_improvement_candidates.md`.
- Do not edit the canonical skill itself during an active exam run unless the user explicitly requests a skill update.

## Quality Checks

Quality checks are mandatory for every major artifact. The assistant must run them before showing the artifact to the student. If the artifact fails, revise it before delivery or say exactly what missing input blocks quality.

### Universal Artifact Quality Check

Every `knowledge_framework.md`, `course_questions.md`, homework map, exam, answer key, mistake review, recitation pack, and final sprint file must pass:

| Check | Pass standard |
|---|---|
| Evidence | Important claims cite course source, teacher transcript, homework, page, slide, timestamp, or are clearly labeled inference |
| Original-source verification | Specific questions, cases, examples, formulas, and concept clarifications are checked against the original slide/page/transcript/question when available; secondary indexes are labeled secondary |
| Exam alignment | Scope, marks, question types, difficulty, and priorities follow `logs/exam_rules.md` and S0/S1 evidence |
| Direct study value | The file can be studied directly without reopening source materials for basic explanations |
| Specificity | Uses course-specific concepts, numbers, cases, formulas, teacher language, or homework patterns; not generic textbook filler |
| Subject/entity clarity | Explanations identify the relevant parties, objects, variables, actors, texts, events, mechanisms, or concepts and show their relationships before drawing conclusions |
| Completeness | Covers the required phase inputs and names any missing high-priority sources |
| Difficulty calibration | Matches the selected mode: pass, standard, high-score, or pressure simulation |
| Time cost | The next action fits the student's remaining time and does not overload the schedule |
| Feedback loop | Weak points, mistakes, or user questions feed into the next artifact |
| Non-repetition | Reused knowledge points appear as variants, not duplicated questions |
| Honesty | Does not claim to read unavailable files, does not promise scores, and does not hide uncertainty |

### Quality Check Report

At the end of each major artifact, include a compact report:

```markdown
## Quality Check
- Evidence grounding: pass / partial / blocked
- Original-source verification: pass / partial / blocked
- Exam alignment: pass / partial / blocked
- Direct study value: pass / partial / blocked
- Subject/entity clarity: pass / partial / blocked
- Difficulty calibration: pass / partial / blocked
- Missing or weak inputs:
- What I revised before delivery:
- Next quality risk:
```

If any item is `blocked`, do not proceed to the next phase unless the student explicitly accepts lower confidence.

### Garbage Output Red Flags

Treat these as failures:

- A framework that mostly lists chapters, filenames, or IDs without teaching the content.
- A mock exam that copies old papers, ignores this year's teacher rules, or uses generic questions unrelated to course materials.
- An answer key that gives only answers without reasoning, marking points, or common mistakes.
- A recitation sheet that says "review formulas" but does not include the formulas.
- A final sprint sheet that sends the student to search other files for core content.
- A long artifact whose length comes from filler, repeated warnings, or generic study advice rather than examinable content.
- A coaching response that answers from general knowledge before checking the courseware.
- A correction or answer that copies an answer letter from an index, search result, OCR fragment, or previous generated file without verifying the original stem/options/source.
- A concept, case, formula, event, or question explanation that never identifies the relevant subject, object, variable, actor, text, mechanism, or relationship.
- A progress plan that is impossible to execute in the remaining time.

### Difficulty and Score Target Calibration

Do not describe the skill only as "60+ floor, 80 stretch" when the user has enough evidence and time for high-score mode. Select one mode:

| Mode | Use when | Output behavior |
|---|---|---|
| Pass mode | 2-4h, incomplete materials, low confidence | Focus on must-know points and easy marks |
| Standard mode | 6-10h, most materials readable | Aim for broad coverage and 75-85 readiness |
| High-score mode | 10-12h+, materials complete, teacher review priorities available | Add harder variants, precise recall, and answer-language polish |
| Pressure simulation mode | After framework and at least one review cycle | Make Exam 2/3 slightly harder than the expected paper while staying in scope |

Pressure simulation must be harder by reasoning depth, mixed conditions, time pressure, or distractor quality. It must not become random,超纲, or disconnected from teacher evidence.

## Learning-Artifact Quality Gates

These gates are mandatory because students are time-constrained. If an output fails any gate, rewrite it before moving on.

### Knowledge Framework Gate

`02_analysis/knowledge_framework.md` must be a teacher-style course walkthrough. It is not enough to list chapters, file names, confidence, or source categories.

Required:

- Start with the course's central question: what problem this course teaches the student to solve.
- Build a concept chain showing how chapters connect.
- For each major chapter/module, explain: what this module is for, core concepts in plain language, must-know formulas or procedures, likely exam forms, easy traps, and source locations.
- Include course-specific concepts, features, and foundation knowledge, not generic placeholders.
- Use source locations as citations, but do not let traceability tables replace explanation.
- Include must-memorize items and confusing-pair contrasts that are directly usable for recall.

Reject:

- A bare "chapter tree + knowledge IDs" with no explanation.
- A framework where the student must still open the book to understand every concept.
- A long confidence/evidence table presented as the main learning artifact.

### Answer-Key Teaching Gate

Every exam answer key must teach. It is not enough to provide the correct option or final number.

Required:

- For each objective question, include the answer, related K IDs, a 2-4 sentence explanation, and a "common mistake / what this reveals" note.
- For calculation questions, include cash-flow or variable identification, formula selection, step-by-step calculation, conclusion, and one feedback note.
- For short-answer questions, provide a memorisable exam-language answer plus marking points.
- Include a review table mapping wrong question ranges to weak knowledge points and next drills.

Reject:

- Choice answers with no explanation.
- Calculation answers that skip why a formula applies.
- Answer keys that do not feed back into `mistake_log.md` or `weak_points.md`.

### Concept, Case, and Question Clarification Gate

Concept explanations, case analyses, question corrections, and coaching responses must reduce confusion rather than add uncertainty. This gate applies across all university subjects. A response that blurs the subject/entity, skips relationships, invents reasoning, or uses external knowledge instead of original course evidence is a failed artifact.

Required:

- **Original-source verification**: If the concept, question, or case appears in courseware, verify the original source before answering. For objective questions, verify stem, options, and answer. For cases, verify the original case facts and course analysis. For formulas/examples, verify the original variables, assumptions, and conclusion.
- **Subject/entity relationship map**: Start with a compact map of the relevant parties, objects, variables, actors, institutions, texts, events, mechanisms, or concepts. Pick the map style by discipline:
  - Law/management: subject → action → responsibility/right → evidence.
  - STEM/engineering: object/system → variables → assumptions/conditions → mechanism/formula → result.
  - Economics/management: actor → incentive/constraint → decision → outcome.
  - Humanities/social science: person/institution/concept/event → relation → cause/evidence → conclusion.
- **Course-first reasoning**: Every rule, formula, theory, case conclusion, or interpretation applied in the answer must be traceable to a specific course source when available. If the courseware does not cover a point, say `课件/资料未明确涉及此点` and label any explanation as inference.
- **Special-case flagging**: If the question involves an exception, boundary condition, changed assumption, special event, unusual case fact, or modified formula/model, explicitly separate: general rule/model → what's special here → course source for the special handling → final conclusion.
- **Deep-but-fast explanation**: Explain in plain language first, then give the exam-ready version. The student should leave with a clear mental model, not just a copied answer.
- **Exam-ready answer format**: Provide a concise version the student can write on an exam. Include a 3-5 point quick-recall structure when useful.

Reject:

- Any answer that starts from general knowledge when the original course source is available but unchecked.
- Any objective-question correction based only on answer letters from an index, old generated file, search result, or memory.
- Any case analysis that adds unsupported conclusions not found in the source or not clearly labeled as inference.
- Any explanation with vague subjects such as "it was changed", "the result happened", "the variable increases", or "the system failed" without saying what acted on what.
- Any response that leaves the student still unsure about who/what/which condition causes which conclusion.

### Courseware Question Bank Gate

`02_analysis/course_questions.md` must be a complete, navigable, self-teaching question bank extracted from courseware (PPT, lecture notes, handouts). It is not enough to list questions with bare answers.

Required:

- Extract ALL practice questions found in courseware: choice (single/multiple), short-answer, case analysis, calculation, and discussion questions. Do not omit any. If a question is partially legible, include it with a note.
- Open with a **categorized index table** at the top of the file. Each row has: a short question keyword, question type, and an anchor link (`[→](#anchor-id)`) that jumps to the full question below. Categories must follow the course's knowledge structure (e.g., "Contract Law Basics", "Construction Contract Management"), not slide order.
- For each question, include: full question stem, all options (if applicable), correct answer, and a **detailed explanation** that teaches why the answer is correct and why distractors are wrong. For case, discussion, formula, or concept questions, include a compact relationship map before step-by-step reasoning.
- Include a **source trace** for each question: original file name + slide number / section / page. This is the student's way to go back to the courseware for context. Format: `[Source: filename.pptx, Slide N]` or `[Source: filename.pdf, PXX]`.
- For questions that share a knowledge point or are natural pairs (e.g., "design contract deposit 20%" vs "design contract over half = full fee"), place them near each other and add a cross-reference note.
- Group questions by knowledge area under clear headings (`## A. Knowledge Area Name`). Within each group, use sequential IDs (S01, S02... for objective; C01, C02... for cases).

Reject:

- A question list with answers but no explanations.
- An index that only lists question numbers without keywords or anchor links.
- Questions with no source trace back to the original courseware.
- A file with no index at all, forcing the student to scroll through everything to find a topic.

### Final-Sprint Self-Contained Gate

`06_final/final_sprint.md` must be a last-page memory sheet, not a navigation checklist.

Required:

- Include the formulas, concept contrasts, mini answer templates, common traps, and last-minute recall prompts inside the file itself.
- If it says "review confusing points" or "memorize formulas", the confusing points and formulas must be written immediately below.
- Include a 3-minute or 10-minute emergency version for students with very little time.

Reject:

- A checklist that only says "look at the framework" or "review formulas" without listing the content.
- A final sprint that requires the student to search other files for basic material.

## Capability Check

Before processing course materials, list available and missing capabilities, then install or enable missing tools when possible:

| Material / Need | Capability to check | If missing |
|---|---|---|
| Homework photos or screenshots | image understanding, OCR, or vision plugin | Tell the student OCR/vision is needed for image homework, then install/enable a vision/OCR tool if the platform permits. If blocked, ask for clearer images, text transcription, explicit skip, or lower-confidence continuation. |
| PDF textbooks or handouts | PDF text extraction or document parser | Tell the student PDF extraction is needed, then install/enable a PDF/document tool if possible. If blocked, ask for extracted text or key pages. Do not infer unseen PDF content. |
| PPT/PPTX slides | slide parser, Office/LibreOffice export, or document tool | Tell the student slide extraction is needed, then install/enable a slide/document parser if possible. If blocked, ask for exported PDF/images/text. |
| DOCX notes | DOCX parser or document tool | Tell the student DOCX parsing is needed, then install/enable a DOCX/document parser if possible. If blocked, ask for pasted text or exported PDF. |
| Review recordings or other audio | transcript or audio transcription tool | Tell the student transcription is needed because review recordings are S1 sources, then install/enable transcription if possible. If blocked, ask for transcript or key timestamps. Do not let lower-tier sources replace unread teacher review audio. |
| Spreadsheets or tables | XLSX/CSV parser or spreadsheet tool | Tell the student table parsing is needed, then install/enable a spreadsheet parser if possible. If blocked, ask for CSV export or screenshots plus OCR. |
| Archives | zip/7z extraction | Tell the student archive extraction is needed, then extract with available tools or install/enable an archive tool. If blocked, ask the student to unpack the archive. |
| Web exam conventions | web search/browser | Use browser/search if available; if missing and the web signal matters, request the needed tool or ask the user to provide links/text. |
| Persistent artifacts | filesystem write access | Treat this as blocked for official FinalsPilot. Ask the user to switch to an installed/file-based agent or explicitly accept a non-supported manual run. |

If a capability is missing and installable, the default action is: explain why it is needed, install/enable it, smoke-test it, and continue. Only fall back to text export/transcription, skip, or lower-confidence continuation when installation is unavailable, unsafe, denied, or fails.

## Quick Workflow

1. **Check capabilities and install tools**: Identify which files can actually be read in the current platform and which require OCR, document parsing, transcription, web, archive, spreadsheet, or file-write tools. Create `logs/tool_readiness.md`, explain missing tools to the student, install/enable what the agent can safely install, smoke-test representative files, then start `logs/session_state.json`.
2. **Initialize workspace**: If no organized course folder exists, run `scripts/init_qimo_workspace.py <target-folder>` or create the same structure manually. Accept raw unsorted course materials in `00_inbox/`.
3. **Auto intake materials**: If the materials are inside Chaoxing/Learning通, run the companion `chaoxing-materials` workflow before ordinary folder intake: confirm a user-approved output folder outside the repo, reuse browser login, open the target course/chapter, download accessible chapter PDFs by default, verify the files, and create `manifest/materials-manifest.md/json`. Download source files, video, or audio only when the student opts in or the PDF is insufficient. If a manifest exists, seed `logs/source_coverage.md` from it before scanning the folder: `01_pdf_for_ai/` becomes the default courseware reading set, `02_source_files/` is optional original evidence, and `03_video_audio/` is optional recording evidence. Then classify any remaining loose files into PPT/PDF, textbook/reference, recordings/transcripts, homework, review重点, past exams, charts/tables/figures, and other. Assign priority tier S0-S6 and ask only about low-confidence or high-impact ambiguities.
4. **Build source coverage ledger**: Create `logs/source_coverage.md` before synthesis. Mark every source complete, partial, unreadable, or skipped. Stop on unread S0/S1/S2 sources unless the user explicitly accepts lower confidence.
5. **Collect and lock exam info**: Ask only for missing high-impact details: course name, exam scope, question types/marks, duration, open/closed book, target score, available time, and whether Hermes-style timed reminders/message check-ins should be used. Save current rules to `logs/exam_rules.md`.
6. **Build evidence index and priority map**: Scan all readable files, list usable and unreadable sources, note weak OCR/transcript quality, create `logs/evidence.md`, and create `logs/source_priority.md`. Extract teacher review-recording priorities before using past papers.
7. **Extract framework**: Produce `02_analysis/knowledge_framework.md` as a teacher-style course walkthrough with the course's central question, concept chain, module explanations, source locations, A/B/C priority, confusing pairs, difficult points, likely question types, and must-memorize items. Do not output only a chapter tree or evidence index.
8. **Primary original courseware review**: Guide the student through a 60-80 minute PPT/PDF/handout review after the framework and before Exam 1. Update `02_analysis/courseware_review.md` with missed details, teacher-style signals, framework corrections, and items to add to exams or the final sheet.
9. **Extract and map figures**: For engineering or chart-heavy materials, create a figure inventory, chart/table descriptions, and figure-to-knowledge mappings before generating figure-based questions.
10. **Map homework to knowledge**: If homework photos, screenshots, textbook exercises, or assigned after-class questions are readable or transcribed, create a full homework question bank, solve each question from course knowledge, and map each question to knowledge IDs, prerequisite concepts, style, difficulty, and variant potential.
11. **Extract courseware questions**: Scan all PPT slides, lecture notes, and handouts for in-class practice questions (choice, case analysis, short-answer, calculation). Extract ALL questions into `02_analysis/course_questions.md` with a categorized anchor-linked index at the top, full question text, answers, detailed explanations, and source traces (file + slide/page). Group by knowledge area, not slide order. This step runs before exam generation — the courseware questions are a primary input for Exam 1.
12. **Coach understanding**: Let the student ask questions against the framework, homework solutions, courseware questions, figures, original courseware, and materials. When answering, run the Original Source Verification Gate first. Also run the Active Coaching Feedback Gate when the student's feedback suggests memorization difficulty, unclear framework, fatigue, pace risk, or repeated `stuck` points.
13. **Generate Exam 1**: Create a foundation paper aimed at passing level: broad coverage, mostly basic logic, answer key with teaching explanations, marking rubric, source trace, homework-style variants, and reproducible chart assets where useful. Must pass the Source Coverage Gate, Original Courseware Review Gate, and Quality Checks first. If scheduled tasks are available, ask whether to start timing now or create a check-in at a specific time/channel.
14. **Review Exam 1 and targeted courseware review**: Grade or help self-grade, update `04_mistakes/mistake_log.md`, then run a 30-40 minute targeted courseware review against wrong questions, uncertain concepts, and suspicious AI explanations. If review exposes an agent error, run the Correction Incident Gate before continuing.
15. **Generate Exam 2**: Cover all S1 review-recording priorities together with Exam 1 gaps. Do not repeat Exam 1 questions; repeat important concepts through variants and deliberate practice, especially homework-derived concepts that overlap with review-recording emphasis. If scheduled tasks are available, propose a timed check and a post-paper review reminder.
16. **Review Exam 2 and return to materials**: Resolve remaining confusion by quoting or paraphrasing course materials, then produce `05_recitation/recitation_pack.md`. Use weak points and correction incidents to adapt the recitation pack. If memorization difficulty appears, suggest movement recall or voice recall rather than more passive reading.
17. **Run rolling recitation and sleep**: Use concentrated rolling recitation: first pass all A/B points, second pass only weak points, third pass closed-book recall. Preserve sleep, especially a 05:00-07:00 block if that is the student's plan. If scheduled tasks are available, propose short recall prompts and wake-up reminders through the approved message channel.
18. **Morning retrieval and Exam 3**: Start with short recall, then generate Exam 3 using current exam rules, S1 review priorities, course materials, homework pattern analysis, figure pattern analysis, and prior mistakes/questions. Use past papers only as historical hints unless confirmed by S0/S1. Exam 3 should be comprehensive, diagnostic, and focused on reaching the stretch target.
19. **Final courseware sweep**: Run a 20-30 minute final original-courseware sweep for teacher-style details, formula conditions, tables, figures, examples, and likely objective-question details. Add only high-yield discoveries to the final sprint.
20. **Final pack**: Produce `06_final/final_sprint.md` as a self-contained last-page memory sheet with must-memorize formulas, confusing-point contrasts, exam-language answer templates, last-hour checklist, and exam strategy. Run the Quality Check Report before delivery.
21. **Post-run evolution**: If the course run is ending, create a post-run retrospective and candidate skill improvements for user approval.

## Time Budget

Default to a 10-12 hour path:

- 0.5-1h: organize materials and collect exam info
- 1.5-2h: knowledge framework, priorities, confusing points
- 1.5-2h: original courseware review across primary review, targeted review, and final sweep
- 1.5-2h: Exam 1 plus review
- 2-2.5h: Exam 2 plus review
- 1.5-2h: material re-check and rolling recitation
- sleep block
- 1.5-2h: morning recall, Exam 3, final review

If the user has only 6-8 hours, skip full Exam 3 and produce a shorter mixed diagnostic. If the user has only 2-4 hours, skip full papers and produce framework, must-memorize list, and 20-30 high-yield questions.

## Output Standards

Every major output should include:

- `Current step`: exact workflow step and phase from `logs/session_state.json`.
- `Attention`: the current risk, bottleneck, or focus point the student should notice.
- `User action`: the one action the student should take now.
- `Purpose`: what this artifact is for.
- `Inputs used`: source files and source locations. Use confidence only for unreadable or degraded sources; do not make confidence scoring the main artifact.
- `Tool readiness`: available / installed / needs approval / blocked, with unreadable file types and install results when relevant.
- `Source coverage gate result`: complete / partial with user-approved skips / blocked, with the high-priority unread list if any.
- `Source priority used`: S0-S6 evidence tiers used and any conflicts resolved.
- `Original-source verification`: original slide/page/transcript/question checked, secondary-only, conflicting, or unavailable.
- `Original courseware review`: not due / due now / completed primary / completed targeted / completed final sweep / skipped by user.
- `Quality Check`: pass / partial / blocked, including what was revised before delivery.
- `Correction/evolution status`: no incident / incident logged / artifact revised / next drill adapted.
- `Follow-up task status`: not available / not needed / proposed / scheduled / completed.
- `Active coaching`: no signal / memorization difficulty / unclear framework / fatigue-low initiative / pace risk / repeated stuck point, plus the next coaching move.
- `Subject/entity map`: the key parties, objects, variables, actors, texts, events, mechanisms, or concepts and their relationships when the output explains or corrects something.
- `Knowledge IDs covered`: IDs from the framework.
- `Source evidence`: source references or "inference" labels.
- `Next action`: what the student should do immediately.
- `State update`: what phase was completed and what next actions are allowed.
- `Learnability check`: one sentence confirming whether the artifact can be studied directly without opening other files for basic explanations.

For exams, also include:

- Student-facing paper without answers first.
- Separate answer key and marking rubric with teaching explanations for every question.
- Coverage table showing knowledge IDs and source evidence.
- Homework-pattern table when homework exists: original homework source, transformed concept, variant method, and non-copying check.
- Non-repetition check against previous exams.
- Difficulty mix and question-type distribution.

For the courseware question bank (`02_analysis/course_questions.md`), also include:

- A categorized index table at the very top, with anchor links for every question.
- Source trace for each question: `[Source: filename, Slide N / PXX]`.
- Total question count broken down by type (single choice, multiple choice, case analysis, etc.).
- Cross-references between related questions (e.g., "See also S16 for the under-half rule").
- A note at the end of each question pointing to the related knowledge ID(s) from the framework, so the student can cross-check against `knowledge_framework.md`.

For concept, case, formula, event, or question-correction answers (in question bank, exams, or coaching), also include:

- A discipline-appropriate relationship map at the top: party-action-responsibility for law/management; object-variable-condition-mechanism for STEM; actor-incentive-constraint-outcome for economics/management; person/institution/concept/event-cause-evidence-conclusion for humanities/social science.
- Original courseware citations in the courseware's own language, with source trace, before applying the rule, formula, theory, concept, or interpretation to the user's question.
- Explicit special-case flagging when the question deviates from the general rule/model: general rule/model → what's special → course source for special handling → how the conclusion changes.
- An exam-ready answer version the student can write directly on the exam, followed by a 3-5 point quick-recall structure.

## Course Workspace

Prefer this structure:

```text
course-folder/
  # Optional input produced by chaoxing-materials, usually outside the repo:
  # chaoxing-materials/
  #   01_pdf_for_ai/
  #   02_source_files/
  #   03_video_audio/
  #   manifest/
  00_inbox/
    ppt/
    textbook/
    recordings/
    transcripts/
    homework/
      photos/
      textbook_exercises/
    figures/
    auto_classified/
    review_materials/
    past_exams/
    other/
  01_extracted_text/
  02_analysis/
    knowledge_framework.md
    courseware_review.md
    course_questions.md    # courseware question bank with index
    weak_points.md
  03_exams/
    exam1_foundation/
    exam2_deliberate_practice/
    exam3_sprint/
  04_mistakes/
  05_recitation/
  06_final/
  logs/
    session_state.json
    tool_readiness.md
    source_coverage.md
    source_priority.md
    exam_rules.md
    followup_tasks.md
    kb_retrieval.md
    correction_incidents.md
    post_run_retrospective.md
    skill_improvement_candidates.md
    quality_checks.md
    evidence.md
    usage_log.md
```

Use `assets/course-workspace-template/` as a reference template if copying manually.

## Detailed References

- Read `references/workflow.md` when planning or running the full 10-12 hour path.
- Read `references/tool-readiness.md` when materials require PDF, PPT/PPTX, DOCX, OCR/vision, transcription, spreadsheet, archive, browser, or filesystem tooling that is missing or uncertain.
- Read `references/auto-intake.md` when the user provides one unsorted course folder or multiple course folders.
- Read `references/courseware-review.md` when planning or running original PPT/PDF/handout review.
- Read `references/active-coaching.md` when user feedback, progress, or silence suggests a learning bottleneck.
- Read `references/chart-agent-protocol.md` for engineering/quantitative courses, chart-heavy PDFs/PPTs, or exam questions that require reading or generating figures.
- Read `references/exam-rubric.md` before generating Exam 1, Exam 2, or Exam 3.
- Read `references/output-templates.md` when creating files or maintaining cross-platform consistency.
- Read `references/hermes-agent.md` when running inside Hermes Agent or any agent with cron, scheduled tasks, reminders, or QQ/WeChat/app message gateways.
- Read `references/knowledge-base-platforms.md` when using Tencent ima, Kimi, Tongyi Tingwu, or another knowledge-base/transcription product.
- Read `references/evolution-and-incident-review.md` when the user challenges an answer, an answer is corrected, a source conflict appears, or a course run is ending.
- Read `references/platform-notes.md` when adapting this skill to Codex, Claude Code, OpenClaw, OpenWork, Hermes, or another installed/file-based assistant.
