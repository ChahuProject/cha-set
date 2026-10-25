---
id: select
component: select
category: Forms & Inputs
title: Select
description: Displays a list of options for the user to pick from, triggered by a button with item indicators and scroll buttons.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Enter / Space / ↓ | Open options popover and highlight current value |
| ↓ / ↑ | Navigate options with wrapping, suppressing pointer hover |
| Home / End | Jump directly to the first / last enabled option |
| Enter / Space | Select highlighted option and close popover |
| Escape | Close options popover without changing selection |
| A-Z / 0-9 | Typeahead search jumping to first matching item |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | Controlled selected value. |
| `defaultValue` | `string` | `undefined` | Initial value for uncontrolled usage. |
| `onValueChange` | `(value: string) => void` | `undefined` | Callback triggered when value changes. |
| `disabled` | `boolean` | `false` | Whether the select is disabled. |
```
