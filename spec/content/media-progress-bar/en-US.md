---
id: media-progress-bar
component: media-progress-bar
category: Forms & Inputs
title: MediaProgressBar
description: Universal media playback progress bar with drag scrubbing, click-to-seek, hover preview, position/total time readout, click-to-toggle elapsed/countdown and right-click format menu.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ← / → | Seek backward / forward by step increment |
| Home / End | Jump directly to beginning / end of media |
| Space | Toggle playback play/pause or trigger seek |
| Tab / Shift + Tab | Move focus between interactive controls |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | `number` | `0` | Playback progress ratio from 0.0 to 1.0. |
| `duration` | `number` | `0` | Total duration of the media in milliseconds. |
| `position` | `number` | `0` | Current playback position in milliseconds. |
| `frameRate` | `number` | `30` | Frame rate for frame-based time formatting. |
| `timingMode` | `"elapsed" \| "remaining"` | `"elapsed"` | Timing mode: elapsed time or remaining countdown. |
| `timeFormat` | `"hms" \| "seconds" \| "frames"` | `"hms"` | Format to display timestamp. |
| `showTime` | `boolean` | `true` | Whether to show the time readout underneath. |
| `showThumb` | `boolean` | `true` | Whether to display the progress thumb handle. |
| `interactive` | `boolean` | `true` | Whether pointer seek/drag is enabled. |
| `disabled` | `boolean` | `false` | Disabled state. |
```
