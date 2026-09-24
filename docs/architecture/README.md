# ChaSet Architecture & Core Specification Index

> **AI / Developer Guide**: This file is the **sole authoritative architecture index** for `cha-set`.
> Before starting new features, cross-stack adjustments, or complex modifications, consult the relevant documents for your domain.
> Items marked `[Authoritative Specification]` must be strictly followed; `[Design & Implementation]` guides concrete code.

---

## 1. Global System Architecture & Core Skeleton

| Authoritative Architecture Doc | Core Content / Scope | Related Modules / Code Paths | Authority Level |
| :--- | :--- | :--- | :--- |
| [`system-architecture.md`](./system-architecture.md) | Cross-stack architecture, Single-Source-of-Truth (SoT) topology, and multi-stack lifecycle (React + Qt) | `spec/`, `packages/react/`, `qt/`, `gate/` | `[Authoritative Specification]` |

---

## 2. Core Subsystems & Domain Modules

| Authoritative Architecture Doc | Core Content / Scope | Related Modules / Code Paths | Authority Level |
| :--- | :--- | :--- | :--- |
| [`token-pipeline.md`](./token-pipeline.md) | Design token pipeline: shards aggregation, derivation, CSS/Qt code generation, and consumer sync | `spec/tokens/**`, `spec/generators/`, `scripts/sync-consumers.mjs` | `[Authoritative Specification]` |
| [`scroll-area.md`](./scroll-area.md) | ScrollArea & ScrollBar specifications: zero-latency kinematics, auto-hide, stepper buttons, and desktop wheel handling | `packages/react/src/scroll-area/`, `qt/src/ChaSetScrollBar.qml`, `qt/src/ChaSetScrollArea.qml` | `[Authoritative Specification]` |
| [`qt-module.md`](./qt-module.md) | Qt 6 QML module export architecture: ChaSet 1.0 URI, static plugin linkage, exported headers, and host CMake integration | `qt/CMakeLists.txt`, `qt/include/ChaSet/`, `qt/src/` | `[Authoritative Specification]` |
| [`component-contracts.md`](./component-contracts.md) | Neutral component API contracts, capability manifests, earned coverage testing, and Parity Gate | `spec/components/`, `spec/capabilities.json`, `gate/parity.mjs`, `packages/*/conformance/` | `[Authoritative Specification]` |
| [`visual-conformance.md`](./visual-conformance.md) | Cross-stack visual conformance, isolated component harnesses, automated Edge CDP + Qt snapshot pipeline, and pixel diff gating | `scripts/visual-diff.mjs`, `packages/react/examples/basic/`, `qt/src/` | `[Authoritative Specification]` |
| [`theme-customizer.md`](./theme-customizer.md) | Style configurator & component preview workbench (React Studio + Qt Showcase), real-time token tuning, and copyable exports | `packages/react/examples/basic/`, `qt/src/` | `[Design & Implementation]` |
| [`icon-system.md`](./icon-system.md) | Cross-stack icon specification: single geometry registry, one stroke weight, declared grids, optical centring by construction, external specification switch, and the adoption ratchet | `spec/icons/`, `spec/generators/generate-icons.mjs`, `packages/react/src/lib/icons.generated.tsx`, `qt/src/ChaSetIcon.qml`, `qt/src/ChaSetIcons.generated.qml`, `scripts/check-icon-spec.mjs` | `[Authoritative Specification]` |
| [`i18n-system.md`](./i18n-system.md) | Universal cross-stack internationalization (i18n): neutral dictionaries, 3-tier extension, reactive QML singleton, and dual-stack LanguageSettings | `spec/i18n/`, `spec/generators/generate-i18n.mjs`, `packages/react/src/i18n/`, `packages/react/src/language-settings/`, `qt/src/ChaSetI18n*`, `qt/src/ChaSetLanguageSettings.qml` | `[Authoritative Specification]` |
| [`../design/chaset-theme-control.md`](../design/chaset-theme-control.md) | Unified cross-stack theme configuration control, neutral schema boundary, 10-id palette convergence, and host isolation | `packages/react/src/theme-settings/`, `qt/src/ChaSetThemeSettings.qml`, `spec/schemas/theme-config.schema.json`, `spec/theme-controls.json` | `[Authoritative Specification]` |
| [`showcase-architecture.md`](./showcase-architecture.md) | Showcase living documentation infrastructure, automated "On this page" TOC scanning, zero-drift heading synchronization, and SPAS verification | `packages/react/examples/basic/src/layout/`, `qt/src/DocLayout.qml`, `scripts/verify-showcase-parity.mjs` | `[Authoritative Specification]` |

---

## 3. Associated Design Documents & References (Non-authoritative, reference only)

- [`../token-mapping.md`](../token-mapping.md) — Comprehensive technical reference for token derivation rules, multi-axis deltas, and cross-repo synchronization.
