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
  "specs": [ /* named specifications — exactly one is "implemented" at a time */ ],
  "adoption": { "maxInlineSvgSites": 56, "inlineSvgBaseline": [ /* frozen backlog */ ] }
}
```

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
| `weights` | `[{ id: "regular", strokeWidth: 2 }]` | One weight. Emphasis is colour or size — never a heavier glyph |
| `sizes.ramp` | `10, 12, 14, 16, 18, 20, 24` | Named steps; artwork is never hand-scaled |
| `color.policy` | `currentColor` | Web inherits `currentColor`; Qt defaults to `ThemeTokens.text` |

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
| `ratchet` | The number of hand-authored inline `<svg>` sites grew |
| `resolution` | A component references an icon name the active specification does not own |

The assertion count is not fixed: each icon contributes a geometry assertion and each icon reference in the codebase contributes a resolution assertion, so the number grows as the library grows.

> **Centring is judged on ink, not on boxes.** The gate measures the painted extent — half the stroke paints outside the artwork coordinates, and it is the painted ink that has to *look* centred. Anchor offsets and padding are deliberately not an accepted fix: they centre a box, not what is inside it. This is the specific reason the OSD reset arrow no longer drifts: it is centred because the geometry is, not because a margin was tuned until it looked right.

### The adoption ratchet

Hand-authored `<svg>` artwork in components is frozen as a **budget, not a target**: `adoption.maxInlineSvgSites` currently allows 56 sites (`packages/react/src/**`, `packages/react/examples/basic/src/**`, `qt/src/**`). The gate *warns* while the backlog sits at the budget and *fails* the moment it grows, so the backlog can only shrink. Each migration lowers `maxInlineSvgSites` in the same commit that removes a site.

The catalogued migration backlog (labels, checkbox, switch, scroll-bar steppers, window title bar, task HUD, pipeline view, …) is intentionally **not** migrated here: rewriting them without a rendered verification pass would trade a verified state for an unverified one. Only the *text-glyph* class — the defect family this specification exists to remove — was cleared outright, because each of those was a one-line change with a visible, checkable result.

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
| `qt/src/ChaSetIcon.qml` | Canvas-drawn per-name line art (`lw = max(1.2, w * 0.09)`) | Specification-driven `Shape` + `PathSvg` renderer |
| `packages/react/src/lib/icons.tsx` | 47 hand-written SVG components | Re-export of `icons.generated.tsx` (import paths and export names unchanged) |

New icons added by this migration: `plus`, `minus`, `arrow-left`, `arrow-right`, `arrow-up`, `chart`, `window-minimize`, `window-maximize`, `window-restore`, `window-close` — the last four on the dense 10-unit chrome grid so window captions finally match the geometry of the toolbar icons next to them.

---

## 9. Verification

```bash
pnpm gen:icons        # re-emit both stacks from spec/icons/registry.json
pnpm check:icons      # icon-specific assertions (geometry + ledgers + resolution)
pnpm gate             # includes 2.11 (icon specification) and 2.5 (showcase parity)
pnpm test             # React unit + conformance + showcase smoke suite
pnpm build:qt         # QtChaSetDemo, including the QML runtime scenario sweep
```

Expected clean output of the icon gate — a pass plus at most one warning:

```
[check-icon-spec] WARN [ratchet] N hand-authored inline <svg> site(s) remain in the frozen
                            migration backlog (budget 56): ...
[check-icon-spec] OK — M icon specification assertion(s) verified — active specification
                          "stroke-monoline" via chaset.config.json (icons.spec)
```
