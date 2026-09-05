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
