---
id: viewport-constrained-container
component: viewport-constrained-container
category: Surfaces & Layout
title: Viewport Constrained Container
description: 根据锚点下方可用视口空间动态约束最大高度的容器。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| PageUp / PageDown | 受约束视口向上／向下滚动整页 |
| Arrow Keys | 按步长平滑滚动视口 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `maxHeight` | `number \| string` | `undefined` | 容器最大高度的可选上限。 |
| `minHeight` | `number \| string` | `80` | 最小允许高度下限。 |
| `margin` | `number` | `16` | 容器底部与视口底边之间的预留边距。 |
| `overflow` | `'auto' \| 'scroll'` | `'auto'` | 垂直溢出滚动策略。 |
| `className` | `string` | `undefined` | 自定义样式 CSS 类名。 |
| `children` | `React.ReactNode` | `undefined` | 渲染于容器内部的元素。 |
```
