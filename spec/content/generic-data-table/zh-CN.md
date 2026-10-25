---
id: generic-data-table
component: generic-data-table
category: Composite Engines
title: Generic Data Table
description: 基于 TanStack Table 构建的企业级通用数据表格，提供列头排序、实时筛选、行选择与分页控制。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 向上／向下移动行选择光标 |
| Space | 切换当前活动行的选择复选框 |
| Enter | 展开行详情或进入单元格编辑模式 |
| Escape | 退出单元格编辑模式并恢复表格行焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `data` | `TData[]` | `[]` | 数据记录数组。 |
| `columns` | `ColumnDef<TData, any>[]` | `[]` | TanStack Table 列定义。 |
| `enableSorting` | `boolean` | `true` | 是否启用列排序。 |
| `enablePagination` | `boolean` | `true` | 是否渲染分页控件。 |
| `pageSize` | `number` | `10` | 每页行数。 |
```
