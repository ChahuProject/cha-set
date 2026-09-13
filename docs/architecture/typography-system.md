# Cross-Stack Typography System

> **Authority Level**: `[Authoritative Specification]`
> **Scope**: Font family, size, weight, line-height and letter-spacing for every React (Web) and Qt (Desktop/QML) component in `cha-set`.

---

## 1. Why this exists

Two stacks rendered the same component with two unrelated typography toolchains:

| | React (Web) | Qt (Desktop) |
| :--- | :--- | :--- |
| Family | Tailwind `font-mono` fallback stack (browser resolves the whole list) | `font.family: "Consolas, monospace"` — **Qt does not resolve comma lists** |
| Size | `text-xs` → `0.75rem` | `font.pixelSize: 12` |
| Line height | `leading-[1.4]` → `12 × 1.4 = 16.8px` | **nothing applied** → `fontMetrics.lineSpacing` = `14px` |
| Letter spacing | `tracking-wider` → `0.05em` = `0.55px` | `letterSpacing: 1.0` → `0.091em` |

Only the **Code Block** body was visibly broken, but the same class of drift existed in its header label and file tabs. The root cause is not a wrong value on either side — it is that **nothing owned the value**. `leading-[1.4]` was an inline literal on the Web side and simply had no Qt counterpart.

Measured on the reference machine (Qt 6.10.1 / MSVC, `QT_QPA_PLATFORM=offscreen`, Consolas @ 12px):

| Probe | Result |
| :--- | :--- |
| `TextEdit` RichText, bare `<span>`/`<br/>` | `contentHeight` = **42px for 3 lines** → 14px/line |
| `TextEdit` RichText, `<p style="line-height:16.8px">` | `contentHeight` = **50.390625px for 3 lines** → 16.796875px/line |
| `Text` `lineHeightMode: Text.FixedHeight`, `lineHeight: 16.8` | 3 lines = **50.4px** → exactly 16.8px/line |
| Chromium, `font-size: 12px; line-height: 1.4` | 3 lines = **50.4px** → exactly 16.8px/line |

---

## 2. Single source of truth

All typography values live in **`spec/tokens/primitives.json` → `primitives.typography`** (plus `primitives.fontWeight`). Nothing else may define a font family, size, line height or letter spacing.

```jsonc
"typography": {
  "fontFamily": { "sans": { "css": "ui-sans-serif, system-ui, …", "qt": "Segoe UI" },
                  "mono": { "css": "ui-monospace, SFMono-Regular, Menlo, …", "qt": "Consolas" } },
  "fontSize":     { "nano": 9, "micro": 10, "caption": 11, "small": 12,
                    "body": 14, "heading": 16, "subheading": 18, "title": 28 }, // px integers
  "lineHeight":   { "none": 1, "tight": 1.25, "snug": 1.375, "normal": 1.5,
                    "relaxed": 1.625, "code": 1.4, /* + one per size */ },
  "letterSpacing":{ "tighter": -0.05, "tight": -0.025, "normal": 0,
                    "wide": 0.025, "wider": 0.05, "widest": 0.1 }     // em ratios
}
```

**Font sizes have exactly one home.** They used to sit in `primitives.size` next to radii and insets; `primitives.size` is now dimensional only, and `spec/qt-mapping.json` re-exports the four legacy names:

```jsonc
"fontSizeBody": "primitives.typography.fontSize.body"
```

so `ThemeTokens` / `theme_tokens.generated.h` keep their 21 `size` fields, names **and values**. The refactor is invisible downstream — verified by regenerating and observing that `theme_tokens.generated.h` and `ThemeTokens.generated.qml` come out byte-identical.

### Unit conventions

| Token | Stored as | Web emits | Qt emits |
| :--- | :--- | :--- | :--- |
| `fontFamily.*` | `{css, qt}` | full fallback stack | **one** family name |
| `fontSize.*` | px integer | `× 0.0625` → `rem` | px integer |
| `lineHeight.*` | unitless ratio | unitless ratio (browser multiplies by font-size) | **absolute px** via `Typography.lineHeightPx()` |
| `letterSpacing.*` | em ratio | `em` | **absolute px** via `Typography.trackingPx()` |

---

## 3. Generated artifacts

`pnpm gen:all` (→ `spec/generators/generate-css.mjs` + `generate-qt.mjs`) produces:

| Target | Artifact | Contents |
| :--- | :--- | :--- |
| Web | `packages/react/src/styles/tokens.css` | `--cs-font-sans/mono`, `--cs-font-weight-regular/medium/semibold/bold`, `--cs-text-*` (rem), `--cs-leading-*` (ratio), `--cs-tracking-*` (em) — in both `:root` and `.dark` (typography is mode-invariant) |
| Web (bridge) | `packages/react/src/styles/theme.css` | maps the tokens onto Tailwind namespaces + composite role utilities |
| Qt | `qt/src/Typography.generated.qml` (singleton `Typography`) | `familySans/familyMono`, `weight*`, `size*`, `leading*`, `tracking*`, named accessors, and the two px bridges |

`Typography.generated.qml` is a **separate** artifact from `theme_tokens.generated.h` on purpose: that header mirrors dt-a's `ThemeManager::Tokens` and its field set is frozen downstream. Same rationale as `CodeTokens.generated.qml`.

Registration lives in `qt/CMakeLists.txt` (`QT_QML_SINGLETON_TYPE` + `QML_FILES`).

---

## 4. The two Qt quirks this system encodes

### 4.1 `font.family` must be a single family

CSS resolves a comma-separated fallback list; Qt assigns `font.family` to one family. The token therefore carries two fields — `css` keeps the Web stack, `qt` is a single name. `spec/validate-tokens.mjs` **rejects any comma in `fontFamily.*.qt`**. (Qt 6.9+ exposes `font.families` for ordered fallback, which is the forward path if ordered fallback is ever needed.)

### 4.2 Rich-text `line-height` percentages are relative to the font, not the size

```
CSS       line-height: 140%   →  1.40 × font-size      = 1.40 × 12 = 16.8px
Qt <p>    line-height: 140%   →  1.40 × fontMetrics(14) = 19.6px   ✗
```

Measured: `<p style="line-height:140%">` yields 19.59px/line for Consolas@12. So **never use a percentage in Qt rich text.** Use the absolute px form, which `Typography.lineHeightPx()` produces:

```qml
readonly property string styledRichText:
    "<p style=\"margin:0;line-height:" + root.lineHeightPx + "px\">" + root.richText + "</p>"
```

The `<p>` wrapper is what carries the value — a bare run of `<span>`/`<br/>` inherits the font's default line spacing (14px for Consolas@12), which was the original bug. Qt defaults `<p>` to `margin: 0`, but it is spelled out so the contract is explicit.

**Residual quantization**: Qt rounds rich-text line boxes to 1/64 px (its layout unit), so 16.8px becomes 16.796875px. Over a 3-line block that is a **0.0094px** difference versus Chromium — four orders of magnitude below a device pixel and far inside the `pixelmatch` tolerance. `Text.lineHeight` + `Text.FixedHeight` (used for plain `Text`, not `TextEdit`) is exact.

---

## 5. Consuming the tokens

### Web

Core Tailwind namespaces are **redefined to point at the tokens** in `theme.css`, so existing markup became token-driven without churn and without moving a single pixel:

```css
--font-sans: var(--cs-font-sans);
--font-mono: var(--cs-font-mono);
--text-xs: var(--cs-text-small);        --text-xs--line-height: var(--cs-leading-small);
--text-sm: var(--cs-text-body);         --text-sm--line-height: var(--cs-leading-body);
--text-base: var(--cs-text-heading);    --text-base--line-height: var(--cs-leading-heading);
--text-lg: var(--cs-text-subheading);   --text-lg--line-height: var(--cs-leading-subheading);
--leading-normal: var(--cs-leading-normal);   /* also none/tight/snug/relaxed */
--tracking-wider: var(--cs-tracking-wider);
```

Tailwind v4 emits `.text-xs { font-size: …; line-height: var(--tw-leading, var(--cs-leading-small)) }`, so an explicit `leading-*` utility always wins over a size's companion line-height — no ordering ambiguity.

New markup uses the ChaSet names: `text-nano / text-micro / text-caption / text-small / text-body / text-heading / text-subheading / text-title`, `leading-code`, `tracking-wider`, `font-regular / font-medium / font-semibold / font-bold`.

**Composite role utilities** set family + size + line-height in one atom, so a component never assembles a role from four classes:

| Utility | Family | Size | Line height |
| :--- | :--- | :--- | :--- |
| `cs-code` | mono | `small` (12px) | `code` (1.4 → 16.8px) |
| `cs-code-label` | mono | `caption` (11px) | `caption` |

### Qt

```qml
font.family: Typography.familyMono
font.pixelSize: Typography.sizeSmall
font.weight: Typography.weightSemibold
font.letterSpacing: Typography.trackingPx(Typography.sizeCaption, "wider")
// line height:
Text      { lineHeight: Typography.lineHeightPx(fontSize, "body"); lineHeightMode: Text.FixedHeight }
TextEdit  { text: "<p style=\"margin:0;line-height:" + px + "px\">…</p>" }
```

Named accessors (`Typography.size("body")`, `Typography.leading("code")`) exist so a role can be passed as one string instead of re-typing the scale.

---

## 6. Worked example: the Code Block

| Element | Before (Web) | Before (Qt) | After (both) |
| :--- | :--- | :--- | :--- |
| Code body | `font-mono text-xs leading-[1.4]` → 12px / **16.8px** | Consolas-ish 12px / **14px** | `cs-code` → 12px / 16.8px |
| Header label | mono 11px, `tracking-wider` → **0.55px** | mono 11px, `letterSpacing: 1.0` → **1.0px** | mono 11px, `wider` → 0.55px |
| File tab | `font-mono text-[0.6875rem]` → mono **11px** | `"Segoe UI, …"` **12px** | mono 11px |

Files: `packages/react/src/code-block/{HighlightedCode,CodeBlock,CodeBlockHeader}.tsx`,
`qt/src/{ChaSetHighlightedCode,ChaSetCodeBlock}.qml`.

---

## 7. Preconditions and verification

- **Web root font size must be 16px.** Sizes are emitted as `rem`; Qt is px-fixed. This is the same assumption the existing radius tokens already make (`--cs-radius: 0.5rem` = 8px).
- `pnpm gen:all` must be re-run after editing `spec/tokens/**`; `pnpm gen:tokens --check` fails on shard/snapshot drift.
- `node spec/validate-tokens.mjs` enforces: both families present, no comma in `qt`, sizes are positive integer px, line heights positive, letter spacings within ±0.5 em.

```bash
pnpm gen:all                 # regenerate tokens.css + Typography.generated.qml
node spec/validate-tokens.mjs
node spec/__tests__/...      # token unit tests
pnpm gate                    # incl. the typography drift checker below
```

The typography drift check (`scripts/check-typography-parity.mjs`, wired into `pnpm gate` as the *Cross-Stack Typography Contract Gate*) asserts that:

1. every `primitives.typography` value is present in the generated `tokens.css` **and** `Typography.generated.qml`;
2. no QML file under `qt/src/` sets a **comma-separated** `font.family` literal;
3. no library component under `qt/src/ChaSet*.qml` carries a **bare numeric font size** in `font.pixelSize:` or in a `fontSize`-ish derived property — every size must be a `Typography.size*` token;
4. no React source reintroduces a raw `leading-[…]` literal, and arbitrary `text-[…]` **length** literals are reported as warnings (colours such as `text-[#0f172a]` are ignored).

A literal can only be exempted by adding an entry to `scripts/typography-allowlist.json` with a written justification. The file is a debt ledger: four entries today, all icon-glyph or metric cases that have no text-role counterpart.

### Code Block line-pitch gate

The Code Block was the component whose line-height originally diverged, so it gets a dedicated end-to-end gate rather than only a static one. Both stacks expose an isolated harness rendering the *same* 5-line TypeScript sample (`--harness code-block`; source kept byte-identical in `App.tsx` and `Main.qml`), captured at 1.0 device-pixel ratio and compared by `scripts/pixel-sync-test.mjs`:

- **Gross layout** — `pixelmatch` mismatch rate ≤ 4% (card chrome, header strip, body padding, blank-body detection).
- **Typography contract** — the vertical **line pitch** of both captures must agree geometrically, measured by autocorrelation of the per-row ink profile (`pitchTolerance: 1px`).

The geometric assertion is the load-bearing one. `pixelmatch` runs with `includeAA: false`, and at 12px mono most glyph pixels are stroke edges, so a line-height regression is largely classified as anti-aliasing and discarded: reverting Qt to a 14px line pitch moved the mismatch rate only **2.61% → 3.08%**, far too thin to gate on. The autocorrelation metric separates the states decisively — **17/17px ok** when aligned versus **17/14px DRIFT** when not — while both healthy ends agree to 0px. Run it with `pnpm test:pixel --component code-block`; it is also part of `pnpm gate:pixel` (`--component all`).

---

## 8. What the migration actually changed

The system was landed by mechanically rewriting every literal it could prove, and by leaving a written trail where it could not.

| Rewrite | Sites | Visual effect |
| :--- | :--- | :--- |
| Qt `font.family: "Consolas, monospace"` / `"Segoe UI, …"` → `Typography.familyMono` / `familySans` | 47 | **Fixed** — Qt never resolved the comma list, so every one of these was silently falling back to the system default font |
| Qt `font.pixelSize: <n>` → `Typography.size*` (library components) | 66 | none (same px) |
| Qt ternary / derived sizes (`root.isSm ? 12 : 13` …) → tokens | 54 | none (same px) |
| React `text-[0.6875rem]` → `text-caption`, `text-[0.625rem]`/`text-[10px]` → `text-micro`, `text-[0.5625rem]` → `text-nano` | 23 | none (same px) |
| React `text-[0.8rem]` → `text-small`, `text-[0.6rem]`/`text-[0.65rem]` → `text-micro` | 4 | ≤0.8px, and each moves *towards* the value its Qt twin already used |

### Two structural drifts found and fixed

1. **`body` was a phantom step.** `primitives.size.fontSizeBody = 13` had no React consumer — React's body text is Tailwind `text-sm` = **14px**. Qt, faithful to the token, rendered 13px. `body` is now 14 and the duplicate `bodyLarge` is gone, so `Typography.sizeBody ≡ text-sm` by construction. Side effect: `ChaSetTabsTrigger` (`12 : 13` → 12 : 14), `ChaSetSettingRow`, `ChaSetInlineEditableText`, `ChaSetBadge`, `ChaSetInput`, `ChaSetLabel` and the six `Typography.sizeBody` consumers all move 1px closer to the Web rendering.
2. **`ChaSetSegmentedControl` badges were size-derived.** `font.pixelSize: root.itemFontSize - 2` gave 9px at `size="sm"` and 12px at `size="lg"`; React uses a fixed `text-micro` (10px). Now `Typography.sizeMicro`.

### Explicit line heights added to Qt

React pins `leading-*` on 23 elements; Qt previously had no way to express them and used `fontMetrics.lineSpacing`. The ones that change the rendered line box are now spelled out:

| Element | React | Qt |
| :--- | :--- | :--- |
| `ChaSetHighlightedCode` | `cs-code` → 12/16.8px | `<p style="line-height:16.8px">` |
| `ChaSetCardTitle` | `text-base leading-none` → 16/16px | `lineHeightPx(sizeHeading,"none")` + `FixedHeight` (was 18px — a stale `text-lg` copy) |
| `ChaSetCardDescription` | `text-sm` → 14/20px | `lineHeightPx(sizeBody,"body")` |

### Known debt

- **Showcase doc pages** (`qt/src/*DocPage.qml`, `Main.qml`) still hold ~550 bare `font.pixelSize` numbers, including 15/20/22/32 which the scale cannot express. They are demo prose, not library surface, so the gate deliberately scopes rule 3 to `ChaSet*.qml`. Tokenising them is the natural next increment and will require widening `fontSize` to the Tailwind `xl`/`2xl`/`3xl` steps.
- React `text-xl/2xl/3xl` are **not** yet aliased to tokens (only `xs/sm/base/lg`); they are used in demo pages only.
