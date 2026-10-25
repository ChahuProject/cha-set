---
id: duration-input
component: duration-input
category: Forms & Inputs
title: Duration Input
description: Segmented duration input with step buttons, keyboard arrow jumping, and preset menu.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ | Increment / decrement focused time segment (hours, minutes, seconds) |
| ← / → | Navigate between adjacent time segments |
| Tab / Shift + Tab | Move focus between time segments and preset dropdown |
| Mouse Wheel | Adjust focused segment value up or down |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Total duration in seconds (controlled mode). |
| `defaultValue` | `number` | `0` | Initial duration in seconds (uncontrolled mode). |
| `onChange` | `(seconds: number) => void` | `undefined` | Callback fired when the duration changes. |
| `maxHours` | `number` | `99` | Upper clamp limit for the hours segment. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Visual density and size variant. |
| `disabled` | `boolean` | `false` | Whether the inputs, buttons, and preset dropdown are disabled. |
| `showPresets` | `boolean` | `true` | Whether to display the preset dropdown button. |
| `showLabels` | `boolean` | `true` | Whether to display the segment unit labels underneath. |
| `presets` | `DurationPresetGroup[]` | `defaultDurationPresetGroups` | Custom grouped duration presets for the dropdown. |
| `hoursLabel` | `string` | `'Hours'` | Label text for hours segment. |
| `minutesLabel` | `string` | `'Minutes'` | Label text for minutes segment. |
| `secondsLabel` | `string` | `'Seconds'` | Label text for seconds segment. |
| `presetsLabel` | `string` | `'Presets'` | Label text for the presets trigger button. |
| `className` | `string` | `undefined` | Custom CSS classes for outer container. |
```
