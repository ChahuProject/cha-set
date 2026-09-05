# Scroll Area & ScrollBar Architecture Specification

> **Authority Level**: [Authoritative Specification]  
> **Scope**: Platform-neutral specifications, desktop platform idioms, and runtime kinematics for ScrollArea and ScrollBar across Web (React @chahu/cha-set) and Desktop (Qt Quick ChaSetScrollBar, ChaSetScrollView).

---

## 1. Role & System Boundaries

- **Core Role**: Provides robust, accessible, and high-performance viewport scrolling with visual scrollbars. Guarantees 100% behavioral parity between React web applications and Qt native desktop applications.
- **Scope Delineation**:
  - **In-Scope**:
    - Platform-neutral component contracts and behavior invariants.
    - Zero-latency direct-follow scroll kinematics (no interpolation or position tweening lag).
    - Lifecycle-aware auto-hide when content does not overflow the viewport.
    - Desktop platform idioms: dual-end stepper buttons (with auto-repeat), track runway boundary isolation, expandable hit zones, and native mouse wheel handling.
    - Dual-mode theme adaptation (consumes host theme tokens if available, falls back to built-in ThemeTokens).
  - **Out-of-Scope**:
    - Application-level business scrolling logic (e.g. infinite feed pagination, virtual list windowing algorithms).
    - Platform window scrollbars managed outside QML or DOM containers.

---

## 2. Core Invariants & Desktop Platform Idioms

To ensure desktop-grade ergonomics and cross-stack parity, all implementations MUST satisfy the following invariants:

### 2.1 Zero-Latency Direct-Follow Kinematics (No Position Tweens)
- **Rule**: Never apply position transitions or smoothing animations (e.g., CSS 	ransition: top/transform or QML Behavior on y/position) to the scrollbar thumb position.
- **Rationale**: Any artificial tweening on thumb position introduces a floating, disconnected "laggy" sensation during mouse wheel scrolling or track navigation. The thumb position must be an immediate, deterministic projection of the viewport scroll offset.
- **Permitted Motion**: Visual-only dimension and opacity transitions (e.g. thumb width expanding on hover, color fades) are encouraged, provided they do not delay position tracking.

### 2.2 Auto-Hide Lifecycle When Content Fits
- **Rule**: When content dimensions fit entirely within the viewport (!hasOverflow), the scrollbar must be automatically hidden and disabled (policy: ScrollBar.AsNeeded).
- **Web Implementation**: Dual ResizeObserver monitors both the viewport and content containers. When content does not overflow, the scrollbar root unmounts from the DOM (or receives hidden / display: none), freeing the area from intercepting pointer clicks.
- **Desktop (Qt) Implementation**: ChaSetScrollBar sets isible: false and nabled: false when !hasOverflow, completely relinquishing pointer event handling to underlying elements.

### 2.3 Desktop Stepper Buttons & Auto-Repeat
- **Rule**: Desktop scrollbars must provide stepper buttons at both ends (To-Start / Page-Back at the top/left, Page-Forward / To-End at the bottom/right).
- **Auto-Repeat Timing**:
  - **Initial Delay**: 400ms.
  - **Repeat Interval**: 100ms.
- **Tooltips**: Buttons must provide localized tooltips (e.g., "到顶", "向上翻一页", "向下翻一页", "到底").

### 2.4 Track Runway Margin & Hit Isolation
- **Rule**: The thumb's travel distance is strictly confined to the "runway" between the stepper buttons.
- **Kinematic Invariant**:
  - Runway Length = Total Length - (Button Count * Button Length)
  - Thumb Position = Start Offset + (Relative Position * (Runway Length - Thumb Length))
- **Track Clicks**: Clicking on the track background must never be intercepted or distorted by stepper button boundaries. Track clicks trigger page-wise or coordinate jumps cleanly within the remaining runway.

### 2.5 Expandable Interaction Hot Zone
- **Resting State**: Subtle visual footprint (	humbThickness: 6px, transparent background).
- **Active State**: When hovered or pressed, the background illuminates (hitThickness: 14px) and the thumb expands smoothly (xpandedThumbThickness: 10px, duration 120ms) to ensure comfortable targeting and dragging.
- **Minimum Thumb Length**: Clamped to minThumbLength: 30px to guarantee clickability even in extremely large documents.

### 2.6 Native Desktop Wheel Handling
- **Rule**: Desktop scrollable views must use ChaSetScrollView with native WheelHandler.
- **Rationale**: On Qt Quick, default Flickable does not handle desktop mouse wheel events reliably. ChaSetScrollView wraps native wheel handling with configurable scroll step sizes.

### 2.7 Dual-Mode Adaptive Theme Source
- **Rule**: Components must gracefully adapt to their hosting environment without hardcoded theme couplings.
- **Pattern**:
  `qml
  // Prioritize host-provided theme context property; fallback to ChaSet built-in ThemeTokens
  readonly property var _themeSource: (typeof theme !== "undefined" && theme !== null) ? theme : ThemeTokens
  readonly property color _accent: _themeSource.accent
  readonly property color _subduedText: _themeSource.subduedText
  readonly property color _panelRaised: _themeSource.panelRaised
  `

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding Path | Responsibilities |
| :--- | :--- | :--- |
| **React ScrollArea** | [packages/react/src/scroll-area/ScrollArea.tsx](file:///D:/pengj/cha-set/packages/react/src/scroll-area/ScrollArea.tsx) | Base UI wrapper, dual ResizeObserver, overflow detection |
| **React ScrollBar** | [packages/react/src/scroll-area/ScrollBar.tsx](file:///D:/pengj/cha-set/packages/react/src/scroll-area/ScrollBar.tsx) | Web scrollbar, stepper buttons, auto-repeat, track margin isolation |
| **Qt ScrollBar** | [qt/src/ChaSetScrollBar.qml](file:///D:/pengj/cha-set/qt/src/ChaSetScrollBar.qml) | Native Quick Controls 2 ScrollBar with desktop thickness, steppers, and auto-hide |
| **Qt ScrollView** | [qt/src/ChaSetScrollView.qml](file:///D:/pengj/cha-set/qt/src/ChaSetScrollView.qml) | ScrollView with WheelHandler and attached ChaSetScrollBar |
| **Verification Gate** | [gate/parity.mjs](file:///D:/pengj/cha-set/gate/parity.mjs) | Validates scroll kinematics, drag tracking, and stepper actions |

---

## 4. Invariants & Forbidden Anti-Patterns

1. **NO Position Animations**: Never add easing or duration animations to scrollbar thumb coordinates (x, y, position, 	op, left).
2. **NO Visual-Only Parity**: Never declare scrollbar parity based solely on static screenshots. Interactive verification (wheel scrolling, synthetic drag kinematics, boundary clamps) is mandatory.
3. **NO Zombie Hit Boxes**: Scrollbars must never intercept mouse clicks when content fits without overflow.
4. **NO Hardcoded Presets in View Code**: Color and sizing values must originate from theme tokens, never hardcoded hex literals.
