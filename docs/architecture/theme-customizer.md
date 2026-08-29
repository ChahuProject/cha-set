# Theme Customizer & Component Workbench Architecture

## 1. Role & System Boundaries
- **Core Role**: Provides an interactive developer workbench and preview studio across React and Qt stacks. Allows real-time tuning of design tokens (colors, radii, typography), instant visual feedback across all component variants, and one-click export of ready-to-use theme configurations and component code.
- **Scope Delineation**:
  - **In-Scope**:
    - Interactive token editing (light/dark mode, accent themes, custom color pickers, radius/size sliders).
    - Live component matrix and interactive sandbox previewing all props and states.
    - Code generator & exporter for CSS custom properties, Tailwind v4 `@theme`, React JSX, and Qt QML overrides.
    - Dual-stack consistency between React Showcase and Qt Showcase.
  - **Out-of-Scope**:
    - Persisting theme overrides into remote database (stores locally in `localStorage` or session).

---

## 2. Core Data Flow & Interactive Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Theme Configurator / Token Tuner               │
│  • Mode Toggle (Light / Dark)                               │
│  • Accent Theme Presets (slate, red, orange, blue, etc.)    │
│  • Custom Token Overrides (Primary, Accent, Radius, etc.)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ React State & Dynamic CSS Injection / QML Properties
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Live Component Gallery                      │
│  • Full Component Matrix (Variants × Sizes × States)        │
│  • Interactive Playground (Live prop toggles & edits)       │
│  • Palette Swatches with real-time computed values          │
└──────────────────────────────┬──────────────────────────────┘
                               │ User clicks "Copy Config"
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               One-Click Export / Copy Modal                 │
│  • CSS Custom Properties Block (:root / .dark)              │
│  • Tailwind CSS v4 @theme inline Block                      │
│  • React Component Usage Snippet                            │
│  • Qt / QML Theme Configuration Snippet                     │
│  • Spec Token Delta JSON                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **React Studio App** | [`packages/react/examples/basic/src/App.tsx`](file:///D:/pengj/cha-set/packages/react/examples/basic/src/App.tsx) | Theme state coordinator, layout, dynamic CSS variable injector |
| **Token Tuner Panel** | `packages/react/examples/basic/src/components/ThemeTuner.tsx` | Color pickers, radius sliders, preset selectors |
| **Interactive Sandbox** | `packages/react/examples/basic/src/components/ComponentPlayground.tsx` | Live customizable component preview with JSX generator |
| **Code Exporter Modal** | `packages/react/examples/basic/src/components/ExportModal.tsx` | Formats and copies CSS vars, Tailwind, JSX, QML |
| **Qt Showcase App** | [`qt/src/Main.qml`](file:///D:/pengj/cha-set/qt/src/Main.qml) | Qt Quick workbench with live theme toggles, button matrix, and export view |
| **Qt Showcase Runner** | [`scripts/run-qt-showcase.mjs`](file:///D:/pengj/cha-set/scripts/run-qt-showcase.mjs) | Auto-discovers Qt 6, configures/builds CMake target, and spawns demo binary |

---

## 4. Invariants & Usability Principles

1. **Instant Feedback**: Every token adjustment in the tuner must immediately reflect on the rendered components without page reload.
2. **Copy-Paste Ready**: Code generated in the export panel must be 100% syntactically valid and ready to drop directly into a consumer application.
3. **Cross-Stack Synchrony**: Token naming and semantic hierarchy in both React and Qt showcase tools must strictly match `spec/tokens.json`.
