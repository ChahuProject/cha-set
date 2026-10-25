---
id: popover
component: popover
category: Overlays & Feedback
title: Popover
description: Displays rich interactive content in a floating portal anchored to a trigger, with accessible focus management.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Enter / Space | Toggle popover content from trigger |
| Tab | Move focus into popover interactive content |
| Escape | Close popover and restore focus to trigger |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Default open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Open state change handler. |
| `modal` | `boolean` | `false` | Whether the popover is rendered as modal with backdrop. |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Placement side relative to trigger. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along the anchor edge. |
| `sideOffset` | `number` | `8` | Distance offset from trigger. |
| `alignOffset` | `number` | `0` | Offset distance along alignment edge. |
| `arrow` | `boolean` | `false` | Whether to render an anchored directional arrow. |
| `movable` | `boolean` | `false` | Enables interactive drag repositioning via handle. |
| `moveLabel` | `string` | `'Drag to move'` | Accessible label for the drag handle button. |
```
