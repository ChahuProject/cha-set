---
id: virtual-list
component: virtual-list
category: Desktop & Virtualization
title: Virtual List
description: 基于 TanStack Virtual 构建的高性能视口虚拟化长列表，支持 10 万+ 行数据流畅滚动与 DOM 动态回收。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 垂直导航列表项并自动对齐视口 |
| PageUp / PageDown | 按可见视口页高向上／向下翻页 |
| Home / End | 直接跳转至列表中首个／末尾项 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `items` | `readonly T[]` | `[]` | 待虚拟化的数据项数组。 |
| `renderRow` | `(item: T, index: number) => ReactNode` | `undefined` | 渲染单行的回调。 |
| `renderItem` | `(item: T, index: number) => ReactNode` | `undefined` | renderRow 的别名。 |
| `estimateSize` | `number \| ((index: number) => number)` | `36` | 用于测量的预估行高。 |
| `gap` | `number` | `0` | 相邻项之间的垂直间距。 |
| `overscan` | `number` | `8` | 视口边界之外额外渲染的缓冲项数量。 |
| `emptyNode` | `ReactNode` | `null` | 数据为空时渲染的内容。 |
| `onScroll` | `(distanceToBottom: number) => void` | `undefined` | 接收距底部距离的滚动事件回调。 |
| `ref` | `Ref<VirtualListHandle>` | `undefined` | 暴露 scrollToIndex(index, align) 的句柄。 |
```
