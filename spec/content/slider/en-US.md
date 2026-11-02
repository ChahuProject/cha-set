---
id: slider
component: slider
category: Forms & Inputs
title: Slider
description: An interactive control for selecting single numeric values, min-max ranges, or discrete presets along a track.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / ↓ | Decrease value by one step (or adjust active thumb in range mode) |
| → / ↑ | Increase value by one step (or adjust active thumb in range mode) |
| Tab / Shift+Tab | Switch focus between low and high thumbs in range mode |
| PageDown / PageUp | Decrease / increase value by 10 steps |
| Home / End | Jump directly to the minimum / maximum value |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| [number, number]` | `—` | The controlled numeric value or [min, max] range tuple of the slider. |
| `defaultValue` | `number \| [number, number]` | `0` | The default value or [min, max] range tuple for uncontrolled slider usage. |
| `min` | `number` | `0` | The minimum allowable value. |
| `max` | `number` | `100` | The maximum allowable value. |
| `step` | `number` | `1` | The stepping granularity interval. |
| `range` | `boolean` | `false` | When true, enables dual-thumb min-max range interval selection with active span fill. |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum number of steps enforced between thumbs in range mode to prevent collision. |
| `commitOnRelease` | `boolean` | `false` | When true, dragging adjusts the thumb visually while value changes and change callbacks commit only on release. |
| `size` | `'default' \| 'sm'` | `'default'` | The size scale of the slider track and thumb. |
| `disabled` | `boolean` | `false` | When true, prevents user interaction and applies muted opacity. |
| `readOnly` | `boolean` | `false` | When true, prevents value changes while maintaining full visual opacity. |
| `showTooltip` | `boolean` | `false` | When true, shows an interactive floating value tooltip over the thumb on drag and hover. |
| `formatValue` | `(value: number) => string` | `—` | Optional formatter function for the floating tooltip text. |
| `showTicks` | `boolean` | `false` | Displays tick mark indicators along the slider track. |
| `marks` | `string[]` | `—` | Optional array of label strings corresponding to discrete stop positions. |
| `count` | `number` | `—` | Number of discrete snap stops (snap mode). |
| `labels` | `string[]` | `—` | Array of label strings for discrete stops rendered beneath the track. |
| `leftLabel` | `string` | `—` | Annotation label displayed below the track on the far left. |
| `rightLabel` | `string` | `—` | Annotation label displayed below the track on the far right. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the slider track. |
| `onValueChange` | `(value: any) => void` | `—` | Event handler called when the slider value changes. |
| `onChange` | `(value: any) => void` | `—` | Standard event handler called when the slider value changes. |
| `onValueCommit` | `(value: any) => void` | `—` | Event handler called on thumb release or keyboard step completion. |
| `name` | `string` | `—` | Form submission name for an underlying hidden input. |
| `forceHover` | `boolean` | `false` | Visual testing aid to programmatically force hover styling. |
| `forceFocus` | `boolean` | `false` | Visual testing aid to programmatically force focus ring styling. |
| `className` | `string` | `''` | Additional CSS class names to apply to the slider root element. |
```
