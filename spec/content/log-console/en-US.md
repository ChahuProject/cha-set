---
id: log-console
component: log-console
category: Composite Engines
title: Log Console
description: High-performance virtualized terminal log viewer with auto-scroll, ANSI color parsing, and copy support.
---

## Animations {#animations}

Log console scrolling and live streaming specifications.

- Continuous append of streaming logs smoothly follows at full frame rate when pinned to bottom without layout thrashing.
- Upward scroll detachment smoothly unlocks auto-scroll, restoring pin-to-bottom stickiness when scrolled back to the lower boundary.
- Animation and scroll kinematics strictly obey ChaSet tokens and `ThemeTokens.animationsEnabled` on Qt Desktop.

## Keyboard Navigation {#keyboard}

Keyboard interactions supported by the component.

```table shortcuts
| Key | Interaction |
| --- | --- |
| Tab / Shift+Tab | Navigate focus between console container, line count badge, and copy button |
| Space / Enter | Activate the copy button to copy all plain text logs to clipboard |
| PageUp / PageDown | Scroll up or down by one full viewport page |
| Home / End | Jump immediately to the beginning or end of log history |
```

## Props Reference {#props}

Cross-stack props share identical names and semantics; `Type` reflects TypeScript signatures.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `lines` | `string[]` | `[]` | Array of log lines with optional embedded ANSI escape sequences. |
| `emptyText` | `string` | `'No logs'` | Text displayed when the log array is empty. |
| `showCopy` | `boolean` | `true` | Whether to display the one-click copy button in the header toolbar. |
| `showLineCount` | `boolean` | `true` | Whether to display the total line count badge in the header toolbar. |
| `autoScroll` | `boolean` | `true` | Whether to automatically scroll to the bottom when new lines arrive. |
| `copyTitle` | `string` | `'Copy all logs'` | Tooltip title for the copy button. |
| `className` | `string` | `undefined` | Custom CSS class names applied to root element (React only). |
```
