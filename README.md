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

Token flow: edit `spec/tokens/**` shards → `just gen-tokens` builds `spec/tokens.json` snapshot →
`just gen-all` (css + qt) emits per-stack artifacts (CSS custom properties for web,
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

<Button variant="default" size="default" loading={isSaving}>
  Save
</Button>
```

## Component Showcase & Theme Studio

ChaSet includes an interactive **Studio & Theme Customizer** for both React and Qt. It allows real-time token tuning (light/dark mode, accent colors, custom radii, fine-grained color overrides), full component matrix inspection, and **one-click copy of ready-to-use configuration and component code**.

### 1. Launch React Studio (Web)

```bash
just react
```
Open `http://localhost:5173` in your browser to:
- **Tweak live styles**: Test custom primary colors, border radii, and accent presets.
- **Interactive Component Playground**: Toggle `variant`, `size`, `loading`, `disabled`, `fullWidth`, or Base UI polymorphic `render` props.
- **One-click Copy & Export**: Copy ready-to-use CSS Variables, Tailwind v4 `@theme`, React JSX, or JSON token configs directly.

### 2. Launch Qt Showcase (Desktop)

One-command automatic build and launch:
```bash
just qt
```

Or run with hot-reload development mode:
```bash
just qt --hot
```

---

## Development & Workflows

```bash
pnpm install       # install node dependencies
just react         # start interactive React studio & theme customizer
just qt            # launch desktop Qt showcase (or just qt --hot)
just gen           # regenerate all derived assets (tokens, css, qt, highlight, icons)
just typecheck     # TypeScript check
just test          # vitest unit & conformance tests
just gate          # full contract & parity gate
just build react   # build @chahu/cha-set library
just build qt      # build desktop Qt showcase binary
```

---

## Architecture Documentation

All system architecture and design specifications are cataloged under [`docs/architecture/README.md`](docs/architecture/README.md):

- [`System Architecture Specification`](docs/architecture/system-architecture.md) — Cross-stack architecture and SoT topology.
- [`Token Pipeline Specification`](docs/architecture/token-pipeline.md) — Shard aggregation, derivation, and consumer sync.
- [`Component Contracts & Parity Gate`](docs/architecture/component-contracts.md) — Neutral Zod contracts, capability matrix, and gate enforcement.
- [`Theme Customizer & Studio Workbench`](docs/architecture/theme-customizer.md) — Dual-stack theme configurator and code exporter architecture.

---

## License

MIT