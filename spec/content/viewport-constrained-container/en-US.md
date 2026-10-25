---
id: viewport-constrained-container
component: viewport-constrained-container
category: Surfaces & Layout
title: Viewport Constrained Container
description: Container that dynamically bounds max-height based on available viewport space below the anchor.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| PageUp / PageDown | Scroll constrained viewport page up / down |
| Arrow Keys | Scroll viewport smoothly by step |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `maxHeight` | `number \| string` | `undefined` | Optional upper limit on container max-height. |
| `minHeight` | `number \| string` | `80` | Minimum allowable height lower bound. |
| `margin` | `number` | `16` | Reserved margin between container bottom and viewport bottom edge. |
| `overflow` | `'auto' \| 'scroll'` | `'auto'` | Vertical overflow scrolling strategy. |
| `className` | `string` | `undefined` | Custom CSS class names for styling. |
| `children` | `React.ReactNode` | `undefined` | Elements rendered inside the container. |
```
