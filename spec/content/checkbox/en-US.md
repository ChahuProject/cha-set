---
id: checkbox
component: checkbox
category: Forms & Inputs
title: Checkbox
description: A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, helper descriptions, and companion labels.
---

## Animations {#animations}

Motion behavior and timing for the checked, indeterminate, and state transitions.

- The check-mark SVG stays mounted and, when checked, fades in from opacity 0 to 1 while scaling from 0.5 to 1 over `duration-quick` with the `ease-entrance` curve.
- The box border color cross-fades on hover, focus, checked, and invalid state changes.
- Durations and easing resolve from theme tokens, so `prefers-reduced-motion` zeroes them automatically (Qt: governed by `ThemeTokens.animationsEnabled`).

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Space | Toggle checkbox between checked and unchecked states |
| Tab / Shift + Tab | Traverse focus between controls |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | The controlled checked state of the checkbox. |
| `defaultChecked` | `boolean` | `false` | The default checked state when uncontrolled. |
| `indeterminate` | `boolean` | `false` | Whether the checkbox is in an indeterminate state (takes visual precedence over checked). |
| `disabled` | `boolean` | `false` | Disables user interactions and applies 50% opacity. |
| `readOnly` | `boolean` | `false` | Prevents toggling state while retaining focusability and full opacity. |
| `invalid` | `boolean` | `false` | Applies destructive error styling and aria-invalid attribute. |
| `size` | `'default' \| 'sm'` | `'default'` | The size variant: default or sm. |
| `label` | `ReactNode` | `undefined` | Optional companion label rendered alongside the checkbox. |
| `description` | `ReactNode` | `undefined` | Optional helper text rendered below the label. |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | Callback invoked when checked state changes. |
| `forceHover` | `boolean` | `false` | Visual testing aid to force hover state styles. |
| `forceFocus` | `boolean` | `false` | Visual testing aid to force focus ring styles. |
| `className` | `string` | `''` | Additional CSS class names to apply to the checkbox button. |
```
