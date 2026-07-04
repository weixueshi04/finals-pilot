# Hermes Agent Operating Notes

Use this reference when University Finals Sprint runs inside Hermes Agent or another agent that can persist files, create scheduled tasks, and send messages through QQ, WeChat, or another message gateway.

## Operating Model

Hermes should be treated as the active study coordinator, not just a chat box.

- Keep the course workspace as the source of state: `logs/session_state.json`, `logs/source_coverage.md`, `logs/exam_rules.md`, `logs/followup_tasks.md`, `04_mistakes/mistake_log.md`, and `02_analysis/weak_points.md`.
- Use message channels for short prompts, check-ins, recall questions, and status collection.
- Keep long artifacts in files. Do not push a full mock paper or long framework through a message gateway unless the user asks for it.
- Never create, modify, or cancel a scheduled task silently. Ask for confirmation of time, channel, and purpose.

## When To Propose Scheduled Tasks

Always propose a follow-up task when one of these happens:

- A speedrun plan is confirmed.
- Exam 1, Exam 2, or Exam 3 is generated.
- A timed paper starts.
- A mistake review is completed.
- Original courseware review is due or completed.
- The agent detects memorization difficulty, unclear framework, fatigue, low initiative, pace risk, or repeated stuck points.
- A recitation pack or final sprint sheet is produced.
- The user says they will study later, sleep, commute, eat, or leave the computer.

Prompt pattern after paper generation:

```text
卷一已经生成。要现在开始计时吗？
- 现在开始，45/60/90 分钟后检查
- 指定一个时间检查
- 暂不创建提醒
你想用哪个消息渠道接收提醒？
```

## Task Record

Record every accepted task in `logs/followup_tasks.md`:

```markdown
## Task: <short name>
- Created at:
- Platform/tool:
- Channel: QQ / WeChat / app / other
- Trigger time:
- Repeat:
- Course:
- Phase:
- Purpose:
- Message to send:
- Expected reply:
- On reply:
- Cancel/reschedule rule:
- Related files:
```

## Message Design

Messages should be short and action-shaped.

- Use one question per message.
- Prefer reply buttons or simple text replies when possible: `done`, `skip`, `stuck`, `A/B/C/D`, `need explanation`.
- For recall tasks, ask 1-3 focused questions, then wait.
- For progress checks, ask what happened and update state from the answer.
- If the user is stuck, trigger the Concept, Case, and Question Clarification Gate rather than pushing more content.

Examples:

```text
卷一 60 分钟到。回复：
done = 已完成
stuck + 题号 = 卡住
skip = 今天跳过
```

```text
睡前 10 分钟回忆：请默写 K03/K07/K11 的核心公式或三句话要点。不会就回 stuck。
```

## State Updates From Replies

When the user replies to a message task:

- Update `logs/session_state.json` with current phase and next action.
- If the reply reveals confusion, update `02_analysis/weak_points.md`.
- If the reply reveals memorization difficulty, unclear framework, fatigue, low initiative, or pace risk, run the Active Coaching Feedback Gate.
- If the reply reports wrong answers, update `04_mistakes/mistake_log.md`.
- If the reply challenges an answer or source, run the Correction Incident Gate.
- If the task is complete, mark it complete in `logs/followup_tasks.md`.

## Safety

- Do not spam. Default to one check-in per study block plus one short recall prompt unless the user asks for more.
- Confirm timezone and absolute date/time for reminders near midnight.
- Do not send sensitive exam materials to public or group channels unless the user explicitly approves.
- Include a simple cancel/reschedule path in every recurring plan.
