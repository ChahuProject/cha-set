# Qt implementation (planned)

The Qt (QWidget/QML) implementation of ChaSet will live here.

It must satisfy the same `spec/capabilities.json` "must" requirements as the
React implementation — the `gate/parity.mjs` script enforces this once a
`qt/conformance/coverage.json` file exists. Design tokens come from
`spec/tokens.json` via `spec/generators/generate-qt.mjs`.