# Table of Contents (TOC) Architecture Specification

## 1. Role & System Boundaries
- **Core Role**: Provides a pure, universal cross-stack table of contents / anchor navigation component (`TableOfContents` in React and `ChaSetTableOfContents` in Qt QML). It visualizes hierarchical document outlines as a multi-level tree with active indicators, supports dynamic top offsets for global banners/headers, and manages keyboard and cursor interactions.
- **Scope Delineation**:
  - **In-Scope (Handled by this module)**:
    - Pure presentation of hierarchical outline data (`TocItem[]` with `level`/`depth` and nested `children`).
    - Multi-level tree display with visual branch guide lines (tree tracks), depth-based indentation, and active item indicators.
    - Banner & top offset awareness (`topOffset` / `targetOffset`) preventing obstruction by announcement bars or dynamic sticky headers.
    - Keyboard navigation (spatial Arrow traversal, Home/End, Enter/Space activation) and input modality tracking.
    - Semantic cursor conformance (`cursor-pointer` / `Qt.PointingHandCursor`) and dual-stack color contrast pairing.
  - **Out-of-Scope (Delegated externally)**:
    - DOM querying, element inspection, or QML item hierarchy crawling (`scanDocSections`, `MutationObserver`).
    - Scroll spying / intersection detection (`IntersectionObserver`).
    - URL hash writing and history manipulation (`window.location.hash`).
    - Page-specific heading fallback heuristics or document scanning logic. All input data is passed to the component as props/properties.

---

## 2. Core Data Flow & Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Data Source / Host Application                       │
│    • Static outline data, AST heading extractor, or doc layout scanner │
│    • Tracks active section ID (via IntersectionObserver or scroll)    │
│    • Measures top announcement banner + header offset                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ props: { items, activeId, topOffset, targetOffset, onSelect }
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 TableOfContents Component (React & Qt)                 │
│                                                                        │
│   1. Data Normalization:                                               │
│      • Flattens or traverses nested tree nodes with computed depths    │
│      • Resolves active branch hierarchy                                │
│                                                                        │
│   2. Geometry & Offset Adaptation:                                     │
│      • Applies topOffset for sticky positioning / container placement  │
│      • Decouples from viewport fixed top-14 / 100vh assumptions        │
│                                                                        │
│   3. Tree View & Track Rendering:                                      │
│      • Renders tree guide track (border-l)                             │
│      • Renders active indicator pill/marker at active node             │
│      • Indents items proportionally to their level/depth               │
│                                                                        │
│   4. Interaction & Dispatch:                                           │
│      • Click / Tap / Enter / Space triggers onSelect(item)             │
│      • Smooth scroll execution with targetOffset banner compensation   │
│      • Keyboard spatial navigation cycles through items                │
└────────────────────────────────────────────────────────────────────────┘
```

### Concurrency & State Model
- **Controlled & Uncontrolled State**: The component supports controlled `activeId` (passed from the host/scanner) and uncontrolled internal selection when interacted with.
- **Input Modality**: Follows the strict modality state machine (Golden Red Line 10). Keyboard arrow keys claim focus and suppress hover states; pointer moves restore pointer hover claim.

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **API Contract & Schema** | [`spec/components/table-of-contents.ts`](file:///Z:/chahu/cha-set-a/spec/components/table-of-contents.ts) | Neutral Zod schema defining `TocItem`, `TableOfContentsProps`, tree types, and offsets |
| **Capabilities Manifest** | [`spec/capabilities.json`](file:///Z:/chahu/cha-set-a/spec/capabilities.json) | Declares atomic capabilities (`tree`, `active-indicator`, `banner-offset`, `keyboard`, `selection`) |
| **React Implementation** | [`packages/react/src/table-of-contents/`](file:///Z:/chahu/cha-set-a/packages/react/src/table-of-contents/) | Pure React component `<TableOfContents>` with tree indentation, track line, and offset adaptation |
| **Qt Implementation** | [`qt/src/ChaSetTableOfContents.qml`](file:///Z:/chahu/cha-set-a/qt/src/ChaSetTableOfContents.qml) | Qt Quick / QML component with tree repeater, smooth active indicator, and scaling via `ThemeTokens.dp` |
| **Showcase Living Docs** | `packages/react/examples/basic/src/pages/components/TableOfContentsDocPage.tsx`, `qt/src/TableOfContentsDocPage.qml` | Interactive dual-stack documentation with variant playground, tree scenarios, and banner offset simulation |
| **Dogfooding Consumers** | `packages/react/examples/basic/src/layout/DocLayout.tsx`, `qt/src/DocLayout.qml` | Replaces custom/ad-hoc TOC columns with official `<TableOfContents>` / `ChaSetTableOfContents` |

---

## 4. Invariants & Forbidden Anti-Patterns

1. **Pure Presentation Decoupling**: The component must NEVER contain DOM scraping (`querySelectorAll`, `MutationObserver`), viewport scroll spying (`IntersectionObserver`), or URL hash mutation. All outline data and active state are provided externally.
2. **Banner & Top Offset Accommodation**: Hardcoded viewport assumptions (`h-[calc(100vh-3.5rem)]`, `top-14`, fixed pixel top offsets) are strictly forbidden. The component must size relative to its parent container or respect configurable `topOffset` / `targetOffset` to ensure announcement banners never obscure navigation or scroll targets.
3. **Multi-Level Tree Hierarchy**: The component must render headings as a visual tree with level-based indentation and an active branch guide line, not as a flat one-dimensional text list.
4. **Single Source of Truth for Visual Highlight**: Visual active highlighting must be driven exclusively by a single active index/ID. Combining hover and keyboard focus with boolean OR is strictly forbidden (Golden Red Line 10).
5. **Zero-`px` Units & Strict Scaling**: In React/Tailwind, raw `px` units are banned (use semantic scale or rem units). In Qt, all dimensions exceeding 2 must be wrapped in `ThemeTokens.dp(...)`.
6. **Background-Foreground Pairing**: Any surface background color must explicitly declare its corresponding text color (Golden Red Line 8).
