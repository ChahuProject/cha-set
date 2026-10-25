---
id: scale-osd
component: scale-osd
category: Overlays & Feedback
title: Scale OSD
description: 用于画布缩放调节的浮动屏幕显示条，支持自动隐藏。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在放大、缩小与重置按钮之间循环切换焦点 |
| Space / Enter | 激活当前聚焦的缩放按钮 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `number` | `1.0` | 当前缩放比例（例如 1.0 表示 100%）。 |
| `defaultValue` | `number` | `1.0` | 非受控模式下的初始缩放比例。 |
| `step` | `number` | `0.1` | 点击 +/- 按钮时应用的步进增量。 |
| `min` | `number` | `0.2` | 允许的最小缩放比例。 |
| `max` | `number` | `3.0` | 允许的最大缩放比例。 |
| `steps` | `number[]` | `undefined` | 离散缩放阶梯数组（例如 CANONICAL_SCALE_STEPS）。 |
| `size` | `"default" \| "lg"` | `"default"` | 视觉缩放变体（桌面启动器 42px 或标准 40px）。 |
| `ignoreUiScale` | `boolean` | `true` | 锁定物理像素尺寸，不随界面缩放变化。 |
| `visible` | `boolean` | `undefined` | 受控可见状态。 |
| `autoHideDuration` | `number` | `1400` | 自动隐藏前的持续时长（毫秒，悬停时暂停）。 |
| `showControls` | `boolean` | `true` | 是否显示 +/- 与重置按钮。 |
| `showTooltips` | `boolean` | `true` | 是否显示控制按钮的悬停提示。 |
| `placement` | `"bottom-center" \| "top-center" \| "bottom-right" \| "top-right"` | `"bottom-center"` | 固定的视口锚定位置。 |
| `contained` | `boolean` | `false` | 是否将 OSD 限制在父容器内绝对定位，而非固定在全局视口。 |
| `disabled` | `boolean` | `false` | 禁用所有控件与用户交互。 |
| `delayedCommit` | `boolean` | `false` | 是否开启防抖延迟生效，暂停调节后再触发提交。 |
| `debounceMs` | `number` | `500` | 开启延迟生效时的防抖等待时长（毫秒）。 |
| `onChange` | `(value: number) => void` | `undefined` | 缩放值变化时触发的回调。 |
| `onImmediateChange` | `(value: number) => void` | `undefined` | 缩放调节时即时触发的未防抖回调。 |
| `onCommit` | `(value: number) => void` | `undefined` | 延迟生效防抖完成后触发的最终提交回调。 |
| `onStep` | `(delta: number) => void` | `undefined` | 阶梯调节时触发的回调。 |
| `onReset` | `() => void` | `undefined` | 重置至 100% 时触发的回调。 |
```
