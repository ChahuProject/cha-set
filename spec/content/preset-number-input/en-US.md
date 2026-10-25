---
id: preset-number-input
component: preset-number-input
category: Forms & Inputs
title: Preset Number Input
description: Numeric input field with quick-select preset dropdown panel and clear actions.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ | Increment / decrement numeric value by unit step |
| PageUp / PageDown | Increment / decrement numeric value by preset large step |
| Enter | Commit parsed numeric value |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Current numeric value of the input. |
| `onChange` | `(val: string) => void` | `undefined` | Callback fired when the value changes. |
| `presets` | `number[]` | `[64, 128, 256, 512, 1024, 2048, 4096, 8192]` | List of quick-select preset numbers. |
| `placeholder` | `string` | `undefined` | Placeholder text displayed when empty. |
| `disabled` | `boolean` | `false` | Whether typing and dropdown interactions are disabled. |
| `allowClear` | `boolean` | `true` | Whether to display the clear/reset option in dropdown. |
| `clearLabel` | `string` | `'None'` | Label text for the clear option. |
| `inputClassName` | `string` | `undefined` | Custom CSS classes for the inner input. |
| `className` | `string` | `undefined` | Custom CSS classes for the outer container. |
```
