---
id: table-of-contents
component: table-of-contents
category: Surfaces & Layout
title: Table of Contents
description: Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support.
---

## Animations {#animations}

Motion behavior and timing for interactive states, strictly following the ChaSet token system.

- State changes (hover, press, focus) animate over `duration-quick` with the `ease-standard` curve.
- Durations and easing resolve from theme tokens, so enabling the reduced-motion preference (`prefers-reduced-motion`) zeroes them automatically; on Qt the switch is governed by `ThemeTokens.animationsEnabled`.

## Keyboard Navigation {#keyboard}

The whole outline is a single tab stop. Once focused, [[↑]] / [[↓]] move the selection, [[Home]] / [[End]] jump to the first or last item, [[Space]] or [[Enter]] activate the selection and scroll to its section, and [[Tab]] / [[Shift+Tab]] move focus in and out.

```table shortcuts
| Key | Behavior |
| --- | --- |
| [[↑]] / [[↓]] | Move the selection through outline items |
| [[Home]] / [[End]] | Jump directly to the first / last outline item |
| [[Space]] / [[Enter]] | Activate the selected item and scroll to its section |
| [[Tab]] / [[Shift+Tab]] | Move focus into and out of the outline |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature, and the Qt counterpart is `ChaSetTableOfContents`.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TocItem[]` | `[]` | Hierarchical array of outline items with level and nested children. |
| `activeId` | `string` | `""` | Currently active section ID. |
| `topOffset` | `number \| string` | `0` | Top offset for sticky positioning, accommodating global announcement banners. |
| `targetOffset` | `number` | `0` | Safety scroll offset ensuring headings are not occluded by top banners. |
| `variant` | `"default" \| "track" \| "flat"` | `"default"` | Visual styling variant of the outline container. |
| `size` | `"default" \| "sm"` | `"default"` | Size density and font scaling of the outline labels. |
| `showTrack` | `boolean` | `true` | Whether to render the vertical guide track and active indicator marker. |
| `showTitle` | `boolean` | `true` | Whether to display the header title label. |
| `title` | `string` | `"On this page"` | Header title text displayed above the outline items. |
| `onSelect` | `(item: TocItem, event) => void` | — | Callback fired when an outline item is selected or activated. |
```

