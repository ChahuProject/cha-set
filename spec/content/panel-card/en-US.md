---
id: panel-card
component: panel-card
category: Surfaces & Layout
title: Panel Card
description: Card surface with integrated collapsible sections and header action slots.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Traverse interactive controls embedded in panel card |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `undefined` | Panel header title text or element. |
| `badgeText` | `string` | `undefined` | Optional badge text displayed next to the title. |
| `collapsible` | `boolean` | `false` | Whether the panel content can be toggled collapsed. |
| `collapsed` | `boolean` | `undefined` | Controlled collapsed state. |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state for uncontrolled mode. |
| `onCollapsedChange` | `(c: boolean) => void` | `undefined` | Collapse change handler. |
| `actions` | `ReactNode` | `undefined` | Right-aligned header action elements. |
| `size` | `'default' \| 'sm'` | `'default'` | Sizing scale of the card panel. |
```
