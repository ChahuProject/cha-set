---
id: theme-settings
component: theme-settings
category: Composite Engines
title: Theme Settings
description: Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density.
---

## Animations {#animations}

ThemeSettings uses unified motion tokens for smooth state transitions across buttons, segmented controls, color pickers, and override drawers.

- Transitions use `duration-quick` and `ease-standard`.
- Respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` in Qt as global kill switches.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Navigate between settings rows and interactive controls |
| Space / Enter | Toggle segmented control, trigger reset or export actions |
| ← / → / ↑ / ↓ | Adjust slider values or select palette swatches |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `ThemeConfig` | `DEFAULT_THEME_CONFIG` | Canonical theme configuration object containing mode, palette, decoration, typography, and uiScale. |
| `onChange` | `(next: ThemeConfig) => void` | `undefined` | Callback invoked when any theme property changes. |
| `onReset` | `() => void` | `undefined` | Callback invoked when the reset button is activated. |
| `onExport` | `(configJson: string) => void` | `undefined` | Callback invoked when exporting configuration JSON. |
| `onImport` | `(jsonString: string) => boolean \| void` | `undefined` | Callback invoked when importing and parsing configuration JSON. |
| `disabled` | `boolean` | `false` | Disables all interactive controls and dims opacity. |
| `showReset` | `boolean` | `true` | Whether to display the reset button in header. |
| `showExport` | `boolean` | `true` | Whether to display the export JSON button in header. |
| `showImport` | `boolean` | `true` | Whether to display the import button in header. |
| `showTypography` | `boolean` | `false` | Whether to render typography font family and scale selection rows. |
| `textProvider` | `(key: string, defaultText: string) => string` | `undefined` | Optional internationalization string resolver callback. |
```
