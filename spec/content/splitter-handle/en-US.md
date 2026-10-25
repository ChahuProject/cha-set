---
id: splitter-handle
component: splitter-handle
category: Surfaces & Layout
title: Splitter Handle
description: Edge resize handle with reference item coordinate stabilization and min/max clamping.
---

## Animations {#animations}

Motion behavior and timing for handle state transitions.

- Active indicator color and opacity transitions animate smoothly over `duration-quick` (150ms) using `ease-standard` curve.
- Handle dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.
- All transitions are guarded by `ThemeTokens.animationsEnabled` and `prefers-reduced-motion`.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / → / ↑ / ↓ | Resize target panel by 10px increment |
| Home | Snap panel to minSize |
| End | Snap panel to maxSize |
| Enter / Double Click | Reset panel to defaultSize |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `edge` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Which edge of the target panel the resize handle controls. |
| `targetSize` | `number` | `200` | Current size (width or height) of the target element being resized. |
| `minSize` | `number` | `100` | Minimum allowed size bound. |
| `maxSize` | `number` | `1000` | Maximum allowed size bound. |
| `defaultSize` | `number` | — | Size restored when double-clicked or Enter is pressed. |
| `liveUpdate` | `boolean` | `true` | Whether size updates fire continuously during drag. |
| `hitThickness` | `number` | `6` | Interactive mouse hit test zone thickness. |
| `visualThickness` | `number` | `1` | Resting visible hairline thickness. |
| `activeVisualThickness` | `number` | `2` | Highlighted visible hairline thickness when hovered or dragged. |
| `disabled` | `boolean` | `false` | Whether handle resizing is disabled. |
```
