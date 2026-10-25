---
id: collapsible
component: collapsible
category: Surfaces & Layout
title: Collapsible
description: An interactive component which expands and collapses a panel of content.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Space / Enter | Toggle collapsible panel open or closed |
| Tab | Traverse focus between triggers and nested controls |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Controlled open state of the collapsible panel. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback invoked when open state changes. |
| `variant` | `'default' \| 'card' \| 'ghost'` | `'default'` | Visual container styling variant. |
| `disabled` | `boolean` | `false` | Whether user interaction is disabled. |
| `className` | `string` | `''` | Additional custom CSS classes. |
```
