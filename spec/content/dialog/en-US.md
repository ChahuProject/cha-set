---
id: dialog
component: dialog
category: Overlays & Feedback
title: Dialog
description: A modal window that interrupts the user with critical content and prompts for user action.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Trap focus strictly within the dialog loop |
| Escape | Close dialog and return focus to triggering element |
| Enter | Trigger primary action button |
```

The `alert` variant narrows two of these: Escape dismisses it only when it is cancelable, and
Enter confirms the destructive action rather than a neutral primary one.

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | The controlled open state of the dialog. |
| `variant` | `'default' \| 'alert'` | `'default'` | Visual and behavioral variant of the dialog (standard modal or alert confirmation). |
| `defaultOpen` | `boolean` | `false` | The default open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | `—` | Event handler called when the open state changes. |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full'` | `'default'` | Tiered size preset controlling modal card width and containment. |
| `closeOnOverlayClick` | `boolean` | `true` | Whether clicking the backdrop overlay dismisses the dialog. |
| `closeOnEscape` | `boolean` | `true` | Whether pressing the Escape key dismisses the dialog. |
| `draggable` | `boolean` | `true` | Whether the dialog is rendered as a desktop draggable and resizable modal window. |
| `showCloseButton` | `boolean` | `true` | Whether to render the close button in the top-right controls. |
| `showEscBadge` | `boolean` | `false` | Whether to render an ESC keyboard shortcut badge in the top-right controls. |
| `defaultWidthRem` | `number` | `—` | Initial modal width in rem units (e.g. 32). |
| `defaultHeightRem` | `number` | `—` | Initial modal height in rem units (e.g. 24). |
| `initialPositionMode` | `'center' \| 'top'` | `'center'` | Initial positioning mode for the modal window. |
| `topMarginRem` | `number` | `4.5` | Top margin in rem when initialPositionMode is top. |
| `autoFitHeight` | `boolean` | `true` | Automatically adjust modal height to fit inner content. |
| `sizeOptions` | `DialogSizeOption[]` | `—` | Preset sizing options for the top-right size switcher dropdown menu. |
| `sizeMenuTooltip` | `string` | `'Adjust Size'` | Tooltip text for the size switcher dropdown button. |
| `dragHandleClassName` | `string` | `—` | CSS class selector for the drag handle area (e.g. dialog header). |
| `contentClassName` | `string` | `—` | Custom class name for the scrollable inner content container. |
| `overlayClassName` | `string` | `''` | Additional CSS classes to customize the backdrop overlay. |
```
