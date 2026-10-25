---
id: splitter
component: splitter
category: Surfaces & Layout
title: Splitter
description: 面向 IDE 与桌面工具包的带可拖拽分隔条与折叠限制的多窗格可调布局容器。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / → | 按步长调整水平分割器分割比例 |
| ↑ / ↓ | 按步长调整垂直分割器分割比例 |
| Home / End | 将分割器吸附至最小／最大分栏极限 |
| Enter | 将分割器重置为默认均衡分割比例 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `size` | `number` | `undefined` | 受控百分比宽度／高度（0-100）。 |
| `onChange` | `(size: number) => void` | `undefined` | 拖拽时携带新百分比触发的回调。 |
| `initialSize` | `number` | `50` | 非受控用法下的初始尺寸百分比。 |
| `minSize` | `number` | `0` | 允许的最小百分比边界。 |
| `maxSize` | `number` | `100` | 允许的最大百分比边界。 |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 分隔条的方向。 |
```
