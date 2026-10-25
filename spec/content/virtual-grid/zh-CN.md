---
id: virtual-grid
component: virtual-grid
category: Desktop & Virtualization
title: Virtual Grid
description: 二维自适应响应式虚拟化网格视图，支持海量卡片、图像矩阵与动态单元格布局渲染。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ / ← / → | 在二维网格的行与列之间导航单元格 |
| PageUp / PageDown | 按可见网格页高纵向翻页 |
| Home / End | 直接跳转至数据集首个／末尾单元格 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `items` | `readonly T[]` | `[]` | 布局为网格卡片的数据项数组。 |
| `renderCard` | `(item: T, index: number) => ReactNode` | `undefined` | 渲染单个网格卡片的回调。 |
| `renderItem` | `(item: T, index: number) => ReactNode` | `undefined` | renderCard 的别名。 |
| `minColumnWidthRem` | `number` | `12` | 响应式换行前的最小列宽。 |
| `gapRem` | `number` | `0.75` | 卡片之间的网格间距。 |
| `estimateSize` | `number` | `180` | 虚拟计算用的预估行高。 |
| `overscan` | `number` | `4` | 视口边界之外额外渲染的缓冲行数。 |
| `emptyNode` | `ReactNode` | `null` | 数据为空时渲染的内容。 |
| `ref` | `Ref<VirtualGridHandle>` | `undefined` | 暴露 scrollToIndex(index, align) 的句柄。 |
```
