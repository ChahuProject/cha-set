---
id: window-title-bar
component: window-title-bar
category: Desktop & Virtualization
title: Window Title Bar
description: Desktop window frame header with title, drag region, and minimize/maximize/close buttons.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Alt + Space | Open system window control menu |
| Alt + F4 | Close application window |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `undefined` | Window title label or element. |
| `icon` | `ReactNode` | `undefined` | Application icon rendered at left edge. |
| `onMinimize` | `() => void` | `undefined` | Minimize button click callback. |
| `onMaximize` | `() => void` | `undefined` | Maximize button click callback. |
| `onClose` | `() => void` | `undefined` | Close button click callback. |
```
