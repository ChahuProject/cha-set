---
id: dropdown-menu
component: dropdown-menu
category: Overlays & Feedback
title: Dropdown Menu
description: Displays a menu to the user triggered by a button with item groups and shortcuts.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Enter / Space / ↓ | Open menu from trigger and highlight first enabled item |
| ↓ / ↑ | Navigate items with wrapping, suppressing pointer hover |
| Home / End | Jump directly to the first / last enabled item |
| Enter / Space | Trigger highlighted item and close menu |
| Escape | Close menu and return focus to triggering element |
| Tab | Close menu and advance focus to next interactive element |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Controlled open state of the dropdown menu. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Event handler called when open state changes. |
| `modal` | `boolean` | `true` | Whether to render as a modal trapping focus. |
| `sideOffset` | `number` | `4` | Distance offset from trigger to floating content. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along trigger edge. |
```
