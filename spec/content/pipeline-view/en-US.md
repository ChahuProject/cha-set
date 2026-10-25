---
id: pipeline-view
component: pipeline-view
category: Composite Engines
title: Pipeline View
description: Multi-stage execution view and pipeline center with job tracking, step timelines, and virtualized auto-scrolling log console.
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
| ↑ / ↓ | Navigate through jobs in the job list |
| Home / End | Jump to the first / last job in the list |
| Space / Enter | Select the focused job to inspect steps and logs |
| Tab / Shift + Tab | Move focus between job list, action buttons, and log console |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `PipelineStatus` | `'running'` | Overall execution status for summary header badge. |
| `startMs` | `number` | `0` | Execution start timestamp in epoch milliseconds. |
| `endMs` | `number \| null` | `null` | Execution completion timestamp; displays formatted duration when non-null. |
| `jobs` | `PipelineJob[]` | `[]` | Array of jobs belonging to the current execution run. |
| `activeJobId` | `string \| null` | `null` | Currently selected job id displaying step timeline and logs. |
| `onSelectJob` | `(id: string) => void` | `undefined` | Callback invoked when a job is selected. |
| `onCancel` | `() => void` | `undefined` | Callback invoked when the cancel button is clicked. |
| `cancelDisabled` | `boolean` | `false` | Disables the cancel button. |
| `getLogs` | `(jobId: string) => string[]` | `undefined` | Function supplying log lines array for a given job id. |
| `jobsTitle` | `string` | `'Jobs'` | Title text for the job list sidebar. |
| `emptyJobsText` | `string` | `'No jobs'` | Placeholder text displayed when the job list is empty. |
| `headerActionSlot` | `ReactNode` | `undefined` | Slot for custom actions in the header. |
```
