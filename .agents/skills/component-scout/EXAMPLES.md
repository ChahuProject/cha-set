# 外部组件通用化勘探与评估报告范例 (EXAMPLES.md)

本文档提供由 `component-scout` 产出的真实场景组件勘探与通用化决策报告范例。

---

## 范例报告：某设备管控云平台 (`device-ops-web`) 组件勘探报告

### 报告头部与概要 (Executive Summary)

```markdown
# 外部组件通用化评估报告：device-ops-web

- **勘探目标路径**：`../device-ops-web/src/components`
- **扫描组件总数**：18 个
- **建议直接收录 (DIRECT_ADOPT)**：2 个
- **建议解耦重构收录 (ABSTRACT_AND_ADOPT)**：3 个
- **低优先级 / 暂缓 (SPECIALIZED_DEFER)**：2 个
- **维持业务私有 / 拒绝 (KEEP_IN_APP)**：11 个
```

---

### 一、候选组件综合对比表 (Candidate Overview Matrix)

| 组件名称 | 业务解耦度 (0-5) | 通用价值 (0-5) | 双端可行性 (0-5) | 综合评分 (满分20) | 建议层级 | 裁决结论 | 预估重构成本 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`Timeline`** (原 `DeviceStatusTimeline`) | 4/5 | 5/5 | 5/5 | **18/20** | L4 复合 | 🌟 建议直接收录 | 低 (仅需剥离设备专属字段) |
| **`MetricCard`** (原 `KpiTelemetryCard`) | 4/5 | 5/5 | 5/5 | **18/20** | L1/L4 复合 | 🌟 建议直接收录 | 低 (提取通用数值与趋势插槽) |
| **`FilterBar`** (原 `AuditQueryFilter`) | 3/5 | 4/5 | 4/5 | **15/20** | L4 复合 | 🔨 解耦重构后收录 | 中 (提取可配置字段 Schema) |
| **`DiffViewer`** (原 `ConfigVersionDiff`) | 3/5 | 4/5 | 4/5 | **14/20** | L4 复合 | 🔨 解耦重构后收录 | 中 (解耦纯文本 Diff 算法) |
| **`AudioWaveVisualizer`** | 1/5 | 2/5 | 2/5 | **7/20** | L3 原语 | ⚠️ 暂缓 / 局限性大 | 高 (Qt/Web 双端音频接口差异大) |
| **`DeviceFirmwareUpgradeModal`** | 0/5 | 1/5 | 3/5 | **5/20** | 业务私有 | ❌ 维持业务私有 | 极高 (包含固件校验与专用 RPC) |

---

### 二、重点推荐组件深度剖析与通用契约提案

#### 1. 🌟 `Timeline` (原 `DeviceStatusTimeline`)

- **原有问题与耦合分析**：
  - 源码中硬编码了 `deviceId`, `fwVersion`, `gatewayIp` 等专有业务字段；
  - 节点状态颜色直接写死了 `green` / `red` / `orange` 等内联十六进制色值；
  - 点击节点时直接调用了业务端 Redux action。
- **解耦与通用化改造方案**：
  - 将数据源重构为标准泛型列表 `TimelineItem[]`；
  - 状态标签映射为 `ThemeTokens` 支持的语义等级：`'default' | 'info' | 'success' | 'warning' | 'error'`；
  - 节点图标与内容支持自定义插槽 (`iconSlot`, `contentSlot`)。
- **提议通用契约 (`spec/components/timeline.ts`)**：
  ```typescript
  export interface TimelineItem {
    id: string | number;
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    timestamp?: string | React.ReactNode;
    status?: 'default' | 'info' | 'success' | 'warning' | 'error';
    icon?: React.ReactNode;
  }

  export interface TimelineProps {
    items: TimelineItem[];
    mode?: 'left' | 'right' | 'alternate';
    reverse?: boolean;
    activeItem?: string | number;
    onItemClick?: (item: TimelineItem) => void;
  }
  ```
- **双端实现可行性**：
  - **React**：基于 Flexbox/Grid 纵向流动，动效采用 `duration-short ease-standard`。
  - **Qt/QML**：基于 `ListView` 或 `ColumnLayout`，节点连接线使用 `Rectangle` 配合垂直锚定，光标使用 `Qt.PointingHandCursor`。

---

#### 2. 🔨 `FilterBar` (原 `AuditQueryFilter`)

- **原有问题与耦合分析**：
  - 内置了对 `/api/audit/presets` 的异步加载逻辑；
  - 固化了搜索框、部门下拉框、时间选择器三个特定组件；
  - 样式使用裸 `px`（如 `gap: 12px`, `height: 36px`）。
- **解耦与通用化改造方案**：
  - **状态与请求剥离**：移除组件内部网络请求，所有过滤字段由外部以配置项 Schema (`FilterField[]`) 传入；
  - **插槽扩展**：提供前置筛选区域 (`fields`)、搜索动作按钮组 (`actions`) 以及展开/收起更多筛选项的折叠插槽；
  - **样式对齐**：使用 Tailwind 语义间距 `gap-2`、`h-9`，双端适配键盘 `Enter` 触发查询、`Escape` 重置。
- **提议通用契约 (`spec/components/filter-bar.ts`)**：
  ```typescript
  export type FilterFieldType = 'input' | 'select' | 'date-range' | 'custom';

  export interface FilterField {
    key: string;
    label: string;
    type: FilterFieldType;
    placeholder?: string;
    options?: Array<{ label: string; value: string | number }>;
  }

  export interface FilterBarProps {
    fields: FilterField[];
    values: Record<string, any>;
    onChange?: (values: Record<string, any>) => void;
    onSearch?: (values: Record<string, any>) => void;
    onReset?: () => void;
    collapsible?: boolean;
  }
  ```

---

### 三、用户决策清单与后续实施建议 (Decision Checklist)

请用户勾选拟采纳并纳入本项目 (`cha-set`) 的候选组件：

- [ ] **🌟 `Timeline`**：采纳为通用时间轴组件（归属 `L4 Composite`），预计开发耗时 0.5 天。
- [ ] **🌟 `MetricCard`**：采纳为通用指标展示卡片（归属 `L1 Atomic` / `L4 Composite`），预计开发耗时 0.5 天。
- [ ] **🔨 `FilterBar`**：按解耦方案抽象为通用多条件筛选栏（归属 `L4 Composite`），预计开发耗时 1 天。
- [ ] **🔨 `DiffViewer`**：解耦文本差异算法后纳入代码/文本工具包，预计开发耗时 1.5 天。
- [ ] **跳过其他组件**：其余业务组件维持在原项目中。

> **下一步**：用户确认选择后，Agent 将自动调用 `add-component` 技能，按照单一真理源契约（Spec -> React -> Qt -> Living Showcase -> Verification Gate）依次将入选组件落地！
