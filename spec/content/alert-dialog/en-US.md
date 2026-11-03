---
id: alert-dialog
component: alert-dialog
category: Overlays & Feedback
title: Alert Dialog
description: Modal dialog that interrupts the user with important, critical, or destructive confirmations.
---

## Animations {#animations}

Motion behavior and duration specifications strictly aligned with ChaSet tokens.

- Backdrop modal barrier fades in smoothly over `duration-short` (180ms) via `ease-standard`.
- Alert dialog card scales from 0.95 and fades in over `duration-short` (180ms) via `ease-entrance`.
- Motion durations resolve directly from theme tokens and cleanly collapse to zero under `prefers-reduced-motion` or `ThemeTokens.animationsEnabled = false`.

## Keyboard Navigation {#keyboard}

Keyboard interactions supported by the component.

```table shortcuts
| Key | Interaction |
| --- | --- |
| Tab / Shift+Tab | Trap and cycle focus between Cancel and Action buttons |
| Space / Enter | Activate the currently focused action button |
| Escape | Cancel and dismiss the alert dialog |
```

## Props Reference {#props}

Cross-stack props share identical names and semantics; `Type` reflects TypeScript signatures.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Controlled open state of the alert dialog. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when the dialog opens or closes. |
| `destructive` | `boolean` | `true` | Emphasizes destructive nature of the primary action with destructive tone. |
| `confirmText` | `string` | `'Continue'` | Label text for confirmation action button. |
| `cancelText` | `string` | `'Cancel'` | Label text for cancellation button. |
```
