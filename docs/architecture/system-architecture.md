# System Architecture Specification

## 1. Role & System Boundaries
- **Core Role**: ChaSet is an open-source, cross-stack UI design system and component library. A single source of truth (`spec/`) drives multiple platform implementations (React on Web, Qt Quick / QML on Desktop).
- **Scope Delineation**:
  - **In-Scope (Handled by this module)**:
    - Design tokens (colors, typography, spacing, motion, radius) defined in platform-neutral shards (`spec/tokens/**`).
    - Multi-stack artifact generation (CSS custom properties for Web, C++ headers & QML singletons for Qt).
    - Neutral component API contracts (`spec/components/*.ts`) and capabilities manifests (`spec/capabilities.json`).
    - Reference and production implementations for target stacks (`packages/react` for Web, `qt/` for Qt Quick).
    - Cross-stack parity enforcement gate (`gate/parity.mjs`).
    - Interactive theme configurator and component preview showcase.
  - **Out-of-Scope (Delegated externally)**:
    - Host-application-specific business logic or state management.
    - Runtime network/IPC communication protocols (handled by host applications).

---

## 2. Core Data Flow & Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    spec/tokens/** (Shards)                  │
│  (meta, primitives, semantic/*, composite/*, themes/*)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ pnpm gen:tokens (sha256-gated)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      spec/tokens.json                       │
│                  (Committed Single Source)                  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼ pnpm gen:css                  ▼ pnpm gen:qt
┌──────────────────────────────┐ ┌────────────────────────────┐
│   Web Artifacts (CSS Vars)   │ │ Qt Artifacts (C++ / QML)   │
│   • packages/react/tokens.css│ │ • qt/include/ChaSet/*.h    │
│   • dist/.../tokens.css      │ │ • qt/src/ThemeTokens.qml   │
│                              │ │ • ChaSet 1.0 QML Module    │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│    React Implementation      │ │     Qt Implementation      │
│  • @chahu/cha-set (Base UI)  │ │  • ChaSetScrollBar / Button │
│  • Conformance Coverage      │ │  • Conformance Coverage    │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             gate/parity.mjs (CI Parity Gate)                │
│    Verifies all "must" capabilities across every stack      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **Spec & Design Tokens** | [`spec/`](file:///D:/pengj/cha-set/spec/) | Source-of-truth tokens shards, snapshot builder, validators, and generators |
| **Component Contracts** | [`spec/components/`](file:///D:/pengj/cha-set/spec/components/) | Zod schema contracts defining neutral props, types, and defaults |
| **Parity Gate** | [`gate/parity.mjs`](file:///D:/pengj/cha-set/gate/parity.mjs) | CI gate asserting earned capability coverage across all active stacks |
| **React Package** | [`packages/react/`](file:///D:/pengj/cha-set/packages/react/) | `@chahu/cha-set` implementation using Base UI + Tailwind CSS + CVA |
| **Qt QML Module** | [`qt/`](file:///D:/pengj/cha-set/qt/) | Qt Quick / QML module (`ChaSet 1.0`) with `ChaSetScrollBar`, `ChaSetScrollArea` (`ChaSetScrollView` alias), `ChaSetButton` |
| **Exported C++ Headers** | [`qt/include/ChaSet/`](file:///D:/pengj/cha-set/qt/include/ChaSet/) | Typed C++ headers (`theme_tokens.generated.h`) exported for host application integration |
| **Showcase & Workbench** | [`packages/react/examples/basic/`](file:///D:/pengj/cha-set/packages/react/examples/basic/), [`qt/src/Main.qml`](file:///D:/pengj/cha-set/qt/src/Main.qml) | Interactive live theme customizer, component gallery, and code exporter |

---

## 4. Invariants & Forbidden Anti-Patterns

1. **Shards are the Sole Authoritative Source**: Never manually edit `spec/tokens.json`, `tokens.generated.css`, or `ThemeTokens.generated.qml`. Always edit `spec/tokens/**` shards or `spec/qt-mapping.json` and run `pnpm gen:all`.
2. **Parity Gate Invariant**: Any capability marked as `"must"` in `spec/capabilities.json` must be earned via actual passing behavioral tests in every stack's `conformance/coverage.json`.
3. **No Unilateral Primitive Drift**: Web and Qt must resolve to identical visual tokens for shared semantic roles (e.g. `--primary`, `ThemeTokens.accent`, focus ring dimensions).
