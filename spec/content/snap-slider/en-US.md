---
id: snap-slider
component: snap-slider
category: Forms & Inputs
title: Snap Slider
description: Stepped discrete slider that snaps to defined stops with ticks and label row.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / ↓ | Step to previous discrete stop |
| → / ↑ | Step to next discrete stop |
| Home / End | Jump directly to the first or last stop |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Controlled current snap stop index. |
| `defaultValue` | `number` | `0` | Default initial snap stop index in uncontrolled mode. |
| `count` | `number` | `5` | Total number of discrete stops (defaults to labels.length if provided). |
| `labels` | `string[]` | `[]` | Array of labels for each stop shown at the active center position. |
| `leftLabel` | `string` | `""` | Boundary label on the bottom-left edge. |
| `rightLabel` | `string` | `""` | Boundary label on the bottom-right edge. |
| `showTicks` | `boolean` | `true` | Whether to display tick marks on the slider track. |
| `size` | `"default" \| "sm"` | `"default"` | Visual sizing variant. |
| `disabled` | `boolean` | `false` | Whether the slider is disabled. |
| `readOnly` | `boolean` | `false` | Whether the slider is read-only. |
| `onChange` | `(index: number) => void` | `undefined` | Callback fired when the selected stop index changes. |
```
