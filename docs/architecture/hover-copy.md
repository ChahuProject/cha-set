# HoverCopy — Cross-Stack Behavior Specification

> **Authority**: `[Authoritative Specification]`. Both stacks MUST implement this document exactly.
> The numeric/visual defaults live in ONE shared source: `spec/components/hover-copy.ts`
> (`hoverCopyDefaults`, `hoverCopyRadiusMap`, icon schema). React and Qt mirror them;
> `spec/__tests__/hover-copy-parity.test.ts` mechanically rejects drift.

---

## 1. Layering

| Layer | Responsibility | React | Qt |
| :--- | :--- | :--- | :--- |
| Copy capability | Platform clipboard write + success/failure result | `navigator.clipboard` (inline idiom of `CopyButton.tsx`) | `ChaSetClipboard` singleton (`ChaSetClipboard.setText`) |
| **HoverCopy** (capability layer) | Hover-dim overlay + floating button + state machine + timing. **Zero assumptions about wrapped content.** | `packages/react/src/hover-copy/HoverCopy.tsx` | `qt/src/ChaSetHoverCopy.qml` |
| **CopyableBadge** (preset layer) | Thin parameter colimation: fixes Badge-bound params (pill radius, secondary variant), forwards everything else to HoverCopy. **No logic, no new state, no new timing.** | `packages/react/src/hover-copy/CopyableBadge.tsx` | `qt/src/ChaSetCopyableBadge.qml` |

The copy capability is intentionally NOT owned by HoverCopy: HoverCopy owns
"overlay interaction + when to copy + feedback state", the platform bridge owns
"how the clipboard is written". Same observable semantics both stacks.

Presets exist only for proven, stable combinations. Today the only preset is
CopyableBadge. Do not add predictive presets (combinatorial explosion).

---

## 2. Shared configuration (single source of truth)

Source: `spec/components/hover-copy.ts`.

| Parameter | Default | Meaning | Shared mapping |
| :--- | :--- | :--- | :--- |
| `text` | `''` | Payload to copy. Independent of displayed content (display may be truncated). | plain string both stacks |
| `dim` | `0.45` | Black scrim alpha over content while active. Theme-independent by design (matches dialog scrim approach). | alpha value identical both stacks |
| `radius` | `'md'` | Corner radius of the dim overlay + wrapper. **Never hardcoded** — supplied externally so pill and small-radius contents both work. | `hoverCopyRadiusMap`: `none->rounded-none/0`, `sm->rounded/2`, `md->rounded-md/6`, `lg->rounded-lg/8`, `full->rounded-full/pill` (`pill` = height/2) |
| `icon` | `'copy'` | Resting overlay icon (semantic name). | React `CopyIcon`, Qt `ChaSetIcon { name: "copy" }` |
| `copiedIcon` | `'check'` | Success icon (semantic name). | React `CheckIcon`, Qt `ChaSetIcon { name: "check" }` |
| `resetTime` | `2000` ms | Restore interval after a successful copy. Logic timer — reduced motion does NOT shorten it. | identical both stacks |
| `disabled` | `false` | Blocks reveal + copy. | identical both stacks |

Motion (visual transitions only) comes from the shared motion tokens
(`spec/tokens/primitives.json`): reveal/leave = `quick` 90ms `ease-standard`;
icon swap = `short` 120ms `ease-standard`. React: `duration-quick`/`duration-short`
+ `ease-standard` utilities; Qt: `Behavior` gated on `ThemeTokens.animationsEnabled`
with `ThemeTokens.motionQuick`/`motionShort` + `easeStandard`. Under
`prefers-reduced-motion` (React token zeroing) / `ThemeTokens.animationsEnabled=false`
(Qt) all transitions are instant; the state machine itself is unchanged.

---

## 3. State machine (identical on both stacks)

States: `idle`, `hovered`, `copied`.

```
                pointer-leave / focus-out (only when not copied)
   ┌──────┐ ◄─────────────────────────────────┐
   │ idle │                                   │
   └──┬───┘                                   │
      │ pointer-enter (mouse) | focus-in | touch-tap               ┌────────┐
      │ (guard: !disabled)       │                                 │ copied │
      ▼                          │                                 └───┬────┘
   ┌─────────┐  copy activation  │                                     │ restore timer
   │ hovered ├───────────────────┘ (guard: !disabled, text non-empty) │ fires (resetTime)
   └─────────┘                                                         ▼
      ▲                                          still hovering/focus-within -> hovered
      └────────────────────────────────────────  otherwise -> idle
```

| # | From | Event | Guard | To | Side effects |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `idle` | pointer-enter (mouse) | `!disabled` | `hovered` | scrim + button fade in (`quick`) |
| 2 | `idle` | focus-in (keyboard) | `!disabled` | `hovered` | focus-within counts as hover modality |
| 3 | `idle` | touch tap (touch modality, no hover) | `!disabled` | `hovered` (pinned) | overlay pinned open until copy or mouse takeover |
| 4 | `hovered` | pointer-leave (mouse) / focus-out | not `copied` | `idle` | overlay fades out |
| 5 | `hovered` | copy activation (click / Enter / Space) | `!disabled`, `text` non-empty | `copied` | clipboard write; icon -> check (`short`); restart `resetTime` timer; `onCopy(text)` on success |
| 6 | `hovered` | copy activation | `text` empty | `hovered` | **no-op**: no clipboard call, no callbacks, no error |
| 7 | `copied` | restore timer fires | still hovering / focus-within | `hovered` | icon back to resting; **overlay stays** (scrim remains, icon reverts) |
| 8 | `copied` | restore timer fires | not hovering / focus-within | `idle` | overlay fades out |
| 9 | `copied` | pointer-leave during `copied` | — | `copied` | **ignored** — never truncate the success feedback |
| 10 | `copied` | copy activation again | as #5 | `copied` | re-copies, timer restarts |
| 11 | any | `disabled` becomes true | — | `idle` | overlay out, button inert |
| 12 | `copied` | clipboard write fails | — | `hovered` | icon unchanged (no false check); `onError(reason)` fired |

Success/failure semantics (both stacks):
- success -> enter `copied`, fire `onCopy(text)` (React) / `copiedToClipboard(text)` (Qt).
- failure -> stay `hovered`, fire `onError(error)` (React) / `copyFailed(reason)` (Qt).
- empty `text` -> silent no-op per #6 (never an error).
- disabled -> never reveals, never copies.

Restore rule (the anti-flicker guarantee): when the restore timer fires, the
component re-checks hover/focus modality. Still hovering -> `hovered`
(overlay remains, icon reverts) NOT `idle`. This is the rule most likely to
drift between stacks; the parity test asserts both implementations restore to
`hovered` under persistent hover.

---

## 4. Visual contract

- Root wrapper hugs its content (no stretching). On Qt the root `Item` binds
  `width: implicitWidth; height: implicitHeight` (0x0-collapse red line).
- Dim scrim: full-bleed overlay, black at alpha `dim`, inherits `radius`.
  Never intercepts pointer events while `idle` (React: `pointer-events-none`
  until revealed; Qt: button `enabled: false` until revealed).
- Floating button: circle, size 24 logical units, inset 4 from top-right,
  border 1 (`border-border` / `ThemeTokens.border`), surface
  `bg-popover text-popover-foreground` (React) / `ThemeTokens.panel` +
  `ThemeTokens.text` (Qt), icon size 14 logical units. Cursor:
  `cursor-pointer` / `Qt.PointingHandCursor`; disabled -> `cursor-not-allowed` /
  `Qt.ForbiddenCursor` (never bare `pointer-events-none` dropping the cursor).
- Button z-order above scrim; scrim never above content text by interaction.
- HoverCopy itself stays content-agnostic: any children are accepted and no
  child tag is assumed.

---

## 5. Keyboard, touch, and a11y

- The overlay button is always present in the tree but unrevealed until
  hover/focus (focus-within reveals it). `Tab` focuses it, `Shift+Tab` leaves,
  `Enter`/`Space` act as copy activation (transition #5).
- Touch (no hover): first tap on the content reveals the overlay (pinned
  `hovered`), second tap on the button copies. A mouse pointer entering the
  component takes over (unpins).
- a11y: button carries an accessible label (i18n `common.copyToClipboard`);
  wrapper exposes `aria-disabled` when disabled. No built-in tooltip
  (phase-1 exclusion).

---

## 6. Performance contract

- Exactly ONE pointer/interaction handler set per instance (React: inline
  `onPointerEnter`/`onPointerLeave`/focus handlers on the wrapper; Qt: one
  `HoverHandler` + one `TapHandler` + one `Timer`). No per-item global
  listeners, no resize/scroll observers, no per-frame work.
- Idle state renders no visible overlay work (pure opacity/transform
  transitions; no layout-affecting properties animated).
- Instance cost is O(1): wrapper + scrim + button nodes only.
- Designed to sit inside virtualized lists (10k+ rows): reveal is local state,
  so viewport cropping plus parent-level React event delegation keeps
  per-row cost flat. Qt rows use the same HoverHandler-per-delegate pattern.
- The overlay is decorative CSS opacity/transform only; content children never
  re-render due to hover state changes (React: hover reveal uses CSS
  `group-hover`; only the icon swap is React state).

---

## 7. CopyableBadge preset contract

| Aspect | Contract |
| :--- | :--- |
| Usage (React) | `<CopyableBadge text="ORDER-1024">ORDER-1024</CopyableBadge>` — payload `text`, displayed children; callbacks + `disabled` forwarded. |
| Usage (Qt) | `ChaSetCopyableBadge { text: "ORDER-1024" }` (label defaults to `text`; `displayText` overrides). |
| Fixed params | radius `full` (pill), Badge variant `secondary`, `dim`/`resetTime`/icons = HoverCopy defaults. |
| Exposed props | `text`, children/`displayText`, `onCopy`/`copiedToClipboard`, `onError`/`copyFailed`, `disabled`. |
| Forbidden | Preset MUST NOT reimplement copy logic, timing, or state; it only forwards to HoverCopy. Badge itself stays copy-free. |
| New behavior | NONE. The preset introduces no state, timing, or visual parameter beyond HoverCopy. |

---

## 8. Phase-1 exclusions

Rich text copy, batch copy, global copy-shortcut interception, built-in tooltip.

---

## 9. Verification map

| Concern | Mechanism |
| :--- | :--- |
| Shared defaults parity | `spec/__tests__/hover-copy-parity.test.ts` parses `HoverCopy.tsx` + `ChaSetHoverCopy.qml` against `spec/components/hover-copy.ts` |
| State machine (React) | `packages/react/src/hover-copy/HoverCopy.test.tsx` incl. restore-while-hovering, empty text, disabled, keyboard |
| State machine (Qt) | `QtChaSetDemo.exe --test-scenario hovercopy` (C++ physical hover/click + `ChaSetClipboard` assertion) |
| Showcase parity | `pnpm check:showcase --component hover-copy` + `pnpm gate` |
| Capability coverage | `spec/capabilities.json` -> `components.hoverCopy` "must" caps mirrored in both `conformance/coverage.json` |
