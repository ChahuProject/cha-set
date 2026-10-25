---
id: scale-osd
component: scale-osd
category: Overlays & Feedback
title: Scale OSD
description: Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide.
---

## Animations {#animations}

Motion behavior and timing for OSD visibility and auto-hide countdown.

- OSD enter and exit transitions run over `duration-short` (120ms) with the `ease-standard` curve (Qt: `ThemeTokens.motionShort` / `ThemeTokens.easeStandard`).
- The 1400ms auto-hide countdown pauses deterministically on hover.

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab / Shift + Tab | Cycle focus between zoom in, zoom out, and reset buttons |
| Space / Enter | Activate the focused zoom button |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `1.0` | Current scale ratio (e.g. 1.0 represents 100%). |
| `defaultValue` | `number` | `1.0` | Initial scale ratio in uncontrolled mode. |
| `step` | `number` | `0.1` | Step increment applied on +/- button click. |
| `min` | `number` | `0.2` | Minimum allowed zoom scale ratio. |
| `max` | `number` | `3.0` | Maximum allowed zoom scale ratio. |
| `steps` | `number[]` | `undefined` | Discrete scale steps array (e.g. CANONICAL_SCALE_STEPS). |
| `size` | `"default" \| "lg"` | `"default"` | Visual scale variant (desktop launcher 42px or standard 40px). |
| `ignoreUiScale` | `boolean` | `true` | Locks physical pixel size and renders invariant regardless of interface scaling. |
| `visible` | `boolean` | `undefined` | Controlled visibility state. |
| `autoHideDuration` | `number` | `1400` | Duration in ms before auto-hiding (pauses on hover). |
| `showControls` | `boolean` | `true` | Whether to display +/- and reset buttons. |
| `showTooltips` | `boolean` | `true` | Whether to display hover tooltip hints for control buttons. |
| `placement` | `"bottom-center" \| "top-center" \| "bottom-right" \| "top-right"` | `"bottom-center"` | Fixed viewport anchor position. |
| `contained` | `boolean` | `false` | Whether to position OSD absolutely within its parent container instead of fixed to the global viewport. |
| `disabled` | `boolean` | `false` | Disables all controls and user interaction. |
| `delayedCommit` | `boolean` | `false` | Whether to enable debounced delayed commit, firing callbacks only after user interaction pauses. |
| `debounceMs` | `number` | `500` | Debounce delay in milliseconds before committing when delayedCommit is enabled. |
| `onChange` | `(value: number) => void` | `undefined` | Callback fired when scale value changes. |
| `onImmediateChange` | `(value: number) => void` | `undefined` | Callback fired immediately during adjustments before debounced commit. |
| `onCommit` | `(value: number) => void` | `undefined` | Callback fired when the debounced scale change is committed. |
| `onStep` | `(delta: number) => void` | `undefined` | Callback fired on step adjustments. |
| `onReset` | `() => void` | `undefined` | Callback fired when resetting to 100%. |
```
