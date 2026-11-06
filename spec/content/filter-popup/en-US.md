---
id: filter-popup
component: filter-popup
category: Overlays & Feedback
title: Filter Popup
description: Multi-dimensional facet filtering popup with search, exclusions, ratings and shortcuts.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Printable Char | Instantly expands and activates search bar with typed character |
| Escape | First press clears search filter text; second press closes popup |
| Left Click | Toggle inclusion filter on item |
| Right Click | Toggle exclusion filter on item (red cross indicator) |
| ArrowUp / ArrowDown | Navigate through facet item rows |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `""` | Title text displayed in the header row. |
| `icon` | `string` | `""` | Icon name displayed before the title. |
| `items` | `FilterPopupItem[]` | `[]` | Array of facet filter items. |
| `open` | `boolean` | `false` | Controlled open state of the popup. |
| `searchEnabled` | `boolean` | `true` | Whether the search filtering capability is enabled. |
| `searchVisibility` | `'autoHidden' \| 'always'` | `'autoHidden'` | Search bar visibility mode. |
| `showLogicToggle` | `boolean` | `false` | Whether to display AND / OR logic toggle capsule. |
| `logicMode` | `'and' \| 'or'` | `'and'` | Active boolean logic filtering mode. |
| `hasActive` | `boolean` | `false` | Whether any filters are currently active in this dimension. |
```
