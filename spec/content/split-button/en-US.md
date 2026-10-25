---
id: split-button
component: split-button
category: Base Primitives
title: Split Button
description: Dual-action button with primary direct click and secondary attached dropdown menu.
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
