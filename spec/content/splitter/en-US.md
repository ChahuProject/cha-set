---
id: splitter
component: splitter
category: Surfaces & Layout
title: Splitter
description: Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits.
---

## Animations {#animations}

Motion behavior and timing for divider dragging and state transitions.

- Gutter indicator color and opacity transitions animate smoothly over `duration-quick` (150ms) using `ease-standard` curve.
- Divider dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.
- All transitions are guarded by `ThemeTokens.animationsEnabled` and `prefers-reduced-motion`.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / → | Adjust horizontal splitter ratio by step increment |
| ↑ / ↓ | Adjust vertical splitter ratio by step increment |
| Home / End | Snap splitter to minimum / maximum pane limit |
| Enter | Reset splitter to default balanced ratio |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number` | `undefined` | Controlled percentage width/height (0-100). |
| `onChange` | `(size: number) => void` | `undefined` | Callback fired on drag with new percentage. |
| `initialSize` | `number` | `50` | Initial size percentage for uncontrolled usage. |
| `minSize` | `number` | `0` | Minimum allowed percentage bound. |
| `maxSize` | `number` | `100` | Maximum allowed percentage bound. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Orientation of the divider. |
```
