# Original Courseware Review

Use this when the student needs to browse original PPT/PDF/handout files during University Finals Sprint.

## Purpose

Original courseware review is human calibration. It lets the student see the teacher's actual material, catch details the agent missed, and verify whether the AI-built framework matches the course.

## Placement

Use three review passes when time allows:

1. **Primary review after framework, before Exam 1: 60-80 minutes.** The student now has a map, so PPT browsing is guided instead of blind.
2. **Targeted review after Exam 1: 30-40 minutes.** Use wrong questions, uncertain concepts, and suspicious explanations as search targets.
3. **Final sweep after Exam 3 or before final sprint: 20-30 minutes.** Look for teacher-style details, examples, figures, tables, formula conditions, and one-page additions.

If only 2 hours are available, allocate roughly:

- 70 minutes primary review after framework,
- 35 minutes targeted review after Exam 1,
- 25 minutes final sweep,
- 10 minutes final-sheet insertion,
- 10 minutes buffer.

## Review Method

During review, the agent should provide a checklist, not another long lecture:

```markdown
## Courseware Review Checklist
- Does this slide support or contradict the framework?
- Is there a teacher-emphasis signal: repeated, bold, boxed, example-heavy, or unusually detailed?
- Is there a small detail that may become an objective question?
- Is there an example, table, figure, formula condition, or case not covered by the current artifacts?
- Does this page change the exam priority of any K ID?
- Does this page reveal an AI claim that needs correction?
```

## Output

Update `02_analysis/courseware_review.md`:

```markdown
## Courseware Review
- Pass: primary / targeted / final sweep
- Time spent:
- Pages/slides checked:
- New details found:
- Teacher-style signals:
- Framework corrections:
- Exam/question-bank additions:
- Final-sprint additions:
- AI claims to re-check:
- Next action:
```

Do not ask the student to read every slide with equal effort. The point is guided inspection.
