---
id: notification-stack
component: notification-stack
category: Overlays & Feedback
title: Notification Stack
description: Floating, severity-coded notification stack with per-item lifetimes and inline actions.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab | Enter the live region as a single tab stop and focus the nearest notification |
| ↑ / ↓ | Move the roving focus through the notification cards |
| Home / End | Jump to the first or last notification in the stack |
| Space / Enter | Activate the focused notification's action or dismiss control |
| Escape | Leave the expanded list, then collapse the stack into its summary row |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `notifications` | `NotificationItem[]` | `[]` | Notifications to surface, oldest first; the newest card sits nearest the anchor. |
| `onDismiss` | `(id: string) => void` | `undefined` | Renders the per-card dismiss control and receives every auto-expiry. |
| `onAction` | `(notificationId: string, actionId: string) => void` | `undefined` | Fired when an inline action button is pressed; the card stays until dismissed. |
| `placement` | `"top-left" \| "top-center" \| "top-right" \| "left-center" \| "right-center" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `'bottom-right'` | Viewport anchor. Cards enter and exit through the anchored edge. |
| `offset` | `number` | `16` | Inset from the anchored viewport edges, in logical units. |
| `maxVisible` | `number` | `4` | Cards rendered before the stack overflows into its "show all" pill. |
| `defaultDuration` | `number` | `5000` | Lifetime for items that do not state their own duration. |
| `pauseOnHover` | `boolean` | `true` | Suspends every expiry countdown while the pointer rests on the stack. |
| `collapsible` | `boolean` | `true` | Offers the collapse-to-summary-row control. |
| `defaultCollapsed` | `boolean` | `false` | Renders the stack collapsed on first paint. |
| `label` | `string` | `'Notifications'` | Accessible name of the live region. |
```

Each notification carries id, title, an optional description, a level of info | success | warning | error, an optional duration, dismissible and a list of actions (id, label, variant).
