---
id: setting-row
component: setting-row
category: Surfaces & Layout
title: Setting Row
description: Settings form item layout with title, description, control slot, and anchor flash.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Focus embedded control inside setting row |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `ReactNode \| string` | — | Primary title label for the setting item. |
| `description` | `ReactNode \| string` | — | Secondary explanatory subtitle text. |
| `icon` | `ReactNode \| string` | — | Optional leading icon or badge avatar. |
| `badge` | `ReactNode \| string` | — | Optional trailing badge tag next to title. |
| `size` | `'default' \| 'sm'` | `'default'` | Density size variant ('default' or 'sm'). |
| `highlightId` | `string` | — | Unique identifier used for anchor jump targeting. |
| `highlightTarget` | `string` | — | Active target identifier. When matching highlightId, triggers pulse. |
| `highlight` | `boolean` | `false` | Direct boolean override to force active highlight animation. |
| `disabled` | `boolean` | `false` | Whether the setting row and controls are dimmed and disabled. |
```
