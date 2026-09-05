---
name: add-component
description: >-
  Standard operating procedure for introducing a new cross-stack component (React + Qt/QML) with single-source-of-truth API contract, earned capability conformance, scientific pixel synchronization, and showcase/documentation integration. Use when adding, implementing, or scaffolding a new UI component, or when the user mentions "add component", "new component", "新增组件", or "添加组件".
  Triggers: add-component, new-component, create-component, 新增组件, 添加组件.
---

# Cross-Stack Component Engineering Pipeline (React Web & Qt Desktop)

When adding a new UI component to `cha-set`, you MUST adhere to this rigorous, multi-phase engineering protocol. No component is considered complete without passing both architectural conformance and scientific pixel synchronization.

---

## 1. Golden Rules for New Components

1. **Single Source of Truth First**: Never write React TSX or Qt QML before formalizing the API contract in `spec/components/<name>.ts` and capability declarations in `spec/capabilities.json`.
2. **Zero-Variance Visual Parity**: Every component variant, size, and interactive state (idle, hover, active, disabled) must achieve bit-exact or scientific pixel alignment (spatial diff $\le 0.20\%$, surface color $\Delta E = 0.0$).
3. **No Native Fallbacks in Showcases**: When a component is added to ChaSet, all corresponding native HTML tags (e.g. `<button>`, `<span>` pills, `<input>`) or ad-hoc QML elements in all demo pages and modal dialogs MUST be migrated to the new component.
4. **Mandatory Dual Gate Verification**: Both `pnpm gate` (behavioral/capability contract) and `pnpm test:pixel --component <name>` (bit-exact rendering) must pass before committing.

---

## 2. The 7-Phase Component Lifecycle

```
[Phase 1: Spec Contract]
      ↓
[Phase 2: React Component & Tests]
      ↓
[Phase 3: Qt Quick Component & CMake]
      ↓
[Phase 4: Behavioral Parity Gate]
      ↓
[Phase 5: Scientific Pixel Sync]
      ↓
[Phase 6: Docs Page & Showcase Migration]
      ↓
[Phase 7: Pre-Response Commit Gate]
```

---

### Phase 1: Neutral Contract & Capabilities Specification

1. **Define Zod Contract**:
   Create `spec/components/<name>.ts`:
   ```ts
   import { z } from 'zod';

   export const <name>VariantSchema = z.enum(['default', 'secondary', 'destructive', 'outline']);
   export const <name>Schema = z.object({
     variant: <name>VariantSchema.default('default'),
     disabled: z.boolean().default(false),
   });

   export type <Name>Api = z.infer<typeof <name>Schema>;
   ```
2. **Export in Spec Package**:
   Update `spec/package.json` to expose `"./<name>": "./components/<name>.ts"`.
3. **Declare Capabilities**:
   Update `spec/capabilities.json` under `"components.<name>"` with atomic capabilities (`must` vs `should`):
   - e.g. `variant`, `size`, `styling`, `disabled`, `keyboard`.
4. **Initialize Conformance Snapshots**:
   Register initial capability flags in `packages/react/conformance/coverage.json` and `qt/conformance/coverage.json`.

---

### Phase 2: React Implementation & Vitest Suites

1. **Component Implementation**:
   Create `packages/react/src/<name>/<Name>.tsx`:
   - Follow Tailwind CSS v4 styling matching tokens (`--primary`, `--secondary`, `--border`, `--radius`).
   - Support `forceHover` and `forceActive` boolean props to allow deterministic headless screenshot capture.
   - Support `asChild` (via `@base-ui/react` or Slot) where applicable.
2. **Module Exports**:
   - `packages/react/src/<name>/index.ts`: export components and types.
   - `packages/react/src/index.ts`: re-export `export * from './<name>';`.
3. **Behavioral Unit Tests**:
   Create `packages/react/src/<name>/<Name>.test.tsx`:
   - Test default render, variant classes, custom classNames, click events, disabled state.
4. **Contract Conformance Test**:
   Create `packages/react/conformance/<name>.conformance.test.tsx`:
   - Verify that `<Name>` props satisfy `spec/components/<name>.ts`.
   - Assert that earned capabilities in `coverage.json` evaluate to `true`.

---

### Phase 3: Qt Quick / QML Desktop Implementation

1. **QML Component**:
   Create `qt/src/ChaSet<Name>.qml`:
   - Bind colors and radiuses to `ThemeTokens` (`ThemeTokens.accent`, `ThemeTokens.panel`, `ThemeTokens.border`, `ThemeTokens.text`).
   - Implement `forceHover` and `forceActive` test hooks.
   - Adhere to desktop interaction conventions (smooth hover cursors, keyboard focus rings).
2. **Register in CMake**:
   Update `qt/CMakeLists.txt`:
   - Add `src/ChaSet<Name>.qml` under `qt_add_qml_module(ChaSet ...)`.
   - Add `src/ChaSet<Name>.qml` under `qt_add_executable(QtChaSetDemo ...)`.
3. **Register Offscreen Test Harness**:
   - Update `qt/src/main.cpp` to parse `--harness <name>` CLI arguments and expose them as context properties.
   - Update `qt/src/Main.qml` to mount `<Name>` within the offscreen snapshot harness when `--harness <name>` is provided.

---

### Phase 4: Behavioral Parity Gate

1. **Rebuild & Verify**:
   ```bash
   cmake --build qt/build
   pnpm --filter @chahu/cha-set test
   pnpm gate
   ```
2. Ensure `gate/parity.mjs` outputs `[gate] OK — all must capabilities covered`.

---

### Phase 5: Scientific Pixel-Level Synchronization

1. **Add Test Matrix in `scripts/pixel-sync-test.mjs`**:
   - Define `<name>Matrix` covering all variants, sizes, interactive states (idle, hover, active), and dark theme.
   - Use the zero-variance Unicode Middle Dot (`·`, U+00B7) benchmark label for any text nodes to eliminate OS font rasterization artifacts.
   - Set spatial diff thresholds: `maxDiff: 0.20` for standard boxes, $\Delta E \le 4.0$ (or $0.0$ for solid fills).
2. **Add React Test Harness in `packages/react/examples/basic/src/App.tsx`**:
   - Handle `harness === '<name>'` with isolated minimal container, parsing `variant`, `state`, `theme`, `disabled`.
3. **Execute Verification**:
   ```bash
   pnpm test:pixel --component <name>
   ```
   Inspect `.pixel-diff/report.html` to confirm 100% PASS with green indicators.
4. **Update Skill Documentation**:
   - Add `<name>` to `.agents/skills/pixel-sync/SKILL.md` supported list.

---

### Phase 6: Showcase, Documentation & Migration

1. **React Documentation Page**:
   - Create `packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx`.
   - Use `ComponentPreview`, `CodeBlock`, and `PropsTable`.
2. **Qt Documentation Page**:
   - Create `qt/src/<Name>DocPage.qml` with 1:1 identical layout, controls, and preview.
   - Register `<Name>DocPage.qml` in `qt/CMakeLists.txt` and `qt/src/Main.qml`.
3. **Navigation & Router**:
   - Add navigation item under `"Components"` in `packages/react/examples/basic/src/types/navigation.ts`.
   - Update `packages/react/examples/basic/src/App.tsx` router.
   - Update `CommandSearchModal.tsx` and `qt/src/CommandSearchModal.qml` search indexes.
4. **Full Demo Codebase Migration**:
   - Scan all demo pages, layouts, and dialogs (`Header`, `Sidebar`, `ComponentPreview`, `ExportModal`, `CommandSearchModal`, `ThemeTuner`).
   - Replace any raw HTML tags or ad-hoc QML shapes with the new component.

---

### Phase 7: Verification Checklist & Commit Gate

1. Verify all suites pass:
   ```bash
   pnpm build
   pnpm --filter @chaset/example-react-button build
   cmake --build qt/build
   pnpm test
   pnpm gate
   pnpm test:pixel --component all
   ```
2. Split commits cleanly per Conventional Commits:
   - `feat(<name>): implement cross-stack <name> component with spec and conformance`
   - `test(<name>): add pixel-sync verification matrix and harness`
   - `refactor(examples): migrate showcase pages to ChaSet <Name>`
3. Run `git push origin main` and confirm working tree is clean.
