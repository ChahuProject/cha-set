---
id: label
component: label
category: Base Primitives
title: Label
description: Renders an accessible label associated with form controls.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Click / Space | Transfer focus to the associated form control |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'default' \| 'sm'` | `'default'` | Text size variant (default or compact sm). |
| `disabled` | `boolean` | `false` | Dimmed opacity for non-interactive form elements |
| `required` | `boolean` | `false` | Destructive asterisk denoting mandatory input fields |
| `optional` | `boolean` | `false` | Muted tag denoting non-mandatory optional fields |
| `invalid` | `boolean` | `false` | Destructive text color highlighting validation error |
| `description` | `ReactNode` | `undefined` | Supporting helper text rendered beneath the label. |
| `tooltip` | `ReactNode` | `undefined` | Contextual help tooltip text displayed with info icon. |
| `htmlFor` | `string` | `undefined` | ID of the form element the label is bound to. |
| `className` | `string` | `''` | Additional custom CSS classes. |
```
