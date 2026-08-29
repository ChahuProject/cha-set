# Component Contracts & Parity Gate Architecture

## 1. Role & System Boundaries
- **Core Role**: Enforces cross-stack behavioral, API, and accessibility parity. Components must satisfy neutral Zod schema contracts and prove capability compliance via automated tests before passing the CI parity gate.
- **Scope Delineation**:
  - **In-Scope**:
    - Contract schema declarations (`spec/components/*.ts`).
    - Capability matrix definitions (`spec/capabilities.json`).
    - Earned capability conformance recording (`conformance/coverage.json`).
    - Automated parity verification (`gate/parity.mjs`).
  - **Out-of-Scope**:
    - Framework-internal prop quirks (e.g. React-only event hooks or QML signal mechanics).

---

## 2. Core Data Flow & Parity Lifecycle

1. **Contract Definition (`spec/components/<name>.ts`)**:
   A Zod schema defines neutral props (e.g., `variant`, `size`, `loading`, `disabled`, `fullWidth`).
2. **Capability Declaration (`spec/capabilities.json`)**:
   Declares whether each capability is `"must"` (mandatory on all stacks) or `"should"` (recommended).
3. **Earned Coverage Generation**:
   Behavioral unit tests (e.g. `packages/react/src/button/Button.test.tsx` and Qt QML tests) flip capability flags to `true` **only when an assertion explicitly passes**. An `afterAll` hook writes `coverage.json`.
4. **Parity Gate Execution (`gate/parity.mjs`)**:
   Iterates through all `"must"` capabilities across every active stack. If any stack fails to earn a must-capability, the gate exits with non-zero status.

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **API Contracts** | [`spec/components/`](file:///D:/pengj/cha-set/spec/components/) | Neutral Zod schemas (e.g. `buttonSchema`, `ButtonApi`) |
| **Capability Manifest** | [`spec/capabilities.json`](file:///D:/pengj/cha-set/spec/capabilities.json) | Capability requirements table (`must` vs `should`) |
| **React Conformance** | [`packages/react/conformance/`](file:///D:/pengj/cha-set/packages/react/conformance/) | Contract parser verification & earned coverage snapshot |
| **Qt Conformance** | [`qt/conformance/`](file:///D:/pengj/cha-set/qt/conformance/) | Qt QML capability assertions snapshot |
| **Parity Gate** | [`gate/parity.mjs`](file:///D:/pengj/cha-set/gate/parity.mjs) | Validates cross-stack parity in CI |

---

## 4. Invariants & Forbidden Anti-Patterns

1. **Coverage Must Be Earned**: `coverage.json` flags must never be hardcoded to `true`. They must be set dynamically inside passing test assertions.
2. **Zero Missing Must-Capabilities**: No PR or release is permitted to pass `pnpm gate` if any `"must"` capability is absent in any implemented stack.
