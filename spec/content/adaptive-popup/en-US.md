---
id: adaptive-popup
component: adaptive-popup
category: Overlays & Feedback
title: Adaptive Popup
description: Content-driven adaptive height popup with zero unnecessary scrollbars and 3-tier layout.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Escape | Close adaptive popup and restore focus |
| Arrow Keys | Scroll content when capped by available host space |
| PageUp / PageDown | Scroll content viewport page up / down |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Controlled open state of the popup. |
| `minHeight` | `number \| string` | `120` | Lower bound protection height to prevent collapse. |
| `maxHeight` | `number \| string` | `-1` | Explicit max height upper bound (-1 or undefined for host-driven). |
| `placement` | `'down' \| 'up'` | `'down'` | Expansion direction relative to anchor coordinates. |
| `anchorX` | `number` | `0` | Expected X origin in host coordinate space. |
| `anchorY` | `number` | `0` | Expected Y coordinate (top for down, bottom for up). |
| `edgeMargin` | `number` | `12` | Safe margin distance from host window bounds. |
| `contentInset` | `number` | `16` | Horizontal padding inset for scrollable content area. |
| `useFullHostBand` | `boolean` | `false` | Whether to utilize full vertical window band when expanding (defaults to anchor side only, preventing overflow or covering anchor). |
| `container` | `HTMLElement \| RefObject \| Item` | `null` | Optional host viewport container, bounding popup expansion and clamping. |
```
