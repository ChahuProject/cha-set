---
id: keybinding-recorder
component: keybinding-recorder
category: Forms & Inputs
title: Keybinding Recorder
description: Interactive recorder that captures accelerator keyboard sequences for desktop apps.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Any Key Combo | Capture and record pressed modifiers and keys |
| Backspace / Delete | Clear current recorded keybinding |
| Escape | Cancel recording mode without saving changes |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| KeybindingValue` | `''` | Active key combination (string or structured object). |
| `onValueChange` | `(val: string \| KeybindingValue) => void` | `undefined` | Callback fired when new combination recorded. |
| `onChange` | `(value: KeybindingValue, str: string) => void` | `undefined` | Dual callback receiving both structured object and string. |
| `size` | `"default" \| "sm"` | `"default"` | Size preset variant for regular or compact density. |
| `clearable` | `boolean` | `true` | Whether to display a clear button when a shortcut is set. |
| `disabled` | `boolean` | `false` | Whether the recorder is disabled. |
| `placeholder` | `string` | `'No keybinding set'` | Placeholder when no shortcut is defined. |
| `recordingText` | `string` | `'Press key combination (Esc to cancel)...'` | Prompt displayed during active recording. |
```
