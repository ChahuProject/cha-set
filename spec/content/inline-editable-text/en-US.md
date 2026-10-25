---
id: inline-editable-text
component: inline-editable-text
category: Forms & Inputs
title: Inline Editable Text
description: Text element that switches seamlessly to an input field on double-click or edit trigger.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Enter | Enter editing mode when focused; commit changes when editing |
| Escape | Cancel editing and restore original text value |
| Tab | Commit current edits and advance focus to next element |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Current text value. |
| `onValueChange` | `(v: string) => void` | `undefined` | Callback invoked upon confirming an edit. |
| `onSave` | `(v: string) => void \| boolean \| Promise<void \| boolean>` | `undefined` | Async save handler; returning false keeps edit mode open. |
| `trigger` | `"click" \| "doubleClick"` | `"click"` | Mouse gesture that opens the inline input. |
| `size` | `"default" \| "sm"` | `"default"` | Density and sizing variant. |
| `placeholder` | `string` | `''` | Placeholder when value is empty. |
| `hint` | `string` | `''` | Hover tooltip hint. |
| `disabled` | `boolean` | `false` | Whether inline editing is disabled. |
```
