---
id: step-timeline
component: step-timeline
category: Composite Engines
title: Step Timeline
description: 纵向步骤时间线，展示有序执行阶段、状态图标与格式化耗时。
---

## 动效规范 {#animations}

步骤时间线状态过渡与流转动效规范。

- 处于运行中（`running`）状态的步骤指示器在 `duration-normal` 周期内持续平滑匀速自旋。
- 步骤完成或失败时，在 `duration-quick`（90ms）内通过 `ease-standard` 平滑切换为终态图标。
- 纵向导轨连线背景与前后步骤的相对几何关系保持自适应吸附。
- 在 Web 端遵循 `prefers-reduced-motion`，在 Qt 端由 `ThemeTokens.animationsEnabled` 管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘交互操作。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Tab / Shift+Tab | 在步骤时间线容器及内嵌可交互操作之间移动焦点 |
| Space / Enter | 激活当前选中的步骤项（如支持回调事件） |
| ↑ / ↓ | 在各个有序步骤项之间上下切换焦点检查 |
```

## 属性 {#props}

双端属性名称与语义完全一致；`类型` 为 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `steps` | `StepTimelineStep[]` | `[]` | 步骤数据列表，每项包含名称、状态与可选耗时。 |
| `emptyText` | `string` | `'No steps'` | 当步骤列表为空时呈现的占位提示文案。 |
| `className` | `string` | `undefined` | 附加到根容器的自定义 CSS 类名（仅限 React）。 |
```
