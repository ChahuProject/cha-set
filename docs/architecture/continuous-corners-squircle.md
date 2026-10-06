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
