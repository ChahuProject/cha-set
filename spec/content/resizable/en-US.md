---
id: resizable
component: resizable
category: Surfaces & Layout
title: Resizable
description: Accessible resizable panel groups and layout splitters.
---

## Animations {#animations}

Motion behavior and timing for panel resizing and active states.

- Resizing handle hover and active transitions animate over `duration-quick`.
- Panel resizing kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.
- Respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` in Qt.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Arrow Keys | Resize panel dimensions along active drag edge |
| Home / End | Snap panel to minimum / maximum allowable size |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of panel layout (also supports orientation prop). |
| `defaultSize` | `number` | `undefined` | Initial percentage size allocated to the panel (0-100). |
| `minSize` | `number` | `0` | Minimum allowed percentage size constraint. |
| `maxSize` | `number` | `100` | Maximum allowed percentage size constraint. |
| `collapsible` | `boolean` | `false` | Whether the panel collapses completely past its minimum size. |
| `withHandle` | `boolean` | `false` | Renders an accessible tactile visual grip handle on the separator divider. |
```
