---
id: query-builder
component: query-builder
category: Composite Engines
title: Query Builder
description: Visual rule tree builder for structured query generation with nested logic groups.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Traverse through rule field selectors, operators, and values |
| Enter | Add new condition rule or nested subgroup |
| Delete | Remove currently focused rule line |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | `QueryField[]` | `[]` | Available queryable fields and data types. |
| `query` | `QueryRuleGroup` | `undefined` | Active query tree root group. |
| `onQueryChange` | `(q: QueryRuleGroup) => void` | `undefined` | Callback fired on rule addition, deletion, or editing. |
| `maxDepth` | `number` | `3` | Maximum nested rule group depth. |
```
