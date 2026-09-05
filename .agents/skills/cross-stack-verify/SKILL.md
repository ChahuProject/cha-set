---
name: cross-stack-verify
description: >-
  Rigorous cross-stack behavioral verification protocol for Web (React) and Desktop (Qt/QML) components. Enforces single source of truth showcase data, native desktop wheel and drag idioms, interactive test scenario execution, and the mandatory behavioral parity gate before completing any component task.
  Triggers: cross-stack, parity, verify-qt, verify-react, cross-stack-verify, test-scenario.
---

# Cross-Stack Verification & Behavioral Protocol

When developing or modifying components across React and Qt, you MUST follow this protocol to prevent regression, behavioral drift, and "superficial visual sync".

## 1. The 4 Golden Red Lines

1. **NO Visual-Only Delivery (禁止仅凭静态截图验收)**
   - Screenshots only verify static CSS / QML bounding boxes.
   - An Agent must NEVER declare a task done without executing behavioral tests (wheel scrolling, pointer drag, button clicks, keyboard activation).

2. **Single Source of Truth for Data (禁止双端手写重复数据)**
   - All component datasets (changelogs, feature matrices, docs hierarchy, token tables) MUST reside in `spec/showcase/*.json` or `spec/tokens/**`.
   - Run `pnpm gen:showcase` / `pnpm build:tokens` to emit synchronized artifacts. Never duplicate raw arrays in TSX and QML.

3. **Desktop Native Idiom Compliance (遵循 Qt 桌面端物理特性)**
   - **Wheel Events**: Qt `Flickable` on Windows ignores mouse wheels unless `WheelHandler` is attached. Always use `ChaSetScrollArea` (or `ChaSetScrollView` alias) with built-in `WheelHandler`.
   - **Drag Decoupling**: In QML, dragging `thumb` must decouple from reactive `y: computedPos` bindings during active mouse press to prevent jitter and binding destruction.
   - **Viewport Bounds**: Ensure `contentHeight` and `contentWidth` are correctly computed or bounded via `childrenRect`.

4. **Mandatory Behavioral Parity Gate Execution (全量门禁必须全绿)**
   - Run `pnpm gate` which executes:
     - 24 capability checks across Web and Qt.
     - Headless native Qt scenario tests (`QtChaSetDemo.exe --test-scenario all`).
     - React Vitest behavioral test suite.

## 2. Verification Commands Checklist

Before declaring any component task complete, execute:

```bash
# 1. Regenerate tokens & showcase datasets
pnpm build:tokens

# 2. Build Qt project
cmake --build qt/build

# 3. Run Qt scenario driver
qt/build/QtChaSetDemo.exe --test-scenario all

# 4. Run React test suite
pnpm --filter @chahu/cha-set test

# 5. Run full cross-stack behavioral gate
pnpm gate
```
