---
id: virtual-list
component: virtual-list
category: Desktop & Virtualization
title: Virtual List
description: High-performance windowed 100k+ row list with dynamic or fixed item measurements.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ | Navigate items vertically with automatic viewport alignment |
| PageUp / PageDown | Jump up / down by visible viewport page height |
| Home / End | Jump directly to the first / last item in the list |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly T[]` | `[]` | Array of data items to virtualize. |
| `renderRow` | `(item: T, index: number) => ReactNode` | `undefined` | Callback rendering an individual row. |
| `renderItem` | `(item: T, index: number) => ReactNode` | `undefined` | Alias for renderRow. |
| `estimateSize` | `number \| ((index: number) => number)` | `36` | Estimated item height for measurement. |
| `gap` | `number` | `0` | Vertical gap between adjacent items. |
| `overscan` | `number` | `8` | Number of buffer items rendered beyond viewport bounds. |
| `emptyNode` | `ReactNode` | `null` | Content rendered when items array is empty. |
| `onScroll` | `(distanceToBottom: number) => void` | `undefined` | Scroll event callback receiving distance to bottom. |
| `ref` | `Ref<VirtualListHandle>` | `undefined` | Handle exposing scrollToIndex(index, align). |
```
