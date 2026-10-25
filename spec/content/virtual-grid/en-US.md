---
id: virtual-grid
component: virtual-grid
category: Desktop & Virtualization
title: Virtual Grid
description: 2D windowed grid virtualizer for massive dataset visualization.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ / ← / → | Navigate grid cells across rows and columns in 2D |
| PageUp / PageDown | Jump vertically by visible grid page height |
| Home / End | Jump directly to the first / last cell in the dataset |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly T[]` | `[]` | Array of data items to layout into grid cards. |
| `renderCard` | `(item: T, index: number) => ReactNode` | `undefined` | Callback rendering an individual grid card. |
| `renderItem` | `(item: T, index: number) => ReactNode` | `undefined` | Alias for renderCard. |
| `minColumnWidthRem` | `number` | `12` | Minimum column width before responsive wrapping. |
| `gapRem` | `number` | `0.75` | Grid gap spacing between cards. |
| `estimateSize` | `number` | `180` | Estimated row height for virtual calculation. |
| `overscan` | `number` | `4` | Buffer row count rendered beyond viewport bounds. |
| `emptyNode` | `ReactNode` | `null` | Content rendered when items array is empty. |
| `ref` | `Ref<VirtualGridHandle>` | `undefined` | Handle exposing scrollToIndex(index, align). |
```
