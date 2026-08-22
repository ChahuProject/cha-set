# ChaSet

> 茶具 — a cross-stack UI component library. One source of truth drives multiple implementations (React now, Qt planned).

ChaSet is the UI layer of the ChahuProject family:

- **chahu** — the debugger project (the teapot)
- **cha-set** — this component library (the tea set, served to every stack)
- **cha-script** — the scripting language

## How it stays consistent across stacks

```
spec/                       single source of truth (not published)
  tokens.json               design tokens → generated CSS (React) / QSS+QPalette (Qt)
  components/*.ts           component API contracts (zod schemas)
  capabilities.json         capability manifest (must / should / stack-specific)
gate/parity.mjs             CI parity gate: every "must" capability must be
                            covered by every existing implementation
packages/react/             React implementation → @chahu/cha-set
qt/                         Qt implementation (planned)
```

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
pnpm gen:css       # regenerate packages/react/src/styles/tokens.css from spec/tokens.json
pnpm typecheck     # tsc --noEmit
pnpm test          # vitest (unit + conformance)
pnpm gate          # parity gate against spec/capabilities.json
pnpm build         # build @chahu/cha-set (esm + cjs + d.ts + css)
```

## License

MIT