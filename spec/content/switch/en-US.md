---
id: switch
component: switch
category: Forms & Inputs
title: Switch
description: A control that allows the user to toggle between checked and not checked states, with support for async loading, read-only mode, and helper descriptions.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Space / Enter | Toggle switch state on or off |
| Tab / Shift + Tab | Traverse focus between controls |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Whether the switch is toggled on (checked). |
| `defaultChecked` | `boolean` | `false` | The default checked state for uncontrolled usage. |
| `onCheckedChange` | `(checked: boolean) => void` | `—` | Event handler called when the checked state changes. |
| `size` | `'default' \| 'sm'` | `'default'` | The size scale of the switch track and thumb. |
| `disabled` | `boolean` | `false` | Disables user interactions and applies muted opacity. |
| `readOnly` | `boolean` | `false` | Whether the switch is read-only (prevents interaction without muted opacity). |
| `loading` | `boolean` | `false` | Shows an animated spinner inside the thumb and prevents toggling. |
| `label` | `React.ReactNode` | `—` | Optional companion label rendered alongside the switch. |
| `description` | `React.ReactNode` | `—` | Optional helper text displayed below the label. |
| `forceHover` | `boolean` | `false` | Visual testing aid to force hover state. |
| `forceFocus` | `boolean` | `false` | Visual testing aid to force focus ring. |
| `className` | `string` | `''` | Additional CSS class names to apply to the switch track element. |
```
