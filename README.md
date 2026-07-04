# University Finals Sprint

语言 / Language: 简体中文 | [English](README.en.md)

University Finals Sprint 是一个面向大学期末复习的 Agent Skill。它把 PPT、教材、复习录音、老师重点、平时作业、往年卷和笔记组织成一条可执行的 10-12 小时冲刺复习流程，并要求 agent 在生成结论前完成资料覆盖、证据分级、原始来源核验和阶段状态控制。

它的重点不是“总结一下课程”，而是让 agent 像一个可靠的期末复习协调器：先确认资料是否真的读到，再建立知识框架，安排原课件阅览，生成模拟卷，复盘错题，组织背诵，并产出考前最后一张记忆页。

## 核心能力

- **资料覆盖检查**：为每份材料记录读取状态、来源类型、优先级、页码/slide/时间戳和未解决问题。
- **工具就绪检查**：根据 PDF、PPT、DOCX、图片、录音、表格和压缩包等资料类型，要求 agent 安装或启用必要读取工具，并进行抽样读取测试。
- **老师优先级证据链**：当前考试规则和老师复习录音优先于 PPT、作业、往年卷和网络资料。
- **原始来源核验**：答题、纠错、解释概念和案例前，优先回到原 PPT、原题、原录音转写或原教材位置。
- **分阶段冲刺流程**：从知识框架、课程题库、卷一、卷二、卷三，到错题、背诵和 final sprint sheet。
- **主动复习推进**：在支持定时任务和消息网关的 agent 中，可提醒计时、检查进度、安排背诵和睡眠窗口。
- **纠错事故复盘**：答错时不止道歉，还要记录根因、修正产物，并把错误转化为后续防错规则。

## 输出物

一次完整课程运行通常会生成：

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

## 工作流

| 阶段 | 目标 |
|---|---|
| 1. 工具与资料接收 | 确认资料类型，安装或启用读取工具，建立资料覆盖表 |
| 2. 考试规则锁定 | 提取考试范围、题型、分值、开闭卷规则和老师最新说明 |
| 3. 证据优先级 | 按老师当次说明、录音重点、课件、作业、往年卷建立优先级 |
| 4. 知识框架 | 把课程拆成可复习的知识链、重点、易混点和高频题型 |
| 5. 原课件阅览 | 在已有框架后回看 PPT/PDF/讲义，校准遗漏和老师风格 |
| 6. 课程题库与作业映射 | 抽取课件例题、作业题和变式方向 |
| 7. 模拟卷与复盘 | 生成三轮不同定位的模拟卷，并通过错题调整后续复习 |
| 8. 背诵与考前页 | 生成背诵包、最后复习节奏和自包含的 final sprint sheet |

## 安装

克隆仓库：

```bash
git clone https://github.com/weixueshi04/qimost_v_0.1.5.git
```

推荐使用方式：

- **Hermes Agent**：适合需要定时提醒、消息网关、多端复习和长期状态保存的场景。
- **Codex**：打开仓库即可使用 repo-local skill wrapper。
- **Claude Code**：使用 `.claude/skills/university-finals-sprint/`。
- **OpenCode**：使用 `.opencode/skills/university-finals-sprint/`。

详细安装说明见 [docs/agent-installation.md](docs/agent-installation.md)。

## 调用示例

```text
Use $university-finals-sprint.
这是我的课程复习资料文件夹。请先检查你能读取哪些 PDF、PPT、DOCX、图片和录音；缺工具时说明原因并安装或启用。然后建立资料覆盖表、考试规则和知识框架。
```

Hermes 场景：

```text
Use $university-finals-sprint in Hermes mode.
我有 12 小时复习时间，目标是尽量冲高分。每生成一个学习块后，请询问是否现在开始计时，或在指定时间通过消息网关检查进度。
```

## 设计原则

University Finals Sprint 来自真实期末周使用。早期版本在实测中取得过 80+、90+ 的课程结果，也暴露出 AI 复习流程里常见的失败模式：资料没有读全、抄二手答案、被中途追问打断流程、用往年卷覆盖今年老师要求、答错后没有留下可复用的防错规则。

因此这个 skill 的核心原则是：

- 先确认资料覆盖，再生成框架和试卷。
- 老师本次说明高于往年资料和通用知识。
- 原始课件、原题、原录音转写优先于模型推理。
- 复习流程必须有状态，不能被临时问题打乱。
- 输出必须能直接用于学习，不能只给索引和空泛建议。
- 错误必须进入复盘和后续产物修正。

## 项目结构

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

根目录 [SKILL.md](SKILL.md) 是唯一完整规则来源。`.agents/`、`.claude/` 和 `.opencode/` 中的文件只是 repo-local wrapper。

## 隐私

不要提交真实课程资料、学生答案、录音转写、作业照片、生成试卷、错题日志或任何包含个人信息的复习产物。`.gitignore` 已排除常见课程材料和生成目录，提交前仍应人工检查。

## 作者与维护权

University Finals Sprint 由 [weixueshi04](https://github.com/weixueshi04) 创建并维护。

欢迎提交 issue、建议、使用反馈和 pull request。项目名称、核心规则、版本发布、合并决策、对外收录和后续修改权由原作者/维护者保留。详见 [NOTICE.md](NOTICE.md)。

## License

No open-source license has been granted yet. Unless a separate `LICENSE` file is added, all rights are reserved. See [NOTICE.md](NOTICE.md).
