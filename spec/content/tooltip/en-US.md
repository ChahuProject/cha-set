---
id: tooltip
component: tooltip
category: Overlays & Feedback
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Focus | Display tooltip when trigger element gains keyboard focus |
| Escape | Dismiss tooltip immediately |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode \| string` | `''` | The content rendered inside the floating tooltip bubble. |
| `shortcut` | `string` | `''` | Keyboard shortcut badge rendered inside the tooltip bubble. |
| `arrow` | `boolean` | `false` | Whether to render a directional arrow pointing toward the trigger. |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | The preferred placement relative to the trigger. |
| `avoidCollisions` | `boolean` | `true` | Whether to shift the bubble back inside the viewport on overflow; false pins exact side placement. |
| `delayDuration` | `number` | `200` | Hover delay in milliseconds before the tooltip opens. |
| `disabled` | `boolean` | `false` | Prevents the tooltip from opening when hovering or focusing. |
| `asChild` | `boolean` | `false` | Merges trigger props and event handlers directly onto the single child element. |
| `open` | `boolean` | `undefined` | Controlled open state of the tooltip. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback executed when the open state changes. |
| `className` | `string` | `''` | Additional CSS class names applied to the element. |
```
