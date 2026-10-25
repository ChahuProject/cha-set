---
id: sheet
component: sheet
category: Overlays & Feedback
title: Sheet
description: Extends the dialog component to display content that slides in from any screen edge (top, right, bottom, left).
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Trap focus strictly within sheet drawer |
| Escape | Close sheet drawer and restore focus to trigger |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Default open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when open state changes. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | Edge of the viewport that the drawer slides in from. |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full'` | `'default'` | Preset drawer dimension sizing (width for left/right, height for top/bottom). |
| `showCloseButton` | `boolean` | `true` | Whether the top-right close icon button is rendered inside the drawer. |
| `closeOnOverlayClick` | `boolean` | `true` | Whether clicking the backdrop automatically dismisses the sheet. |
```
