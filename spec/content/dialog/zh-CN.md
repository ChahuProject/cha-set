---
id: dialog
component: dialog
category: Overlays & Feedback
title: Dialog
description: 以关键内容打断用户并提示用户操作的中断式模态窗口。
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
| Tab / Shift + Tab | 将焦点严格限制在对话框内循环 |
| Escape | 关闭对话框并将焦点返回给触发元素 |
| Enter | 触发主要操作按钮 |
```

`alert` 变体收窄了其中两条行为：仅在可取消时 Escape 才会关闭它，Enter 确认的是破坏性操作而非中性的主操作。

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 受控的对话框打开状态。 |
| `variant` | `'default' \| 'alert'` | `'default'` | 对话框的视觉与交互变体（标准模态或警告确认弹窗）。 |
| `defaultOpen` | `boolean` | `false` | 非受控使用时的默认打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `—` | 打开状态变化时调用的事件处理函数。 |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full'` | `'default'` | 控制模态卡片宽度与收纳的分档尺寸预设。 |
| `closeOnOverlayClick` | `boolean` | `true` | 点击背景遮罩是否关闭对话框。 |
| `closeOnEscape` | `boolean` | `true` | 按下 Escape 键是否关闭对话框。 |
| `draggable` | `boolean` | `true` | 是否将对话框渲染为桌面端可拖拽、可调整尺寸的模态窗口。 |
| `showCloseButton` | `boolean` | `true` | 是否在右上角控件中渲染关闭按钮。 |
| `showEscBadge` | `boolean` | `false` | 是否在右上角控件中渲染 ESC 快捷键徽标。 |
| `defaultWidthRem` | `number` | `—` | 以 rem 为单位的初始模态宽度（例如 32）。 |
| `defaultHeightRem` | `number` | `—` | 以 rem 为单位的初始模态高度（例如 24）。 |
| `initialPositionMode` | `'center' \| 'top'` | `'center'` | 模态窗口的初始定位模式。 |
| `topMarginRem` | `number` | `4.5` | 当 initialPositionMode 为 top 时以 rem 为单位的顶部边距。 |
| `autoFitHeight` | `boolean` | `true` | 自动调整模态高度以适配内部内容。 |
| `sizeOptions` | `DialogSizeOption[]` | `—` | 右上角尺寸切换下拉菜单的预设尺寸选项。 |
| `sizeMenuTooltip` | `string` | `'Adjust Size'` | 尺寸切换下拉按钮的提示文本。 |
| `dragHandleClassName` | `string` | `—` | 拖拽手柄区域的 CSS 类选择器（例如对话框标题栏）。 |
| `contentClassName` | `string` | `—` | 可滚动内部内容容器的自定义类名。 |
| `overlayClassName` | `string` | `''` | 用于自定义背景遮罩的额外 CSS 类。 |
```
