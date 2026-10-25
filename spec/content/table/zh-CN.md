---
id: table
component: table
category: Composite Engines
title: Table
description: 响应式语义化基础数据表格组件，具备行悬停高亮、精致分割边框与表头/表尾语义结构。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在表格单元格内的交互元素之间导航 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `className` | `string` | `''` | 表格元素的额外 CSS 类。 |
| `containerClassName` | `string` | `''` | 可滚动外层容器的额外 CSS 类。 |
```
