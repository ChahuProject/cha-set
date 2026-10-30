# Token Pipeline Architecture Specification

## 1. Role & System Boundaries
- **Core Role**: Defines, aggregates, validates, and derives design tokens (colors, space, motion, typography, radii, elevation) across multi-axis variations (mode, accent theme, window tint, interface style) and compiles them into concrete per-stack code assets.
- **Scope Delineation**:
  - **In-Scope**:
    - Token authoring in granular JSON shards under `spec/tokens/**`.
    - Shard aggregation into canonical `spec/tokens.json` with sha256 snapshot hashing.
    - Token generation for Web (CSS Custom Properties) and Qt (C++ header + QML singleton).
    - Exporting generated token headers directly into module include paths (`qt/include/ChaSet/`) and optional consumer distributions.
  - **Out-of-Scope**:
    - Runtime CSS parsing or dynamic stylesheet runtime injection inside consumer applications.

---

## 2. Core Data Flow & Generator Pipeline

1. **Shard Aggregation (`spec/build-tokens.mjs`)**:
   Reads `meta.json`, `primitives.json`, `semantic/*.json`, `composite/*.json`, and `themes/*.json`, merges them in canonical order, and writes `spec/tokens.json`.
2. **CSS Generator (`spec/generators/generate-css.mjs`)**:
   Produces:
   - `packages/react/src/styles/tokens.css` (for the `@chahu/cha-set` library).
   - `dist/.../tokens.generated.css` (for consumer web stylesheets).
3. **Qt Generator (`spec/generators/generate-qt.mjs`)**:
   Uses `spec/qt-mapping.json` to map semantic roles into:
   - `qt/include/ChaSet/theme_tokens.generated.h` (public C++ `cha_set_gen::ThemeTokens` header with bit-exact `kDark` and `kLight`).
   - `qt/src/ThemeTokens.generated.qml` (QML singleton with reactive `dark` boolean property).
   - `dist/.../theme_tokens.generated.h` (consumer distribution artifact).
4. **Consumer Sync (`scripts/sync-consumers.mjs`)**:
   Copies generated artifacts into sibling checkouts when present.

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **Token Shards** | [`spec/tokens/`](file:///D:/pengj/cha-set/spec/tokens/) | Primitives, semantics, composites, themes axes & deltas |
| **Snapshot Aggregator** | [`spec/build-tokens.mjs`](file:///D:/pengj/cha-set/spec/build-tokens.mjs) | Merges shards into canonical JSON snapshot |
| **Loader & Helpers** | [`spec/load-tokens.mjs`](file:///D:/pengj/cha-set/spec/load-tokens.mjs), [`spec/token-helpers.mjs`](file:///D:/pengj/cha-set/spec/token-helpers.mjs) | Color conversion (OKLCH, RGBf, Hex), selector generation |
| **CSS Generator** | [`spec/generators/generate-css.mjs`](file:///D:/pengj/cha-set/spec/generators/generate-css.mjs) | Emits standard `:root` / `.dark` / `[data-theme]` CSS variables |
| **Qt Generator** | [`spec/generators/generate-qt.mjs`](file:///D:/pengj/cha-set/spec/generators/generate-qt.mjs) | Emits C++ headers and QML singleton |
| **Consumer Sync** | [`scripts/sync-consumers.mjs`](file:///D:/pengj/cha-set/scripts/sync-consumers.mjs) | Propagates fresh builds to sibling repositories |

---

## 4. Invariants & Forbidden Anti-Patterns

1. **Deterministic Order**: Aggregated `spec/tokens.json` must always preserve exact alphabetical/hierarchical key sorting to prevent noisy git diffs.
2. **Preset Completeness**: Any new semantic role added to `semantic/core.json` must specify values for both desktop and web presets.
3. **No Direct Hex Hardcoding in Components**: Components must reference semantic token variables (CSS vars in Web, `ThemeTokens.<role>` in QML) rather than hardcoded colors.

### 4.1 The Two Showcases Must Render One Palette

The Qt library and demo consume `ThemeTokens` (preset `dunting`). The React library and demo consume the CSS emit, which only exists for preset `launcher`. The showcase therefore had a third, hand-written Tailwind slate palette in `packages/react/examples/basic/src/styles.css`, while the Qt demo hardcoded the same slate for its chrome and kept reading `dunting` for text:

| | Qt showcase | React showcase (before) |
| :--- | :--- | :--- |
| body text | `#e6f0fa` | `#f8fafc` |
| muted text | `#a0b2c6` | `#94a3b8` |
| raised surface | `#252d3d` | `#1e293b` |
| border | `#3c4858` | `#1e293b` |

On the same canvas this reads as "the Qt text is lighter and flatter" — a palette divergence, not a rendering bug. The rule now is: **the React demo mirrors the `dunting` values by hand, and `just check-palette` fails the build when a mirror drifts** (`scripts/check-showcase-palette.mjs`, wired as gate 2.15b). Only `background` is exempt: both demos pin the canvas to the same `#020817` / `#ffffff` outside the token layer.

When a semantic role is added or retuned, run `just gen-qt` and copy the mapped value into `styles.css`; the gate names the exact property and both colours if you forget.
