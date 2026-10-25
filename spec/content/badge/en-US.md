---
id: badge
component: badge
category: Base Primitives
title: Badge
description: Displays a badge or a component that looks like a badge to highlight status, tags, and counts.
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
| Tab | Move focus to badge if interactive |
| Space / Enter | Trigger click action if interactive |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | Visual stylistic variant corresponding to core color tokens. |
| `size` | `'default' \| 'sm'` | `'default'` | Size variant determining pill height, padding, and font metrics scale. |
| `dot` | `boolean` | `false` | Whether to display a leading status indicator dot. |
| `dotColor` | `string` | `undefined` | Custom color class for the status dot (e.g. bg-emerald-500). |
| `removable` | `boolean` | `false` | Whether to display an inline dismiss/remove action button. |
| `onRemove` | `() => void` | `undefined` | Callback fired when the dismiss/remove action is triggered. |
| `interactive` | `boolean` | `false` | Whether the badge responds with interactive cursor and click effects. |
| `className` | `string` | `''` | Optional additional Tailwind CSS class names. |
```
