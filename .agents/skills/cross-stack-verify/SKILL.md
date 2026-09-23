---
name: cross-stack-verify
description: >-
  Rigorous cross-stack behavioral verification protocol for Web (React) and Desktop (Qt/QML) components. Enforces single source of truth showcase data, native desktop wheel and drag idioms, interactive test scenario execution, and the mandatory behavioral parity gate before completing any component task.
  Triggers: cross-stack, parity, verify-qt, verify-react, cross-stack-verify, test-scenario.
---

# Cross-Stack Verification & Behavioral Protocol

When developing or modifying components across React and Qt, you MUST follow this protocol to prevent regression, behavioral drift, and "superficial visual sync".

## 1. Golden Red Lines

1. **NO Half-Baked Delivery (100% 双端演示文档与路由必须就绪 — React & Qt)**
   - An Agent must NEVER stop after only implementing component core code and unit tests.
   - Every component defined in `spec/components/*.ts` MUST have:
     1. Navigation entry in `spec/showcase/navigation.json`.
     2. **Web (React)**: Living DocPage `packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx` and active route in `packages/react/examples/basic/src/App.tsx`.
     3. **Desktop (Qt/QML)**: Component `qt/src/ChaSet<Name>.qml` + DocPage `qt/src/<Name>DocPage.qml` (both registered in `qt/CMakeLists.txt`) and active route in `qt/src/Main.qml` (`getPageSource`).
   - **Mechanical Gate**: `pnpm gate` mechanically scans all component specs and enforces 100% dual-stack (React + Qt) living showcase completeness and runs headless scenario tests (`QtChaSetDemo.exe --test-scenario all`) across all routes.

2. **NO Visual-Only Delivery (禁止仅凭静态截图验收)**
   - Screenshots only verify static CSS / QML bounding boxes.
   - An Agent must NEVER declare a task done without executing behavioral tests (wheel scrolling, pointer drag, button clicks, keyboard activation).

3. **Tiered Quality Matrix Compliance (按组件层级实施针对性检验)**
   - **L1 Atomic Visual Primitives** (`button`, `scroll-area`, `tabs`, `badge`, `card`, `input`, `separator`, `checkbox`, `switch`, `slider`): Bit-exact pixel-sync mandatory (`pnpm test:pixel --component <name>`).
   - **L2 Floating Overlays**, **L3 Virtualization & Shell**, **L4 Composite Engines**: Focus on semantic token mapping, keyboard flows, 60fps virtualization kinetics, and JSON AST serialization equivalence.

4. **Mandatory Dogfooding & Showcase Self-Hosting (组件自举与演示置换红线)**
   - Whenever a new component is introduced, scan all demo layouts, headers, sidebars, and dialogs in both React and Qt.
   - All raw HTML elements, ad-hoc button implementations, custom copy scripts, mode buttons, and raw divider rectangles MUST be replaced immediately with the new ChaSet primitive (e.g. `<CopyButton>`, `<Separator>`, `<DropdownMenu>`, `<Tooltip>`, `<SegmentedControl>`, `<Badge>`).
   - In Qt QML, delegates and preview headers must similarly dogfood ChaSet primitives (`ChaSetBadge` for status/telemetry/rules, `ChaSetSegmentedControl` for mode toggles, `ChaSetSeparator` for divider lines, and `ChaSetTable` with `badge: true` for status cells).

5. **Single Source of Truth for Data (禁止双端手写重复数据)**
   - All component datasets (changelogs, feature matrices, docs hierarchy, token tables) MUST reside in `spec/showcase/*.json` or `spec/tokens/**`.
   - Run `pnpm gen:showcase` / `pnpm build:tokens` to emit synchronized artifacts. Never duplicate raw arrays in TSX and QML.

6. **Desktop Native Idiom & QML Robustness Compliance (遵循 Qt 桌面端物理交互与健壮性规约)**
   - **Wheel Events**: Qt `Flickable` on Windows ignores mouse wheels unless `WheelHandler` is attached. Always use `ChaSetScrollArea` with built-in `WheelHandler`.
   - **Drag Decoupling**: In QML, dragging `thumb` must decouple from reactive `y: computedPos` bindings during active mouse press to prevent jitter and binding destruction.
   - **Viewport Bounds**: Ensure `contentHeight` and `contentWidth` are correctly computed or bounded via `childrenRect`.
   - **Layout Attached Properties**: Never use `Layout.fillWidth` or `Layout.fillHeight` inside standard `Row` or `Column`. Only use inside `RowLayout`/`ColumnLayout` or use anchors.
   - **Signal Duplication**: Never redeclare automatic property change signals (`property string value` already generates `signal valueChanged`).
   - **Component Runtime Instantiation Gate**: Never rely merely on file existence. All 47 Qt doc pages must pass physical instantiation via `QtChaSetDemo.exe --test-scenario all` to verify zero `Component.Error`.

7. **Mandatory Color & Contrast Self-Containment (双端色彩自洽与成对配对律)**
   - Ensure all components, floating overlays, and interactive controls pair surface colors with explicit foreground text colors (`bg-background` + `text-foreground`, `bg-card` + `text-card-foreground`, `ThemeTokens.panel` + `ThemeTokens.text`). Never allow portal overlays or outline buttons to leave text colors unassigned or reliant on ambient DOM inheritance.

8. **Mandatory Keyboard Navigation & Input Modality Disambiguation (键盘交互规范与输入模态排他律)**
   - **Single Source of Truth**: Active highlight is driven strictly by `highlightedIndex` / `[data-highlighted]`. Never combine `isHighlighted || containsMouse` in QML delegates or CSS hover selectors.
   - **Zero Dual-Highlight**: Navigational keys switch modality to `'keyboard'`, immediately suppressing hover highlight under the mouse cursor. Stationary mouse events are ignored; only intentional mouse movement ($\Delta > 1\text{px}$) switches modality back to `'pointer'`.
   - **Showcase Completeness**: Every living showcase DocPage must render `<KeyboardShortcutsTable>` backed by `spec/showcase/keyboard-shortcuts.json`.

9. **Mandatory Zero-`px` Units Mandate (零 `px` 跨端度量与样式红线)**
   - **Strict Zero-`px`**: Raw `px` units are strictly forbidden across all component code, CSS classes, inline styles, doc descriptions, and properties tables.
   - **Web Scale**: Use Tailwind scale (`w-32`, `h-9`, `gap-2`, `size-8`) or rem arbitrary values (`w-[6.25rem]`, `h-[0.0625rem]`). Never use `w-[100px]`, `w-px`, or inline `${val}px`.
   - **Virtualization Spacers**: Dynamic height/width calculations in spacers must convert to rem: `${val * 0.0625}rem`.
   - **Neutral Prop Names**: Omit `Px` suffixes from props and CSS variables (`hitThickness`, `visualThickness`, `deltaAmount`, `--sidebar-width`).
   - **Docs & Descriptions**: Never write `in pixels` or `100px` in PropsTable descriptions or doc text.

10. **Mandatory Motion Token & Animation Determinism Contract (双端动效统一与测试确定性红线)**
   - **Token-driven only**: Durations (`--cs-motion-quick/short/medium`) and easings (`--cs-ease-standard/emphasized/entrance`, each with a Qt `Easing.*` counterpart) live in `spec/tokens/primitives.json` and are regenerated via `pnpm gen:css && pnpm gen:qt`. Components MUST consume them — `duration-quick`/`ease-*` utilities on React, `ThemeTokens.motion*`/`ThemeTokens.ease*` in QML. Hardcoded `duration-100/150/200`, `ease-in-out`, raw `Easing.*`, or numeric animation durations are forbidden (they silently bypass reduced-motion handling).
   - **animation-aware DocPages**: Every living DocPage MUST include an `Animations` section (React: `<section id="animations">` + `tocItems` entry; Qt: matching text block) describing motion points and the tokens used.
   - **Deterministic headless runs**: `QtChaSetDemo.exe --test-scenario all` / `--harness` / shot captures force `ThemeTokens.animationsEnabled = false` in `qt/src/Main.qml`. Every QML `Behavior` MUST gate on `ThemeTokens.animationsEnabled` (+ force/harness exclusions when those props exist); otherwise scenario assertions and pixel sampling race the animation and turn flaky.
   - **Never animate kinematics**: scroll offsets/contentY and drag positions (virtual lists, scroll areas, splitter, Rnd) must not receive `Behavior`/transition — animating these breaks the 60fps and determinism red lines.

11. **Mandatory Cascade-Layer Order & Dev-Mode Style Gate (Tailwind 层序与 dev 样式红线)**
   - **Declare the layer order first**: any library CSS entry under `packages/react/src/styles/*.css` that opens a bare `@layer <name> { ... }` block MUST declare the canonical order
     `@layer properties, theme, base, components, utilities;` **before** that block.
     Per the CSS Cascade Layers spec a layer's position is fixed by its **first appearance in the whole document**, so with `motion.css` imported before `theme.css` an undeclared `utilities` block pins utilities to the BOTTOM of the order — the `@layer base` preflight (`button { background-color: transparent; border-radius: 0 }`) then silently outranks every Tailwind utility, stripping colour, radius and borders from all components. `properties` must be included in the declaration too: it holds `* { --tw-*: initial }`, which would otherwise float to the top and reset `--tw-shadow` / `--tw-ring-*`.
   - **Verify in dev, never only in build**: `vite build` concatenates all CSS with theme.css's statement first, so this entire regression class is invisible under `build` / `preview`. Acceptance for any style-touching change MUST include a `pnpm showcase` (dev server) check that a known utility really applies, e.g. `getComputedStyle(document.querySelector('button.bg-primary'))` reports the accent colour and a non-zero `borderRadius`.
   - **Layer-ladder probe**: to prove the order, inject one colour per layer on the same selector (`@layer properties{...hotpink} @layer theme{...red} @layer base{...blue} @layer components{...green} @layer utilities{...yellow}`) — `utilities` must win. If `components` wins instead, the order is polluted.
   - **Cold-start check**: re-run the probe after `rm -rf packages/react/examples/basic/node_modules/.vite`; a warm cache can mask stylesheet-injection ordering bugs.

12. **Mandatory Mouse Cursor Semantics & Text Selectability Contract (鼠标指针语义与文本可选性红线)**
   - **Single Source of Truth Contract**: All cursor styles are codified in `spec/cursor-contract.json` mapping semantic types (`action`, `text`, `slider`, `resize-col`, `resize-row`, `window-move`, `disabled`) to Web CSS classes and Qt cursor enums.
   - **Cross-Stack Cursor Alignment**:
     - Action items (`Button`, `SplitButton`, `TabsTrigger`, `SegmentedControl`, `Checkbox`, `Switch`, `DropdownMenuItem`, `SelectTrigger`, links, pagination, clickable table rows) MUST show `cursor-pointer` (React) and `Qt.PointingHandCursor` (Qt).
     - Text inputs (`Input`, `DurationInput`, `PresetNumberInput`, `InlineEditableText`, `ReadOnlyInput`, `ColorPicker` channel/hex inputs) and code viewers (`CodeBlock`, `HighlightedCode`) MUST show `cursor-text` (React) and `Qt.IBeamCursor` (Qt).
     - Disabled controls MUST show `cursor-not-allowed` (React) and `Qt.ForbiddenCursor` (Qt). **STRICT BAN ON POINTER-EVENTS-NONE DROPPING CURSORS**: Never use bare `disabled:pointer-events-none` on interactive elements without preserving `disabled:cursor-not-allowed`, which erroneously causes mouse cursor to fall back to the default arrow.
     - Sliders: Tracks show `cursor-pointer` / `Qt.PointingHandCursor`; thumbs show `cursor-grab` (active: `cursor-grabbing`) in React and `Qt.PointingHandCursor` (pressed: `Qt.ClosedHandCursor`) in Qt.
     - Splitters: Column splitters show `cursor-col-resize` / `Qt.SizeHorCursor`; row splitters show `cursor-row-resize` / `Qt.SizeVerCursor`.
     - Window Title Bar: Drag area shows `cursor-move` / `Qt.SizeAllCursor`; action buttons show `cursor-pointer` / `Qt.PointingHandCursor`.
   - **QML Root Item Geometry Anti-Pattern & Mandatory Fix**:
     - In Qt Quick, `Row` and `Column` position items at `(x, y)` but do NOT assign width/height to unconstrained children.
     - If a root `Item` defines only `implicitWidth` / `implicitHeight` without explicitly binding `width: implicitWidth` and `height: implicitHeight`, its rendered width and height remain `0x0`.
     - Inner `MouseArea { anchors.fill: parent }` or `HoverHandler` collapses to `0x0` area, making hover cursors and clicks completely dead. Root items MUST declare:
       ```qml
       width: implicitWidth
       height: implicitHeight
       ```
   - **QML `HoverHandler` Rule**:
     - Always attach `HoverHandler { cursorShape: root.disabled ? Qt.ForbiddenCursor : (root.readOnly ? Qt.ArrowCursor : Qt.IBeamCursor) }` directly to `TextInput` / `TextEdit` items in Qt to eliminate hover occlusion from `QQuickTextInput`/`QQuickTextEdit`.
     - **PointerHandler vs Item**: `HoverHandler` is a `QQuickPointerHandler`, NOT an `Item`. NEVER assign `anchors` to it.
   - **Container Cursor Masking Anti-Pattern & Mandatory Fix (容器级光标遮罩与层级隔离红线)**:
     - When container components (`ChaSetCard`, `ChaSetDialog`, `ChaSetAlertDialog`, `ChaSetSheet`) provide interactive behaviors (e.g. `interactive: true` for clickable cards, or backdrop click-to-dismiss for modal dialogs), their internal `MouseArea` MUST be strictly guarded:
       - **Clickable cards (`ChaSetCard`)**: `visible: root.interactive` and `cursorShape: root.interactive ? Qt.PointingHandCursor : undefined`. Never leave an invisible/non-interactive `MouseArea` at the top of the scene graph with default `cursorShape: Qt.ArrowCursor`, which intercepts pointer hover and masks all child buttons, inputs, tabs, checkboxes, and segmented controls across living showcase pages.
       - **Modal dialogs & sheets (`ChaSetDialog`, `ChaSetAlertDialog`, `ChaSetSheet`)**: Internal backdrop-blocking `MouseArea` items must sit behind the card content (`z: -1`), never covering child controls.
       - **Input containers (`ChaSetInput`, `ChaSetReadOnlyInput`)**: Internal `containerClickArea` / `hoverArea` (`z: -1`) must define matching cursorShape: `cursorShape: root.disabled ? Qt.ForbiddenCursor : (root.readOnly ? Qt.ArrowCursor : Qt.IBeamCursor)`.
   - **Authentic C++ Pointer Raycasting Protocol (真实物理指针射线投射测试标准)**:
     - Unit tests inspecting isolated offscreen controls (`testBtn`, `testCheckbox`) cannot catch composite container occlusion or clipping regressions.
     - The cross-stack verification suite (`QtChaSetDemo.exe --test-scenario cursor` / `all`) executes an authentic physical pointer raycast across all 52 showcase pages:
       1. Dynamically discovers and mounts all registered showcase pages via `getAllPageIds()`.
       2. Dispatches real physical mouse movement via `QTest::mouseMove(window, scenePoint.toPoint())`.
       3. Queries `window->cursor().shape()` directly from the native OS window handle.
       4. Compares the physical window cursor shape against `spec/cursor-contract.json`.
       5. Asserts 0 discrepancies across all on-screen interactive controls.
   - **Showcase Stage & Flow Containment Standards (演示沙盒舞台与流式布局边界律)**:
     - **`ComponentPreview` Stage Height**: Default `stageHeight` is 280. For tall components (such as `ColorPicker` at 540px, or `VirtualList` at 312px), the living DocPage must declare explicit `stageHeight` (e.g. `stageHeight: root.demoMode === "popover" ? 280 : 580`) so content is not clipped by `stageContainer { clip: true }`.
     - **`Flow` vs `Row` in Showcases**: Never place an outer `Row` inside `controlsData` (`Flow`). `Flow` cannot break `Row` children, causing layout blowouts past the content column into the TOC. Direct items must omit `anchors` inside `Flow`.
     - **Closed Popover Card Lazy Loading**: Popovers (`ChaSetColorPicker`, `ChaSetSelect`) must use lazy loading (`Loader { active: root.mode === "popover" && colorPopup.visible }`) or `visible: false` rather than `opacity: 0.0` or always-active loaders to prevent phantom hit testing and cursor collisions from closed dialogs.
     - **Test Viewport Reset**: Any kinematic tests (such as mouse drag on scrollbars) must reset `flickable->setProperty("contentY", 0.0)` at the end of the test so subsequent tests and raycasts operate from the canonical top-of-page coordinate space.
   - **Text Selectability & Clipboard Integrity**: Code viewers (`CodeBlock`, `HighlightedCode`) MUST support multi-line drag selection (`selectByMouse: true`) and `Ctrl+C` copying, while line numbers reside in a separate non-selectable gutter (`ArrowCursor`).

13. **Mandatory Dual-Stack Showcase Structural, Semantic & Code Authenticity Contract (SPAS — 双端演示文档结构、元数据与代码保真度全景规约)**
   - **Single Source of Truth for Metadata**: Showcase page titles, categories, and descriptions MUST strictly mirror `spec/showcase/navigation.json`. React `<DocLayout title=...>` and Qt `DocLayout { pageTitle: ... }` must display the official component name. Never displace component titles with sandbox-specific preview card text.
   - **Canonical Table of Contents (TOC) Standard**: Every DocPage on React and Qt MUST define the identical 5 canonical sections with identical anchor IDs:
     1. `overview`: **Interactive Overview** (strict ban on legacy `preview` / `Interactive Preview`)
     2. `installation`: **Installation**
     3. `animations`: **Animations** (motion tokens, transitions, reduced motion per Red Line 10)
     4. `keyboard`: **Keyboard Navigation** (backed by `spec/showcase/keyboard-shortcuts.json`)
     5. `props`: **Props Reference** (strict ban on legacy `api` / `API Reference`)
   - **Authentic Code Snippet Contract**: Qt's `ComponentPreview` `reactCode` property MUST contain authentic, valid React JSX conforming to the real ChaSet React component API. Speculative, invalid, or hallucinated React JSX in QML is strictly forbidden.
   - **Sandbox Equivalence**: Sandbox layouts, pane titles, mock items, badge calculations, and reset actions MUST match 1:1 between React and Qt showcases.
   - **Multi-Example Cardinality & Sequence Parity (多示例强等价律)**: Every interactive example (`ComponentPreview`) in React MUST have an identical counterpart in Qt. `ComponentPreview` count (`previews.length`), sequence, and preview titles (`title="..."`) MUST match 1:1 bit-for-bit across stacks.
   - **Section & Sub-Anchor Parity (子示例章节与锚点对齐律)**: When a DocPage introduces multiple example sections (e.g. `nested`, `playground`, `variants`, `vertical`), those section IDs and headings MUST be reflected identically in the Table of Contents (`tocItems`) and page structure on both React and Qt.
   - **Automated Verification**: Run `pnpm check:showcase` (or `pnpm check:showcase --component <name>`) and `pnpm gate` (Stage 2.5) to mechanically enforce structural, multi-example, and code parity.

14. **Mandatory Unified Theme Configuration Contract (统一主题配置入口与边界契约律)**
   - **Single Theme Configuration Entry**: Cross-stack theme configuration across ChaSet consumers MUST be unified through ChaSet's `<ThemeSettings>` (React) and `ChaSetThemeSettings` (Qt QML).
   - **Host-Only Isolation**: Host-only settings MUST NOT leak into the shared ThemeSettings component or schema.
   - **Automated Boundary Gate**: `pnpm check:theme-boundary` mechanically enforces that only covered axes (mode, palette, decoration, typography, uiScale) exist in the neutral schema.

15. **Mandatory Zero-Emoji Mandate & Pure-Vector Icon Conformance (严禁使用 Emoji 与纯矢量图标契约红线)**
   - Never use Unicode emojis in component code, showcase pages, demo datasets, documentation, scripts, or commit messages.
   - All visual icons must use pure-vector representations: SVG icon components from `packages/react/src/lib/icons.tsx` on React, and `ChaSetIcon` / `ChaSetStatusIcon` on Qt Quick.
   - Mechanically enforced via `pnpm check:no-emoji` and `pnpm gate`.

16. **Mandatory High-DPI & UI Scaling Parity Contract (跨端界面缩放体系与 ThemeTokens.dp 强制律 — 禁止非缩放物理像素)**
   - Desktop Qt Quick does NOT scale raw pixel coordinates when `ThemeTokens.uiScale` changes. All geometric dimensions in ChaSet Qt components (`implicitHeight`, `implicitWidth`, `height`, `width`, `radius`, `spacing`, `padding`, `headerHeight`, `rowHeight`, `boxSize`, `estimateSize`, `itemHeight`, `thumbThickness`, `expandedThumbThickness`, `hitThickness`, `buttonLength`) MUST be scaled via `ThemeTokens.dp(val)` or `ThemeTokens.sp(val)` / `Typography.*`. Raw unscaled numbers > 2 are strictly forbidden.
   - 0, 1, and 2 represent hairlines/borders and remain unscaled integer literals (`border.width: 1`). Any geometry dimension exceeding 2 MUST be wrapped in `ThemeTokens.dp(...)`.
   - Public component property interfaces accept unscaled logical units (`rowHeight: 36`, `size: 16`); component internals calculate `ThemeTokens.dp(rowHeight)` (callers must NEVER pass `ThemeTokens.dp` to prevent double-scaling).
   - All vector icons (`ChaSetIcon`, `ChaSetStatusIcon`) MUST scale strictly according to `ThemeTokens.dp(size)`.
   - Interactive sandbox containers (`ComponentPreview`, `TabsDocPage`) must never use fixed unscaled heights that clip components under high zoom.
   - Mechanically enforced via static linter `pnpm check:scaling` (`scripts/check-qt-scaling.mjs`) and headless runtime scenario (`QtChaSetDemo.exe --test-scenario uiscale`), both embedded directly in `pnpm gate`.

## 2. Verification Commands Checklist

Before declaring any component task complete, execute:

```bash
# 1. Regenerate tokens & showcase datasets (if contracts or tokens modified)
pnpm build:tokens

# 2. Run showcase parity assurance system (SPAS)
pnpm check:showcase

# 3. Check UI scaling compliance (ThemeTokens.dp) across all Qt components
pnpm check:scaling

# 3. Build Qt desktop project
#    The QML components are compiled into QtChaSetDemo.exe, so ANY edit under
#    qt/src/ requires a rebuild before the gate/pixel runs mean anything.
#    `cmake --build qt/build` alone FAILS on a cold shell: cl is not on PATH, and
#    CMake then silently picks MinGW gcc. Load the VS dev shell in the SAME
#    process that runs cmake, and pin the compiler explicitly. From the Bash
#    tool, invoke PowerShell with this block (a bare `cmd.exe /c ...` is blocked
#    by the host's command validation, and PowerShell stdout capture is
#    unreliable — redirect cmake to a log file and read that instead):
#
#   Import-Module 'C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\Microsoft.VisualStudio.DevShell.dll'
#   Enter-VsDevShell -VsInstallPath 'C:\Program Files\Microsoft Visual Studio\18\Community' -SkipAutomaticLocation -DevCmdArguments '-arch=x64 -host_arch=x64'
#   $env:PATH = 'D:\pengj\qt\6.10.1\msvc2022_64\bin;' + $env:PATH
#   cmake -S qt -B qt/build -G Ninja -DCMAKE_PREFIX_PATH='D:\pengj\qt\6.10.1\msvc2022_64' -DCMAKE_C_COMPILER=cl -DCMAKE_CXX_COMPILER=cl *> $env:TEMP\chaset-qt-build.log
#   cmake --build qt/build *>> $env:TEMP\chaset-qt-build.log
#
#   An incremental rebuild of one ChaSet*.qml is ~10-20s (qmlcache recompile +
#   relink), so repeat build/capture cycles during a pixel investigation are cheap.

# 4. Run full React test suite & cursor conformance
pnpm test
pnpm --filter @chahu/cha-set exec vitest run src/__tests__/cursor-conformance.test.tsx

# 5. Run full cross-stack behavioral, cursor & showcase gate
# (Checks capability coverage, 100% showcase docs completeness for every component, SPAS parity, and Qt scenarios)
pnpm gate

# 6. Run targeted Qt cursor & behavioral scenarios
.\qt\build\QtChaSetDemo.exe --test-scenario cursor
.\qt\build\QtChaSetDemo.exe --test-scenario all

# 7. (For L1 Atomic Primitives) Run targeted bit-exact pixel-sync
pnpm test:pixel --component <name>
# `code-block` is a text-dense case: it asserts line pitch geometrically rather
# than by mismatch rate (see .agents/skills/pixel-sync). Report a `Line Pitch`
# column of `<react>px/<qt>px`; aligned renders print `17/17px ok`.
# OR run all L1 components:
pnpm gate:pixel

# 7. Interactive Cursor & Text Selection Verification
# - Verify hover over input boxes, text fields, and code blocks displays IBeamCursor / cursor-text
# - Verify clicking margins/padding of input containers focuses the input
# - Verify code blocks allow multi-line drag selection without selecting line numbers
# - Verify disabled controls display ForbiddenCursor / cursor-not-allowed
```

### Known-red check: `--test-scenario all` pointer raycasting

On this machine the *Pointer Raycasting* scenario inside `QtChaSetDemo.exe --test-scenario all`
fails with ~12-14 cursor discrepancies (pages `color-picker`, `theme-tuner`,
`splitter-handle`, `sidebar`), each reporting `got window cursor 0`. It also
varies run to run (776/777 controls, 12/14 discrepancies), so it is environment-
dependent rather than deterministic — the window cursor is never updated for
those items.

`pnpm gate` runs this scenario as step 3 and `process.exit(1)`s there, which
means gate steps 4 and 5 (React showcase pages, cursor conformance) **never run**.
Do not treat a red `pnpm gate` as your regression until you have ruled this out:

1. Run the failing suite directly and compare against a pristine build — back your
   files up first, since `git checkout --` / `git stash` are the destructive part:
   `cp qt/src/Main.qml $TEMP/Main.qml.mine` then
   `git show HEAD:qt/src/Main.qml > qt/src/Main.qml`, rebuild, run
   `--test-scenario all`, copy your file back and rebuild.
2. Normalise the output before diffing, because QML auto-numbers type instances
   (`ChaSetSlider_QMLTYPE_116` vs `_103`) and those numbers shift whenever the QML
   type registry changes — that is noise, not a regression:
   `sed 's/_QMLTYPE_[0-9]*//; s/_QML_[0-9]*//g'`
3. Re-run gate steps 4 and 5 by hand:
   `pnpm --filter @chahu/cha-set exec vitest run src/__tests__/showcase-parity.test.tsx src/__tests__/showcase-pages.test.tsx src/__tests__/showcase-sidebar.test.tsx src/__tests__/cursor-conformance.test.tsx`

