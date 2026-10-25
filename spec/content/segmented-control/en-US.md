---
id: segmented-control
component: segmented-control
category: Forms & Inputs
title: Segmented Control
description: Compact pill segmented switch for toolbars, menus, and view toggles.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / → | Navigate between adjacent segments |
| Home / End | Jump to the first / last segment |
| Space / Enter | Select and activate the focused segment |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SegmentedControlOption[]` | — | Array of option objects ({ label, value, icon?, badge?, disabled?, tooltip? }). |
| `value` | `string \| number` | — | Controlled active value. |
| `defaultValue` | `string \| number` | — | Initial value when uncontrolled. |
| `onValueChange` | `(value: string \| number) => void` | — | Callback invoked when a new segment is selected. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Physical dimension variant ('sm', 'default', 'lg'). |
| `title` | `string` | — | Optional prefix label displayed before the segments. |
| `disabled` | `boolean` | `false` | Whether the entire segmented control is disabled. |
| `fullWidth` | `boolean` | `false` | Whether segments expand equally to fill the parent container. |
| `equalWidth` | `boolean` | `false` | Whether all segments share an identical fixed width while hugging content. |
| `itemWidth` | `number` | — | Explicit fixed width allocated to each segment option. |
| `tooltipSide` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Default side placement for option tooltips. |
| `tooltipDelayDuration` | `number` | `200` | Default hover delay duration in ms before displaying option tooltips. |
| `renderTooltip` | `(option: SegmentedControlOption) => React.ReactNode` | — | Custom render function for option tooltips, allowing full user customization. |
```
