# FinalsPilot

语言 / Language: 简体中文 | [English](README.en.md)

一个把混乱课程资料变成 10-12 小时期末冲刺流程的 Agent Skill。

FinalsPilot 面向大学期末复习场景。它让 agent 先确认自己真的读到了课程资料，再根据老师最后一节课的重点、复习录音、PPT、作业、往年题和笔记，生成一条可执行的复习路线：建框架、看原课件、刷模拟卷、复盘错题、整理背诵包，最后压成考前一张纸。

如果课程资料在学习通/超星里，本仓库也提供 `chaoxing-materials` 配套 skill，用来下载用户账号可访问的章节课件。默认只下载适合 AI 阅读的 PDF，源文件、视频和音频保留为可选下载，生成资料清单后再交给 FinalsPilot。

这个项目不是“帮你总结一下课程”，而是把 agent 变成一个期末复习协调器。它会记录当前复习到了哪一步，提醒哪些资料还没核验，区分老师重点和往年资料的优先级，并在答错、跳步或产出质量不够时强制复盘。

## 核心能力

- **资料读取检查**：记录每份材料是否读到、读了哪里、还有什么没读。
- **工具准备检查**：遇到 PDF、PPT、DOCX、图片、录音、表格或压缩包时，要求 agent 说明需要什么读取工具，并在允许时安装或启用。
- **老师重点优先**：本次考试说明和老师复习录音高于 PPT、作业、往年题和通用知识。
- **原始资料核验**：答题、纠错、解释概念和案例前，优先回到原 PPT、原题、原录音转写或原教材位置。
- **分阶段冲刺**：从知识框架、原课件阅览、课程题库、三轮模拟卷，到错题、背诵和 final sprint sheet。
- **主动复习推进**：在 Hermes 等支持定时任务和消息网关的 agent 中，可以提醒计时、检查进度、安排背诵和睡眠窗口。
- **纠错事故复盘**：答错后记录根因，修正产物，并把错误转化成后续防错规则。

## 输出内容

一次完整运行通常会生成：

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

## 工作流程

| 阶段 | 目标 |
|---|---|
| 1. 工具与资料接收 | 确认资料类型，安装或启用读取工具，建立资料覆盖表 |
| 2. 考试规则锁定 | 提取考试范围、题型、分值、开闭卷规则和老师最新说明 |
| 3. 资料优先级排序 | 按老师本次说明、录音重点、课件、作业、往年题建立优先级 |
| 4. 知识框架 | 把课程拆成可复习的知识链、重点、易混点和高频题型 |
| 5. 原课件阅览 | 在已有框架后回看 PPT/PDF/讲义，校准遗漏和老师风格 |
| 6. 课程题库与作业映射 | 抽取课件例题、作业题和可能变式方向 |
| 7. 模拟卷与复盘 | 生成三轮不同定位的模拟卷，并用错题调整后续复习 |
| 8. 背诵与考前页 | 生成背诵包、最后复习节奏和 final sprint sheet |

## 安装

克隆仓库：

```bash
git clone https://github.com/weixueshi04/finals-pilot.git
```

推荐使用方式：

- **Hermes Agent**：适合需要定时提醒、消息网关、多端复习和长期状态保存的场景。
- **Codex**：打开仓库即可使用 repo-local skill wrapper。
- **Claude Code**：使用 `.claude/skills/finals-pilot/`。
- **OpenCode**：使用 `.opencode/skills/finals-pilot/`。

详细说明见 [docs/agent-installation.md](docs/agent-installation.md)。

## 调用示例

```text
Use $finals-pilot.
这是我的课程复习资料文件夹。请先检查你能读取哪些 PDF、PPT、DOCX、图片和录音；缺工具时说明原因并安装或启用。然后建立资料覆盖表、考试规则和知识框架。
```

Hermes 场景：

```text
Use $finals-pilot in Hermes mode.
我有 12 小时复习时间，目标是尽量冲高分。每生成一个学习块后，请询问是否现在开始计时，或者在指定时间通过消息网关检查进度。
```

## 学习通/超星资料下载

如果课件还在学习通/超星章节里，先使用配套 skill：

```text
Use $chaoxing-materials.
请打开我的学习通课程，进入指定课程和章节，把可访问的课件下载到我指定的资料文件夹。默认只下载 PDF，并生成 manifest。
```

首次使用时：

```powershell
npm.cmd install
```

常用命令：

```powershell
npm.cmd run chaoxing:login
npm.cmd run chaoxing:courses
npm.cmd run chaoxing:open-section -- <课程关键词> <章节关键词>
npm.cmd run chaoxing:download-current -- --output "<course-materials-folder>"
```

浏览器和登录说明：

- 默认优先使用 Chrome，找不到 Chrome 时使用 Edge；也可以设置 `CHAOXING_BROWSER_CHANNEL=edge` 或 `CHAOXING_BROWSER_CHANNEL=chrome`。
- 登录状态保存在 `automation/chaoxing/browser-profile`，不是你平时浏览器的个人资料。换浏览器或换 profile 后，可能需要重新登录一次。
- 下载器使用脚本的 HTTP fetch + 浏览器 cookie，不依赖迅雷、IDM 或浏览器下载插件。
- 浏览器扩展默认禁用；除非你显式设置 `CHAOXING_ALLOW_EXTENSIONS=1`，否则第三方插件不会参与下载。

默认下载结果：

```text
<course-materials-folder>/
  01_pdf_for_ai/
  manifest/
    materials-manifest.md
    materials-manifest.json
```

`FinalsPilot` 会把 `manifest/materials-manifest.json` 当作资料覆盖表的种子，把 `01_pdf_for_ai/` 当作默认可读课件。源文件、视频和音频不会默认下载；只有当 PDF 缺页、排版损坏、老师原文件很重要，或者用户明确需要录音/视频时，才使用 `chaoxing:download-source`、`chaoxing:download-media` 或 `chaoxing:download-all`。

## 设计原则

FinalsPilot 来自真实期末周使用。早期版本在实测中取得过 80+、90+ 的课程结果，也暴露出 AI 复习流程里常见的失败模式：资料没读全、抄二手答案、被中途追问打断流程、用往年卷覆盖今年老师要求、答错后没有留下可复用的防错规则。

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

根目录 [SKILL.md](SKILL.md) 是 FinalsPilot 的唯一完整规则来源。`skills/chaoxing-materials/SKILL.md` 是学习通/超星资料下载配套 skill 的规则来源。`.agents/`、`.claude/` 和 `.opencode/` 中的文件只是 repo-local wrapper。

## 隐私

不要提交真实课程资料、学生答案、录音转写、作业照片、生成试卷、错题日志或任何包含个人信息的复习产物。`.gitignore` 已排除常见课程材料和生成目录，提交前仍应人工检查。

## 作者与维护权

FinalsPilot 由 [weixueshi04](https://github.com/weixueshi04) 创建并维护。

欢迎提交 issue、建议、使用反馈和 pull request。项目名称、核心规则、版本发布、合并决策、对外收录和后续修改权由原作者/维护者保留。详见 [NOTICE.md](NOTICE.md)。

## License

本项目采用 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](LICENSE)（CC BY-NC-SA 4.0）许可协议。

你可以在署名、非商业、相同方式共享的条件下分享和改编本项目。项目名称、核心规则、版本发布、合并决策、对外收录和后续修改权仍由原作者/维护者保留，详见 [NOTICE.md](NOTICE.md)。
