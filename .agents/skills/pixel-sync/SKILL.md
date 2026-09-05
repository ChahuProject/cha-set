---
name: pixel-sync
description: >-
  Scientific pixel-level synchronization and visual/behavioral regression testing protocol for Web (React) and Desktop (Qt/QML) components. Enforces selective opt-in visual conformance, color-probe delta matching across interactive states (idle, hover, active, disabled), DPI-aware headless captures, and automated pixelmatch verification. Use when aligning component visual styles, verifying pixel-perfect parity between React and Qt, diagnosing visual regressions, or when the user mentions "pixel-sync", "pixel-level", "pixel diff", "像素同步", or "像素级别".
  Triggers: pixel-sync, pixel-level, pixel diff, pixel-sync-test, 像素同步, 像素级别, 像素对齐.
---

# Scientific Cross-Stack Pixel-Sync Protocol (React Web & Qt Desktop)

When fine-tuning component aesthetics or validating visual/behavioral parity between React (Web/Tailwind) and Qt Quick (Desktop/QML), you MUST follow this scientific, verifiable protocol.

---

## 1. Why "Scientific" Pixel Sync? (Core Principles)

Static screenshot comparison by "human eyeballing" is unreliable and leads to superficial synchronization. A truly scientific protocol enforces:

1. **Deterministic State Injection**:
   - Interactive states (Idle, Hover, Active/Pressed, Disabled, Loading) must be programmatically injected via props/CLI (`forceHover`, `forceActive`, `--state hover`, `--state active`) without depending on flaky OS mouse positioning.
2. **Strict DPI Scale Locking**:
   - Qt and Chromium engines must render at strictly `1.0` device pixel ratio (`QT_ENABLE_HIGHDPI_SCALING=0`, `QT_SCALE_FACTOR=1`, CDP `deviceScaleFactor: 1`). Both viewports must yield bit-identical canvas resolutions (e.g. `220x80`).
3. **Dual Spatial & Color Probe Assertions**:
   - **Spatial Pixel Diff (`pixelmatch`)**: Overall image mismatch rate must be <= 2.8% (tolerance accommodates micro subpixel anti-aliasing variations between DirectWrite/FreeType and Blink font engines).
   - **Surface Color Probe (Delta E <= 4.0)**: Background fill and interactive state colors sampled inside component padding must match within mathematical Delta E <= 4.0 (flat solid fills achieve bit-exact Delta E = 0.0).
4. **Selective Targeted Execution (Opt-in)**:
   - High-precision pixel testing launches headless browsers and native Qt processes (~10-15s). To maintain fast developer loops, pixel-level gates are **selective and opt-in** (targeted per-component, currently active for `button`).

---

## 2. The 5-Step Synchronization Pipeline

### Step 1: Token & Color Space Alignment
Ensure mathematical color parity between Tailwind v4 color mixing and Qt QML color declarations:
- **Default/Primary**: `#1d7ae0` (`rgb(29, 122, 224)`).
  - Hover: `color-mix(in oklab, #1d7ae0 90%, transparent)` over `#ffffff` -> `rgb(51, 135, 227)`.
  - Active: `color-mix(in oklab, #1d7ae0 80%, transparent)` over `#ffffff` -> `rgb(74, 149, 230)`.
- **Secondary / Accent**:
  - Idle: `#f1f5f9` (`rgb(241, 245, 249)`).
  - Hover: `rgb(244, 247, 250)`.
  - Active: `rgb(245, 248, 251)`.
- **Outline**:
  - Idle: Canvas background (`rgb(255, 255, 255)`) with `border-input` (`#e2e8f0`).
  - Hover: `rgb(241, 245, 249)` with `text-accent-foreground` (`#0f172a`).
  - Active: `rgb(244, 247, 250)`.
- **Destructive**:
  - Idle: `#ef4444` (`rgb(239, 68, 68)`).
- **Disabled**:
  - `opacity: 0.5` applied identically across React and Qt -> `rgb(141, 187, 239)` (Delta <= 2.4).

### Step 2: Isolated Test Harness
Both stacks expose an isolated rendering harness centered in a minimal canvas:
- **React**: `http://127.0.0.1:5299/?harness=button&variant={v}&size={s}&state={st}&disabled={d}&loading={l}`
- **Qt**: `QtChaSetDemo.exe --harness button --variant {v} --size {s} --state {st} --width 220 --height 80 --shot {path}`

### Step 3: Headless Image Acquisition
- Use Edge/Chromium via Chrome DevTools Protocol (`Page.navigate`, `Emulation.setDeviceMetricsOverride`, `Page.captureScreenshot`).
- Use Qt offscreen / single-shot window capture with zero high-DPI scaling.

### Step 4: Programmatic Comparison
Run `scripts/pixel-sync-test.mjs`:
- Sample button surface color at size-aware coordinates away from text glyphs (`sm: (86, 28)`, `default: (76, 28)`, `lg: (60, 28)`, `icon: (98, 28)`).
- Verify color Delta: Delta E = sqrt(Delta R^2 + Delta G^2 + Delta B^2) <= 4.0.
- Compute visual diff heatmap and mismatched pixel percentage via `pixelmatch`.

### Step 5: Visual HTML Conformance Report
Open `.pixel-diff/report.html` to inspect side-by-side:
- React capture frame
- Qt Quick capture frame
- Diff heatmap with highlighted pixel discrepancies
- Exact measured RGB values and Delta E metrics

---

## 3. Verification Commands

```bash
# 1. Run targeted pixel test for button (all variants & states)
pnpm test:pixel --component button

# 2. Run targeted pixel test for a specific variant or state
pnpm test:pixel --component button --variant outline
pnpm test:pixel --component button --state hover

# 3. Run cross-stack parity gate including targeted pixel gate
pnpm gate:pixel
# OR
pnpm gate --pixel
```

---

## 4. Red Lines for AI Agents

1. **NEVER accept visual drift on interactive states**: Hover and active states are first-class citizens. When a button is hovered or clicked, the resulting color MUST match across React and Qt.
2. **DO NOT probe font glyphs for color match**: Font anti-aliasing differs across rendering engines. Background surface colors must be sampled in padding areas, while font rendering is verified via `pixelmatch` spatial tolerance (<= 2.8%).
3. **Always lock DPI**: Never run visual captures without `QT_ENABLE_HIGHDPI_SCALING=0` and `QT_SCALE_FACTOR=1`.
4. **Selective Gate Preservation**: Keep standard `pnpm gate` fast. Always use `pnpm gate:pixel` or `pnpm gate --pixel` for targeted visual conformance.
