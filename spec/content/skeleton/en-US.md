---
id: skeleton
component: skeleton
category: Base Primitives
title: Skeleton
description: Used to show a placeholder while content is loading, with smooth CSS pulse and wave shimmer animations.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| — | Non-interactive placeholder element for loading states |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `animation` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | Animation style for the placeholder loading effect. |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Corner radius preset for the placeholder shape. |
| `animate` | `boolean` | `true` | Convenience boolean flag to toggle animation on or off. |
| `className` | `string` | `''` | Custom CSS classes for height, width, and background styling. |
```
