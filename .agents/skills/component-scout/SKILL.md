---
name: component-scout
description: >-
  Inspect external or sibling project codebases to scout candidate UI components, evaluate business coupling, assess generalization feasibility and cross-stack parity (React & Qt), and generate structured decision reports for users to pick components for adoption into cha-set. Use when scouting external components, analyzing third-party UI libraries for extraction, evaluating candidate components for generalization, or when the user mentions "component-scout", "scout component", "通用组件评估", "组件抽象评估", "挖掘通用组件", or "分析别的项目组件".
  Triggers: component-scout, scout-component, mine-component, eval-component, 通用组件评估, 组件抽象评估, 挖掘通用组件, 外部组件分析, 组件通用化.
---

<!-- PENGJ_TEMPLATE_START -->

# Component Scout & Generalization Assessment (组件勘探与通用化评估)

Scout candidate UI components from external projects, business repositories, or third-party libraries, analyze their reusability and business coupling, assess cross-stack feasibility (React Web & Qt Desktop), and generate structured decision reports enabling stakeholders to select components for adoption.

## Quick Start

Run the automated component scanner against the target directory to extract candidate components, line counts, and preliminary coupling heuristics:

```powershell
# 1. Scan external component directory and output summary
pwsh .agents/skills/component-scout/scripts/scan-components.ps1 -SourceDir "<path/to/external/project/src/components>"

# 2. Output structured JSON for automated pipelines
pwsh .agents/skills/component-scout/scripts/scan-components.ps1 -SourceDir "<path/to/external/project/src/components>" -OutputJson
```

---

## Standard 5-Step Evaluation Workflow

```
[1. Target Scan & Inventory] ──► [2. Coupling & Parity Rubric] ──► [3. Abstraction & API Proposal] ──► [4. Decision Report to User] ──► [5. Handoff to add-component]
```

### Step 1: Target Scan & Component Inventory (勘探与组件清单采集)
1. Locate the external component root directory or specific component files.
2. Execute `scan-components.ps1` to detect component files, exclude tests/stories, count lines of code, and flag business imports (`api/`, `service/`, `store/`, `redux`, `zustand`, `pinia`, `axios`, `fetch`).
3. Classify detected components into preliminary buckets (`DIRECT_ADOPT`, `ABSTRACT_AND_ADOPT`, `KEEP_IN_APP`).

### Step 2: Multi-Dimensional Coupling & Parity Rubric (四维解耦度与可行性研判)
Evaluate candidate components against the 4-dimensional rubric (see [REFERENCE.md](REFERENCE.md)):
- **Business Coupling (0-5)**: Assess presence of hardcoded APIs, domain entities, or business stores.
- **Generality & Utility (0-5)**: Determine if the pattern is common across multiple domains (e.g. Timeline, FilterBar, MetricCard, DiffViewer).
- **Cross-Stack Feasibility (0-5)**: Confirm whether it cleanly translates across React (Web) and Qt Quick / QML (Desktop) without exotic platform dependencies.
- **Design System Fit (0-5)**: Verify adaptability to design tokens (zero-`px`, color-contrast pairs, keyboard navigation, motion tokens).

### Step 3: Abstraction & Generic API Proposal (解耦重构与通用契约构想)
For candidates categorized as `DIRECT_ADOPT` or `ABSTRACT_AND_ADOPT`:
1. Apply the **5 Decoupling Patterns** (Data Inversion, Slot/Delegate Inversion, Controlled State, Tokenization, Cross-Stack Idioms).
2. Draft a proposed TypeScript specification interface (`spec/components/<name>.ts`).
3. Identify required props, slots/render props, and Qt QML property mappings.

### Step 4: Interactive Decision Report to User (出具结构化决策报告)
Generate an evaluation report artifact (`component-scout-report-<project>.md`) containing:
- **Executive Summary**: Total scanned, recommended counts by verdict.
- **Candidate Overview Matrix**: Name, Coupling Score, Generality Score, Cross-Stack Feasibility, Tier, Verdict, and Estimated Effort.
- **Deep-Dive & Proposed Contracts**: Current coupling pain points, proposed generic API interfaces, and dual-stack implementation plan.
- **User Decision Checklist**: Checkboxes allowing the user to select which components to adopt into `cha-set`.
- Prompt the user to confirm their selection.

### Step 5: Downstream Adoption Pipeline (一键衔接组件落地流水线)
Once the user confirms the selected components:
1. Transition directly into the `.agents/skills/add-component/SKILL.md` lifecycle.
2. Formally register the contract in `spec/components/<name>.ts` and capabilities in `spec/capabilities.json`.
3. Proceed with dual-stack implementations, living showcase documentation, and verification gates.

---

## Progressive Disclosure & Reference

- [Detailed Scoring Rubric, Decoupling Patterns & Tier Classification](REFERENCE.md)
- [Real-World Evaluation Report Example & Decision Checklist](EXAMPLES.md)

<!-- PENGJ_TEMPLATE_END -->

<!-- 以下为项目专属区域：模板更新只替换上方托管块，本区域归项目所有、完整保留。 -->
## 项目专属通用组件准入标准与双端规范 (cha-set Project Area)

在将外部组件引入 `cha-set` 前，必须严格满足本项目的工程红线与双端对齐规范：

### 1. 架构分层防线 (Architecture Quality Tier)
- **L1 基础视觉原语** (`Tag`, `Badge`, `Avatar`, `Indicator` 等)：必须能进行像素级同步（`pixel-sync`），且不能带有任何业务副作用。
- **L2 浮层与微交互** (`TourStep`, `GuidePopover`, `NotificationCard` 等)：必须满足前景色/背景色成对自洽、零黑色不可见文字隐患、键盘焦点漫游。
- **L3 桌面虚拟化与动力学原语** (`VirtualList`, `VirtualKanban`, `Waterfall` 等)：必须保障 60fps 平滑滚动、内存恒定、动效与滚动解耦。
- **L4 复合引擎** (`FilterBar`, `MetricCard`, `Timeline`, `PipelineView`, `DiffViewer` 等)：必须支持 JSON AST 序列化、多插槽组合与状态机双模。

### 2. 核心工程红线 (Golden Red Lines)
1. **绝对禁止硬编码业务模型**：严禁在 `spec/components/*.ts` 中出现特定业务字段（如 `orderId`, `customerId`），全部转换为泛型或键值映射。
2. **绝对禁止网络请求与外部 Store 导入**：组件必须为纯受控/非受控 UI 原语，通过回调（`onChange`, `onSearch`）向外发信。
3. **双端保真度红线 (SPAS 2.0)**：任何纳入 `cha-set` 的组件，必须同时具备 React 与 Qt QML 实现，并配套拥有 100% 对齐的 Living Showcase 文档（含 5 个标准锚点章节、真实 React 代码契约与等价交互沙盒）。
4. **度量规范**：严禁使用裸 `px` 单位，全面采用 Tailwind 语义缩放或 rem 比例；光标必须遵从 `spec/cursor-contract.json`。
5. **动效规范**：交互状态转换必须接入 `spec/tokens/primitives.json` 动效令牌，支持无障碍减弱动效开关。
