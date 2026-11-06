---
id: adaptive-popup
component: adaptive-popup
category: Overlays & Feedback
title: Adaptive Popup
description: Content-driven adaptive height popup with zero unnecessary scrollbars and 3-tier layout.
---

## Keyboard Navigation {#keyboard}

组件支持的无指针键盘交互操作。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Escape | 关闭弹窗并恢复焦点 |
| 方向键 | 在内容被宿主空间封顶时平滑滚动内容区 |
| PageUp / PageDown | 向上或向下翻页滚动视口 |
```

## Props {#props}

双端属性名称与语义完全一致；`类型` 为 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 弹窗显示状态。 |
| `minHeight` | `number \| string` | `120` | 封顶保护下限，防止极端空间下塌陷。 |
| `maxHeight` | `number \| string` | `-1` | 显式封顶上限（<=0 表示由宿主空间自动计算）。 |
| `placement` | `'down' \| 'up'` | `'down'` | 相对锚点的展开方向（down 为向下，up 为向上）。 |
| `anchorX` | `number` | `0` | 宿主父项坐标系下的期望 X 原点。 |
| `anchorY` | `number` | `0` | 期望 Y 坐标（down 为期望顶边，up 为期望底边）。 |
| `edgeMargin` | `number` | `12` | 距离宿主窗口边缘的安全间距。 |
| `contentInset` | `number` | `16` | 可滚动内容区的左右内缩边距。 |
| `useFullHostBand` | `boolean` | `true` | 是否允许使用宿主纵向全量可用空间进行自适应。 |
| `container` | `HTMLElement \| RefObject \| Item` | `null` | 可选宿主容器视口，指定后弹窗将被限制在该容器内自适应与 clamp。 |
```
