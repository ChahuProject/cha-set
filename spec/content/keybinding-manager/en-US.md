---
id: keybinding-manager
component: keybinding-manager
category: Composite Engines
title: Keybinding Manager
description: Cross-stack keybinding and shortcut manager with reverse key search, conflict detection, and reset.
---

## Animations {#animations}

KeybindingManager employs unified motion tokens for responsive state transitions across search fields, scope filters, keybinding recording capsules, and conflict resolution popups.

- Micro-interactions (hover, focus, and capsule clicks) use `duration-quick` and `ease-standard`.
- Active recording pulse animations and conflict indicators use standard CSS keyframe transitions.
- Global kill switch: respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` in Qt.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Navigate through search input, scope filters, action rows, and action buttons |
| Space / Enter | Activate keybinding capsule into recording state or trigger action buttons |
| Escape | Cancel active keybinding recording without modifying existing shortcut |
| Backspace / Delete | Clear selected keybinding chord when focused |
| ↑ / ↓ | Move focus between filtered action rows in the management list |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `actions` | `KeybindingActionItem[]` | `[]` | List of configurable action items with id, name, chords, and defaultChords. |
| `scopes` | `KeybindingScope[]` | `[]` | Available application scopes used for filtering and conflict evaluation. |
| `sections` | `KeybindingSection[]` | `[]` | Logical sections for grouping actions into visual headers. |
| `onBindingChange` | `(actionId: string, chordIndex: number, newKey: string) => void` | `undefined` | Callback fired when an action shortcut chord is modified or cleared. |
| `onResetAction` | `(actionId: string) => void` | `undefined` | Callback fired when resetting a specific action to its default shortcuts. |
| `onResetAll` | `() => void` | `undefined` | Callback fired when restoring all action shortcuts to their defaults. |
| `onExportCheatSheet` | `(markdown: string) => void` | `undefined` | Callback fired when exporting the shortcut reference cheat sheet. |
| `searchable` | `boolean` | `true` | Whether to display the top search bar supporting text and reverse key queries. |
| `allowMultiChord` | `boolean` | `true` | Whether actions can have secondary or multiple keybinding chords. |
| `allowResetAll` | `boolean` | `true` | Whether to render the global reset all defaults action button. |
| `allowExportCheatSheet` | `boolean` | `true` | Whether to render the export reference cheat sheet action button. |
| `showSourceBadge` | `boolean` | `true` | Whether to show the User or Builtin source badge on modified actions. |
| `showScopeBadge` | `boolean` | `true` | Whether to show the scope category badge on each action row. |
| `layout` | `'grouped-list' \| 'flat-table'` | `'grouped-list'` | Layout mode: grouped section cards or flat filterable table. |
| `disabled` | `boolean` | `false` | Whether the entire management interface is disabled. |
| `className` | `string` | `undefined` | Additional CSS class names applied to the container element. |
```
