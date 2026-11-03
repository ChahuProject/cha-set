---
id: activity-stack
component: activity-stack
category: Overlays & Feedback
title: Activity Stack
description: Floating viewport-anchored stack of activity cards with 8-way placement, overflow, and collapse.
---

## Animations {#animations}

Motion tokens and transition rules governing entry, exit, and collapse of activity cards.

- New cards slide in from the anchored viewport edge and fade in over `duration-short` (180ms) with `ease-entrance`.
- Dismissed cards linger in place as fading ghosts for 180ms while adjacent cards smoothly translate into position.
- Collapsing and expanding summary rows animate over `duration-medium` (240ms) with `ease-emphasized`.
- Determinate progress updates transition over `duration-medium`; indeterminate progress animates a 1.6s looping shimmer.
- Controlled by `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` on Qt.

## Keyboard Navigation {#keyboard}

Keyboard controls supported for mouse-free traversal.

```table shortcuts
| Key | Action |
| --- | --- |
| Tab | Enters the activity stack region and focuses the first card |
| ↑ / ↓ | Moves roving focus between active cards |
| Home / End | Jumps focus to the first or last active card |
| Space / Enter | Activates dismiss or primary action on the focused card |
| Escape | Collapses expanded list or releases roving focus |
```

## Props Reference {#props}

Neutral property specifications aligned across both stacks; types reflect TypeScript signatures.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `ActivityStackEntry[]` | `[]` | Array of card entries, oldest first. Newest appears closest to anchor. |
| `placement` | `"top-left" \| "top-center" \| "top-right" \| "left-center" \| "right-center" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `'bottom-right'` | Viewport anchor placement. |
| `offset` | `number` | `16` | Inset from anchored edges in logical units. |
| `maxVisible` | `number` | `3` | Maximum cards shown before overflowing into a show-all pill. |
| `collapsible` | `boolean` | `true` | Whether to render the collapse-to-summary control. |
| `defaultCollapsed` | `boolean` | `false` | Whether the stack starts collapsed on initial render. |
| `label` | `string` | `'Activity Stack'` | Accessible name for the activity region. |
| `summaryLabel` | `string` | `undefined` | Noun appended to collapsed summary count (e.g. "active tasks"). |
```
