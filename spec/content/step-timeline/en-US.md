---
id: step-timeline
component: step-timeline
category: Composite Engines
title: Step Timeline
description: Sequential vertical execution step timeline with status indicators and formatted durations.
---

## Animations {#animations}

Step timeline status transition and progress animation specifications.

- Steps in the `running` state continuously rotate smoothly at a constant angular rate.
- Status icon transitions (e.g. running to success or failed) smoothly switch within `duration-quick` (90ms) via `ease-standard`.
- Vertical timeline connecting rails automatically adapt to the geometry between adjacent steps.
- Respects `prefers-reduced-motion` on Web and `ThemeTokens.animationsEnabled` on Qt Desktop.

## Keyboard Navigation {#keyboard}

Keyboard interactions supported by the component.

```table shortcuts
| Key | Interaction |
| --- | --- |
| Tab / Shift+Tab | Navigate focus across step timeline containers and embedded actions |
| Space / Enter | Activate currently focused step item when actionable |
| ↑ / ↓ | Navigate sequentially between consecutive step entries |
```

## Props Reference {#props}

Cross-stack props share identical names and semantics; `Type` reflects TypeScript signatures.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `StepTimelineStep[]` | `[]` | Array of step objects containing name, status, and optional duration. |
| `emptyText` | `string` | `'No steps'` | Text displayed when the step list is empty. |
| `className` | `string` | `undefined` | Custom CSS class names applied to the root element (React only). |
```
