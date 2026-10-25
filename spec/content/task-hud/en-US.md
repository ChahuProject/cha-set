---
id: task-hud
component: task-hud
category: Overlays & Feedback
title: Task HUD
description: Floating stack of background executions with progress, overflow and collapse-to-summary.
---

## Animations {#animations}

Entry, exit, and progress transitions for task cards in the HUD stack.

- New task cards expand their row height and fade in over `duration-short` (180ms) with `ease-entrance`.
- Dismissed cards linger as exit ghosts for the same 180ms so the stack reorders underneath them instead of snapping.
- Determinate progress transitions over `duration-medium`; indeterminate tasks run an infinite 1.6s shimmer rail.
- An emptied HUD holds its last frame for `autoHideDelay` (600ms) before fading out.
- Respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` in Qt.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab | Enter the stack as a single tab stop and focus the nearest card |
| ↑ / ↓ | Move the roving focus through the cards in the stack |
| Home / End | Jump to the first or last card in the stack |
| Space / Enter | Activate the focused card's dismiss or cancel control |
| Escape | Leave the expanded list, then collapse the stack into its summary row |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tasks` | `TaskItem[]` | `[]` | Background executions to surface, oldest first; the newest card sits nearest the anchor. |
| `onDismiss` | `(id: string) => void` | `undefined` | Renders the per-card dismiss control; omit to make cards non-dismissible. |
| `onCancel` | `(id: string) => void` | `undefined` | Renders a cancel control on running tasks flagged cancellable. |
| `maxVisible` | `number` | `3` | Cards rendered before the stack overflows into its "show all" pill. |
| `autoHideDelay` | `number` | `600` | Grace period in milliseconds an emptied HUD stays on screen before fading out. |
| `placement` | `"top-left" \| "top-center" \| "top-right" \| "left-center" \| "right-center" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `'bottom-right'` | Viewport anchor. Cards enter and exit through the anchored edge. |
| `offset` | `number` | `16` | Inset from the anchored viewport edges, in logical units. |
| `collapsible` | `boolean` | `true` | Offers the collapse-to-summary-row control. |
| `defaultCollapsed` | `boolean` | `false` | Renders the stack collapsed on first paint. |
| `forceVisible` | `boolean` | `false` | Keeps the HUD mounted while no task is running (used by static sandboxes). |
| `label` | `string` | `'Task Progress HUD'` | Accessible name of the HUD region. |
```

Each TaskItem carries id, title, an optional detail, a status of queued | running | success | warning | error | cancelled, a progress ratio (or indeterminate), a total/done step counter and elapsedMs.
