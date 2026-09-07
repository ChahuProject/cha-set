---
name: cross-stack-verify
description: >-
  Rigorous cross-stack behavioral verification protocol for Web (React) and Desktop (Qt/QML) components. Enforces single source of truth showcase data, native desktop wheel and drag idioms, interactive test scenario execution, and the mandatory behavioral parity gate before completing any component task.
  Triggers: cross-stack, parity, verify-qt, verify-react, cross-stack-verify, test-scenario.
---

# Cross-Stack Verification & Behavioral Protocol

When developing or modifying components across React and Qt, you MUST follow this protocol to prevent regression, behavioral drift, and "superficial visual sync".

## 1. The 5 Golden Red Lines

1. **NO Half-Baked Delivery (100% 演示文档与路由必须就绪)**
   - An Agent must NEVER stop after only implementing component core code and unit tests.
   - Every component defined in `spec/components/*.ts` MUST have:
     1. Navigation entry in `spec/showcase/navigation.json`.
     2. Living DocPage `packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx` with interactive preview and props table.
     3. Active routing registered in `packages/react/examples/basic/src/App.tsx`.
   - **Mechanical Gate**: `pnpm gate` mechanically scans all component specs and aborts if living documentation is incomplete.

2. **NO Visual-Only Delivery (禁止仅凭静态截图验收)**
   - Screenshots only verify static CSS / QML bounding boxes.
   - An Agent must NEVER declare a task done without executing behavioral tests (wheel scrolling, pointer drag, button clicks, keyboard activation).

3. **Tiered Quality Matrix Compliance (按组件层级实施针对性检验)**
   - **L1 Atomic Visual Primitives** (`button`, `scroll-area`, `tabs`, `badge`, `card`, `input`, `separator`, `checkbox`, `switch`, `slider`): Bit-exact pixel-sync mandatory (`pnpm test:pixel --component <name>`).
   - **L2 Floating Overlays**, **L3 Virtualization & Shell**, **L4 Composite Engines**: Focus on semantic token mapping, keyboard flows, 60fps virtualization kinetics, and JSON AST serialization equivalence.

4. **Mandatory Dogfooding & Showcase Self-Hosting (组件自举与演示置换红线)**
   - Whenever a new component is introduced, scan all demo layouts, headers, sidebars, and dialogs in both React and Qt.
   - All raw HTML elements, ad-hoc button implementations, custom copy scripts, and raw divider rectangles MUST be replaced immediately with the new ChaSet primitive (e.g. `<CopyButton>`, `<Separator>`, `<DropdownMenu>`, `<Tooltip>`).

5. **Single Source of Truth for Data (禁止双端手写重复数据)**
   - All component datasets (changelogs, feature matrices, docs hierarchy, token tables) MUST reside in `spec/showcase/*.json` or `spec/tokens/**`.
   - Run `pnpm gen:showcase` / `pnpm build:tokens` to emit synchronized artifacts. Never duplicate raw arrays in TSX and QML.

6. **Desktop Native Idiom Compliance (遵循 Qt 桌面端物理特性)**
   - **Wheel Events**: Qt `Flickable` on Windows ignores mouse wheels unless `WheelHandler` is attached. Always use `ChaSetScrollArea` with built-in `WheelHandler`.
   - **Drag Decoupling**: In QML, dragging `thumb` must decouple from reactive `y: computedPos` bindings during active mouse press to prevent jitter and binding destruction.
   - **Viewport Bounds**: Ensure `contentHeight` and `contentWidth` are correctly computed or bounded via `childrenRect`.

## 2. Verification Commands Checklist

Before declaring any component task complete, execute:

```bash
# 1. Regenerate tokens & showcase datasets
pnpm build:tokens

# 2. Build Qt project
cmake --build qt/build

# 3. Run React test suite
pnpm --filter @chahu/cha-set test

# 4. Run full cross-stack behavioral & showcase gate
# (Checks 242+ capabilities, 100% showcase docs completeness, and Qt scenarios)
pnpm gate

# 5. (For L1 Atomic Primitives) Run targeted bit-exact pixel-sync
pnpm test:pixel --component <name>
# OR run all L1 components:
pnpm gate:pixel
```
