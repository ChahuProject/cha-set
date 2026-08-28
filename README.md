# ChaSet

> Tea Set — a cross-stack UI component library. One source of truth drives multiple implementations (React now, Qt planned).

ChaSet is the UI layer of the ChahuProject family:

- **chahu** - the debugger project (the teapot)
- **cha-set** - this component library (the tea set, served to every stack)
- **cha-script** - the scripting language

## How it stays consistent across stacks

```
spec/                       single source of truth (not published)
  tokens/**                 shards, SoT (do NOT hand-edit spec/tokens.json)
    meta.json               meta + conventions
    primitives.json         primitives: space/motion/size/fontWeight
    semantic/core.json      core shadcn roles
    semantic/launcher.json  launcher-only (sidebar/chart)
    semantic/dunting.json   dunting namespaces (chrome/canvas/overlay/accent.*)
    composite/launcher.json composite surfaces ($platform: css)
    themes/axes.json        axes: mode/accentTheme/windowTint/interfaceStyle
    themes/deltas.json      deltas (30): tokens by axes, no selector
  tokens.json               committed snapshot (built from shards, sha256-gated)
  qt-mapping.json           qt derivation map: 33 colors + space/motion/size
  load-tokens.mjs           single read path (split → snapshot fallback)
  build-tokens.mjs          aggregator → tokens.json (canonical ORDER)
  token-helpers.mjs         regexes, hexToRgbf, selectorFor, fmtChannel
  validate-tokens.mjs       structural validator (CI + pre-gen check)
  components/*.ts           component API contracts (zod schemas)
  capabilities.json         capability manifest (must / should / stack-specific)
gate/parity.mjs             CI parity gate: every "must" capability must be
                            covered by every existing implementation
packages/react/             React implementation → @chahu/cha-set
qt/                         Qt reference implementation (ChaSetButton demo)
```

Token flow: edit `spec/tokens/**` shards → `pnpm gen:tokens` builds `spec/tokens.json` snapshot →
`pnpm gen:all` (css + qt) emits per-stack artifacts (CSS custom properties for web,
a C++ header + QML singleton for dt-a's ThemeManager) → committed into consumer repos.
SoT is shards, not the snapshot. See `docs/token-mapping.md` and `spec/README.md`.

## Packages

| Package | Description |
| --- | --- |
| `@chahu/cha-set` | React component library (published to npm) |
| `@chahu/spec` | Spec contracts, used internally (not published) |

## Usage

```bash
pnpm add @chahu/cha-set
```

```tsx
import { Button } from '@chahu/cha-set';
import '@chahu/cha-set/styles.css';

<Button variant="primary" size="md" loading={isSaving}>
  Save
</Button>
```

## Development

```bash
pnpm install
pnpm gen:tokens    # aggregate spec/tokens/** + spec/qt-mapping.json → spec/tokens.json (sha256-gated)
pnpm gen:css       # regenerate packages/react/src/styles/tokens.css + dist/consumers/launcher/generated/tokens.generated.css
pnpm gen:qt        # regenerate dist/consumers/dunting/generated/theme_tokens.generated.h + qt/src/ThemeTokens.generated.qml
pnpm gen:all       # gen:tokens + gen:css + gen:qt (also: pnpm gen:tokens && pnpm gen:all)
pnpm typecheck     # tsc --noEmit
pnpm test          # vitest (unit + conformance)
pnpm gate          # parity gate against spec/capabilities.json
pnpm build         # build @chahu/cha-set (esm + cjs + d.ts + css)
```

SoT is `spec/tokens/**` shards (plus `spec/qt-mapping.json` for qt derivation), not `spec/tokens.json` directly.
Edit shards, then run `pnpm gen:tokens && pnpm gen:all` and verify `git diff --exit-code` is clean before committing.
Emergency fallback `CHA_TOKENS_FROM=snapshot pnpm gen:all` reads the committed snapshot. See `spec/README.md` and `docs/token-mapping.md` §7-8.

## License

MIT