---
id: code-block
component: code-block
category: Composite Engines
title: Code Block
description: Spec-driven syntax-highlighted code viewer composed from scroll, copy, and tab primitives.
---

## Animations {#animations}

Motion behavior and timing for interactive states aligned with ChaSet tokens.

- State changes (hover, press, focus) animate over `duration-quick` with the `ease-standard` curve.
- Durations and easing resolve from theme tokens, so enabling the reduced-motion preference (`prefers-reduced-motion`) zeroes them automatically; on Qt the switch is governed by `ThemeTokens.animationsEnabled`.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Traverse between file tabs and the copy button in the header |
| ← / → | Switch the active file tab in a multi-file code block |
| Space / Enter | Copy the active file source to the system clipboard |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | `''` | Source text; ignored when `files` is provided. |
| `language` | `string` | `'tsx'` | Language id or alias resolved by the shared lexer. |
| `filename` | `string` | `undefined` | Header title override; defaults to the resolved language label. |
| `files` | `CodeBlockFileProps[]` | `undefined` | Multi-file tab group; when present it replaces the single-file body. |
| `highlight` | `boolean` | `true` | Enable spec-driven syntax highlighting. |
| `showLineNumbers` | `boolean` | `false` | Render a line-number gutter. |
| `showLanguage` | `boolean` | `true` | Render the language / filename label in the header. |
| `showCopy` | `boolean` | `true` | Render the built-in copy button in the header. |
| `wrap` | `boolean` | `false` | Wrap long lines instead of scrolling horizontally. |
| `maxHeight` | `number \| string` | `undefined` | Bound the content height (rem-equivalent number, or any CSS length string). |
| `embedded` | `boolean` | `false` | Drop the card chrome (border / background / header) for inline prose embedding. |
| `copyLabel` | `string` | `undefined` | Accessible label for the copy button. |
| `className` | `string` | `undefined` | Additional class names for the outer container. |
```
