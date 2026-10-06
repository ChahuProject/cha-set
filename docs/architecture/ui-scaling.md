# UI Scaling & Dimension Contract Architecture

## 1. Role & System Boundaries

- **Core Role**: Defines the cross-stack UI scaling and density multiplication architecture for ChaSet. Governs how user interface density scales dynamically via `uiScale` across Web (React) and Desktop (Qt Quick / QML), establishes single-source-of-truth ownership for dimension calculations, and guarantees scale linearity while preventing double-scaling blowouts.
- **Scope Delineation**:
  - **In-Scope (Handled by this system)**:
    - Neutral density multiplier contract (`uiScale`, range 0.75 - 2.0).
    - Web root typography rem baseline scaling (`html.style.fontSize = 16 * uiScale`).
    - Qt vector density functions (`ThemeTokens.dp(val)`, `ThemeTokens.sp(val)`, `Typography.size*`).
    - Component API dimension prop contracts (logical units vs rendered physical pixels).
    - Double-scaling static analysis gates and runtime scale linearity verification.
  - **Out-of-Scope (Delegated externally)**:
    - OS display server hardware DPI scaling (managed by operating system compositor and Qt Quick window drivers).
    - Arbitrary user-agent zoom gestures (`Ctrl + Plus/Minus` in browsers).

---

## 2. Core Data Flow & Lifecycle

### 2.1 Density Multiplier Topology

```
┌─────────────────────────────────────────────────────────────┐
│              Theme Config / Scale Trigger                   │
│             uiScale: 0.75 | 1.0 | 1.25 | 1.5 | 2.0          │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼ Web                           ▼ Desktop (Qt Quick)
┌──────────────────────────────┐ ┌────────────────────────────┐
│ Root Font Scaling            │ │ Reactive Singleton Binding │
│ html.fontSize = 16 * uiScale │ │ ThemeTokens.uiScale = val  │
│ --cs-ui-scale = val          │ │ ThemeTokens.dp(val)        │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│ React Components             │ │ Qt Components              │
│ • Props receive raw numbers  │ │ • Props receive raw numbers│
│   e.g. itemWidth={120}       │ │   e.g. itemWidth: 120      │
│ • Converted to rem internally│ │ • Scaled internally via    │
│   `itemWidth * 0.0625rem`    │ │   `effectiveItemWidth:     │
│                              │ │    ThemeTokens.dp(...)`    │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Rendered Output Invariant                   │
│            Dimension_scaled / Dimension_1.0 == uiScale      │
│                 (Strict Linear Scaling)                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component API Prop Dimension Contract (Axiom)

To maintain 100% conceptual parity between React and Qt:

1. **Public Props Accept Unscaled Logical Design Units**:
   - All spatial dimension and radius properties exposed by `ChaSet*` components (e.g. `itemWidth`, `customRadius`, `hitThickness`, `rowHeight`, `gutterSize`, `iconSize`, `padding`, `topPadding`) accept **unscaled logical units (DP / numbers)**.
   - Example: `<SegmentedControl itemWidth={120} />` in React, and `ChaSetSegmentedControl { itemWidth: 120 }` in Qt.
2. **Internal Component Scaling Ownership**:
   - The component implementation is solely responsible for converting the logical unit into scaled pixels.
   - In Qt, the component declares:
     ```qml
     property real itemWidth: 0
     readonly property real effectiveItemWidth: itemWidth > 0 ? ThemeTokens.dp(itemWidth) : 0
     ```
     or
     ```qml
     property int customRadius: 8
     readonly property int effectiveRadius: ThemeTokens.dp(customRadius)
     ```
   - All internal layout calculations and geometry bindings reference the `effective*` property.
3. **Double-Scaling Anti-Pattern (Strictly Forbidden)**:
   - Callers MUST NEVER pass `ThemeTokens.dp(...)` to an internally scaled component property.
   - Writing `ChaSetSegmentedControl { itemWidth: ThemeTokens.dp(120) }` causes the width to scale as $120 \times (\text{uiScale})^2$, causing quadratic blowout on zoom in and quadratic shrinkage on zoom out.
   - Monitored internally-scaled properties (`INTERNALLY_SCALED_PROPS` in `scripts/check-qt-scaling.mjs`):
     `customRadius`, `itemWidth`, `rowHeight`, `headerHeight`, `gutterSize`, `hitThickness`, `handleThickness`, `cellWidth`, `cellHeight`, `estimateSize`, `sideMargin`, `contentLeftMargin`, `contentRightMargin`, `customSheetSize`, `sidebarWidth`, `iconWidth`, `sideOffset`, `menuWidth`, `popoverWidth`, `popoverHeight`.
4. **Native Container Elements**:
   - Native Qt Quick containers without ChaSet wrappers (e.g. `Column.spacing`, `Row.spacing`, `Rectangle.radius`, `anchors.margins`) do not have internal scaling, and therefore MUST be wrapped in `ThemeTokens.dp(...)`.

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **Token Specification** | [`spec/tokens/primitives.json`](file:///D:/pengj/cha-set/spec/tokens/primitives.json) | Base typography and spacing tokens |
| **Qt Token Generator** | [`spec/generators/generate-qt.mjs`](file:///D:/pengj/cha-set/spec/generators/generate-qt.mjs) | Generates `ThemeTokens.generated.qml` with `uiScale`, `dp()`, `sp()` |
| **React Dimension Gate** | [`scripts/check-ui-scale-dimensions.mjs`](file:///D:/pengj/cha-set/scripts/check-ui-scale-dimensions.mjs) | Validates React DOM metrics are not multiplied by `0.0625rem` |
| **Qt Scaling Linter Gate** | [`scripts/check-qt-scaling.mjs`](file:///D:/pengj/cha-set/scripts/check-qt-scaling.mjs) | Validates Qt components and detects double-scaling invocations |
| **Runtime Linearity Gate** | [`qt/src/Main.qml`](file:///D:/pengj/cha-set/qt/src/Main.qml) | Scenario 6 (`uiscale`) asserts dynamic linear scaling ratio ($W_2 / W_1 == 2.0$) |
| **Parity Gate Pipeline** | [`gate/parity.mjs`](file:///D:/pengj/cha-set/gate/parity.mjs) | Orchestrates static checks and runtime headless scenarios in CI |

---

## 4. Invariants & Forbidden Anti-Patterns

1. **Scale Linearity Invariant**:
   For any geometric dimension $D$ at scale $S$, the rendered dimension must satisfy:
   $$\left|\frac{D(S)}{D(1.0)} - S\right| \le \epsilon \quad (\epsilon \approx 0.05)$$
   Quadratic scaling ($S^2$) or unscaled rigidity ($S^0$) violates the invariant.
2. **Component Props Are Logical Units**:
   All component-level dimension props accept raw numbers. External callers must never pass pre-scaled `ThemeTokens.dp(...)` to properties that the component scales internally.
3. **Reactive Re-Evaluation**:
   In Qt, internal scaling bindings MUST react dynamically to `ThemeTokens.uiScale`. Initializing properties with static expressions without reactive bindings is forbidden.
4. **No Runtime DOM rem Multiplication in React**:
   In React, runtime measured values (`offsetWidth`, `getBoundingClientRect`, `virtualItem.start`) already include the root font scale. They must not be multiplied by `0.0625rem`.
