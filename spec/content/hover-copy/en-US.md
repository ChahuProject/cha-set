---
id: hover-copy
component: hover-copy
category: Base Primitives
title: Hover Copy
description: Hover-dim overlay with centered copy button; clicking anywhere on the overlay copies arbitrary content.
---

## Animations {#animations}

Motion behavior and timing for interactive states aligned with ChaSet tokens.

- Overlay reveal and leave animate over `duration-quick` with the `ease-standard` curve (Qt: `ThemeTokens.motionQuick` + `easeStandard`).
- The resting-to-success icon swap uses the `duration-short` token.
- Durations and easing resolve from theme tokens, so `prefers-reduced-motion` zeroes them automatically (Qt: governed by `ThemeTokens.animationsEnabled`). The restore timer is logic timing and is never shortened.

## Keyboard Navigation {#keyboard}

Tab focuses the centered button, Enter or Space copies, clicking anywhere on the overlay also copies, and leaving focus dismisses the overlay.

```table shortcuts
| Key | Behavior |
| --- | --- |
| Tab | Move focus to the centered copy button (reveals the overlay) |
| Space / Enter | Copy the configured text and show the check icon |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Payload copied to the clipboard; may differ from the displayed (possibly truncated) content. |
| `children` | `ReactNode` | `undefined` | Arbitrary wrapped content the overlay hugs; no assumptions are made about child tags. |
| `dim` | `number` | `0.45` | Black scrim alpha of the hover overlay, 0 to 1, default 0.45. |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Semantic radius of the overlay: none, sm, md, lg or full (pill). |
| `icon` | `'copy' \| 'check'` | `'copy'` | Resting overlay icon semantic name, default copy. |
| `copiedIcon` | `'copy' \| 'check'` | `'check'` | Success icon semantic name, default check. |
| `resetTime` | `number` | `1000` | Milliseconds before restoring after a successful copy, default 1000. |
| `disabled` | `boolean` | `false` | When disabled the overlay never appears and copy never fires. |
| `onCopy` | `(text: string) => void` | `undefined` | Fired on successful copy with the copied text. |
| `onError` | `(error: unknown) => void` | `undefined` | Fired when the clipboard write fails. |
```
