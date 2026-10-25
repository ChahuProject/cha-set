---
id: range-slider
component: range-slider
category: Forms & Inputs
title: Range Slider
description: Dual-thumb slider for selecting numeric min-max intervals with collision prevention.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab | Toggle focus between lower and upper range thumb handles |
| ← / ↓ | Decrease active handle value by step |
| → / ↑ | Increase active handle value by step |
| Home / End | Snap active handle to minimum / maximum bound |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `[number, number]` | `[0, 100]` | Current [min, max] interval value. |
| `onValueChange` | `(val: [number, number]) => void` | `undefined` | Callback fired on thumb move. |
| `onChange` | `(val: [number, number]) => void` | `undefined` | Alias for onValueChange. |
| `size` | `"default" \| "sm"` | `"default"` | Density and sizing variant. |
| `showTooltip` | `boolean` | `false` | Displays value tooltip bubble on hover, drag, and focus. |
| `readOnly` | `boolean` | `false` | Prevents user interaction while preserving contrast. |
| `disabled` | `boolean` | `false` | Disables slider interaction and dims opacity. |
| `min` | `number` | `0` | Minimum allowed value. |
| `max` | `number` | `100` | Maximum allowed value. |
| `step` | `number` | `1` | Step increment. |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum gap between the two thumbs. |
```
