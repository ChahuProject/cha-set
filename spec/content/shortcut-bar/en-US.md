---
id: shortcut-bar
component: shortcut-bar
category: Base Primitives
title: Shortcut Bar
description: Interactive multi-stage responsive keyboard shortcut bar that progressively adapts from full text to compact symbols, overflow drawer, and keyboard icon.
---

## Animations {#animations}

Motion behavior and timing for interactive states aligned with ChaSet tokens.

- Width transitions and layout rearrangements animate over `duration-short` with the `ease-standard` curve.
- Overflow drawer and compact icon popup opening and dismissal use `duration-short` and `ease-entrance`.
- Durations and easing resolve from theme tokens, so enabling the reduced-motion preference (`prefers-reduced-motion`) zeroes them automatically; on Qt the switch is governed by `ThemeTokens.animationsEnabled`.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| `Tab` / `Shift+Tab` | Cycles focus between interactive elements in the shortcut bar |
| `Enter` / `Space` | When folded into overflow badge or compact keyboard icon, activates popover showing all shortcuts |
| `Esc` | Dismisses the open shortcut list popover drawer |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'auto' \| 'icon'` | `'auto'` | Display mode: `auto` for progressive multi-stage responsive adapting (folds to icon on extreme constraint), `icon` for persistent compact keyboard icon. |
| `items` | `ShortcutItem[]` | `[]` | Custom shortcut list with keys, label, and priority. |
| `preset` | `'dropdown' \| 'dialog' \| 'tree' \| 'table' \| 'address-bar'` | `undefined` | Built-in standard shortcut preset for common container contexts. |
| `additionalShortcuts` | `ShortcutItem[]` | `[]` | Additional shortcuts appended after the preset configuration. |
| `compact` | `'auto' \| 'always' \| 'never'` | `'auto'` | Modifier display mode (convert to compact symbols or full keycap names). |
| `size` | `'xs' \| 'sm' \| 'default' \| 'md'` | `'xs'` | Size scale for shortcut keycaps and text. |
| `variant` | `'outline' \| 'solid' \| 'subtle' \| 'inverted'` | `'outline'` | Visual variant for rendered keycaps. |
| `showOverflowCount` | `boolean` | `true` | Whether to display overflow count badge when shortcuts exceed width. |
| `className` | `string` | `''` | Optional additional Tailwind CSS class names (React). |
```
