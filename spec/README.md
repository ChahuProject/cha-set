# spec: Token Source and Aggregation

> SoT is `tokens/**` shards + `qt-mapping.json`; `tokens.json` is a committed snapshot (generated artifact).

## Shards Overview

```
spec/
  tokens.json                 # committed snapshot (generated, do NOT hand-edit)
  qt-mapping.json             # qt derivation map: 33 colors + space 7 + motion 3 + size 21
  load-tokens.mjs             # single read entry, split-first with snapshot fallback
  build-tokens.mjs            # aggregator: shards → snapshot (canonical key order + sha256)
  token-helpers.mjs           # shared pure functions: HEX8/OKLCH_RE/HEX, hexToRgbf, fmtChannel, selectorFor, stringifySorted/ORDER
  validate-tokens.mjs         # validator: oklch/color-mix/hex, axes, deltas 30, forbid selector/qt shards
  tokens/
    meta.json                 # meta: schemaVersion/sources/conventions
    primitives.json           # primitives: space(7)/motion(3)/size(21)/fontWeight(2)
    semantic/
      core.json               # core shadcn-compatible tokens ~22
      launcher.json           # launcher-specific: sidebar*, chart-1..5
      dunting.json            # dunting namespaces: chrome.*/canvas.*/overlay.*/accent.*
    composite/
      launcher.json           # 40 app-* composite surfaces, $platform ["css"]
    themes/
      axes.json               # four axes: mode(2) accentTheme(8) windowTint(6) interfaceStyle(2)
      deltas.json             # 30 deltas (16 accent + 12 tint + 2 interfaceStyle), no selector
```

Key order is fixed by `token-helpers.mjs:ORDER` + `stringifySorted`; shards have no overlapping top-level keys; `qt` and `selector` are both derived, not stored in shards.

## Common Commands

```bash
# Aggregate snapshot (shards → spec/tokens.json)
node spec/build-tokens.mjs
pnpm gen:tokens

# Validate shards match snapshot (same gate as CI, sha256 after normalization)
node spec/build-tokens.mjs --check

# Validate structure (reads shards by default, including qt/selector derivation)
node spec/validate-tokens.mjs

# Generate all artifacts
pnpm gen:all            # = gen:css + gen:qt
pnpm gen:css            # → packages/react/src/styles/tokens.css + dist/consumers/launcher/generated/tokens.generated.css
pnpm gen:qt             # → dist/consumers/dunting/generated/theme_tokens.generated.h + qt/src/ThemeTokens.generated.qml

# Full refresh flow (after editing shards)
pnpm gen:tokens && pnpm gen:all
git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/
node scripts/sync-consumers.mjs  # sync to sibling crd-a/dt-a checkouts if present

# Emergency bypass: ignore shards, use committed snapshot directly
CHA_TOKENS_FROM=snapshot node spec/validate-tokens.mjs
CHA_TOKENS_FROM=snapshot pnpm gen:all
```

## Validation and Gates

- `node spec/validate-tokens.mjs` green: both `validateSpec` + `validateShards` paths.
- `node spec/build-tokens.mjs --check` green: aggregated sha256 from shards matches committed `spec/tokens.json`.
- `pnpm gate` green: `gate/parity.mjs` validates against `spec/capabilities.json`.
- CI additionally runs `git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/` to prevent drift.

## Environment Switches

- `CHA_TOKENS_FROM=snapshot`: force `load-tokens.mjs` to read the `spec/tokens.json` snapshot instead of shards, for shard corruption or hotfix bypass.
- Default `CHA_TOKENS_FROM=split` (shard-first, snapshot fallback): if `spec/tokens/**` exists, read shards and derive `qt`/`selector`; otherwise fall back to snapshot.

## Rollback

The entire refactor is a pure structural change with unchanged values and paths; a single revert can roll it back, see `docs/token-mapping.md` §8.

```
git revert --no-commit HEAD~6..HEAD && git commit -m "revert: rollback cha-token-refactor"
```

## References

- Mapping and refresh details: `docs/token-mapping.md` (file split table, aggregation graph, 33-row qt table, selectorFor rules).
- Design trade-offs: W3C DTCG grouping idea + vanilla Node aggregation (see `docs/token-mapping.md` §9), rejecting Style Dictionary to preserve byte-identical output.
