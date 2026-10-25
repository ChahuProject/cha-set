---
id: elided-text
component: elided-text
category: Base Primitives
title: Elided Text
description: Smart text truncation with automatic overflow detection, click-to-copy, and contextual tooltip reveal.
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
| Hover / Focus | Display full untruncated text in tooltip if elided |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | The string content to display and measure for overflow. |
| `tooltipText` | `string` | `''` | Custom tooltip text override if different from raw text. |
| `tooltipPlacement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'top'` | Placement direction of the floating tooltip. |
| `tooltipDelay` | `number` | `400` | Delay in milliseconds before showing tooltip on hover. |
| `alwaysShowTooltip` | `boolean` | `false` | Force tooltip to appear on hover even if text is not elided. |
| `showTooltipWhenElided` | `boolean` | `true` | Enable tooltip reveal whenever overflow truncation is detected. |
| `maxLines` | `number` | `1` | Maximum visible lines before truncating (1 = single line, >1 = clamp). |
| `copyable` | `boolean` | `false` | Whether clicking the text copies it to clipboard with instant feedback. |
```
