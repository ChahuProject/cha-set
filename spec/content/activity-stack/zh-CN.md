---
id: activity-stack
component: activity-stack
category: Overlays & Feedback
title: Activity Stack
description: 视口锚定浮动活动卡片栈，支持八向定位、溢出折叠与卡片色调。
---

## 动效规范 {#animations}

活动栈卡片进入、退出与折叠动效规范。

- 卡片在 `duration-short`（180ms）内以 `ease-entrance` 从锚定边缘平滑滑入并淡入。
- 移除的卡片作为残影在原位置保持 180ms 淡出，下方卡片平滑平移以填补空隙。
- 汇总折叠栏在 `duration-medium`（240ms）内通过 `ease-emphasized` 展开或收起。
- 确定性进度在 `duration-medium` 内过渡；不确定进度条运行 1.6s 的无限微光动画。
- 在 Web 端遵循 `prefers-reduced-motion`，在 Qt 端由 `ThemeTokens.animationsEnabled` 管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，提供完整的无鼠标交互能力。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Tab | 进入活动卡片栈并聚焦首张卡片 |
| ↑ / ↓ | 在卡片之间切换焦点 |
| Home / End | 跳转至首张或末张活动卡片 |
| Space / Enter | 激活当前卡片的关闭或自定义操作按钮 |
| Escape | 收起展开的列表，或退出焦点巡回 |
```

## 属性 {#props}

双端属性名称与语义完全一致；`类型` 为 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `entries` | `ActivityStackEntry[]` | `[]` | 卡片项数组，最旧在前，最新卡片最靠近锚点。 |
| `placement` | `"top-left" \| "top-center" \| "top-right" \| "left-center" \| "right-center" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `'bottom-right'` | 视口锚点位置。 |
| `offset` | `number` | `16` | 距锚定边缘的内缩距离（逻辑单位）。 |
| `maxVisible` | `number` | `3` | 溢出为胶囊按钮前最多直接显示的卡片数量。 |
| `collapsible` | `boolean` | `true` | 是否提供折叠为单行摘要的控制按钮。 |
| `defaultCollapsed` | `boolean` | `false` | 初始加载时是否默认处于折叠状态。 |
| `label` | `string` | `'Activity Stack'` | 浮动区域的无障碍名称。 |
| `summaryLabel` | `string` | `undefined` | 摘要行计数后追加的描述文字（例如“项进行中”）。 |
```
