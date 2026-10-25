---
id: floating-notice
component: floating-notice
category: Overlays & Feedback
title: Floating Notice
description: Floating stacked notice pill anchored to top or bottom with priority queueing, card-stack cycling, and extensible content.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Escape | Dismiss the currently active notice |
| ← / → | Cycle through queued notices |
| Tab / Shift + Tab | Move focus between close button and interactive notice actions |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `notices` | `FloatingNoticeItem[]` | `[]` | Array of notice items to display and queue. |
| `placement` | `'top' \| 'bottom'` | `'top'` | Anchoring edge for the floating notice container. |
| `offset` | `number` | `16` | Inset from anchored viewport edge in logical dp. |
| `gap` | `number` | `undefined (adaptive: 12dp / 10dp / 7dp)` | Joint spacing between stacked notice cards in logical dp. Omit for adaptive spacing based on notice count. |
| `defaultDuration` | `number` | `3000` | Fallback lifetime in ms before auto-dismiss. |
| `pauseOnHover` | `boolean` | `true` | Whether mouse hovering suspends cycling and expiry timers. |
| `zoomOnHover` | `boolean` | `true` | Whether hovering smoothly magnifies the notice by 1.05x. |
| `closable` | `boolean` | `true` | Whether items reveal a close dismiss button on hover. |
| `renderContent` | `(item: FloatingNoticeItem) => ReactNode` | `undefined` | Optional custom render callback for notice content slots. |
```
