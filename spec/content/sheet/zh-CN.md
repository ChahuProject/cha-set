---
id: sheet
component: sheet
category: Overlays & Feedback
title: Sheet
description: 扩展对话框组件，用于展示从任意屏幕边缘（顶部、右侧、底部、左侧）滑入的内容。
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
| Tab / Shift + Tab | 将焦点严格限制在抽屉侧栏内部循环 |
| Escape | 关闭抽屉侧栏并将焦点恢复至触发源 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 受控的打开状态。 |
| `defaultOpen` | `boolean` | `false` | 非受控使用时的默认打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化时触发的回调。 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 抽屉滑入的视口边缘。 |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full'` | `'default'` | 抽屉尺寸预设（左右为宽度，上下为高度）。 |
| `showCloseButton` | `boolean` | `true` | 是否在抽屉内渲染右上角关闭图标按钮。 |
| `closeOnOverlayClick` | `boolean` | `true` | 点击背景是否自动关闭抽屉。 |
```
