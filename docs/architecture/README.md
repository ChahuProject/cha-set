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

---

## 3. Associated Design Documents & References (Non-authoritative, reference only)

- [`../token-mapping.md`](../token-mapping.md) — Comprehensive technical reference for token derivation rules, multi-axis deltas, and cross-repo synchronization.
