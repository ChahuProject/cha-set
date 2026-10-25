---
id: smooth-wheel-handler
component: smooth-wheel-handler
category: Desktop & Virtualization
title: Smooth Wheel Handler
description: Desktop kinematic scrolling helper with continuous damping, Shift-horizontal conversion, and gesture mutex.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Mouse Wheel | Continuous smooth scrolling with momentum damping |
| Shift + Wheel | Map vertical mouse wheel to horizontal scrolling |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `scrollOrientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Primary direction of scrolling for the target viewport. |
| `mapVerticalToHorizontal` | `boolean` | `false` | Whether to map vertical wheel ticks to horizontal axis movement. |
| `speedMultiplier` | `number` | `1.2` | Scroll speed multiplier applied to raw delta values. |
| `duration` | `number` | `200` | Duration in milliseconds for the OutCubic damping transition. |
| `fixedStepSize` | `number` | `0` | Optional quantized step increment per wheel notch (0 for dynamic). |
| `consumeEvent` | `boolean` | `true` | Whether to prevent propagation of handled wheel events to parent windows. |
```
