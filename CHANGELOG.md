# Changelog

## 0.2.1 - 2026-07-04

- Added a Tool Readiness and Auto-Install Gate so agents must explain missing document/OCR/transcription capabilities, install or enable tools when permitted, smoke-test extraction, and log remaining unreadable sources.
- Added `references/tool-readiness.md` with preferred reading capabilities and fallbacks for PDF, PPT/PPTX, DOCX, homework photos, audio/video recordings, spreadsheets, archives, web pages, and local folders.
- Updated the Capability Check, Quick Workflow, output standards, and workspace logs to include tool readiness and install results.
- Renamed the primary skill to `university-finals-sprint` and removed older alias wrappers.
- Rewrote `README.md` as a normal Chinese GitHub project page and added `README.en.md` for English readers.
- Added explicit author/maintainer-rights notice and removed draft-style license suggestions from the README.

## 0.2.0 - 2026-07-04

- Added a required Original Courseware Review Gate with a 60-80 minute primary review after the framework, a 30-40 minute targeted review after Exam 1, and a 20-30 minute final sweep.
- Added `references/courseware-review.md` for guided PPT/PDF/handout inspection and `02_analysis/courseware_review.md` output.
- Added an Active Coaching Feedback Gate and `references/active-coaching.md` so agents infer memorization difficulty, unclear frameworks, fatigue, low initiative, pace risk, and repeated stuck points.
- Expanded `logs/session_state.json` with current step labels, attention points, user action needed, courseware review status, and coaching signals.
- Reworked the workflow from 18 to 21 steps so courseware review, targeted review, final sweep, and post-run evolution are explicit.
- Removed support burden for ordinary web-only AI usage without skill installation, file access, and persistent state. Hermes message gateways remain supported as part of installed agent workflows.

## 0.1.9 - 2026-07-02

- Added Hermes-first active coordination with scheduled follow-up tasks, cron/reminder prompts, and QQ/WeChat/app message-gateway guidance.
- Added `references/hermes-agent.md` for timed paper checks, recitation reminders, sleep/wake prompts, reply handling, and task logging.
- Added `references/knowledge-base-platforms.md` to constrain Tencent ima, Kimi, Tongyi Tingwu, and similar knowledge-base retrieval workflows.
- Added `references/evolution-and-incident-review.md` with correction incident logs, root-cause classification, post-run retrospectives, and skill-improvement candidates.
- Added lightweight reference files for workflow, auto-intake, chart handling, exam rubrics, output templates, and platform notes so all `SKILL.md` reference links resolve.
- Updated the main workflow, output standards, and course workspace logs for follow-up tasks, retrieval receipts, correction incidents, and autonomous evolution.

## 0.1.8 - 2026-07-02

- Added an Original Source Verification Gate so answers to specific questions, cases, concepts, formulas, events, and teacher examples must check the original slide/page/transcript/question when available.
- Added a no-second-hand-answer rule: answer letters, indexes, OCR snippets, search results, and previous generated files cannot be trusted until the original stem/options/facts are verified.
- Reworked the case-analysis gate into a cross-discipline Concept, Case, and Question Clarification Gate for STEM, engineering, economics, management, humanities, and social science courses.
- Added subject/entity relationship mapping so explanations must clarify parties, objects, variables, actors, texts, events, mechanisms, and their relationships before giving conclusions.
- Expanded Quality Checks and output standards to include original-source verification and subject/entity clarity.

## 0.1.7 - 2026-07-02

- Added mandatory Quality Checks for every major artifact so shallow, generic, unverifiable, or badly aligned outputs must be revised before delivery.
- Added a compact Quality Check Report format covering evidence grounding, exam alignment, direct study value, difficulty calibration, missing inputs, and next quality risk.
- Added garbage-output red flags for frameworks, mock exams, answer keys, recitation packs, final sprint sheets, coaching responses, and impossible plans.
- Added difficulty and score target calibration modes: pass, standard, high-score, and pressure simulation.

## 0.1.6 - 2026-07-02

- Added a mandatory source coverage ledger to prevent skipped PPT, audio, image, homework, and review materials from being treated as read.
- Added a source priority hierarchy: current teacher instructions and review recordings override PPT/courseware, homework, past papers, and general knowledge.
- Added `logs/exam_rules.md` as a current-exam rule lock so old paper marks and patterns cannot silently override this year's teacher guidance.
- Added `logs/session_state.json` and a strict phase state machine to reduce step-jumping when the student asks side questions mid-workflow.
- Added side-question handling: answer the question, record weak points when relevant, then return to the saved workflow phase.
- Added low-tool / web chat checkpoint mode with a pasteable `STATE SNAPSHOT` for platforms that cannot reliably read files or persist state.
- Added GitHub-ready repository documentation, agent installation notes, repo-local wrappers for Codex/Claude Code/OpenCode, OpenAI UI metadata, and privacy-oriented `.gitignore`.
- Shortened the skill frontmatter description for cross-agent compatibility.
