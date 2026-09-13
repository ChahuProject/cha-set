# 组件通用化研判与评估体系详解 (REFERENCE.md)

本文档系统阐述如何对外部项目（业务前端、Electron 客户端、兄弟项目或第三方参考库）中的 UI 组件进行深度通用化研判、耦合度测定、双端（React Web + Qt QML）可行性分析，以及将业务组件提炼为通用组件的解耦模式。

---

## 一、通用化研判四维量表 (The 4-Dimensional Rubric)

在评估外部组件是否适合纳入通用设计系统（如 `cha-set`）时，统一按以下四大维度进行 0~5 分量化打分（满分 20 分）：

```
总评分 (Score) = 业务解耦度 (Coupling) + 通用抽象价值 (Generality) + 双端对齐可行性 (Cross-Stack) + 体系规约契合度 (Design Tokens & Contract)
```

| 维度 (Dimension) | 0~1 分 (极低 / 阻碍) | 2~3 分 (中等 / 需重构) | 4~5 分 (极高 / 理想) |
| :--- | :--- | :--- | :--- |
| **1. 业务解耦度 (Decoupling Feasibility)** | 深度绑定特定 API 请求、硬编码业务字段（如 `orderId`、`userRole`）、依赖全局业务 Store（Redux/Pinia/Zustand） | 包含部分业务枚举或专用格式化逻辑，但核心视图结构相对独立，可通过提取 Props 剥离 | 纯视觉/纯交互逻辑组件，完全由受控/非受控 Props 驱动，零外部 API 依赖，零业务 Store 导入 |
| **2. 通用复用价值 (Generality & Utility)** | 特定业务场景的一次性活动弹窗、专有结账收银台、特定业务表单 | 具备一定共性的复合面板（如审计筛选栏、自定义操作树），在多于 2 个业务模块有类似需求 | 业界公认的标准 UI 模式（如时间轴 Timeline、指标卡 MetricCard、代码差异对比 DiffViewer、虚拟看板 Kanban） |
| **3. 双端对齐可行性 (Cross-Stack Parity)** | 极度依赖浏览器 DOM 私有 API（如特定 Canvas WebGL Hack、CSS Houdini、原生 contenteditable 复杂定制），Qt 端移植成本极高 | 具备明确视觉与交互规范，Qt Quick 有类似原语（如 Flickable/PointerHandler），但需要定制桌面微动效与光标 | 两端均有成熟生态对齐基建（React Tailwind + Base UI / Qt Quick QML），状态机与手势语义完全等价 |
| **4. 规范与令牌契合度 (Design System Fit)** | 硬编码大量非语义色值、固定 `px` 尺寸、无键盘导航考量、无动效支持 | 样式集中但未完全采用设计令牌，需补齐暗黑模式前景色/背景色配对、替换 `px` 为语义比例 | 结构天然适配主题令牌（Tokens）、无硬编码 `px`、支持键盘焦点环与输入模态、具备状态机动画潜质 |

---

## 二、候选组件裁决矩阵 (Verdict Matrix)

根据综合评分与核心红线，将候选组件划分为四大明确决策类别：

```
[总分 >= 16 且解耦度 >= 4] ──► 🌟 建议直接收录 (DIRECT_ADOPT)
[总分 11~15 或解耦度 2~3]  ──► 🔨 解耦重构后收录 (ABSTRACT_AND_ADOPT)
[总分 8~10 或双端可行性 < 2] ──► ⚠️ 低优先级 / 暂缓 (SPECIALIZED_DEFER)
[总分 < 8 或业务深度绑定]   ──► ❌ 维持业务私有 / 拒绝 (KEEP_IN_APP)
```

### 1. 🌟 建议直接收录 (DIRECT_ADOPT)
- **特征**：结构清晰、无业务副作用、易于跨端实现，属于通用组件库目前缺失的基础或进阶原语。
- **行动**：直接输出规范化 API 契约草案（TypeScript Contract），纳入后续开发计划。

### 2. 🔨 解耦重构后收录 (ABSTRACT_AND_ADOPT)
- **特征**：交互优秀、视觉体验好、在多处被重复开发，但源码中塞入了硬编码请求、特定实体字段或业务判断。
- **行动**：应用下述五大解耦重构模式，出具“业务代码 ➔ 通用组件”前后 API 对比与插槽化方案。

### 3. ⚠️ 低优先级 / 暂缓 (SPECIALIZED_DEFER)
- **特征**：仅在极端边缘场景使用，或者依赖极其复杂的原生底层接口，短期投入产出比低。
- **行动**：记录在评估报告的备选池中，暂不建议投入双端实现资源。

### 4. ❌ 维持业务私有 / 拒绝 (KEEP_IN_APP)
- **特征**：强业务逻辑属性（如带有业务校验逻辑的结算流程、专用审批流引擎），强行抽象会导致 API 过度设计、扩展性极差。
- **行动**：建议留在业务应用仓库内，或者仅抽取其纯视觉子元素（如其中的单行状态标签）。

---

## 三、五大黄金解耦模式 (The 5 Decoupling Patterns)

当候选组件属于 `ABSTRACT_AND_ADOPT` 时，Agent 必须在报告中给出具体的解耦重构建议：

### 模式 1：数据契约倒置 (Data Contract Inversion)
- **反模式**：组件内部接收 `data: UserEntity[]` 或 `record: OrderDetail`。
- **解耦法**：提取为扁平通用的数据项接口，或通过字段映射器 (`keyField`, `titleField`, `renderItem`) 允许调用方自定义取值。
```typescript
// ❌ 业务硬编码
interface TimelineProps {
  logs: Array<{ orderId: string; opUser: string; auditStatus: number; createTime: string }>;
}

// ✅ 通用化抽象
export interface TimelineItem {
  id: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string | React.ReactNode;
  status?: 'default' | 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}
export interface TimelineProps {
  items: TimelineItem[];
  mode?: 'left' | 'right' | 'alternate';
}
```

### 模式 2：插槽与委托反转 (Slot & Delegate Inversion)
- **反模式**：在组件内部写死特定的业务按钮、状态下拉框、操作抽屉。
- **解耦法**：提供具名插槽（React 中为 `slots` 或 `actions` / `extra`，Qt QML 中为 `Component` delegate）。
```qml
// Qt QML 通用委托抽象
property Component itemDelegate: defaultItemDelegate
property Component actionDelegate: null
```

### 模式 3：状态下沉与受控/非受控双模 (Controlled/Uncontrolled State)
- **反模式**：组件内部通过 `useEffect` 自行发起 `fetch('/api/v1/...')`。
- **解耦法**：通用组件严禁发起网络请求。所有异步数据、加载状态、错误提示均由外层通过 `loading: boolean`、`error?: ReactNode` 传入，或者提供标准的事件通知回调（`onFilterChange`, `onSearch`）。

### 4. 模式 4：样式令牌化与零-px 化 (Tokenization & Zero-px)
- **反模式**：写死 `width: 320px`, `color: #1a1a1a`, `background: #ffffff`。
- **解耦法**：完全转换为设计系统的语义类名（React `bg-card text-card-foreground`, `w-80` 或 `w-[20rem]`）与 Qt 主题令牌（`ThemeTokens.card`, `ThemeTokens.text`）。

### 模式 5：双端交互范式对齐 (Cross-Stack Idiomatic Parity)
- **对齐规范**：
  - **React 端**：基于语义化 HTML、Base UI 无样式原语、Tailwind v4 实用工具类、Focus Visible。
  - **Qt 端**：使用 `ChaSetScrollArea`（带 `WheelHandler`）、显式声明 `implicitWidth`/`implicitHeight`、使用 `HoverHandler` 维护工字/手型光标、动画绑定 `ThemeTokens.animationsEnabled`。

---

## 四、组件层级归类指南 (Tier Classification in cha-set)

评估时需明确组件在目标项目中的归属层级：

1. **L1: Atomic Visual Primitives (原子视觉原语)**
   - 示例：`Tag`, `Badge`, `Avatar`, `Kbd`, `Indicator`。
   - 检验要求：双端完全一致、像素级比对（Pixel-Sync）、无内嵌复杂业务。
2. **L2: Floating Overlays & Micro-Interactions (浮层与微交互)**
   - 示例：`TourStep`, `GuidePopover`, `NotificationCard`, `CommandPalette`。
   - 检验要求：Portal 挂载、背景前景色彩自洽、键盘焦点漫游（Roving Tabindex）、淡入淡出动效。
3. **L3: Desktop Virtualization & Kinetics (虚拟化与动力学原语)**
   - 示例：`InfiniteScrollList`, `Waterfall`, `VirtualKanban`。
   - 检验要求：60fps 平滑滚动、内存恒定、动效解耦。
4. **L4: Composite Engines & Layout Workspaces (复合引擎与工作区)**
   - 示例：`FilterBar`, `MetricCard`, `Timeline`, `PipelineView`, `DiffViewer`。
   - 检验要求：JSON AST 序列化、多插槽组合、高内聚低耦合。
