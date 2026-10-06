# Continuous Curvature (Squircle) Architecture & Global Adoption Guide

> **Authoritative Specification & Implementation Guide**: Single source of truth for iOS-style continuous corner curvature (G2 continuity superellipse) across the React (Web) and Qt (Desktop) stacks in `cha-set`.

---

## 1. Mathematical Background & Design Rationale

### 1.1 The Limitation of Traditional Circular Arcs (G1 Continuity)
In traditional UI rendering (CSS `border-radius` and standard Qt `Rectangle { radius: ... }`), rounded corners are constructed by appending a 90-degree circular arc tangentially to the straight edges:
- **G0 Continuity (Position)**: Continuous.
- **G1 Continuity (Tangent / Angle)**: Continuous — the tangent vectors match at the connection point.
- **G2 Continuity (Curvature)**: **Discontinuous**. The curvature along the straight edge is zero ($\kappa = 0$), but jumps instantaneously to $1/R$ at the exact tangent point where the circle begins.

This abrupt curvature jump causes the human visual cortex to perceive an optical "seam" or sharp crease (Mach banding effect) at the tangent transition, making corners appear mechanically stamped rather than naturally shaped.

### 1.2 Continuous Curvature (Squircle / G2 Continuity)
A squircle (superellipse) transitions curvature continuously from zero at the flat edge up to peak curvature at the corner's apex, and smoothly back to zero on the orthogonal edge:
- **No optical creases**: Straight edges flow seamlessly into curves without visible transition points.
- **Apple iOS Standard**: Apple introduced continuous corners across iOS, iPadOS, and macOS hardware and software, with a curvature smoothing factor of approximately $s = 0.6$ (60%).
- **12-Segment Cubic Bézier Construction**: Each corner is constructed using three cubic Bézier curve segments (total 12 segments for the full shape) to achieve $G2$ continuity while executing efficiently on modern rasterizers.

---

## 2. Dual-Stack Architecture

### 2.1 Design Tokens (`spec/tokens.json` & `ThemeTokens`)
Curvature configuration is unified in the design tokens:
- `--cs-corner-shape` / `ThemeTokens.cornerShape`: `"squircle"`
- `--cs-corner-smoothing` / `ThemeTokens.cornerSmoothing`: `0.6` (Apple standard)

### 2.2 Web (React) Stack Strategy
Web rendering employs a **two-tier progressive enhancement** strategy:

1. **Native CSS Acceleration (Tier 1)**:
   For browsers supporting CSS Borders Level 4 `corner-shape`:
   ```css
   @supports (corner-shape: squircle) {
     *, ::before, ::after {
       corner-shape: squircle;
     }
     .rounded-full,
     [data-shape="round"] {
       corner-shape: round;
     }
   }
   ```
2. **Dynamic SVG Clip-Path Fallback (Tier 2)**:
   For browsers without native `corner-shape` support (e.g. Safari, Firefox, older Chromium), `<Squircle>` calculates exact cubic Bézier paths matching the dimensions via `ResizeObserver`, applying dynamic SVG `<clipPath>` or CSS `clipPath: path(...)` and rendering box-sizing compliant borders.

### 2.3 Desktop (Qt / QML) Stack Strategy
- Native C++ `ChaSetSquircle` (registered as both `ChaSetSquircleBase` and `ChaSetSmoothRectangle`) inheriting `QQuickPaintedItem`.
- `ChaSetSquircle.qml` wraps the base component, binding `cornerSmoothing: ThemeTokens.cornerSmoothing`.
- Provides 100% property compatibility with Qt `Rectangle` (`radius`, `color`, `border.color`, `border.width`), plus independent corner radii (`topLeftRadius`, etc.) and side toggles (`roundLeft`, `roundRight`).

---

## 3. Global Adoption Guide for Host Projects

### 3.1 Adopting in React / Web Applications

#### Step 1: Enable Global CSS Continuous Corners
Add the following rules to your project's root stylesheet (e.g., `globals.css` or `index.css`):
```css
/* Enable iOS continuous curvature for all elements with border-radius */
@supports (corner-shape: squircle) {
  *, ::before, ::after {
    corner-shape: squircle;
  }

  /* Preserve pure circular geometry for pills and circles */
  .rounded-full,
  [data-shape="round"] {
    corner-shape: round;
  }
}
```

#### Step 2: Use `<Squircle>` for Guaranteed Cross-Browser Parity
For key visual containers, dialogs, cards, or hero elements where exact continuous curvature must render across all browsers:
```tsx
import { Squircle } from '@chahu/cha-set';

export function MyCard({ title, children }) {
  return (
    <Squircle
      radius={16}
      smoothing={0.6}
      borderWidth={1}
      borderColor="var(--border)"
      className="bg-card text-card-foreground p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2">{children}</div>
    </Squircle>
  );
}
```

---

### 3.2 Adopting in Qt / QML Desktop Applications

#### Step 1: Link the ChaSet QML Module
In your `CMakeLists.txt`:
```cmake
find_package(ChaSet REQUIRED) # Or include via FetchContent / add_subdirectory
target_link_libraries(my_desktop_app PRIVATE ChaSetPlugin)
```

#### Step 2: Use `ChaSetSquircle` in Place of `Rectangle`
`ChaSetSquircle` is an API drop-in replacement for `Rectangle`. Replace container and control backgrounds with `ChaSetSquircle`:
```qml
import QtQuick 6.10
import ChaSet 1.0

ChaSetSquircle {
    width: 320
    height: 180
    radius: ThemeTokens.dp(16)
    // cornerSmoothing defaults to ThemeTokens.cornerSmoothing (0.6)
    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1

    // Selective side rounding (e.g., segmented controls or docked panels)
    roundLeft: true
    roundRight: false

    Text {
        anchors.centerIn: parent
        text: "Continuous Curvature Panel"
        color: ThemeTokens.text
    }
}
```

#### Step 3: Global Theme Configuration
Ensure `ThemeTokens.cornerSmoothing` is configured in your theme manager:
```qml
// In your custom ThemeManager or theme singleton:
readonly property real cornerSmoothing: 0.6 // 0.0 (circle) -> 1.0 (full squircle)
```

---

## 4. Concentric Corner Radii Architecture (同心圆角几何体系)

### 4.1 Micro-Curvature vs. Macro-Geometry: Complementary Harmony
A frequent misconception is that continuous curvature (Squircle) and concentric corner radii (同心圆角) are competing concepts. In truth, they operate at two distinct, complementary dimensional layers:
- **Micro-Curvature (Squircle / G2 Continuity)**: Governs the **derivative continuity along a single perimeter curve**, eliminating the optical crease (Mach banding) between flat edges and corner arcs.
- **Macro-Geometry (Concentricity / Equidistant Offset)**: Governs the **spatial relationship between nested boundaries**, maintaining uniform spacing between an outer container and its inner child elements.

Apple's design system across iOS and macOS uses both simultaneously: an outer squircle container with padding contains an inner squircle element whose corner radius is precisely offset.

### 4.2 The Mathematical Concentric Radius Law
When an outer container with radius $R_{outer}$ and internal padding $P$ contains an inner element (active pill indicator, selected item background, menu item hover/active highlight), the inner corner radius $R_{inner}$ **MUST** obey:

$$R_{inner} = \max(0, R_{outer} - P)$$

#### Why This Law Holds:
1. **Shared Center of Curvature**:
   The outer curve begins at offset $(R_{outer}, R_{outer})$ from the outer corner. The inner element begins at offset $(P, P)$. By setting $R_{inner} = R_{outer} - P$, the inner curve's center is located at:
   $$(P + R_{inner}, P + R_{inner}) = (P + R_{outer} - P, P + R_{outer} - P) = (R_{outer}, R_{outer})$$
   Because both curves share the **exact same center**, the distance between the inner and outer curves is constant ($P$) at every single angle $\theta \in [0, \pi/2]$ along the arc!
2. **Visual Pinch Elimination**:
   If an inner item uses an arbitrary radius (e.g. $R_{outer} = 8\text{px}$, $P = 4\text{px}$, but $R_{inner} = 6\text{px}$), the corner gap narrows from $4\text{px}$ down to $8 - 6 = 2\text{px}$ at the 45-degree diagonal. The inner corner bulges out toward the container boundary, producing an unsightly visual pinch.
3. **Natural Degeneration**:
   When padding $P \ge R_{outer}$, the formula yields $R_{inner} = 0$. The inner corners naturally flatten to sharp 90-degree corners because the padding fully absorbs the outer curve.

### 4.3 Dual-Stack Implementation Contract

#### Web (React) Implementation
The ChaSet radius token scale derives from `--radius` (default `0.5rem` = 8px):
- `--radius-lg`: `0.5rem` (8px)
- `--radius-md`: `0.375rem` (6px)
- `--radius-sm`: `0.25rem` (4px)
- `--radius-xs`: `0.125rem` (2px)

Standard concentric pairings in ChaSet:
| Component | Outer Radius | Padding | Inner Radius Formula | React Class Pairing |
| :--- | :--- | :--- | :--- | :--- |
| `SegmentedControl` (default/lg) | 8px (`rounded-lg`) | 2px (`p-0.5`) | $8 - 2 = 6\text{px}$ | `rounded-lg p-0.5` + `rounded-md` |
| `SegmentedControl` (sm) | 6px (`rounded-md`) | 2px (`p-0.5`) | $6 - 2 = 4\text{px}$ | `rounded-md p-0.5` + `rounded-sm` |
| `Tabs` (default) | 8px (`rounded-lg`) | 4px (`p-1`) | $8 - 4 = 4\text{px}$ | `rounded-lg p-1` + `rounded-sm` |
| `Tabs` (sm) | 6px (`rounded-md`) | 2px (`p-0.5`) | $6 - 2 = 4\text{px}$ | `rounded-md p-0.5` + `rounded-sm` |
| `DropdownMenu` | 8px (`rounded-lg`) | 4px (`p-1`) | $8 - 4 = 4\text{px}$ | `rounded-lg p-1` + `rounded-sm` |
| `ContextMenu` | 8px (`rounded-lg`) | 4px (`p-1`) | $8 - 4 = 4\text{px}$ | `rounded-lg p-1` + `rounded-sm` |
| `Select` | 8px (`rounded-lg`) | 4px (`p-1`) | $8 - 4 = 4\text{px}$ | `rounded-lg p-1` + `rounded-sm` |

#### Desktop (Qt / QML) Implementation
The Qt singleton `ThemeTokens` exposes the canonical concentric helper:
```qml
function innerRadius(outerRadius, padding) {
    return Math.max(0, outerRadius - padding);
}
```
Components bind inner delegates and indicator pills reactively:
```qml
ChaSetSquircle {
    id: pillIndicator
    radius: ThemeTokens.innerRadius(root.effectiveRadius, root.effectivePadding)
}
```

### 4.4 Automated Mechanical Parity Gate (`check:concentric`)
Concentricity is not left to human discretion or manual inspection. ChaSet enforces it automatically through `scripts/check-concentric-radii.mjs`, wired directly into `pnpm gate` (Step 2.14):
1. **Contract Verification**: Mechanically asserts that all audited nested components declare and compute radii matching $R_{inner} = \max(0, R_{outer} - P)$.
2. **Static AST Anti-Pattern Scanner**: Scans component source code to detect any container with `rounded-lg` and `p-1` where an inner item inadvertently uses `rounded-md` instead of `rounded-sm`.
3. **Self-Test Validation**: Executes guard verification prior to code scans, ensuring any potential regressions fail loud immediately.

Run the concentric check anytime via:
```bash
pnpm check:concentric
```
