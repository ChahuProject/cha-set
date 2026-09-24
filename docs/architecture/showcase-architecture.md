# Showcase Living Documentation & Automated TOC Architecture

## 1. Role & System Boundaries
- **Core Role**: Provides the living documentation page infrastructure across Web (React) and Desktop (Qt Quick / QML) showcases. Manages the dual-stack documentation template (`DocLayout`), dynamic interactive sandboxes (`ComponentPreview`), props references (`PropsTable`), keyboard tables (`KeyboardShortcutsTable`), and the **Automated "On this page" Table of Contents (TOC) Scanning Engine**.
- **Scope Delineation**:
  - **In-Scope**:
    - Dual-stack living documentation layouts (`DocLayout.tsx` and `DocLayout.qml`).
    - Automated section and heading discovery ("On this page" TOC) from rendered DOM in React and item hierarchy in Qt.
    - Zero-drift title synchronization: TOC labels derive directly from actual rendered heading nodes (`h2`/`h3`/`DocText`) rather than disconnected manual string lists.
    - Direct object-target geometry mapping and zero-heuristic smooth scrolling.
    - Cross-Stack Showcase Parity Assurance System (SPAS) gate verification via `scripts/verify-showcase-parity.mjs`.
  - **Out-of-Scope**:
    - Core component internal logic (delegated to component packages).
    - Host-application documentation pipelines.

---

## 2. Core Data Flow & Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Page Content Authoring                          │
│   • React: <DocLayout title="..."> <section id="..."><h2>...</h2>      │
│   • Qt:    DocLayout { pageTitle: "..." Column { DocText { ... } } }   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│      React DOM Auto-Scanner       │ │       Qt QML Auto-Scanner        │
│ • Container ref mutation observer │ │ • Item tree children scanner     │
│ • Inspects section[id], h2, h3    │ │ • Inspects ComponentPreview,     │
│ • Extracts exact heading text     │ │   DocText (sizeTitleSm/weight),  │
│ • Resolves canonical fallbacks    │ │   KeyboardShortcutsTable, Props  │
└─────────────────┬─────────────────┘ └──────────────────┬───────────────┘
                  │                                      │
                  ▼                                      ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│    Dynamic TableOfContents.tsx    │ │      Dynamic DocLayout.qml       │
│ • "On this page" navigation links │ │ • "ON THIS PAGE" sidebar column  │
│ • IntersectionObserver highlighting││ • Real targetItem Y-axis mapping │
│ • Smooth scroll into view         │ │ • Wheel & click scroll tracking  │
└─────────────────┬─────────────────┘ └──────────────────┬───────────────┘
                  │                                      │
                  └─────────────────┬────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Parity Gate (scripts/verify-showcase-parity.mjs)        │
│   • Validates 1:1 structural & semantic parity across all 56 doc pages │
│   • Checks TOC section IDs and heading title consistency               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **React DocLayout** | [`packages/react/examples/basic/src/layout/DocLayout.tsx`](file:///D:/pengj/cha-set/packages/react/examples/basic/src/layout/DocLayout.tsx) | Page breadcrumbs, title header, copy-link button, content container, and automated TOC mounting |
| **React TOC Engine** | [`packages/react/examples/basic/src/layout/TableOfContents.tsx`](file:///D:/pengj/cha-set/packages/react/examples/basic/src/layout/TableOfContents.tsx) | `scanDocSections`, `slugToTitle`, dynamic `MutationObserver`, and `IntersectionObserver` active highlight |
| **Qt DocLayout** | [`qt/src/DocLayout.qml`](file:///D:/pengj/cha-set/qt/src/DocLayout.qml) | QML documentation shell, `scanSections()`, direct `targetItem` caching, and scroll kinematics |
| **SPAS Parity Engine** | [`scripts/verify-showcase-parity.mjs`](file:///D:/pengj/cha-set/scripts/verify-showcase-parity.mjs) | Mechanical CLI checker asserting metadata, TOC cardinality, preview code, and heading parity |
| **Living Doc Pages** | `packages/react/examples/basic/src/pages/components/`, `qt/src/` | 56+ interactive component documentation pages with zero white-screen guarantee |

---

## 4. Invariants & Usability Principles

1. **Content is Single Source of Truth**: The Table of Contents is dynamically derived from the real rendered content tree. Heading text edits automatically update the TOC without requiring manual array synchronizations.
2. **Backward Compatibility**: Pages providing explicit `tocItems` continue to render the provided list; pages omitting `tocItems` automatically benefit from dynamic zero-drift discovery.
3. **Canonical Sections Uniformity**: Standard canonical section IDs (`overview`, `installation`, `animations`, `keyboard`, `props`) normalize to the golden titles prescribed by Golden Red Line 13.
4. **Zero-Heuristic Navigation**: In Qt QML, scanned entries retain the physical `targetItem` object reference, enabling pixel-exact `mapToItem` positioning and eliminating fragile text-guessing regex.
