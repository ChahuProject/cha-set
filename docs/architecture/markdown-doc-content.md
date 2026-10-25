# Markdown-Single-Sourced Living Documentation

> **Status**: `[Authoritative Specification]`
> **Scope**: how living-doc prose is authored, parsed, rendered and gated across React and Qt.
> **Code paths**: `spec/content/**`, `spec/shared/docAst.mjs`, `packages/react/examples/basic/src/components/DocMarkdown.tsx`, `qt/src/DocMarkdown.qml`, `qt/CMakeLists.txt`, `scripts/check-doc-content.mjs`.

---

## 1. The problem this replaces

Living-doc prose used to be hand-written twice — once in
`packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx`, once in
`qt/src/<Name>DocPage.qml`. Only *contracts* were single-sourced (tokens, component APIs,
i18n dictionaries), never the prose. Measured before the migration:

- 26 React pages and 26 Qt pages carried an `§animations`-style section, but **not the same 26**.
- Qt pages used at least three shapes for that one section: a single prose `DocText`, `"• "`
  baked into the translation string, or a bullet `Column` — while React used `<ul>` plus a
  `CopyableBadge` chip row.
- `spec/i18n/locales` carried **51 `*Qt` / `*Qml` suffixed keys** — the fossil record of authors
  forking a key instead of fixing the shared one.
- The props tables of the same component already disagreed (`onSelect` missing on Qt,
  `"On this page"` vs `"ON THIS PAGE"`, `number | string` vs `real`).

Root cause: prose was not part of any contract, so nothing prevented drift.

## 2. Topology (parse at RUNTIME)

```
spec/content/<docId>/<locale>.md      ← the ONLY authoring surface
spec/shared/docAst.mjs                ← the ONLY parser (shared verbatim)
        │
        ├── React bundle: import.meta.glob('.../spec/content/*/*.md', { query: '?raw' })
        │                 → buildDocAst(source) → DocMarkdown.tsx → design-system markup
        └── Qt:           qrc:/spec/content/** (qt_add_resources)
                          → ChaSetDocSource.read(id, locale)  [C++, QML has no file IO]
                          → buildDocAst(source)               [qrc:/src/vendor/docAst.mjs]
                          → DocMarkdown.qml → DocText / rich text
```

There is **no code generation step**. Editing an `.md` file needs only a page reload (dev) or a
rebuild (Qt, because the sources are embedded).

Three constraints drove this shape, all verified empirically:

1. **The QML JS engine cannot compile modern-syntax libraries.** `marked@18` (ESM) fails to
   compile inside the module, so the parser is dependency-free and written in **ES5 syntax**
   (`var` / `function`, no arrow functions, template literals, optional chaining or
   destructuring). ES modules themselves *are* supported — `export` is fine.
2. **QML cannot read files.** `XMLHttpRequest` rejects the `qrc:` scheme for both sync and async
   requests (`Error: Invalid state`, no READYSTATE.DONE), so `ChaSetDocSource` (a C++
   `QML_SINGLETON`) hands the embedded Markdown to QML.
3. **Qt rich text has no round corners and no inline items.** `border-radius` is not in the
   supported CSS subset, and the only inline object Qt understands is an image. A code span
   therefore *reserves* space in the text flow and marks itself with an anchor
   (`href="chip:<token>"`); the rounded pill is painted by a sibling layer **behind** the text,
   positioned from `QTextLayout` geometry. See §4.

## 3. Dialect (closed whitelist)

`docAst.mjs` reports anything outside this list as an error — a silently dropped node would
render as blank space on one stack, which is worse than the drift being fixed.

| Allowed | Syntax | Notes |
| :--- | :--- | :--- |
| Front matter | `id`, `component`, `category`, `title`, `description` | all required; `id` must match the directory |
| Heading | `## text {#section-id}` | `h2` starts a section, `h3` nests; the explicit id is required for CJK headings |
| Paragraph | plain text | soft breaks join with a space for latin, directly for CJK |
| List | `- item` / `1. item` | one level; continuation lines indented 2+ spaces |
| Table | GFM pipe table | header + delimiter row required |
| Code span | `` `duration-quick` `` | rendered as the inline token chip (see §4) |
| Slot | ```` ```overview ```` / ```` ```anatomy ```` / ```` ```props ```` | native escape hatch |

Rejected on purpose: raw HTML, images, blockquotes, nested lists.

## 4. Inline code is the chip

There is no trailing badge row. A Markdown code span *is* the token chip, inline with the
sentence — that is the intended reading of "`` `duration-quick` `` looks like a copyable token".

**React** renders `<code class="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]">`;
the browser's inline formatting context does the layout, so a real element with real padding and
radius is free.

**Qt** cannot do that. `border-radius` is absent from the supported CSS subset, `padding` only
applies to table cells, and Qt Quick has no way to place a `QQuickItem` inside a text flow
([QTBUG-85651](https://bugreports.qt.io/browse/QTBUG-85651), open since 2020). The chip is
therefore split in two:

| Concern | Owner |
| :--- | :--- |
| Reserve width, break lines, shape glyphs, selection, copy | `QTextEdit` + `QTextLayout` (unchanged) |
| Mark which characters are a chip | anchor: `<a href="chip:<token>"><span …>&nbsp;token&nbsp;</span></a>` |
| Paint the rounded pill | `DocChipLayer.qml` → `Rectangle` **behind** the text |
| Where the pill goes | `ChaSetTextFragments::fragmentRects()` (C++) |

`fragmentRects()` walks the document, keeps fragments whose anchor href starts with `chip:`, and
maps their character range to pixels with `QTextLine::cursorToX()` + `blockBoundingRect()`.
The box is aligned on the fragment's own baseline (`line.y() + line.ascent() - fm.ascent()`),
because the line's ascent belongs to the taller body font, not to the chip font.

Design rules that follow from this:

- **The layer is declared before the `DocText`** so the text paints on top. It carries no
  `MouseArea`, so presses, drag-selection and the native selection highlight stay with the text.
- **No `background-color` in the span.** The pill is the only background; a square rich-text
  background would show through at the rounded corners.
- **The anchor is not decoration** — it is also the payload. `linkActivated("chip:<token>")` is
  what click-to-copy will bind to, so no separate id bookkeeping is needed.
- **`font-size` must be absolute px.** Qt's CSS subset has no `em`; `Typography.sizeSmall` (12px)
  is the equivalent of React's `0.85em`, and it also gives the chip its vertical breathing room
  (the background hugs the fragment box, not the line box).
- **A chip never wraps internally**, so the cross-line branch of `fragmentRects()` is defensive
  only: tokens contain no break opportunities.
- **`background-image` is not an option** even though it is listed as supported: Qt paints
  backgrounds with a texture brush anchored at the painter origin, not the fragment rect, so a
  rounded image would be misaligned (and there is no `background-size`).

Known limitation: the pill's radius/padding are ours, so they can drift from `rounded-sm`. Keep
the radius in `DocChipLayer.radius` and the React class in sync when either changes.

## 5. Slots and incremental migration

Markdown owns structure, headings and prose. Anything interactive stays native:

```md
## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 `duration-quick` 时长内以 `ease-standard` 缓动曲线过渡。

```overview
```
```

A page can consume the whole document (`<DocMarkdown id="..."/>`) or a single section
(`section="animations"`). The second form is what allows migrating one section at a time — the
remaining hand-written parts keep working untouched.

Qt: `DocMarkdown.qml` exposes `sectionId` / `sectionTitle`, which is the same contract
`DocLayout.qml` uses to discover outline entries, so a Markdown-driven block lands in the TOC
exactly like a hand-written one.

## 6. i18n model

- One file **per locale**: `spec/content/<docId>/zh-CN.md`, `en-US.md`.
- Front matter carries that locale's `title` / `description`; `DocMarkdown` picks the page by the
  active `ChaSetI18n` locale and falls back to `zh-CN`.
- The gate refuses to pass if two locales of the same doc expose different section id sequences —
  a translated page cannot silently lose a section.

## 7. Qt resource wiring

The prose is embedded by `qt/CMakeLists.txt`; the parser is embedded as a module resource:

| Resource | Prefix | Consumed via |
| :--- | :--- | :--- |
| `spec/content/**.md` (globbed, `CONFIGURE_DEPENDS`) | `/` | `ChaSetDocSource.read(docId, locale)` → `:/spec/content/<id>/<locale>.md` |
| `spec/shared/docAst.mjs` | `/src/vendor` | `import "vendor/docAst.mjs" as DocAst` |

Two wiring traps, both hit during implementation and both failing *silently* (blank section):

- The parser prefix must match the module's own resource root — `:/src/`, because the demo module
  is declared with `NO_RESOURCE_TARGET_PATH`. `:/qt/qml/chaSetDemo/src/...` does not resolve.
- `ChaSetDocSource` is a `QML_ELEMENT`/`QML_SINGLETON` C++ class; it must be listed in the ChaSet
  module `SOURCES` next to `ChaSetClipboard`, which is what makes `ChaSetDocSource.read()`
  reachable from QML.

Always verify with a screenshot after touching this wiring — a wrong prefix or a missing class
produces no error dialog, just an empty area where the prose should be.

## 8. Gates

| Gate | What it prevents |
| :--- | :--- |
| `scripts/check-doc-content.mjs` (`pnpm check:docs`, wired into `pnpm gate`) | dialect errors, missing front matter, locale section drift, one stack consuming sections the other does not, slots implemented on only one stack, authored sections nobody renders |
| parser self-test inside the same script | a broken detector or a parser regression (heading id, slot fence, inline code, blockquote rejection) |
| `verify-showcase-parity.mjs` | still guards the native skeleton (previews, anatomy, props tables) |

## 9. Migrating a page

1. Create `spec/content/<doc-id>/zh-CN.md` and `en-US.md`; copy the *better* of the two existing
   wordings rather than merging them.
2. React: replace the section block with `<DocMarkdown id="<doc-id>" section="<id>" />`.
3. Qt: replace the block with `DocMarkdown { width: parent.width; docId: "<doc-id>"; section: "<id>" }`.
4. `pnpm check:docs` — fails until both stacks consume the same section set.

## 10. Known gaps

- **Rendered spacing is not pixel-identical** between stacks, by design: break points, line
  height and block rhythm belong to each platform's typography stack. Living-doc pages are out of
  scope for `pnpm test:pixel`, which covers atomic components only.
- **`ChaSetCopyableBadge` (size `sm`, variant `secondary`) renders light-on-dark chips in dark
  mode**, while React's `Badge variant="secondary"` renders dark chips. Verified as pre-existing
  on `CodeBlockDocPage` — unrelated to this pipeline, tracked separately.
- Qt reads the Markdown synchronously through `QFile` on the first render of a page
  (microseconds for embedded resources, and the parsed page is cached per `<docId>/<locale>`).
  If a future page grows into hundreds of KB, revisit.
