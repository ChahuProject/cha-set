---
id: alert-dialog
component: alert-dialog
category: Overlays & Feedback
title: Alert Dialog
description: 用于破坏性操作确认或严重警示的中断式模态对话框。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 背景遮罩层在 `duration-short`（180ms）内以 `ease-standard` 渐入，防止视觉突兀跳变。
- 警示弹窗卡片在 `duration-short`（180ms）内以 `ease-entrance` 执行 0.95 缩放与淡入展开。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Tab / Shift+Tab | 在警示对话框内部的取消与确认操作按钮间循环焦点 |
| Space / Enter | 激活当前获得焦点的操作按钮 |
| Escape | 取消并关闭警示对话框（等同于点击取消按钮） |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 受控的警示对话框打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开或关闭状态变化时的回调函数。 |
| `destructive` | `boolean` | `true` | 是否突出强调确认操作的破坏性（采用破坏性强调色）。 |
| `confirmText` | `string` | `'Continue'` | 确认操作按钮文案。 |
| `cancelText` | `string` | `'Cancel'` | 取消操作按钮文案。 |
```
