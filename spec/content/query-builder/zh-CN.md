---
id: query-builder
component: query-builder
category: Composite Engines
title: Query Builder
description: 可视化条件查询构建器，支持嵌套逻辑分组 (AND/OR)、字段选择、运算符谓词筛选及 JSON 结构序列化。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在规则字段选择器、运算符与数值之间周转遍历 |
| Enter | 添加新条件规则或嵌套子组 |
| Delete | 移除当前聚焦的规则行 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `fields` | `QueryField[]` | `[]` | 可用可查询字段与数据类型。 |
| `query` | `QueryRuleGroup` | `undefined` | 当前查询树根分组。 |
| `onQueryChange` | `(q: QueryRuleGroup) => void` | `undefined` | 添加、删除或编辑规则时触发的回调。 |
| `maxDepth` | `number` | `3` | 最大嵌套规则分组深度。 |
```
