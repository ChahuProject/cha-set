---
id: separator
component: separator
category: Base Primitives
title: Separator
description: Visually or semantically separates content in a list, form, or section.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| — | Non-interactive visual and semantic boundary divider |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the separator line. |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | The stroke style of the separator line. |
| `label` | `ReactNode` | `undefined` | Optional label or annotation text embedded in the divider line. |
| `labelPosition` | `'left' \| 'center' \| 'right'` | `'center'` | Horizontal alignment for the embedded label. |
| `decorative` | `boolean` | `true` | Whether the element is purely decorative or conveys semantic structure. |
| `className` | `string` | `''` | Additional CSS classes for custom width, height, margin, or color overrides. |
```
