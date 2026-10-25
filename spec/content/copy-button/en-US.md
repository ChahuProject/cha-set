---
id: copy-button
component: copy-button
category: Base Primitives
title: Copy Button
description: One-click clipboard copy button with transient success checkmark feedback and customizable timeout.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Space / Enter | Copy target text content to system clipboard |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string \| (() => string \| Promise<string>)` | `''` | Text string written to clipboard on click. |
| `label` | `string` | `''` | Optional companion label alongside the icon. |
| `copiedLabel` | `string` | `'Copied!'` | Label text displayed after successful copy. |
| `timeout` | `number` | `2000` | Duration in ms to show the copied checkmark state. |
| `variant` | `'ghost' \| 'outline' \| 'default' \| 'secondary'` | `'ghost'` | Button visual variant. |
| `size` | `'icon-xs' \| 'icon-sm' \| 'sm' \| 'default'` | `label ? 'sm' : 'icon-xs'` | Button sizing preset. |
| `onCopy` | `(copiedText: string) => void` | `undefined` | Callback fired when text is copied. |
```
