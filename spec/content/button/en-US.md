---
id: button
component: button
category: Base Primitives
title: Button
description: Displays a button or a component that looks like a button with multiple variants, sizes, and states.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Space / Enter | Activate button action handler |
| Tab | Move focus to the next focusable element |
| Shift + Tab | Move focus to the previous focusable element |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'overlay'` | `'default'` | Visual appearance and semantic intent. |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'xs' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Standardized dimensions scale. |
| `loading` | `boolean` | `false` | Shows spinning indicator and disables user interaction. |
| `loadingText` | `ReactNode` | `undefined` | Optional content displayed while in loading state. |
| `pressed` | `boolean` | `false` | Toggle or selected state with active styling and aria-pressed. |
| `leftIcon` | `ReactNode` | `undefined` | Optional leading icon displayed before children. |
| `rightIcon` | `ReactNode` | `undefined` | Optional trailing icon displayed after children. |
| `iconSize` | `number` | `undefined` | Logical unscaled icon size; enlarges or overrides icons rendered inside the button. |
| `fullWidth` | `boolean` | `false` | Stretches the button to 100% of the parent container width. |
| `asChild` | `boolean` | `false` | Passes props directly to the child element (polymorphism). |
| `disabled` | `boolean` | `false` | Blocks clicks and applies muted disabled styling. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type attribute. |
```
