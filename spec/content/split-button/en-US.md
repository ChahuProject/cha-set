---
id: split-button
component: split-button
category: Base Primitives
title: Split Button
description: Dual-action button with primary direct click and secondary attached dropdown menu.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Space / Enter | Trigger primary action on main button segment |
| ↓ / Enter | Open secondary actions dropdown menu from dropdown segment |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `undefined` | Label on the primary action button. |
| `onClick` | `() => void` | `undefined` | Callback fired on clicking primary action. |
| `menuContent` | `ReactNode` | `undefined` | Dropdown menu items rendered on chevron click. |
| `variant` | `ButtonVariant` | `'default'` | Button stylistic variant. |
| `size` | `ButtonSize` | `'default'` | Button size variant. |
```
