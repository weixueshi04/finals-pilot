# Evolution And Incident Review

Use this reference when the user challenges an answer, an answer is discovered to be wrong, a source conflict appears, or a course run finishes and the skill should learn from the run.

## Correction Incident Gate

When the student says an answer is wrong, asks "who told you that?", points out a contradiction, or the agent discovers a source mismatch, stop normal flow and run this gate.

Do not defend the old answer from memory. Reopen the original source first.

Record the incident in `logs/correction_incidents.md`:

```markdown
## Correction Incident
- Time:
- Trigger: user challenge / self-check / source conflict / grading mismatch
- User question:
- Wrong answer given:
- Corrected answer after source check:
- Original source checked:
- Source priority tier:
- Error type:
  - original source not checked
  - secondary answer letter copied
  - stem/options not matched
  - past paper or old rule over-weighted
  - general knowledge substituted for courseware
  - subject/entity/condition relationship unclear
  - calculation/formula condition missed
  - unsupported case conclusion invented
- Root cause:
- Rule violated:
- Similar future triggers:
- Prevention rule for the next answer:
- Files updated:
```

After logging:

- Correct the answer.
- Update `02_analysis/weak_points.md` if the student was confused.
- Update `04_mistakes/mistake_log.md` if the error affects practice or exam review.
- Update the relevant artifact if the wrong answer already appeared in a question bank, exam, answer key, recitation pack, or final sprint sheet.
- Add a short note to the next Quality Check under `What I revised before delivery`.

## Autonomous Evolution Levels

University Finals Sprint should evolve at three levels.

### Level 1: Within The Current Study Block

Use mistakes, slow replies, `stuck` messages, and side questions to change the next action:

- Add a micro-drill.
- Explain a prerequisite concept.
- Lower or raise difficulty.
- Change the next reminder time.
- Reorder recitation items.

### Level 2: Within The Current Course Run

Use accumulated weak points and correction incidents to update course artifacts:

- Revise `knowledge_framework.md` confusing sections.
- Add question-bank cross-references.
- Regenerate weak questions as variants.
- Update recitation items and final sprint contrasts.
- Make Exam 2/3 target the user's actual weak points rather than a generic syllabus.

### Level 3: Across Course Runs

After the exam or final review, create `logs/post_run_retrospective.md`:

```markdown
## Post-run Retrospective
- Course:
- Exam date:
- Materials that mattered most:
- Materials that were missing or low quality:
- Highest-yield artifacts:
- Weakest artifacts:
- Correction incidents:
- Reminder/task usefulness:
- What should change in the next course run:
- Candidate skill changes requiring user approval:
```

Create `logs/skill_improvement_candidates.md` for proposed changes to the skill itself. Do not edit the canonical skill during an active exam run unless the user explicitly asks for a skill update.

## Non-Negotiable Rule

An apology is not a fix. A fix requires source re-check, incident classification, artifact correction, and a prevention rule.
