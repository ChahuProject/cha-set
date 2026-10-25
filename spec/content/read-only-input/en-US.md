---
id: read-only-input
component: read-only-input
category: Forms & Inputs
title: Read-Only Input
description: Protected input field for tokens and IDs with integrated copy-to-clipboard action.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab | Focus input to allow selecting or reading value |
| Ctrl + C / ⌘ + C | Copy current value to system clipboard |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Protected value displayed in the input. |
| `showCopy` | `boolean` | `true` | Whether to show the attached copy button. |
| `masked` | `boolean` | `false` | Whether to mask characters with bullets. |
| `maskChar` | `string` | `'•'` | Character used for masking. |
| `showMaskToggle` | `boolean` | `true` | Whether to show the reveal/hide toggle button when masked. |
| `size` | `"default" \| "sm"` | `"default"` | Density and sizing variant. |
| `colorScheme` | `"default" \| "destructive" \| "warning" \| "success"` | `"default"` | Color theme variant. |
| `disabled` | `boolean` | `false` | Whether the input field is disabled. |
| `placeholder` | `string` | `''` | Placeholder displayed when value is empty. |
```
