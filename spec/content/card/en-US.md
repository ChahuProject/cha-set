---
id: card
component: card
category: Surfaces & Layout
title: Card
description: Displays a card with header, title, description, content, and footer actions.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Traverse through interactive controls inside card |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'outline'` | `'default'` | Visual presentation style of the card container. |
| `size` | `'default' \| 'sm'` | `'default'` | Density and padding scale of the card and composite containers. |
| `interactive` | `boolean` | `false` | Whether the card provides hover/active elevation styling and cursor pointer. |
| `className` | `string` | `''` | Additional CSS class names to apply to the container. |
| `children` | `React.ReactNode` | `—` | Card composite subcomponents or custom elements. |
```
