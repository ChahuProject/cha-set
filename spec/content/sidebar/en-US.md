---
id: sidebar
component: sidebar
category: Surfaces & Layout
title: Sidebar
description: Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Ctrl + B / ⌘ + B | Toggle sidebar between expanded and collapsed modes |
| Tab / Shift + Tab | Traverse through navigation menu items |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | Collapsing behavior mode when closed on desktop. |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | Visual container styling variant. |
| `side` | `'left' \| 'right'` | `'left'` | Docking side for the sidebar layout. |
| `defaultOpen` | `boolean` | `true` | Initial expanded state on SidebarProvider. |
```
