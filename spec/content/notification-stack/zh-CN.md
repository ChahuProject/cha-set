---
id: notification-stack
component: notification-stack
category: Overlays & Feedback
title: Notification Stack
description: 浮动分级通知消息栈，支持单项存活时长与行内操作。
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
| Tab | 以单个 Tab 制表位进入实时播报区并聚焦最近的通知 |
| ↑ / ↓ | 在通知卡片之间轮转切换巡回焦点 |
| Home / End | 跳转至通知堆叠中首条或末条通知 |
| Space / Enter | 激活当前聚焦通知的操作或关闭控件 |
| Escape | 离开展开列表，并将通知堆叠收起为摘要行 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `notifications` | `NotificationItem[]` | `[]` | 待展示的通知，最旧在前；最新卡片最靠近锚点。 |
| `onDismiss` | `(id: string) => void` | `undefined` | 渲染每张卡片的关闭控件，并接收每次自动到期事件。 |
| `onAction` | `(notificationId: string, actionId: string) => void` | `undefined` | 点击行内操作按钮时触发；卡片将保留至被关闭。 |
| `placement` | `"top-left" \| "top-center" \| "top-right" \| "left-center" \| "right-center" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `'bottom-right'` | 视口锚点。卡片经由锚定边进入与退出。 |
| `offset` | `number` | `16` | 距锚定视口边缘的内缩距离（逻辑单位）。 |
| `maxVisible` | `number` | `4` | 堆栈溢出为“全部显示”胶囊前渲染的卡片数。 |
| `defaultDuration` | `number` | `5000` | 未声明自身持续时间的条目的存活时长。 |
| `pauseOnHover` | `boolean` | `true` | 指针悬停在堆栈上时暂停所有到期倒计时。 |
| `collapsible` | `boolean` | `true` | 提供折叠为汇总行控件。 |
| `defaultCollapsed` | `boolean` | `false` | 首次绘制时以折叠状态渲染堆栈。 |
| `label` | `string` | `'Notifications'` | 实时区域的无障碍名称。 |
```

每条通知携带 id、title、可选 description、level（info｜success｜warning｜error）、可选 duration、dismissible 与操作列表（id、label、variant）。
