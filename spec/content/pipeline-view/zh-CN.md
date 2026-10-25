---
id: pipeline-view
component: pipeline-view
category: Composite Engines
title: Pipeline View
description: 多阶段任务流水线执行视图，整合任务追踪队列、步骤时间线及虚拟化自动滚动日志控制台。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 `duration-quick` 时长内以 `ease-standard` 缓动曲线过渡。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控该开关。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 在任务列表的各个任务之间导航 |
| Home / End | 跳转至任务列表中首个／末尾任务 |
| Space / Enter | 选中当前聚焦的任务以查看步骤与日志 |
| Tab / Shift + Tab | 在任务列表、操作按钮与日志控制台之间移动焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `status` | `PipelineStatus` | `'running'` | 汇总头徽章的总体执行状态。 |
| `startMs` | `number` | `0` | 执行开始时间戳（毫秒纪元）。 |
| `endMs` | `number \| null` | `null` | 执行完成时间戳；非空时展示格式化时长。 |
| `jobs` | `PipelineJob[]` | `[]` | 属于当前执行轮次的任务数组。 |
| `activeJobId` | `string \| null` | `null` | 当前选中的任务 ID，展示步骤时间线与日志。 |
| `onSelectJob` | `(id: string) => void` | `undefined` | 选中任务时触发的回调。 |
| `onCancel` | `() => void` | `undefined` | 点击取消按钮时触发的回调。 |
| `cancelDisabled` | `boolean` | `false` | 禁用取消按钮。 |
| `getLogs` | `(jobId: string) => string[]` | `undefined` | 按任务 ID 提供日志行数组的函数。 |
| `jobsTitle` | `string` | `'Jobs'` | 任务列表侧边栏的标题文案。 |
| `emptyJobsText` | `string` | `'No jobs'` | 任务列表为空时展示的占位文案。 |
| `headerActionSlot` | `ReactNode` | `undefined` | 头部自定义操作插槽。 |
```
