---
id: document-tabs
component: document-tabs
category: Desktop & Virtualization
title: Document Tabs
description: Desktop workspace document tab strip container with smooth horizontal scroll, adaptive width, close actions, and shell chrome integration.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Ctrl + W / Cmd + W | Close current active document tab |
| Ctrl + Tab | Switch to the next document tab |
| Ctrl + Shift + Tab | Switch to the previous document tab |
| Middle Click | Close the clicked tab directly |
| Right Click | Open tab context menu |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `useShellChrome` | `boolean` | `false` | Whether to blend seamlessly into frameless native title bars. |
| `tabWidthMode` | `'content' \| 'fixed'` | `'content'` | Tab sizing policy: content-adaptive (VS Code style) or fixed equal width (Chrome style). |
| `selected` | `boolean` | `false` | Whether the tab item is currently active and selected. |
| `canClose` | `boolean` | `true` | Whether the tab can be closed; false indicates a pinned tab. |
| `tabMinWidth` | `number` | `56` | Minimum tab width constraint in standard design units. |
| `tabMaxWidth` | `number` | `240` | Maximum tab width constraint before ellipsis truncation. |
| `onClose` | `() => void` | `undefined` | Callback fired when the tab close icon is clicked. |
| `onMiddleClick` | `() => void` | `undefined` | Callback fired on mouse wheel middle button click. |
```
