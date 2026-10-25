---
id: language-settings
component: language-settings
category: Composite Engines
title: Language Settings
description: Cross-stack language configuration card with system detection and cultural poetry quotes.
---

## Animations {#animations}

Motion behavior and timing for interactive states aligned with ChaSet tokens.

- State changes (hover, press, focus) animate over `duration-quick` with the `ease-standard` curve.
- Durations and easing resolve from theme tokens, so enabling the reduced-motion preference (`prefers-reduced-motion`) zeroes them automatically; on Qt the switch is governed by `ThemeTokens.animationsEnabled`.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Navigate between Follow System and language selection cards |
| Space / Enter | Select the focused language card and apply language preference |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `preference` | `LocalePreference ("system" \| string)` | `"system"` | Active language preference, either "system" or an explicit language code. |
| `onPreferenceChange` | `(next: LocalePreference) => void` | — | Callback triggered when user selects a different language or toggles system mode. |
| `showFollowSystem` | `boolean` | `true` | Whether to show the prominent Follow System option card with system detection. |
| `variant` | `"card" \| "embedded"` | `"card"` | Visual container variant. "card" renders an outer bordered card with header; "embedded" renders inline content without outer frame. |
| `disabled` | `boolean` | `false` | Whether the language selection controls are disabled. |
| `textProvider` | `(key: string, defaultText?: string) => string` | — | Optional custom translation function for overriding component strings. |
```
