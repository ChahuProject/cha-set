---
id: tabs
component: tabs
category: Surfaces & Layout
title: Tabs
description: A set of layered content sections known as tab panels, displayed one at a time.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / → | Switch active tab in horizontal orientation |
| ↑ / ↓ | Switch active tab in vertical orientation |
| Home / End | Jump directly to the first / last tab |
| Space / Enter | Activate tab when in manual activation mode |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultValue` | `string` | `undefined` | The value of the tab that should be active when initially rendered (uncontrolled). |
| `value` | `string` | `undefined` | The controlled value of the active tab. |
| `onValueChange` | `(value: string) => void` | `undefined` | Event handler called when the active tab changes. |
| `variant` | `'default' \| 'line'` | `'default'` | Visual presentation style: pill container (default) or underline tab bar (line). |
| `size` | `'default' \| 'sm'` | `'default'` | Size scale of the tabs triggers and container. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the tabs (controls keyboard navigation axis). |
| `disabled` | `boolean` | `false` | When true on TabsTrigger, prevents interaction on that tab. |
| `badge` | `ReactNode \| string` | `undefined` | Optional count badge or text label rendered inside the trigger. |
| `icon` | `ReactNode` | `undefined` | Optional leading icon element rendered inside the trigger. |
```
