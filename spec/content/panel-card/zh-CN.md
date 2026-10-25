---
id: panel-card
component: panel-card
category: Surfaces & Layout
title: Panel Card
description: 带集成可折叠分区与头部操作槽位的卡片容器。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在面板卡片内嵌的交互控件之间周转遍历 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `undefined` | 面板头部标题文本或元素。 |
| `badgeText` | `string` | `undefined` | 显示于标题旁的可选徽标文本。 |
| `collapsible` | `boolean` | `false` | 面板内容是否可折叠切换。 |
| `collapsed` | `boolean` | `undefined` | 受控折叠状态。 |
| `defaultCollapsed` | `boolean` | `false` | 非受控模式下的初始折叠状态。 |
| `onCollapsedChange` | `(c: boolean) => void` | `undefined` | 折叠变化处理函数。 |
| `actions` | `ReactNode` | `undefined` | 右对齐的头部操作元素。 |
| `size` | `'default' \| 'sm'` | `'default'` | 卡片面板的尺寸规格。 |
```
