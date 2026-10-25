---
id: color-picker
component: color-picker
category: Forms & Inputs
title: ColorPicker
description: Interactive color selection with saturation/brightness field and swatches.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Cycle focus between saturation area, hue slider, and inputs |
| Arrow Keys | Fine-tune color coordinate points and hue angle |
| Enter | Commit color selection |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `—` | Controlled hex color value (e.g. #1D7AE0). |
| `defaultValue` | `string` | `'#1d7ae0'` | Initial color value for uncontrolled usage. |
| `mode` | `'inline' \| 'popover'` | `'inline'` | Display mode: inline panel card or popover dropdown trigger. |
| `size` | `'default' \| 'sm'` | `'default'` | Visual sizing scale for canvas, swatches, and inputs. |
| `disabled` | `boolean` | `false` | When true, prevents user interaction and applies muted opacity. |
| `movable` | `boolean` | `false` | When true, allows dragging on empty background areas to reposition the component. Double-click resets position. |
| `showPreview` | `boolean` | `true` | Whether to show the top preview header swatch and hex label. |
| `showHex` | `boolean` | `true` | Whether to display the editable HEX text input row. |
| `showSwatches` | `boolean` | `true` | Whether to show the quick preset color swatch row. |
| `presetColors` | `string[]` | `16 default colors` | Array of preset hex color strings displayed in swatches panel. |
| `onChange` | `(hex: string) => void` | `—` | Callback invoked whenever the selected color changes. |
| `onValueChange` | `(hex: string) => void` | `—` | Alias callback for onChange for contract consistency. |
| `title` | `ReactNode` | `'Color'` | Custom label rendered in the preview header. |
```
