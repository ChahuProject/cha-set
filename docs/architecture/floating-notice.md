# FloatingNotice Architecture Specification

> **Authority Level**: [Authoritative Specification]  
> **Scope**: Platform-neutral specifications for the FloatingNotice stacked notice pill across Web (React `@chahu/cha-set`) and Desktop (Qt Quick `ChaSetFloatingNotice`): queue model, fixed-position distance fan geometry, settle-gated activation, grow-only width animation, copy affordance, timers, keyboard access, and verification.

---

## 1. Role & System Boundaries

- **Core Role**: A compact floating notice pill anchored to the top or bottom viewport edge. Holds a multi-card queue sorted by priority and insertion time; exactly one card is *raised* (full size, top z-order, interactive chrome) while the rest peek behind as a fan.
- **Scope Delineation**:
  - **In-Scope**:
    - Neutral API contract (`spec/components/floating-notice.ts`) and behavior invariants below.
    - Fixed-position fan layout driven by distance from the raised card.
    - Settle-gated hover activation (instant sweeps, no mid-glide jitter).
    - Copy-to-clipboard affordance on the raised card (reuses `CopyButton` / `ChaSetCopyButton`).
    - Lifetime budgets, hover suspension, expiry dismissal, keyboard access.
  - **Out-of-Scope**:
    - Application notification routing, persistence, or action handling beyond `dismissed` / `onDismiss` callbacks.
    - Portal/window overlay plumbing (FloatingNotice positions itself; it does not manage overlays).

---

## 2. Queue Model

- **Sorting**: Stable sort by `priority` descending, ties broken FIFO by insertion order. Re-sorting never unmounts cards (keyed by `item.id`).
- **Active index**: `activeIndex` points into the sorted order. It clamps when the queue shrinks.
- **Lifetimes**: Each item gets a millisecond budget (`item.duration ?? defaultDuration`, default 3000; `0` would mark expiry). A 100ms ticker decrements only the active item's budget and only while unpaused. On positive-to-zero transition the component fires `onDismiss(id)` / `dismissed(id)` exactly once.
- **Suspension**: `pauseOnHover` (default true) freezes ticking while the pointer is over the stack.

---

## 3. Fixed-Position Distance Fan Geometry

Positions are fixed by sorted order; sizes follow **distance** `d = |index − activeIndex|` from the raised card. The raised card is always the largest.

### 3.1 Offsets (identical above and below)

- Every joint between adjacent depths uses the same gap: `7px` (`0.4375rem` / `ThemeTokens.dp(7)`), so the fan reads identically above and below any raised card. Depth 0 gets no special joint, no special width, no special anything.
- `offset(i) = i × gap × expand`, where `expand` is `1.0` at rest and `1.75` while the stack is hovered (peeking strips grow from ~7px to ~12px so they stay reachable). `bottom` placement mirrors the sign.
- The container size comes from a fixed invisible sizer (React: content-free `16rem × 2.125rem` block; Qt: `pill.implicitHeight + maxOffset`), never from raised content — switching messages never resizes the container.

### 3.2 Distance Fan (symmetric both ways)

For distance `d` (`0` = raised):

| Channel | Raised (`d = 0`) | Behind (`d ≥ 1`) |
| :--- | :--- | :--- |
| Scale | `1` | `max(0.6, 1 − d × 0.05)` |
| Opacity | `1` (`0` while its budget is exhausted) | `max(0.25, 0.85 − d × 0.15)` |
| Width | grow-only (see §3.3) | `100% − inset(d)`, `inset` decaying per step (`16, 12.8, …`, `4` floor) |
| z-order | top (`30` React / `100` Qt) | nearer-above-farther, earlier-wins ties |

### 3.3 Grow-Only Width Animation

- The raised card may only grow, never shrink below its slot: React uses `width: max-content` pinned by `min-width: 100%` under the `max-w-[28rem]` cap; Qt pill uses natural `implicitWidth` (floored at `160dp`).
- `width` itself stays one value type in both states; only `min-width`/`max-width` (length-percentage, covered by `transition-all duration-short ease-standard`) glide open and closed — this is what makes the grow truly animate instead of flipping discretely. Qt mirrors with `Behavior on width` (`motionShort` + `easeStandard`).
- Copy text is `title` plus `description` newline-joined (`title` alone when no description).

### 3.4 Centering Without Lateral Slide

- Every layer in every state centers the same way — React: `left-1/2` plus a **constant** `translateX(-50%)`; Qt: `anchors.horizontalCenter`. The animated transform list is identical across states, so activation glides vertically and never slides sideways mid-transition.

---

## 4. Settle-Gated Hover Activation

Hovering a peeking strip raises that card **in place** (top z-order + full size at its own offset — never reordered to the front).

- **The only motion hover can fight is layout motion**: the 120ms (`duration-short` / `motionShort`) spread/collapse glide after the stack hover flips, during which layers slide under a stationary cursor.
- Card enters inside that settle window are **stashed** (latest wins); when the window ends the stashed card activates exactly once. Leave events cancel their own stash.
- Outside the window every hover activates **instantly** — sweeps raise each touched card the moment it is hit.
- Click, focus, Tab/Enter/Space, taps, and Qt arrow-key cycling always activate immediately.
- Raising causes no motion (offsets never depend on the raised card), so no feedback loop can form.

---

## 5. Raised-Card Chrome (Copy + Close)

- Both controls render **only on the raised card** and reveal on stack hover (`opacity` glide; Qt additionally gates `enabled` while hidden).
- **Copy sits ahead of (before) close** in DOM/row order: React `CopyButton` (`ghost`, `icon-xs`, `title="Copy notice"`, 1.5s feedback), Qt `ChaSetCopyButton` (`ghost`, `icon-xs`) writing through `ChaSetClipboard`.
- Close fires `onDismiss(id)` / `dismissed(id)`; copy needs no new props or signals.

---

## 6. Keyboard & Accessibility

- Every layer is `role="button"` (`tabindex 0`, `aria-label` = title, or `Show notice: <title>` when behind); Qt delegates expose pointing-hand cursors and Tab focus with Enter/Space/Arrow raising.
- The copy button is a native button: Tab reaches it, Enter/Space copies, and its accessible name flips `Copy notice` → `Copied` on success.
- Focus/blur never starts the settle stash path — keyboard activation is immediate.

---

## 7. i18n & Theming

- Chrome labels (`Copy notice`/`Copied`, `Close notice`) follow the existing hardcoded-English precedent of the pill chrome; all showcase prose goes through `overlays.floatingNotice.*` dictionaries.
- All surfaces, borders (paired `border-*` colors, never bare `border`), and text come from theme tokens on both stacks (see AGENTS.md red line 18).

---

## 8. Verification

- Unit: `packages/react/src/floating-notice/FloatingNotice.test.tsx` — sorting, in-place raise, distance fan + mirror symmetry, hover spread, settle gating (defer/once/instant/cancel), copy text + order + feedback, unlimited stack, no-sideways regression.
- Contract: `packages/react/conformance/floating-notice.conformance.test.tsx` + `spec/capabilities.json` via `pnpm gate`.
- Qt: `cmake --build qt/build` (qmlcache compile) + `QtChaSetDemo.exe --test-scenario all` headless (instantiates `FloatingNoticeDocPage`, zero binding errors).
- Living docs (React `FloatingNoticeDocPage`, Qt `FloatingNoticeDocPage.qml`, SPAS 1:1) exercise the sandbox; behavior changes here must keep them green.

---

## 9. File Map

| Concern | React | Qt | Neutral |
| :--- | :--- | :--- | :--- |
| Contract | `packages/react/src/floating-notice/FloatingNotice.tsx` | `qt/src/ChaSetFloatingNotice.qml` | `spec/components/floating-notice.ts` |
| Copy primitive | `packages/react/src/copy-button/CopyButton.tsx` | `qt/src/ChaSetCopyButton.qml`, `qt/src/ChaSetClipboard.*` | `spec/components/copy-button.ts` |
| Showcase | `packages/react/examples/basic/src/pages/components/FloatingNoticeDocPage.tsx` | `qt/src/FloatingNoticeDocPage.qml` | `spec/showcase/navigation.json` |
| Tests | `packages/react/src/floating-notice/FloatingNotice.test.tsx` | headless `--test-scenario all` | `gate/parity.mjs` |
