---
id: address-bar
component: address-bar
category: Composite Engines
title: Address Bar
description: Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing.
---

## Animations {#animations}

Motion tokens and kinematic transitions for mode transitions and suggestions.

- Breadcrumb segment hover highlights transition over `duration-quick` (100ms) with `ease-standard` curve (Qt counterpart: `ThemeTokens.motionQuick`).
- Suggestions popover renders with an entry scale and fade animation over 120ms.
- Respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` in Qt.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Alt + D / Ctrl + L | Switch to path edit mode and select all text |
| Enter | Commit edited path and trigger navigation |
| Escape | Cancel edit mode and revert to breadcrumb display |
| Alt + Left / Alt + Right | Trigger backward or forward history navigation |
| Alt + Up | Navigate to the parent directory level |
| F5 / Ctrl + R | Refresh the active location |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | `''` | Current path string rendered in breadcrumb and edit modes. |
| `defaultValue` | `string` | `''` | Initial path string for uncontrolled usage. |
| `onNavigate` | `(path: string) => void` | `undefined` | Callback invoked when a new path is committed via segment click or Enter. |
| `showNavButtons` | `boolean` | `true` | Whether to show back, forward, up, and refresh navigation buttons. |
| `canGoBack` | `boolean` | `false` | Enables the backward history navigation button. |
| `canGoForward` | `boolean` | `false` | Enables the forward history navigation button. |
| `suggestions` | `string[]` | `[]` | List of auto-complete path strings in the dropdown popover. |
| `history` | `string[]` | `[]` | Recent typed path history for dropdown display. |
| `showSearch` | `boolean` | `false` | Whether to show the integrated search/filter input on the right side. |
| `fileSystemAdapter` | `AddressBarFileSystemAdapter` | `defaultVirtualFileSystemAdapter` | File system adapter providing subfolder enumeration and suggestion querying. |
| `onNavigateWithSelection` | `(path: string, selectionPath: string) => void` | `undefined` | Callback when navigating with a specific file item selected. |
| `disabled` | `boolean` | `false` | Disables all interactions and input editing. |
```
