---
id: slider
component: slider
category: Forms & Inputs
title: Slider
description: An interactive control that allows the user to select a numeric value along a track.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / ↓ | Decrease value by one step |
| → / ↑ | Increase value by one step |
| PageDown / PageUp | Decrease / increase value by 10 steps |
| Home / End | Jump directly to the minimum / maximum value |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `—` | The controlled numeric value of the slider. |
| `defaultValue` | `number` | `0` | The default value for uncontrolled slider usage. |
| `min` | `number` | `0` | The minimum allowable value. |
| `max` | `number` | `100` | The maximum allowable value. |
| `step` | `number` | `1` | The stepping granularity interval. |
| `size` | `'default' \| 'sm'` | `'default'` | The size scale of the slider track and thumb. |
| `disabled` | `boolean` | `false` | When true, prevents user interaction and applies muted opacity. |
| `readOnly` | `boolean` | `false` | When true, prevents value changes while maintaining full visual opacity. |
| `showTooltip` | `boolean` | `false` | When true, shows an interactive floating value tooltip over the thumb on drag and hover. |
| `formatValue` | `(value: number) => string` | `—` | Optional formatter function for the floating tooltip text. |
| `showTicks` | `boolean` | `false` | Displays tick mark indicators along the slider track. |
| `marks` | `string[]` | `—` | Optional array of label strings corresponding to discrete stop positions. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the slider track. |
| `onValueChange` | `(value: number) => void` | `—` | Event handler called when the slider value changes. |
| `onChange` | `(value: number) => void` | `—` | Standard event handler called when the slider value changes. |
| `name` | `string` | `—` | Form submission name for an underlying hidden input. |
| `forceHover` | `boolean` | `false` | Visual testing aid to programmatically force hover styling. |
| `forceFocus` | `boolean` | `false` | Visual testing aid to programmatically force focus ring styling. |
| `className` | `string` | `''` | Additional CSS class names to apply to the slider root element. |
```
