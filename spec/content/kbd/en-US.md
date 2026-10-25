---
id: kbd
component: kbd
category: Base Primitives
title: Kbd
description: Displays keyboard shortcuts, key combinations, and keycap badges with smart compact truncation.
---

## Animations {#animations}

Motion behavior and timing for interactive states aligned with ChaSet tokens.

- State changes (hover, press, focus) animate over `duration-quick` with the `ease-standard` curve.
- Durations and easing resolve from theme tokens, so enabling the reduced-motion preference (`prefers-reduced-motion`) zeroes them automatically; on Qt the switch is governed by `ThemeTokens.animationsEnabled`.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| — | Non-interactive visual indicator representing keyboard shortcuts and key combinations |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'outline' \| 'solid' \| 'subtle' \| 'inverted'` | `'outline'` | Visual presentation variant matching container surfaces. |
| `size` | `'xs' \| 'sm' \| 'default' \| 'md'` | `'default'` | Size scale controlling keycap height, padding, and font size. |
| `compact` | `'auto' \| 'always' \| 'never'` | `'auto'` | Whether to convert verbose modifiers to compact symbols (Ctrl to ⌃). |
| `overflow` | `'collapse' \| 'hide' \| 'visible'` | `'collapse'` | Overflow strategy when space is constrained in narrow containers. |
| `shortcut` | `string` | `''` | Serialized shortcut combination string to parse automatically. |
| `separator` | `string` | `'+'` | Custom separator character between combination keys. |
| `className` | `string` | `''` | Optional additional Tailwind CSS class names. |
```
