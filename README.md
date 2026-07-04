# University Finals Sprint

`university-finals-sprint` 是一个面向大学期末周的 Agent Skill。它的目标不是泛泛地“总结资料”，而是把一堆混乱的 PPT、教材、复习录音、老师重点、平时作业、往年卷和笔记，压缩成一条 10-12 小时可执行的期末复习路径。

一句话版：

> 把课程材料变成：资料覆盖表、老师重点优先级、知识框架、原课件阅览安排、课程题库、三轮模拟卷、错题复盘、背诵包、定时提醒和考前一张纸。

这个 skill 优先面向 Hermes、Codex、Claude Code、OpenCode 等安装式/文件式 agent。普通网页聊天 AI 如果不能安装 skill、读取文件、写入状态日志，就不是本项目支持的主要场景。

## English Summary

`university-finals-sprint` is an Agent Skill for university finals week. It turns messy course materials into a 10-12 hour evidence-grounded review sprint: source coverage, teacher-priority extraction, knowledge framework, original courseware review, courseware question bank, staged mock exams, mistake review, recitation pack, scheduled follow-ups, and a final memory sheet.

It is designed for installed/file-based agents such as Hermes, Codex, Claude Code, and OpenCode. Ordinary web-only chat without skill installation, file access, and persistent state is not the main supported path.

## 适合谁

- 期末前只剩 2-12 小时，但手上有 PPT、作业、老师最后一节课重点、复习录音或往年资料。
- 平时没有系统听课，需要先建立课程框架，再用模拟卷和错题快速补洞。
- 不想让 AI 看几页资料就开始胡编，需要强制它回到原 PPT、原题、原录音转写。
- 希望 agent 能主动推进节奏：定时提醒、检查进度、发现背诵困难、提示休息和复盘。

不适合：

- 想要“保证提分”或“保证过”的承诺。
- 没有课程资料，只想让 AI 用通用知识押题。
- 想用它替代诚信考试或完成不该由 AI 完成的作业。
- 只使用无法读取文件、无法持久化状态、无法安装 skill 的普通网页 AI。

## 核心流程

默认 10-12 小时路径：

| 阶段 | 产出 | 作用 |
|---|---|---|
| 1. 工具就绪与资料接收 | `logs/tool_readiness.md`, `logs/source_coverage.md` | 检查 PDF/PPT/DOCX/图片/录音能不能被读取；缺工具时说明原因并自动安装或启用 |
| 2. 考试规则锁定 | `logs/exam_rules.md` | 锁定本次考试范围、题型、分值、开闭卷、老师最新要求 |
| 3. 老师优先级提取 | `logs/source_priority.md` | 当前老师说明和复习录音优先，往年卷只作为弱提示 |
| 4. 知识框架 | `02_analysis/knowledge_framework.md` | 让学生先知道这门课在讲什么、重点链条是什么 |
| 5. 原课件阅览 | `02_analysis/courseware_review.md` | 在有框架后带着问题看 PPT/PDF，校准 AI 有没有漏掉老师风格和细节 |
| 6. 课程题库与作业映射 | `02_analysis/course_questions.md` | 抽取 PPT 例题、作业风格、常考变形 |
| 7. 卷一、卷二、卷三 | `03_exams/` | 从基础过线到高压综合模拟，逐轮暴露漏洞 |
| 8. 错题与背诵 | `04_mistakes/`, `05_recitation/` | 把错题、概念混淆、背诵困难转成下一步行动 |
| 9. 考前一张纸 | `06_final/final_sprint.md` | 自包含的最后记忆页，公式、概念对比、答题模板直接写进去 |

## 关键设计

### 1. 不读完资料，不准装作读完

Skill 要求 agent 建立 `source_coverage.md`。每个文件都要标记为 complete、partial、unreadable 或 skipped by user。老师复习录音、当前考试说明、PPT、作业等高优先级资料如果不可读，agent 必须停下来说明风险。

### 2. 缺工具时，agent 要自己处理

`v0.2.1` 起，University Finals Sprint 加入 Tool Readiness and Auto-Install Gate。Agent 需要先识别资料类型：

- PDF 需要 PDF 解析工具。
- PPT/PPTX 需要幻灯片解析或导出工具。
- DOCX 需要文档解析工具。
- 作业照片需要 OCR/视觉工具。
- 复习录音需要转写工具。
- 表格和压缩包也要有对应解析能力。

如果当前 agent 能安装或启用工具，它应该先告诉用户“为什么需要这个工具”，然后自动安装/启用并做一个小型读取测试。只有安装受限、失败或用户拒绝时，才退回到让用户导出文本、转写、跳过或低置信继续。

### 3. 老师当次说明优先

优先级顺序：

S0 当前老师考试规则
S1 老师复习录音/转写/口头重点
S2 当前 PPT、课件、复习资料
S3 平时作业、课堂题、教材习题
S4 教材和参考书
S5 往年卷、学长学姐资料
S6 网络和通用知识

往年卷不能覆盖今年老师的要求。老师说今年变了，就按今年重建。

### 4. 原课件阅览不是可有可无

University Finals Sprint 不鼓励一开始就让学生硬看 300 页 PPT。更好的位置是：

1. 先生成知识框架，让学生有地图。
2. 再安排 60-80 分钟原课件阅览。
3. 卷一后再用 30-40 分钟针对错题回看课件。
4. 卷三或考前再做 20-30 分钟最后扫尾。

这样既避免一脸懵地看课件，也避免完全相信 AI 摘要。

### 5. 答错要留下事故复盘

如果用户指出答案错了，agent 不能只道歉。它必须回到原 PPT/原题/原转写，检查题干、选项、案例事实和课程答案，记录根因，并更新后续产物。

## 使用案例

### 案例 A：工程合同管理

输入材料：

- 课程 PPT
- 课件例题
- 平时作业
- 老师最后一节课复习重点
- 往届题

典型产出：

- 合同管理知识框架
- 单选/多选/案例题库
- 合同案例关系图：当事人、行为、责任、结论
- 三轮模拟卷
- 考前一张纸

这个案例暴露了早期版本的问题：AI 曾经没有回到课件原题，直接凭通用知识或二手索引答题，导致答案错误。现在 skill 把“原始来源核验”写成硬门槛。

### 案例 B：工程经济学

输入材料：

- 300 页左右课程 PPT
- 工程经济学复习资料
- 往年卷
- 作业题和公式题

典型产出：

- 资金时间价值、方案比选、折旧、敏感性分析等知识链
- 公式适用条件和单位陷阱
- 计算题变式训练
- 卷一基础过线、卷二刻意练习、卷三综合冲刺

理工科课程会更强调变量、公式、条件、单位、计算步骤和陷阱。

### 案例 C：人文社科/管理类课程

输入材料：

- PPT 或讲义
- 老师划重点
- 案例材料
- 课堂讨论题

典型产出：

- 概念关系图
- 人物/制度/事件/原因/结论链条
- 简答题和论述题答题模板
- 高频概念对比

人文社科课程会更强调主体、关系、因果、证据、比较和考试表达。

## 推荐用法

把课程资料放到一个文件夹里，然后对 agent 说：

```text
Use $university-finals-sprint.
这是我的期末复习资料文件夹。请先检查你能不能读取所有 PDF、PPT、DOCX、图片和录音；缺工具时说明原因并自动安装/启用。然后建立 source_coverage、exam_rules 和知识框架。不要生成卷一，直到原课件阅览步骤完成。
```

如果使用 Hermes，并且你希望它通过 QQ、微信或其他消息网关提醒：

```text
Use $university-finals-sprint in Hermes mode.
我有 12 小时目标冲 85+。生成每个学习块之后，请问我要不要现在开始计时，或者在某个时间点通过消息网关检查进度。创建提醒前先让我确认时间、渠道和内容。
```

## 安装

克隆仓库：

```bash
git clone https://github.com/weixueshi04/qimost_v_0.1.5.git
```

然后选择一种方式：

- Hermes：把本仓库作为 skill 包或文件式工作区提供给 Hermes。推荐使用 Hermes 的 cron、提醒和消息网关能力。
- Codex：把仓库作为 repo-local skill 打开，或复制到 Codex skills 目录。
- Claude Code：使用 `.claude/skills/university-finals-sprint/` 包装入口，实际内容会转到根目录 `SKILL.md`。
- OpenCode：使用 `.opencode/skills/university-finals-sprint/` 包装入口。

详细说明见 [docs/agent-installation.md](docs/agent-installation.md)。

## 仓库结构

```text
.
├── SKILL.md                         # Canonical skill body
├── CHANGELOG.md                     # Version history
├── NOTICE.md                        # Ownership and maintainer-rights notice
├── AGENTS.md                        # Repo guidance for coding agents
├── agents/openai.yaml               # Codex UI metadata
├── .agents/skills/university-finals-sprint/    # Codex/OpenCode repo-local entry
├── .claude/skills/university-finals-sprint/    # Claude Code repo-local entry
├── .opencode/skills/university-finals-sprint/  # OpenCode repo-local entry
├── references/                      # Conditional operating notes
└── docs/
    ├── agent-installation.md
    └── release-process.md
```

根目录 `SKILL.md` 是唯一完整版本；隐藏目录里的 skill 文件只做转发，避免多份规则失控。

## 开发过程与理念

这个项目来自真实期末周使用，而不是从零空想出来的 prompt。

早期版本跑出了不错的结果：有科目达到 90 分出头，也有多门课程达到 80+。但使用过程中暴露出几个严重问题：

- AI 没有完整读取 PPT、录音、作业等材料。
- AI 会被用户临时追问打断，忘记当前流程。
- AI 会把往年卷分值和重点套到今年考试。
- AI 会抄二手答案索引，不回到原 PPT 核对题干和选项。
- AI 答错后只道歉，不把错误变成下一轮规则。

所以 University Finals Sprint 的理念是：

1. **先覆盖资料，再生成判断。**
2. **老师当次说明高于一切历史经验。**
3. **原始课件和原题优先于 AI 的聪明推理。**
4. **复习流程必须有状态，不能被一个问题打断后跳到最后。**
5. **输出宁可少，也不能垃圾。**
6. **agent 应该主动推进学生，而不是等一个已经很累的学生不断提醒它。**

## 与 Hermes Edu Skills 的关系

[Hermes Edu Skills](https://github.com/hezkvectory/hermes-edu-skills) 是一个更大的中文教育 skill pack，覆盖教材同步、备考复习、错题复盘、阅读写作、教师工具等场景。

University Finals Sprint 不试图替代它。更合适的定位是：作为 Hermes 教育生态中的一个大学期末深度场景 skill，专门处理“资料很多、时间很少、必须按老师重点冲刺”的场景。

如果 Hermes Edu Skills 接受外部 skill 推荐或收录，本项目适合作为：

- university-finals
- exam-prep
- cram-review
- source-grounded-review
- hermes-cron-study-plan

这类标签下的候选 skill。

## 隐私与边界

不要把真实课程资料、学生答案、录音转写、作业照片、生成试卷和错题日志提交到仓库。`.gitignore` 已经排除了常见课程材料和生成目录，但提交前仍要人工检查。

本项目是复习流程工具，不保证分数，也不鼓励违反学校考试或课程规则。

## 作者与维护权

University Finals Sprint 由 [weixueshi04](https://github.com/weixueshi04) 创建并维护。

欢迎提交 issue、建议、使用反馈和 pull request；但项目名称、核心规则、版本发布、合并决策、对外收录和后续修改权由原作者/维护者保留。未经原作者明确同意，不应以混淆方式声称自己是本 skill 的原作者，或将本项目重新发布为看似独立原创的同名/近似项目。

## Ownership And Maintainer Rights

University Finals Sprint is created and maintained by [weixueshi04](https://github.com/weixueshi04).

Issues, suggestions, usage reports, and pull requests are welcome. The original author/maintainer retains final control over the project name, core rules, version releases, merge decisions, external listings, and future modifications. Do not claim original authorship or republish this project in a confusing way without explicit permission from the original author.

## License

License 暂未确定。除非后续添加明确开源许可证，否则本项目默认保留所有权利。正式大范围传播或提交到外部 skill catalog 前，建议再确定 MIT、CC BY 4.0 或其他合适许可证。
