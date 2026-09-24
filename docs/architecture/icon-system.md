# Cross-Stack Icon System

> **Authority Level**: `[Authoritative Specification]`
> **Scope**: Icon geometry, stroke weight, grid, size and centring for every React (Web) and Qt (Desktop/QML) surface in `cha-set`.
> **Showcase**: Get Started → **Icon System** (`#/get-started/icons`, `qt/src/IconsPage.qml`)

---

## 1. Why this exists

The Ctrl+wheel zoom pill (`ScaleOsd`) rendered its three controls as **typography**:

| Control | React | Qt | Rendered as |
| :--- | :--- | :--- | :--- |
| Zoom out | `−` U+2212, `font-semibold text-sm` | `Text { text: "−" }`, `font.weight: weightBold`, `pixelSize 15` | **bold** minus sign |
| Zoom in | `+` U+002B, `font-semibold text-sm` | `Text { text: "+" }`, `font.weight: weightBold`, `pixelSize 15` | **bold** plus sign |
| Reset | `⟳` U+27F3, no weight, `text-xs` / `fontSize: 12` | `Text { text: "⟳" }`, default weight, `pixelSize 12` | **thin**, smaller arrow |

Two independent defects came out of that one decision:

1. **Mixed weight inside a single control.** `+`/`−` were bold, the reset arrow was regular and 20% smaller. Neither stack was "wrong" relative to itself — there was simply no owner for the weight, so each call site improvised.
2. **The reset icon sat visibly low in its pill.** Qt centred the `Text` with `anchors.centerIn: parent`, which aligns the *em box*, not the ink. A font's ascent and descent are asymmetric, and `⟳` occupies a different band inside them than `+` does, so the arrow inherited a baseline that pushed it below the optical centre. Web never had that exact symptom (browsers centre differently), which is why the drift survived review on one stack and was reported on the other.

The root cause is not a wrong value on either side. It is that **the value had no home**: a glyph is not a shape, and a text baseline is not a grid. This document, and the registry behind it, make the icon a *geometry* problem with a single owner.

---

## 2. Single source of truth

Every icon in `cha-set` is declared once in **`spec/icons/registry.json`**. Nothing else may define icon artwork, a stroke width or a grid.

```jsonc
{
  "version": 1,
  "activeSpec": "stroke-monoline",
  "specs": [ /* named specifications — exactly one is "implemented" at a time */ ]
}
```

A third top-level key, `adoption`, carries the ratchet ceiling and is described in §7. Its value is deliberately not quoted on this page: it only ever moves down, so any copy of it written into a document is wrong as soon as the next migration lands.

An **active specification** owns the contract:

| Field | Value | Meaning |
| :--- | :--- | :--- |
| `metrics.grid` | `24` | Default drawing box, in grid units (not pixels) |
| `metrics.liveArea` | `20` | Artwork must stay inside this; the remainder is the safe margin |
| `metrics.strokeWidth` | `2` | The one permitted weight |
| `metrics.linecap` / `linejoin` | `round` / `round` | Caps and joins are part of the specification, not of the call site |
| `metrics.fillPolicy` | `none-unless-declared` | Monoline outlines; fill only where an element opts in |
| `metrics.opticalCenterTolerance` | `0.75` | Max drift of the painted centre from the grid centre |
| `grids.default` | `size 24 · stroke 2 · safeMargin 1` | Every UI icon |
| `grids.chrome` | `size 10 · stroke 1 · safeMargin 0.5` | Window-caption glyphs, drawn on a **denser** grid so the line stays a hairline |
| `families` | named sets of icons that render together | A promise about the control rather than about any single icon; no family may span two grids (§7) |
| `weights` | `[{ id: "regular", strokeWidth: 2 }]` | One weight. Emphasis is colour or size — never a heavier glyph |
| `sizes.ramp` | `10, 12, 14, 16, 18, 20, 24` | Named steps; artwork is never hand-scaled |
| `color.policy` | `currentColor` | Web inherits `currentColor`; Qt defaults to `ThemeTokens.text` |

Each grid also has a **stroke floor** of `size / strokeWidth` — the smallest render size at which it still paints a one-pixel stroke. It is not a registry field: it is derived from the two numbers above and embedded in the artifacts, because a floor written down beside the metrics it comes from is a third copy of a fact that nothing verifies (§7).

`icons` is the artwork itself, written in a seven-element vocabulary — `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon` — plus a per-icon `grid`:

```jsonc
"minus": {
  "grid": "default",
  "elements": [{ "t": "path", "d": "M5 12h14" }]
}
```

> **Why two grids.** A caption glyph at 10 units drawn on the 24-unit grid would need a `0.8`-unit stroke, which rasterizes as a sub-pixel smear. Declaring the ratio instead of improvising it is what lets a 10-unit caption glyph and a 24-unit toolbar glyph end up with the *same apparent weight*.

---

## 3. Generated artifacts

`pnpm gen:icons` compiles the registry into both stacks. The command is also part of `pnpm gen:all`, so the artifacts can never be stale after a token regeneration.

| Artifact | Contents |
| :--- | :--- |
| `packages/react/src/lib/icons.generated.tsx` | `ICON_ELEMENTS` (registry vocabulary, emitted as **data**), `Icon` primitive, 57 `*Icon` components, and the whole contract as metadata: `ICON_SPEC_ID`, `ICON_METRICS`, `ICON_GRIDS`, `ICON_SIZES`, `ICON_WEIGHTS`, `ICON_COLOR`, `ICON_RULES`, `ICON_CATEGORIES`, `ICON_SPECS`, `ICON_ADOPTION`, `ICON_AUDIT`, `ICON_NAMES`, `ICON_ALIASES` |
| `qt/src/ChaSetIcons.generated.qml` | The same contract as a `pragma Singleton`, plus `shapes` — artwork compiled to path data (`d`), with `gridSize`, `strokeWidth`, `linecap`, `linejoin` per shape — and `resolveIcon(name)` / `shapesFor(name)` |

Three deliberate choices keep the artifact trustworthy:

- **Data, not baked JSX.** The React artifact stores the vocabulary verbatim and `renderElement` is the single compiler from vocabulary → DOM element. A diff of the generated file therefore reads like a diff of the registry, and the artifact stays serializable for audits.
- **One compilation, two consumers.** Qt cannot consume React elements, so the generator compiles the same elements into absolute path commands (`M/L/H/V/C/S/Q/T/A/Z`, arcs converted to béziers) using the shared resolver in `spec/icons/geometry.mjs`. The numbers are therefore identical on both stacks; only the primitive used to express them differs.
- **No line numbers in the embedded ledger.** The `ICON_ADOPTION` ledger carries file names and counts, never line positions. Line-precise locations are the gate's business — it re-derives them whenever it runs. Baking them in would make the artifact "drift" whenever an unrelated edit shifted a line in a file that merely mentions an icon, turning the freshness assertion into noise that fires for reasons the author cannot see.

`packages/react/src/lib/icons.tsx` is now a one-line re-export of the generated module, so every historical import path (`../lib/icons`) and all 47 legacy named exports keep working unchanged.

---

## 4. Runtime API

### Web

```tsx
import { Icon, SearchIcon, ICON_SPEC_ID } from '@chahu/cha-set';

<Icon name="rotate-ccw" className="size-4" />   // name + CSS sizing
<Icon name="window-close" size={10} />          // explicit logical size, chrome grid
<SearchIcon className="size-4 text-muted-foreground" />  // typed named component
```

Sizing: omit `size` and the primitive applies `size-4` (16 units, matching `sizes.default`); pass `size` for chrome glyphs that need to opt out of that default. Colour always comes from `currentColor`.

### Desktop

```qml
ChaSetIcon { name: "rotate-ccw"; size: 16; color: ThemeTokens.text }
ChaSetIcon { name: "search"; size: 16 }                       // colour defaults to ThemeTokens.text
```

`ChaSetIcon` renders each shape as a `Shape` + `ShapePath` + `PathSvg` inside a `Repeater`, scaling the whole drawing box by `effectiveSize / gridSize` with `transformOrigin: Item.Center`. Because the artwork is drawn at its native grid resolution and scaled once, a 10-unit chrome glyph and a 24-unit UI glyph share one code path. `effectiveSize` is `ThemeTokens.dp(size)` unless `ignoreUiScale` is set (used by the scale-invariant OSD overlay). Sizes still scale with the interface scale — see `docs/architecture/typography-system.md` for the `dp` contract.

An unresolved name does **not** vanish: `resolveIcon` falls back to a square marker, so a typo is visible in the UI instead of rendering nothing. Legacy desktop names are mapped through `ICON_ALIASES` (`close` → `x`, `gear` → `settings`, `logo` → `chaset`, `minimize` → `window-minimize`, …).

> **Registration gotcha — the file must be declared a singleton in CMake.** `pragma Singleton` inside the generated QML is *not* sufficient in this build: `qt/CMakeLists.txt` sets `QT_QML_SINGLETON_TYPE TRUE` and `QT_QML_SOURCE_TYPENAME ChaSetIcons` on the source file, exactly like `ThemeTokens.generated.qml` and the other generated singletons. Without that property the type is registered as an ordinary component, and `ChaSetIcons.resolveIcon(...)` silently resolves against the *type* rather than an instance — every call fails at runtime with `Property '...' of object ChaSetIcons is not a function` while the properties still read fine, which makes it a particularly confusing failure to debug from the QML side. Any change to the generated file list must keep this block in sync.

---

## 5. External configuration

A host that wants all of `cha-set` pinned to one specification **does not edit the library**. It declares the id externally, and the generator bakes the resolved id into both artifacts — so the choice is observable at runtime through `ICON_SPEC_ID` (Web) and `ChaSetIcons.specId` (Desktop).

Resolution order, first match wins (`spec/icons/load.mjs` → `resolveActiveSpec`):

| # | Source | When to use |
| :--- | :--- | :--- |
| 1 | Environment variable `CHASET_ICON_SPEC` | Per shell, per CI job; a build matrix can compile the same sources under several specifications |
| 2 | `chaset.config.json` → `icons.spec` | Project-level switch, committed next to the package manifest |
| 3 | `spec/icons/registry.json` → `activeSpec` | Library-level default when the host declares nothing |
| 4 | First `implemented` specification | Last resort, so a missing switch never breaks a build |

```json
{
  "icons": {
    "spec": "stroke-monoline"
  }
}
```

```bash
export CHASET_ICON_SPEC=stroke-monoline    # pin the build
export CHASET_ICON_SPEC=duotone-fill       # registered but not implemented -> fails loudly
```

Pointing the switch at a specification that is registered but **not implemented** is an error, not a silent fallback — that is the point of having a switch at all. The failure names the source that produced the id:

> `unknown icon specification "duotone-fill" (from CHASET_ICON_SPEC): status "planned" and carries no geometry`

`chaset.config.json` in this repository pins `stroke-monoline`, which is why the generated artifacts report `chaset.config.json (icons.spec)` as their source.

---

## 6. Extending the specification

The registry holds a **list** of specifications, not one hard-coded contract, so a second icon language is a data change rather than a refactor:

1. Add an entry to `specs[]` with its own `metrics`, `grids`, `weights`, `sizes` and `icons`.
2. Point `CHASET_ICON_SPEC` or `icons.spec` at its id — or promote it to `activeSpec`.
3. `pnpm gen:icons` re-emits both artifacts; `pnpm check:icons` proves the new contract holds.

`duotone-fill` ships in the registry in exactly this state (`status: "planned"`, no geometry) so the extensibility path is exercised by the gate rather than merely described by it. Nothing in either stack changes, because both stacks consume whichever entry the configuration selects.

**Adding a single icon** is the same shape: append an entry to `icons` with a `grid` and `elements`, add it to a `category`, run `pnpm gen:icons`. It appears in the showcase gallery on both stacks at once, and the gate refuses a name that has no geometry behind it.

---

## 7. Enforcement

`pnpm check:icons` (`scripts/check-icon-spec.mjs`) is wired into `pnpm gate` as block **2.11**, so no icon change can reach a commit without passing it. Every rule published on the showcase page has an assertion here — a rule that is not machine-checked is a slogan.

| Assertion | Fails when |
| :--- | :--- |
| `registry` | The registry is structurally invalid, or the configured specification does not exist / is not `implemented` |
| `generated` | `icons.generated.tsx` or `ChaSetIcons.generated.qml` drifted from the registry (it re-runs `gen:icons --check`) |
| `optical` | An icon's **painted** bounding box (artwork plus half the stroke) is not centred on its grid beyond `opticalCenterTolerance` |
| `live-area` | Artwork escapes the safe margin, or a stroke bleeds past `[0, grid.size]` and would collide with a neighbouring icon |
| `text-glyphs` | A character (`+`, U+2212, U+27F3, `×`, arrows, …) is used where an icon belongs |
| `ratchet` | The number of hand-authored inline `<svg>` sites grew, or an exemption marker was misused (no reason, dangling, or not attached to a following `<svg>`) |
| `resolution` | A component asks the registry for an icon **by name** (`<Icon name="…">`, QML `name:`) and the active specification does not own it |
| `unowned` (warning) | A reference renders an icon component the specification does not own. The gate cannot tell a locally authored icon set from a component that is not an icon at all, so these are counted rather than failed; a migration removes one from the list |
| `sibling-grids` | One file renders icons **at one size** from more than one grid |
| `families` | A declared control family names an icon the specification does not define, or spans more than one grid |
| `stroke-floor` (warning) | A reference renders below `grid.size / grid.strokeWidth` — the size at which that grid's stroke stops being one pixel |

The assertion count is not fixed: each icon contributes a geometry assertion and each icon reference in the codebase contributes a reference assertion, so the number grows as the library grows.

> **Centring is judged on ink, not on boxes.** The gate measures the painted extent — half the stroke paints outside the artwork coordinates, and it is the painted ink that has to *look* centred. Anchor offsets and padding are deliberately not an accepted fix: they centre a box, not what is inside it. This is the specific reason the OSD reset arrow no longer drifts: it is centred because the geometry is, not because a margin was tuned until it looked right.

### Density belongs to the render site

The first version of this gate could see 40 of the repository's 155 icon references, and every one of the 116 it missed was invisible to it. They were invisible for two different reasons: the scanner only matched `<Icon name="…">` and never the named export `<SearchIcon />` that the codebase actually prefers, and QML's `name:` was only read when it held a bare quoted string, so `name: root.maximized ? "restore" : "maximize"` — a line that renders two different icons depending on state — was read as nothing at all.

Closing that gap made a class of defect visible for the first time, and it is not a class any individual icon can be blamed for. Three questions now have assertions:

1. **Does the reference resolve?** Asked by name, an unknown icon is a broken call site and fails. Reached by named export, an unknown component may legitimately be something else, so it is counted as backlog instead. That split exists because the two reference shapes carry different amounts of information: a name is a claim on the registry, a component identifier is only a claim that something exists.
2. **Do the icons drawn together agree?** Icons rendered at one size inside one file sit in one visual context, so they must come from one grid (`sibling-grids`). `families` makes the same promise explicit for a named set of icons that render together, and unlike the sibling scan it needs no source parsing, so it also protects call sites nobody has written yet.
3. **Is the size honest for the grid?** A grid stops painting a stroke below `grid.size / grid.strokeWidth`: 24/2 = **12px** on the default grid, 10/1 = **10px** on chrome. Under that the stroke is sub-pixel — tolerable on a 2x display, visibly weak on a 1x one — so it is *measured, not banned*. The gate lists every reference below its floor and each one is then a decision: keep the coarse glyph where its artwork suits the size, declare a denser grid, or accept the lighter stroke on purpose. What is not acceptable is arriving there without noticing, which costs nothing to detect.

The floor is **derived** from the grid metrics and embedded in the artifacts, never written down beside them. A floor stored next to the numbers it is computed from is a second copy of a fact, and the second copy is the one that rots.

Rule 2 got its sharpest test from the third question's ancestor. `qt/src/ChaSetWindowTitleBar.qml` drew its minimise and maximise buttons from the chrome grid at 10px and its close button from the **default** grid at 10px. Every icon involved was individually valid, every reference resolved, and the row was still wrong: the generic `x` covers half its grid while the caption glyphs cover nine tenths of theirs, so the close shipped as a 5.8px glyph with a 0.83px stroke beside two 10px glyphs with 1px strokes — roughly a third the size of its neighbours, on every platform. React had used the 10-unit plane for all three buttons from the start, so the desktop was simply the odd one out. No assertion in the specification could see it, because no assertion knew what a reference *asked for*; `sibling-grids` exists to make exactly this shape of mistake a build failure.

### The catalogue is published API, not a usage report

An audit of internal consumption finds that some icons in the catalogue are rendered nowhere in this repository. That is expected and it is not debt: `packages/react/src/index.ts` exports every icon as a named component plus `resolveIconName`, so the catalogue is **published API for consumers of the library**, and a consumer's usage is not visible from here. Internal consumption is the right yardstick only for the two ledgers that are about *this* codebase — the inline-`<svg>` ratchet and the text-glyph ban. Removing an entry because this repository happens not to call it would be removing it from somebody else's build.

What the audit *is* good for is completeness. `chevron-right` shipped without a `chevron-left`, which is a gap in a public icon set no internal scan would ever notice; the missing half is the exact mirror of the existing one (`m9 18 6-6-6-6` → `m15 18-6-6 6-6`), so it was added rather than approximated.

### The adoption ratchet

Hand-authored `<svg>` artwork in components is frozen as a **budget, not a target**: `adoption.maxInlineSvgSites` in the registry is the ceiling for `packages/react/src/**`, `packages/react/examples/basic/src/**` and `qt/src/**`. The gate *warns* while the backlog sits at the ceiling and *fails* the moment it grows, so the backlog can only shrink. Each migration lowers the ceiling in the same commit that removes a site.

Read that ceiling from the registry, never from prose — including from this page. A number that only ever moves down is wrong in a document as soon as the next migration lands, and a stale ceiling is worse than none: it makes a healthy run look like a regression.

The per-file breakdown is deliberately **not** stored either. It is derived live by `spec/icons/adoption.mjs` and embedded in the generated artifacts, so the showcase renders the real numbers and no hand-maintained second copy of the truth exists to drift.

#### Exemptions: parametric art is not a migration

The ceiling is only meaningful if every site inside it is something someone could actually migrate. That is false for **parametric vector art**: the colour picker's HSV triangle, whose vertices come from computed dimensions and whose fill is two generated gradients, has no 24-grid stroke representation and never will. Counting it would make the ceiling permanently unreachable — and an unreachable ceiling stops being read as a signal.

Such a site is therefore excluded, but never silently. It carries an inline marker directly above the artwork:

```tsx
{/* chaset-icon-exempt: interactive HSV colour field, sized from computed geometry and painted with two generated gradients */}
<svg …>
```

The marker is built to be awkward to abuse:

1. **The reason is mandatory.** An unreasoned marker buys nothing: the site stays inside the ceiling *and* the gate fails.
2. **It reaches three lines down at most**, so it cannot be posted at the top of a file to bless everything after it.
3. **It has to be used.** A dangling marker is a gate failure, so exemptions cannot be stockpiled ahead of writing the art they excuse.
4. **It is displayed.** Exempt sites and their reasons are embedded in the ledger and rendered on the showcase page, so the escape hatch is audited rather than invisible.

### What may be migrated, and in what order

Backlog sites are not interchangeable, and the ratchet does not pretend they are. They are paid down under a single rule: **a site moves only when the rendered result can be shown to be unchanged.**

That rule splits the backlog three ways.

1. **Provably identical.** The inline artwork is already drawn on the declared grid at the declared weight, so the registry entry reproduces it exactly — often because the site and the registry were derived from the same original drawing. These migrate freely. Verified so far: `search` (showcase header, command palette), `sun` and `moon` (theme toggle), `zap` and `lock` (introduction cards), and `info` (label tooltip hint), the last of which required adding `info` to the registry first.
2. **Off-weight.** The geometry matches a registry icon but the stroke does not — `Checkbox` draws the standard checkmark at stroke **3.5** on the 24-unit grid, and `Switch` draws the standard loader arc at stroke **3**. Both are compensating for a 10-12px render size by thickening the stroke, which is precisely what a denser grid exists to avoid. Migrating them means the glyph gets *thinner*, so it is a visible change and needs a rendered pass rather than a mechanical one.
3. **Off-grid chrome.** `Badge` draws its close glyph on a 12-unit grid; `ScrollBarButtons` draws eight chevrons on an 8-unit grid while Qt draws the same eight on a 14-unit space with `Canvas`. These are the hairline grids, and the two stacks currently render the scroll-bar steppers at different sizes — so which grids the specification should declare is a live question, not a transcription detail.

The floor ledger (§7) shows what happens once the third question can be asked, and the answer is not "everything below the floor is wrong". Four small controls render the **default-grid `x` at 10px** — the address-bar clear button, the task-HUD dismiss button, the badge remove affordance and the inline-edit pencil — and they are correct as they are. `x` and `window-close` are not the same drawing at two densities: `x` covers half its grid because it is a small in-field clear glyph, while `window-close` covers nine tenths of its because it is a caption control. Migrating those four to the chrome glyph would double the ink, and a 10px-ink `×` inside a 16dp circle would reach the edge. What was wrong was the **caption** row, where the small glyph sat beside two large ones. The ledger's job is to make that distinction visible at a glance instead of leaving it to whoever happens to look at the control next.

The scroll-bar case is the sharpest example of why the ratchet alone was not enough. The two stacks have already drifted apart in four independent ways: grid (8 vs 14), chevron width (62.5% vs 50% of the grid), chevron height (31.25% vs 25%), and the gap between the two chevrons of a double glyph (touching vs separated). The registry's own 24-unit `chevron-up` is 50% × 25%, which means the **desktop** proportions are the ones that already agree with the specification and the web scroll-bar arrows are the outlier — a conclusion nobody could reach by looking at either stack alone.

### Related gates

- `pnpm check:scaling` — every `ChaSet*` Qt component must scale its geometry through `ThemeTokens.dp`/`sp`.
- `pnpm check:no-emoji` — an icon is always vector artwork; emoji are banned repo-wide.
- `pnpm gate` block 2.5 (SPAS) — the showcase pages must stay structurally 1:1 across both stacks.

---

## 8. What the migration changed

| Surface | Before | After |
| :--- | :--- | :--- |
| `ScaleOsd` controls (React) | `−` / `+` / `⟳` text glyphs, `font-semibold` vs no weight, mixed font sizes | `<MinusIcon />`, `<PlusIcon />`, `<RotateCcwIcon />` from the registry |
| `ScaleOsd` controls (Qt) | `Text` glyphs, `weightBold` vs default weight, baseline-centred | `ChaSetIcon` with geometry-centred shapes |
| `ChaSetAddressBar` | `Text` glyphs `←` `→` `↑` `⟳` | `ChaSetIcon` `arrow-left` / `arrow-right` / `arrow-up` / `rotate-ccw` |
| `ChaSetBadge`, `ChaSetInput` | `Text { text: "×" }` | `ChaSetIcon { name: "x" }` |
| `ButtonDocPage` | `<span>←</span>` / `<span>→</span>` | `<Icon name="arrow-left" />` / `<Icon name="arrow-right" />` |
| `Header` (showcase) | Inline `search`, `sun`, `moon` artwork | `SearchIcon`, `SunIcon`, `MoonIcon` |
| `Header` (showcase) | Inline GitHub logo | Exempted as a brand mark, and displayed as such on the showcase page |
| `CommandSearchModal` | Inline `search` artwork | `SearchIcon` |
| `IntroductionPage` | Inline `zap` / `lock` artwork | `ZapIcon` / `LockIcon` |
| `Label` | Inline `info` artwork | `InfoIcon` (registry gained `info`) |
| `qt/src/ChaSetIcon.qml` | Canvas-drawn per-name line art (`lw = max(1.2, w * 0.09)`) | Specification-driven `Shape` + `PathSvg` renderer |
| `packages/react/src/lib/icons.tsx` | 47 hand-written SVG components | Re-export of `icons.generated.tsx` (import paths and export names unchanged) |
| `qt/src/ChaSetWindowTitleBar.qml` | Close button rendered the **generic 24-unit `x`** at 10px — a 5.8px glyph with a 0.83px stroke beside two 10px chrome glyphs on the same row | `window-close` on the chrome grid, so all three caption buttons share one grid at one size. This is the defect `sibling-grids` was written from, and the first thing it failed on |
| `spec/icons/registry.json` | `chevron-right` shipped without a `chevron-left` | `chevron-left` added as the exact mirror (`m9 18 6-6-6-6` → `m15 18-6-6 6-6`), and the `chevron-horizontal` family names the pair so the gap cannot reopen silently |

The chrome-grid caption icons (`window-minimize`, `window-maximize`, `window-restore`, `window-close`) were added by the original migration so window captions would match the weight of the toolbar icons beside them — but the close button kept rendering the generic `x`, so the caption row matched on three sides out of four until the `sibling-grids` assertion was written and found it. The lesson is recorded rather than tidied away: adding the right glyph to the registry does not migrate the call site, and a registry-only check cannot see the difference.

---

## 9. Verification

```bash
pnpm gen:icons        # re-emit both stacks from spec/icons/registry.json
pnpm check:icons      # icon-specific assertions (geometry + ledgers + resolution)
pnpm gate             # includes 2.11 (icon specification) and 2.5 (showcase parity)
pnpm test             # React unit + conformance + showcase smoke suite
pnpm build:qt         # QtChaSetDemo, including the QML runtime scenario sweep
```

Expected output of the icon gate — a pass plus the standing ledgers. Warnings here are not tolerances to be ignored: each one names work that is deliberately outstanding, and a warning that stops being true should be deleted rather than left standing.

```
[check-icon-spec] WARN [ratchet]      N hand-authored inline <svg> site(s) remain in the frozen
                                      migration backlog (ceiling from the registry)
[check-icon-spec] WARN [ratchet]      M site(s) are excused as non-iconography, with reasons
[check-icon-spec] WARN [unowned]      K reference(s) render icon components the specification
                                      does not own
[check-icon-spec] WARN [stroke-floor] J reference(s) render below their grid's stroke floor
[check-icon-spec] WARN [stroke-floor] I reference(s) compute their size at run time
[check-icon-spec] OK — accepted assertions verified — active specification "stroke-monoline"
                        via chaset.config.json (icons.spec)
```

Counts are deliberately absent from this page. Every one of them changes whenever unrelated work lands, and a stale count in prose either makes a healthy run look like a regression or trains the reader to ignore it; the run prints its own numbers.
