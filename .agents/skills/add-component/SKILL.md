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
2. **100% Dual-Stack Living Showcase Coverage Mandate (双端全量演示与路由零盲区)**: Every component MUST have:
   - Registration in `spec/showcase/navigation.json` under its group.
   - **Web (React)**:
     - Dedicated living doc page `packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx` with interactive preview, variant playground, code snippets, and token reference.
     - Active route and page rendering wired into `packages/react/examples/basic/src/App.tsx`.
   - **Desktop (Qt/QML)**:
     - Component implementation `qt/src/ChaSet<Name>.qml` registered in `qt/CMakeLists.txt` (`ChaSet` module).
     - Living doc page `qt/src/<Name>DocPage.qml` registered in `qt/CMakeLists.txt` (`QtChaSetDemo` module).
     - Route mapping in `qt/src/Main.qml` (`getPageSource`).
   - **Mechanical Gate**: `pnpm gate` mechanically scans all `spec/components/*.ts` schemas and halts with a hard error if any component lacks living documentation or route mapping on either React or Qt.
3. **Tiered Quality Defense Matrix**:
   - **L1 Atomic Visual Primitives** (`button`, `scroll-area`, `tabs`, `badge`, `card`, `input`, `separator`, `checkbox`, `switch`, `slider`): **MANDATORY Bit-Exact Pixel-Sync** (`pnpm test:pixel --component <name>`). Spatial diff $\le 0.20\%$, surface color $\Delta E \le 4.0$ (solid fill $\Delta E = 0.0$).
   - **L2 Floating Overlays**, **L3 Desktop Virtualization**, and **L4 Composite Engines**: Token conformance, keyboard navigation flows, 60fps virtualization kinetics, and JSON AST serialization round-trips.
4. **Mandatory Dogfooding & Showcase Migration (零原生标签与全量自举)**: When a component is added to ChaSet, an Agent MUST immediately scan all demo pages, layouts, and dialogs (`packages/react/examples/basic/src/` and `qt/src/`). All corresponding native HTML tags, ad-hoc SVG button implementations (e.g. manual clipboard copying, raw divider lines, hardcoded tooltip wrappers), or ad-hoc QML elements MUST be migrated to the new component. No raw HTML tags or ad-hoc custom implementations are permitted in the showcase when ChaSet provides that primitive.
5. **Mandatory Gate Verification**: Run `pnpm gate` which verifies capabilities, Living Showcase completeness, and headless Qt scenario tests. For L1 components, also verify `pnpm test:pixel --component <name>`.
6. **Mandatory Color & Contrast Self-Containment (色彩自洽与背景前景成对配对律)**:
   - Any component, variant, or floating overlay declaring a background surface (`bg-background`, `bg-card`, `bg-popover`, `bg-primary`, `bg-secondary`, `bg-muted`, etc.) MUST explicitly pair it with the corresponding text token (`text-foreground`, `text-card-foreground`, `text-popover-foreground`, `ThemeTokens.text`, etc.).
   - Portal overlays (`AlertDialog`, `Dialog`, `Sheet`, `Popover`, `Tooltip`) MUST NEVER rely on host CSS inheritance for text colors (in dark mode, unassigned text falls back to user-agent black `rgb(0,0,0)`, creating invisible black-on-black text).
   - Controls with background fills (such as `outline` button variants, select triggers, search bars) must declare `text-foreground` in their default resting state, not only on hover.

---

## 2. The 7-Phase Component Lifecycle

```
[Phase 1: Spec Contract & Capabilities]
      ↓
[Phase 2: React Component & Tests]
      ↓
[Phase 3: Qt Quick Component & CMake]
      ↓
[Phase 4: Behavioral Parity Gate]
      ↓
[Phase 5: Tiered Verification (L1 Pixel-Sync / L2-L4 Scenarios)]
      ↓
[Phase 6: 100% Living Showcase DocPage & Migration]
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
   - Pair surface colors with explicit text tokens (`bg-background` -> `text-foreground`, `bg-card` -> `text-card-foreground`, etc.). Never leave text colors reliant on DOM inheritance.
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

### Phase 5: Tiered Verification (L1 Pixel-Sync / L2–L4 Scenarios)

#### A. For L1 Atomic Visual Primitives (MANDATORY Bit-Exact Pixel-Sync)
> Scope: `button`, `scroll-area`, `tabs`, `badge`, `card`, `input`, `separator`, `checkbox`, `switch`, `slider`.

1. **Add Test Matrix in `scripts/pixel-sync-test.mjs`**:
   - Define `<name>Matrix` covering all variants, sizes, interactive states (idle, hover, active), and dark theme.
   - Use the zero-variance Unicode Middle Dot (`·`, U+00B7) benchmark label for any text nodes to eliminate OS font rasterization artifacts.
   - Set spatial diff thresholds: `maxDiff: 0.20` for standard boxes, $\Delta E \le 4.0$ (or $0.0$ for solid fills).
2. **Add React Test Harness in `packages/react/examples/basic/src/App.tsx`**:
   - Handle `harness === '<name>'` with isolated minimal container, parsing `variant`, `state`, `theme`, `disabled`.
3. **Add Qt Test Harness in `qt/src/Main.qml`**:
   - Add `<Name>` mount block when `harnessMode === '<name>'`.
4. **Execute Verification**:
   ```bash
   pnpm test:pixel --component <name>
   ```
   Inspect `.pixel-diff/report.html` to confirm 100% PASS with green indicators.
5. **Update Skill Documentation**:
   - Add `<name>` to `.agents/skills/pixel-sync/SKILL.md` supported list.

#### B. For L2 Floating Overlays, L3 Virtualization & L4 Composite Engines
> Scope: Popovers, Dialogs, Virtual Trees/Grids, Splitter, WindowTitleBar, DataTable, QueryBuilder.
- Do NOT perform full-screen static pixel diffs (floating window coordinates and dynamic scroll offsets cause false positive diffs across OS window managers).
- Verify:
  1. Token conformance (verify background/border CSS classes and QML ThemeTokens).
  2. Keyboard interactions (Esc to dismiss, Arrow keys for traversal, Enter/Space for activation).
  3. Boundary clipping and kinematic decoupling (for virtual lists and splitters).
  4. AST JSON round-trip serialization (for data tables and query builders).

---

### Phase 6: Showcase, Living Documentation & Migration (100% MANDATORY)

> [!IMPORTANT]
> **Zero Blindspots**: An Agent is strictly forbidden from finishing a task without creating the living showcase documentation. `pnpm gate` mechanically enforces this rule and will fail if skipped!

1. **React Living DocPage Component**:
   - Create `packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx`.
   - Incorporate:
     - Header with title, badge, and description.
     - Interactive `ComponentPreview` with live preview and controls.
     - Variant showcase section.
     - Clean TSX / QML `CodeBlock` examples.
     - Complete `PropsTable`.
2. **Qt Living DocPage Component & Main Route**:
   - Create `qt/src/<Name>DocPage.qml` with interactive preview, variant controls, code blocks, and props table.
   - Register `qt/src/<Name>DocPage.qml` in `qt/CMakeLists.txt` under `QtChaSetDemo` `QML_FILES`.
   - Register `qt/src/ChaSet<Name>.qml` in `qt/CMakeLists.txt` under `ChaSet` `QML_FILES`.
   - Add route mapping in `qt/src/Main.qml` (`getPageSource`).
   - **QML Robustness Red Lines**:
     - Never use `Layout.fillWidth` or `Layout.fillHeight` inside standard `Row` or `Column` (use anchors or `RowLayout`).
     - Never declare duplicate signals for existing properties (e.g. `property string value` already generates `signal valueChanged`).
     - In delegates, explicitly declare `required property int index` if `index` is referenced.
     - Run `.\qt\build\QtChaSetDemo.exe --test-scenario all` to physically verify component compilation and instantiation with 0 errors.
3. **Showcase Navigation Registration**:
   - Add navigation entry to `spec/showcase/navigation.json` under its category:
     ```json
     { "id": "<name>", "title": "<Display Name>", "href": "#/components/<name>", "desc": "<Short Description>" }
     ```
   - Run `node spec/generators/generate-showcase-data.mjs` to regenerate `qt/src/ShowcaseData.generated.qml`.
4. **Application Routing Registration**:
   - In `packages/react/examples/basic/src/App.tsx`:
     - Import `<Name>DocPage`.
     - Add `case '#/components/<name>': return <<Name>DocPage />;` in `renderActivePage()`.
5. **Full Demo Dogfooding & Migration**:
   - Scan showcase layouts and dialogs (`Header`, `Sidebar`, `ComponentPreview`, `ExportModal`, `CommandSearchModal`, `ThemeTuner`).
   - Replace any raw HTML tags (e.g. `<button>`, `<input>`, `<span>` pills) with the newly created ChaSet component.

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
