---
id: draggable-modal
component: draggable-modal
category: Overlays & Feedback
title: Draggable Modal
description: Desktop floating window with dragging title bar and bound viewport constraints.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Trap focus strictly within modal boundaries |
| Escape | Close modal and restore focus to trigger |
| Alt + Arrow Keys | Reposition modal window offset without mouse |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `undefined` | Scrollable main content body of the modal. |
| `initialPositionMode` | `'center' \| 'top' \| '居中' \| '顶部靠上'` | `'center'` | Initial placement mode: centered or top-anchored. |
| `sizeOptions` | `DraggableModalSizeOption[]` | `undefined` | Preset size options for the top-right dropdown switcher. |
| `sizeMenuTooltip` | `string` | `'调整弹窗尺寸'` | Hover tooltip text for the size menu button. |
| `fixedFooter` | `ReactNode` | `undefined` | Pinned bottom action area that does not scroll with content. |
| `topControls` | `ReactNode` | `undefined` | Extra controls rendered in the top-right action bar (e.g. close button). |
| `rootExtra` | `ReactNode` | `undefined` | Extra content inside the root container (e.g. floating panels). |
| `autoFitHeight` | `boolean` | `true` | Whether to auto-fit height to natural content height. |
| `showEscBadge` | `boolean` | `false` | Whether to show the ESC hint badge in the top-right corner. |
| `bounds` | `string \| Element` | `'window'` | Drag bounds for the modal: window-level floating or parent-bounded canvas. |
| `defaultWidthRem` | `number` | `undefined` | Initial width (in rem units). |
| `defaultHeightRem` | `number` | `undefined` | Initial height (in rem units). |
| `defaultWidth` | `number` | `500` | Initial width. |
| `defaultHeight` | `number` | `400` | Initial height. |
| `topMarginRem` | `number` | `4.5` | Top margin in top-anchored mode (in rem units). |
| `remBase` | `number` | `16` | Base ratio for rem conversion. |
```
