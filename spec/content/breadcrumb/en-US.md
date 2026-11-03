---
id: breadcrumb
component: breadcrumb
category: Surfaces & Layout
title: Breadcrumb
description: Hierarchical path navigation trail with overflow ellipsis and dropdown subfolder browsing.
---

## Animations {#animations}

Motion tokens and transition rules governing segment hover, overflow collapsing, and dropdown menus.

- Segment hover and press states transition over `duration-quick` (90ms) with `ease-standard`.
- Subfolder dropdown menus and overflow popups fade and zoom in over `duration-short` (180ms) with `ease-entrance`.
- Constrained nodes collapse smoothly into an ellipsis pill button as viewport width tightens.
- Controlled by `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` on Qt.

## Keyboard Navigation {#keyboard}

Keyboard controls supported for accessible mouse-free navigation.

```table shortcuts
| Key | Action |
| --- | --- |
| Tab / Shift+Tab | Moves focus between visible breadcrumb segments and dropdown chevrons |
| Space / Enter | Activates focused segment to navigate, or opens subfolder dropdown |
| ↑ / ↓ | Navigates through items inside open subfolder or overflow dropdown |
| Escape | Dismisses open dropdown menu and returns focus to active segment |
```

## Props Reference {#props}

Neutral property specifications aligned across both stacks; types reflect TypeScript signatures.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `segments` | `PathSegment[]` | `[]` | Array of path segments containing path, label, and icon metadata. |
| `activePath` | `string` | `undefined` | Active path string matching current route. |
| `disabled` | `boolean` | `false` | Whether the breadcrumb is disabled. |
| `openSegmentIndex` | `number` | `-1` | Index of segment whose subfolders dropdown is open (-1 for none). |
| `maxVisibleItems` | `number` | `5` | Maximum segments shown before collapsing into an overflow ellipsis. |
```
