---
id: context-menu
component: context-menu
category: Overlays & Feedback
title: Context Menu
description: Displays a menu located at the pointer coordinates on right-click or context gesture.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Shift + F10 / Menu | Open context menu at focused element position |
| ↓ / ↑ | Navigate items with wrapping, suppressing pointer hover |
| Enter / Space | Execute highlighted item action and close menu |
| Escape | Dismiss context menu and return focus to trigger |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modal` | `boolean` | `true` | Whether the context menu is modal. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired on open state change. |
```
