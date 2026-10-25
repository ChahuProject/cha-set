---
id: input
component: input
category: Forms & Inputs
title: Input
description: Displays a form text input field or a component that looks like an input field.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Typing | Input and edit text value |
| Enter | Submit form or commit value |
| Escape | Clear text or remove focus |
| Tab | Advance focus to the next element |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'default' \| 'sm'` | `'default'` | The height and padding scale of the input. |
| `type` | `string` | `'text'` | Standard HTML/Qt input type: "text" \| "password" \| "email" \| "search" \| "number". |
| `placeholder` | `string` | `''` | Placeholder hint text displayed when input is empty. |
| `disabled` | `boolean` | `false` | Disables user interactions and applies 50% opacity. |
| `readOnly` | `boolean` | `false` | Prevents editing value while keeping focusability. |
| `invalid` | `boolean` | `false` | Applies destructive error styling and aria-invalid attribute. |
| `clearable` | `boolean` | `false` | Renders a clear button when text is present to wipe content. |
| `passwordToggle` | `boolean` | `false` | Renders an eye toggle button to reveal or mask passwords. |
| `leftIcon` | `ReactNode` | `undefined` | Icon element rendered on the leading side of the input. |
| `rightIcon` | `ReactNode` | `undefined` | Icon element rendered on the trailing side of the input. |
| `onClear` | `() => void` | `undefined` | Callback fired when the clear button is clicked. |
| `forceHover` | `boolean` | `false` | Visual testing aid to force hover state styles. |
| `forceFocus` | `boolean` | `false` | Visual testing aid to force focus ring styles. |
| `className` | `string` | `''` | Additional CSS class names to apply to the input element. |
```
