---
id: scroll-area
component: scroll-area
category: Surfaces & Layout
title: Scroll Area
description: Custom scrollable container with hot-zone expansion and stepper buttons.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ | Scroll viewport vertically by one line |
| PageUp / PageDown | Scroll viewport vertically by one page |
| Home / End | Scroll directly to the top / bottom of the content |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'default' \| 'sm'` | `'default'` | Scrollbar density and scale. |
| `showVerticalScrollBar` | `boolean` | `true` | Whether to render the vertical scrollbar. |
| `showHorizontalScrollBar` | `boolean` | `false` | Whether to render the horizontal scrollbar. |
| `showButtons` | `boolean` | `true` | Whether stepper navigation buttons appear on scrollbar hover. |
| `pageStepRatio` | `number` | `0.85` | Viewport dimension ratio used when clicking page-up/page-down. |
| `smoothScroll` | `boolean` | `true` | Whether stepper buttons use smooth scrolling behavior. |
| `floating` | `boolean` | `true` | Whether scrollbars float over viewport content or occupy dedicated gutter layout space. |
| `viewportClassName` | `string` | `undefined` | Additional CSS classes for the internal scroll viewport element. |
```

## ScrollBar Props {#scroll-bar-props}

ScrollBar is the sub-component Scroll Area renders for its scrollbars; these properties apply when you compose it directly.

```table props
| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Scrollbar orientation axis. |
| `size` | `'default' \| 'sm'` | `'default'` | Scrollbar density and scale. |
| `floating` | `boolean` | `true` | Whether the scrollbar floats over viewport content or occupies dedicated gutter layout space. |
| `hitSize` | `number \| string` | `8` | Thickness of the transparent pointer-capture hot-zone. |
| `collapsedSize` | `number \| string` | `4` | Thickness of the visual indicator when idle. |
| `expandedSize` | `number \| string` | `8` | Thickness of the visual indicator when hovered. |
```
