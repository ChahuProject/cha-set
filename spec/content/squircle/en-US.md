---
id: squircle
component: squircle
category: Base Primitives
title: Squircle
description: iOS continuous curvature superellipse rounded corners (G2 continuity). Eliminates harsh creases caused by abrupt curvature transitions in classic circular arcs, providing smooth, organic modern corners across the design system.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| — | Non-interactive geometric continuous-curvature squircle container |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `radius` | `number` | `8` | Corner radius in logical units. |
| `smoothing` | `number` | `0.6` | Curvature smoothing factor from 0.0 (circle arc) to 1.0 (full squircle). 0.6 is the Apple iOS standard. |
| `cornerSmoothing` | `number` | `0.6` | Alias for smoothing conforming to the neutral schema. |
| `topLeftRadius` | `number` | `undefined` | Explicit top-left corner radius override. |
| `topRightRadius` | `number` | `undefined` | Explicit top-right corner radius override. |
| `bottomLeftRadius` | `number` | `undefined` | Explicit bottom-left corner radius override. |
| `bottomRightRadius` | `number` | `undefined` | Explicit bottom-right corner radius override. |
| `roundLeft` | `boolean` | `true` | Whether left corners are rounded. |
| `roundRight` | `boolean` | `true` | Whether right corners are rounded. |
| `roundTop` | `boolean` | `true` | Whether top corners are rounded. |
| `roundBottom` | `boolean` | `true` | Whether bottom corners are rounded. |
| `borderWidth` | `number` | `0` | Border stroke width in logical units. |
| `borderColor` | `string` | `undefined` | Border stroke color for continuous curvature outline. |
| `color` | `string` | `undefined` | Background surface fill color. |
| `width` | `number` | `undefined` | Explicit width in logical units (auto-measured via ResizeObserver if omitted). |
| `height` | `number` | `undefined` | Explicit height in logical units (auto-measured via ResizeObserver if omitted). |
| `as` | `React.ElementType` | `'div'` | Underlying HTML tag or component to render as. |
```
