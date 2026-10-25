---
id: generic-data-table
component: generic-data-table
category: Composite Engines
title: Generic Data Table
description: Full-featured data table with column sorting, filtering, selection, and pagination.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ | Move row selection cursor up / down |
| Space | Toggle selection checkbox of the active row |
| Enter | Expand row details or enter cell edit mode |
| Escape | Exit cell edit mode and restore table row focus |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `TData[]` | `[]` | Array of data records. |
| `columns` | `ColumnDef<TData, any>[]` | `[]` | TanStack Table column definitions. |
| `enableSorting` | `boolean` | `true` | Whether column sorting is enabled. |
| `enablePagination` | `boolean` | `true` | Whether pagination controls are rendered. |
| `pageSize` | `number` | `10` | Number of rows per page. |
```
