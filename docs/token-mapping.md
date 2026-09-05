# Token Mapping and Refresh Guide

> Single source of truth: `spec/tokens/**` shards (SoT) + `spec/qt-mapping.json` mapping table; `spec/tokens.json` is the aggregated snapshot. Do not hand-edit the snapshot directly. See `spec/README.md` for details.

## 1. Three-Layer Architecture (launcher-inspired skeleton)

```
Tier 0 primitives   Scale constants: space(0..6=0/2/4/8/12/16/24px), motion(90/120/180ms),
                    size(21 control sizes), fontWeight — theme-independent constants.
Tier 1 semantic     Role aliases, each token with presets:
                      launcher: {light, dark}   ← Web UI variable preset (OKLCH format)
                      dunting:  {light, dark}   ← Desktop Native / Quick Controls preset (#RRGGBBAA format)
                    Core vocabulary = shadcn-compatible (background/foreground/card/popover/
                    primary/secondary/muted/accent/destructive/border/input/ring/
                    chart-1..5); domain-specific names are namespaced: chrome.* canvas.* overlay.*
                    interaction.* accent.nest/pending/conflict/blocked.
Tier 2 composite    Multi-part surfaces (material alpha/blur/shadow/gradient), only "$platform":["css"];
                    Qt rendering pipeline does not consume (Desktop Quick Controls uses offscreen QML, no QSS).
themes              Selector axes mode × accentTheme(8) × windowTint(6) × interfaceStyle(2)
                    + deltas[] (axis combinations + tokens, no selector, see §6 derivation rules).
qt                  Derived table (not stored in shards): colors{33 fields×dark/light}+ space/motion/size,
                    derived from semantic.dunting + primitives via spec/qt-mapping.json.
```

### Architecture Diagram

```
                    ┌──────────────────────────────┐
                    │  Tier 0  primitives         │  spec/tokens/primitives.json
                    │  space / motion / size /    │  constant scales, shared across products
                    │  fontWeight                 │
                    └──────────┬───────────────────┘
                               │ referenced by semantic
                    ┌──────────▼───────────────────┐
                    │  Tier 1  semantic           │  spec/tokens/semantic/*.json
                    │  core / launcher / dunting  │  58 tokens × presets
                    │  launcher=oklch  dunting=   │  #RRGGBBAA
                    │  #RRGGBBAA                  │
                    └──────────┬───────────────────┘
                               │ layered by composite
                    ┌──────────▼───────────────────┐
                    │  Tier 2  composite.launcher │  spec/tokens/composite/
                    │  40 app-* surfaces          │    launcher.json
                    │  $platform: ["css"]         │
                    └──────────┬───────────────────┘
                               │ overridden by theme deltas
                    ┌──────────▼───────────────────┐
                    │  themes                      │  spec/tokens/themes/
                    │  axes(8/6/2) + deltas(30)   │    axes.json + deltas.json
                    │  selector derived via       │  derived, not hand-written
                    │  selectorFor                │
                    └──────────┬───────────────────┘
                               │ derive qt
                    ┌──────────▼───────────────────┐
                    │  qt (derived)                │  spec/qt-mapping.json +
                    │  33 colors + space/motion/   │  token-helpers hexToRgbf
                    │  size derived                │  + fmtChannel
                    └──────────────────────────────┘
```

## 2. File Split Table

SoT is shards; `spec/tokens.json` is the committed snapshot aggregated by `spec/build-tokens.mjs` (CI verifies shards and snapshot sha256 match).

| # | File | Contents | Top-level key | Lines / size |
|---|------|----------|---------------|--------------|
| 1 | `spec/tokens/meta.json` | schemaVersion, description, sources, conventions | `meta` | ~40 lines |
| 2 | `spec/tokens/primitives.json` | space(7), motion(3), size(21), fontWeight(2) | `primitives` | ~45 lines |
| 3 | `spec/tokens/semantic/core.json` | core shadcn-compatible tokens ~22: background/foreground/card/popover/primary etc | `semantic` | ~260 lines |
| 4 | `spec/tokens/semantic/launcher.json` | launcher-specific: sidebar*, chart-1..5 | `semantic` | ~120 lines |
| 5 | `spec/tokens/semantic/dunting.json` | dunting namespaces: chrome.*, canvas.*, overlay.*, accent.nest/pending/conflict/blocked | `semantic` | ~220 lines |
| 6 | `spec/tokens/composite/launcher.json` | 40 `app-*` composite surfaces, `$platform: ["css"]` | `composite.launcher` | ~360 lines |
| 7 | `spec/tokens/themes/axes.json` | four axes: mode(2), accentTheme(8), windowTint(6), interfaceStyle(2) | `themes.axes` | ~20 lines |
| 8 | `spec/tokens/themes/deltas.json` | 30 deltas (16 accent + 12 tint + 2 interfaceStyle), no selector | `themes.deltas` | ~440 lines |
| 9 | `spec/qt-mapping.json` | qt derivation map: colors 33 + space 7 + motion 3 + size 21 | mapping table | 74 lines |
| 10 | `spec/load-tokens.mjs` | single read entry, split-first with snapshot fallback | none | 264 lines |
| 11 | `spec/build-tokens.mjs` | aggregator + sha256 + `--check` drift gate | none | 167 lines |
| - | `spec/tokens.json` | committed snapshot (generated, not SoT) | `meta/primitives/semantic/composite/themes/qt` | 2173 lines |
| - | `spec/token-helpers.mjs` | shared pure functions: HEX8/OKLCH_RE/COLOR_MIX_RE, hexToRgbf, fmtChannel, selectorFor, stringifySorted/ORDER | none | 191 lines |

> Note: planned 11 files per DTCG grouping, actually landed as 8 shard JSONs + 3 aggregator/mapping scripts (table 1..11 above, 8 physical shards + qt-mapping mapping to 11 logical). `qt` shards are not allowed under `spec/tokens/**`, nor is `selector` allowed in `deltas`; enforced by `validate-tokens.mjs`.

## 3. Aggregation and Generation Pipeline

```
spec/tokens/** shards (8 files) ─┐
spec/qt-mapping.json map         ─┤
                                 ├─▶  loadTokensSync({from:"split"})
                                 │       ├─ fixed-order deepMerge
                                 │       │   meta → primitives → semantic/core
                                 │       │   → semantic/launcher → semantic/dunting
                                 │       │   → composite/launcher → themes/axes
                                 │       │   → themes/deltas
                                 │       ├─ deriveThemes: deltas → overrides
                                 │       │   (selectorFor per entry, see §6)
                                 │       └─ deriveQt: semantic.dunting + primitives
                                 │           via qt-mapping + hexToRgbf → qt.colors/rgbf
                                 │              /space/motion/size
                                 │
                                 ▼
                     buildSnapshotObject(memoized)
                                 │
                                 ├─ stringifySorted(ORDER) canonical key order
                                 │  top: meta/primitives/semantic/composite/themes/qt
                                 │  semantic sorted by ORDER.semantic groups
                                 │
                                 ▼
                     spec/tokens.json snapshot ── sha256 verify ── committed to git
                                 │
               ┌─────────────────┼─────────────────┐
               ▼                 ▼                 ▼
    generate-css.mjs     generate-qt.mjs    validate-tokens.mjs
    (loadTokensSync)     (loadTokensSync     (loadTokensSync)
     selectorFor)         + deriveQt)         axes/delta/hex checks
               │                 │                 │
               ▼                 ▼                 │
   tokens.css (lib)   theme_tokens.generated.h     │
   tokens.generated   ThemeTokens.generated.qml    │
   .css (launcher)    33 colors+7+3+21            │
               │                 │                 │
               └────────┬────────┘                 │
                        ▼                         │
               git diff --exit-code check         │
               pnpm gen:all / CI drift gate ◀─────┘
```

Pipeline: `shards -> loadTokens -> buildSnapshotObject -> spec/tokens.json -> generators`

Key invariants:

- Merge order is fixed; shards have no overlapping top-level keys (validator checks overlapping keys).
- Key order is determined by `spec/token-helpers.mjs: ORDER` + `stringifySorted`, guaranteeing byte-identical `pnpm gen:tokens`.
- `qt` is not stored in shards, `selector` is not stored in deltas; both are derived at runtime.

## 4. Artifacts and Exported Targets

| Artifact | Generator | Location (cha-set) | Purpose / Target |
|---|---|---|---|
| Library CSS | generate-css.mjs | packages/react/src/styles/tokens.css (shadcn standard names, no prefix, core only) | @chahu/cha-set (Button, ScrollArea, etc.) |
| Web Theme CSS | same | dist/.../tokens.generated.css | Web host applications |
| Qt C++ Public Header | generate-qt.mjs | qt/include/ChaSet/theme_tokens.generated.h | Public header exported by ChaSet target for host CMake applications |
| Qt QML Singleton | generate-qt.mjs | qt/src/ThemeTokens.generated.qml | ChaSet 1.0 QML module (ThemeTokens singleton) |

## 5. Desktop Preset → Unified Semantic Mapping

### 5.1 Overview (Desktop token field → unified semantic slot)

| ThemeManager field | unified semantic slot |
|---|---|
| text | foreground (also card-foreground/secondary-foreground/accent-foreground) |
| subduedText | muted-foreground |
| danger / focus / panel / panelRaised / onAccent / selection / border / background / accent | destructive / ring / card(+muted) / popover(+secondary) / primary-foreground(+destructive-foreground) / accent / border / background / primary |
| chrome, chromeIcon/Hover/Down | chrome.surface / chrome.icon / chrome.hover / chrome.down |
| canvasMarquee(+Border), canvasLoading*(3), canvasGrid(+Major) | canvas.* |
| overlayScrim, infoBar | overlay.scrim / overlay.info-bar |
| hover, pressed, disabled, disabledText | interaction.* |
| nestAccent, pendingAccent, conflict, blocked | accent.nest / accent.pending / accent.conflict / accent.blocked |

Not generated: `accentHover/accentPressed` (derived at runtime via lighter(112)/darker(110) in theme_manager.cpp), `tabMinWidth/tabMaxWidth` (user preference, not a token).

### 5.2 qt 33-Row Mapping Table (qt field → semantic token + transform)

`spec/qt-mapping.json` is the sole mapping table, shared by `generate-qt.mjs:deriveQt` and `load-tokens.mjs:deriveQt`.

| # | qt field | semantic token | transform | Note |
|---|----------|----------------|-----------|------|
| 1 | chrome | chrome.surface | none | dunting dark/light #RRGGBBAA |
| 2 | background | background | none | |
| 3 | panel | card | none | |
| 4 | panelRaised | popover | none | |
| 5 | border | border | none | |
| 6 | accent | primary | none | |
| 7 | nestAccent | accent.nest | none | |
| 8 | pendingAccent | accent.pending | none | |
| 9 | blocked | accent.blocked | none | |
| 10 | text | foreground | none | |
| 11 | subduedText | muted-foreground | none | |
| 12 | conflict | accent.conflict | none | |
| 13 | onAccent | primary-foreground | none | |
| 14 | selection | accent | none | |
| 15 | hover | interaction.hover | none | |
| 16 | pressed | interaction.pressed | none | |
| 17 | disabled | interaction.disabled | none | |
| 18 | disabledText | interaction.disabled-text | none | |
| 19 | focus | ring | none | |
| 20 | overlayScrim | overlay.scrim | none | |
| 21 | danger | destructive | none | |
| 22 | dangerHover | destructive | alpha:0.5 | Take destructive hex, rewrite alpha byte to `round(0.5*255)=0x80`, e.g. `#D12E26E6 → #D12E2680` |
| 23 | infoBar | overlay.info-bar | none | Originally #AARRGGBB float source; derived via hexToRgbf with snapshot rgbf fallback for byte-identical output |
| 24 | canvasMarquee | canvas.marquee | none | |
| 25 | canvasMarqueeBorder | canvas.marquee-border | none | |
| 26 | canvasLoadingBackdrop | canvas.loading-backdrop | none | |
| 27 | canvasLoadingBorder | canvas.loading-border | none | |
| 28 | canvasLoadingText | canvas.loading-text | none | |
| 29 | canvasGrid | canvas.grid | none | |
| 30 | canvasGridMajor | canvas.grid-major | none | |
| 31 | chromeIcon | chrome.icon | none | |
| 32 | chromeHover | chrome.hover | none | |
| 33 | chromeDown | chrome.down | none | |

space / motion / size mappings (`spec/qt-mapping.json: space/motion/size`):

- space: `space0..space6 → primitives.space.space0..space6` (7 entries)
- motion: `motionQuick/Short/Medium → primitives.motion.quick/short/medium` (3 entries)
- size: `radiusSmall/controlHeight/gap/pageInset/dockInset/dividerThickness/minimumPaneExtent/panelRadius/rowRadius/radiusLarge/radiusXl/separatorHeight/separatorLine/checkCol/iconCol/cascadeGap/chevronW/fontSizeTitle/fontSizeHeading/fontSizeBody/fontSizeSmall → primitives.size.*` (21 entries)

Derivation details: `hexToRgbf(hex)` splits `#RRGGBBAA` bytes /255 to floats; `fmtChannel` emits `"<byte>.0 / 255.0"` for byte-origin channels to ensure bit-exact QColor at Qt 16-bit storage; for chrome and other float origins, if hex-derived rgbf diverges from snapshot rgbf by >1e-9, the entire table falls back to snapshot rgbf for byte-identical output (same logic in `load-tokens.mjs` and `generate-qt.mjs`).

## 6. selectorFor Derivation Rules

`spec/token-helpers.mjs: selectorFor` is the sole selector synthesis entry; `generate-css.mjs` derives only through it.

```js
export function selectorFor({ mode, accentTheme, windowTint, interfaceStyle }) {
  if (mode !== 'light' && mode !== 'dark') throw new Error('mode must be "light" | "dark"');
  const count = Number(accentTheme!==undefined) + Number(windowTint!==undefined) + Number(interfaceStyle!==undefined);
  if (count !== 1) throw new Error('exactly one of accentTheme|windowTint|interfaceStyle must be set');
  const base = mode === 'dark' ? '.dark' : ':root';
  if (accentTheme !== undefined) return `${base}[data-theme="${accentTheme}"]`;
  if (windowTint !== undefined) return `${base}[data-window-tint="${windowTint}"]`;
  return `${base}[data-interface-style="${interfaceStyle}"]`;
}
```

Rules (selectorFor rule: `mode light|dark + exactly one of accentTheme/windowTint/interfaceStyle -> .dark/:root[data-*]`):

- `mode` is required and must be `light | dark`.
- Exactly one axis: one of `accentTheme`, `windowTint`, `interfaceStyle` must be set (exactly one, otherwise hard error).
- `base`: `dark → .dark`, `light → :root`.
- Suffix is fixed per axis: `data-theme`, `data-window-tint`, `data-interface-style`; values are literal enums from `themes.axes` (8/6/2); unknown values are double-checked in `validate-tokens.mjs` and `selectorFor`.
- `spec/tokens/themes/deltas.json` must not contain a `selector` field; guarded by both `validate-tokens.mjs` and `generate-css.mjs`; `spec/tokens.json` snapshot's `themes.overrides[].selector` is derived, not SoT.
- Cascade order is fixed by file order in `deltas.json` (30 entries in original `overrides:1065-1533` order: 16 accent light then dark, 12 tint, 2 interfaceStyle); generators do not reorder; `byAxis` preserves original order after filtering by axis.

Example: `{mode:"dark", accentTheme:"slate"}` → `.dark[data-theme="slate"]`, `{mode:"light", windowTint:"mist"}` → `:root[data-window-tint="mist"]`.

## 7. Refresh Flow (edit values → both stacks take effect)

SoT is shards; do not edit `spec/tokens.json` directly.

```bash
# 1) Edit shards only (JSON hand-edit points)
#    spec/tokens/meta.json | primitives.json
#    spec/tokens/semantic/core.json | launcher.json | dunting.json
#    spec/tokens/composite/launcher.json
#    spec/tokens/themes/axes.json | deltas.json
#    Scale map changes go to spec/qt-mapping.json (rarely)

# 2) Aggregate snapshot + generate all artifacts
pnpm gen:tokens    # node spec/build-tokens.mjs  → write spec/tokens.json + print sha256
pnpm gen:all      # node spec/generators/generate-all.mjs → gen:css + gen:qt
#  single-step equivalent: pnpm gen:tokens && pnpm gen:css && pnpm gen:qt

# 3) Local drift self-check (same gate as CI)
node spec/build-tokens.mjs --check
node spec/validate-tokens.mjs
git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/

# One-shot refresh verify (same as CI)
pnpm gen:tokens && pnpm gen:all && git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/

# 4) Sync to consumer checkouts (copy if present, skip if missing)
node scripts/sync-consumers.mjs
#    Web consumer     ← dist/consumers/launcher/generated/tokens.generated.css
#    Desktop consumer ← dist/consumers/dunting/generated/theme_tokens.generated.h

# 5) Commit (commit shards + snapshot + artifacts in this repo)
git add spec/tokens/** spec/tokens.json spec/qt-mapping.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml qt/include/ dist/consumers/
git commit -m "refactor(spec): ..."
```

Drift prevention:

- This repo CI gates `spec/tokens.json` + artifacts via `git diff --exit-code`.
- Additional `node spec/build-tokens.mjs --check` ensures shards and snapshot sha256 match (after normalization).
- Consumer automated tests gate header and token drift.

Emergency bypass: see §8 `CHA_TOKENS_FROM`.

## 8. Rollback Guide (reversible)

### Single revert to roll back

`spec/tokens.json` remains as a committed snapshot, `spec/tokens/**` is SoT, and the refactor changed no token values or consumer paths, so the whole change can be reverted in one shot:

```bash
# View the refactor commit range (use actual git log, typically 6 atomic commits)
git log --oneline --graph --all | grep -E "chore\(spec\)|refactor\(spec\)|feat\(spec\)|chore\(ci\)|docs\(spec\)"

# Revert the entire refactor in one shot (example range, replace with actual commit range)
git revert --no-commit HEAD~6..HEAD
git commit -m "revert: rollback cha-token-refactor sharding, restore single-file SoT"

# Or keep history and hard-reset to pre-refactor baseline
git reset --hard <pre-refactor-base>
```

After rollback:

- `spec/tokens/**`, `spec/load-tokens.mjs`, `spec/build-tokens.mjs`, `spec/qt-mapping.json` are removed; single-file `spec/tokens.json` hand-editing is restored.
- Old generators still read `spec/tokens.json` directly; `pnpm gen:all` remains usable with byte-identical artifacts.
- Evidence retained at `.omo/evidence/cha-token-refactor/`.

### Hotfix switch: CHA_TOKENS_FROM

All reads go through `spec/load-tokens.mjs:loadTokensSync({from})`, which respects an env override:

```bash
# Force snapshot read (ignore shards), for shard corruption or emergency hotfix
CHA_TOKENS_FROM=snapshot node spec/validate-tokens.mjs
CHA_TOKENS_FROM=snapshot pnpm gen:css
CHA_TOKENS_FROM=snapshot pnpm gen:qt
CHA_TOKENS_FROM=snapshot pnpm gen:all

# Default (shard-first, snapshot fallback)
node spec/build-tokens.mjs --check   # verify shards vs snapshot
```

Generators internally pin `loadTokensSync({from:"split"})`, but manually launching with `CHA_TOKENS_FROM=snapshot` can bypass shard derivation and ship an emergency release from the committed snapshot; patch shards afterward and re-run `pnpm gen:tokens && pnpm gen:all`.

## 9. Design Trade-offs: DTCG + vanilla Node (DTCG vanilla Node rationale)

- Borrows W3C DTCG 2025.10 grouping and `$type` ideas (organize by product and layer, keep `$type` and `$platform`) without pulling in Style Dictionary.
- Rejects Style Dictionary because of extra dependency, uncontrollable key order and `oklch()`/`color-mix()` transcription, which would change committed artifact bytes and violate the "byte-identical" constraint.
- Chooses vanilla Node aggregation: `ORDER` + `stringifySorted` guarantees deterministic key order, `oklch()`/`color-mix()` stay verbatim, `fmtChannel` matches the `byte*255` rounding at `spec/generators/generate-qt.mjs:42-45`, and `sha256` snapshot comparison proves byte-identical output.
- Snapshot strategy: `spec/tokens.json` remains as a committed generated artifact for auditability and one-shot revert; `spec/tokens/**` is SoT; editing shards then `pnpm gen:tokens` rewrites the snapshot; CI locks them together via `--check`.

## 10. Known Semantic Pitfalls (hit during transcription)

- Qt `QColor(QString)` 9-digit hex is **#AARRGGBB**: source `infoBar "#99000000"` = α0x99 black; `canvasMarquee "#3366aaff"` likewise α0x33. spec.qt.rgbf stores the true value as float arrays; the generator emits `QColor::fromRgbF(...)` for bit-exact 16-bit storage equivalence.
- Launcher compat flavor variable names = semantic keys stripped of namespace prefix (interaction.hover→--hover).
- `--app-status-*` kept in place under composite (consumers reference by name).
