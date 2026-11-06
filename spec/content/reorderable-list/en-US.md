---
id: reorderable-list
component: reorderable-list
category: Composite Engines
title: Reorderable List
description: Drag-and-drop reorderable action list with insertion slot indicators and Alt solo toggles.
---

## Animations {#animations}

Animation and interactive feedback specifications for drag reordering and action toggles.

- During active dragging, the lifted row applies elevation and background tint smoothly within `duration-quick` (90ms) using `ease-standard`.
- The insertion seam indicator animates into view at the calculated drop slot with zero lag, ensuring responsive visual tracking.
- Action icon toggles transition between active accent and inactive subdued shades within `duration-quick` (90ms).
- Respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` on Qt Desktop.

## Keyboard Navigation {#keyboard}

Keyboard interactions supported by the reorderable list.

```table shortcuts
| Key | Interaction |
| --- | --- |
| Tab / Shift+Tab | Cycle focus across list items and trailing action toggle buttons |
| Space / Enter | Toggle action button state on the focused action button |
| Alt+Click / Alt+Enter | Trigger Solo isolation or invert action toggle across all items |
| ↑ / ↓ | Move focus sequentially between list item rows |
```

## Props Reference {#props}

Cross-stack props share identical names and semantics; `Type` reflects TypeScript signatures.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ReorderableListItem[]` | `[]` | Array of item objects containing id, label/name, optional icon, and action booleans. |
| `rowHeight` | `number` | `30` | Logical height of each list row in density-independent units. |
| `reorderable` | `boolean` | `true` | Whether drag-and-drop item reordering is enabled. |
| `actionColumns` | `ReorderableActionColumn[]` | `[]` | Column definitions for trailing action buttons with icons, tooltips, and shortcuts. |
| `defaultActionKey` | `string` | `'visible'` | Default property key toggled when actionColumns is not explicitly provided. |
| `onItemsEdited` | `(items: ReorderableListItem[]) => void` | `undefined` | Callback fired when items are reordered or an action column state changes. |
| `onItemsReordered` | `(from: number, to: number, items: ReorderableListItem[]) => void` | `undefined` | Callback fired when a drag-and-drop reorder operation completes. |
| `onActionTriggered` | `(index: number, key: string, value: boolean) => void` | `undefined` | Callback fired when an action column button is clicked or toggled. |
```
