# Markdown-Single-Sourced Living Documentation

> **Status**: `[Authoritative Specification]`
> **Scope**: how living-doc prose is authored, generated, rendered and gated across React and Qt.
> **Code paths**: `spec/content/**`, `spec/generators/generate-doc-content.mjs`, `packages/react/examples/basic/src/components/DocMarkdown.tsx`, `qt/src/DocMarkdown.qml`, `qt/src/DocContent.generated.qml`, `scripts/check-doc-content.mjs`.

---

## 1. The problem this replaces

Living-doc pages used to be hand-written twice — once in
`packages/react/examples/basic/src/pages/components/<Name>DocPage.tsx`, once in
`qt/src/<Name>DocPage.qml`. Only *contracts* were single-sourced (tokens, component APIs,
i18n dictionaries), never the prose. Everything below was measured before the migration:

- 26 React pages and 26 Qt pages carried an `§animations`-style section, but **not the same 26**.
- Qt pages used at least three shapes for that one section: a single prose `DocText`, `"• "`
  baked into the translation string, or a bullet `Column` — while React used `<ul>` plus a
  `CopyableBadge` chip row.
- `spec/i18n/locales` carried **51 `*Qt` / `*Qml` suffixed keys** — the fossil record of authors
  forking a key instead of fixing the shared one.
- The props tables of the same component already disagreed (`onSelect` missing on Qt,
  `"On this page"` vs `"ON THIS PAGE"`, `number | string` vs `real`).

Root cause: prose was not part of any contract, so nothing prevented drift.

## 2. Topology

```
spec/content/<docId>/<locale>.md        ← the ONLY authoring surface
        │  pnpm gen:docs  (marked, build time only)
        ▼
AST JSON  ─────────────────────────────► packages/.../data/docContent.generated.ts
        └─────────────────────────────► qt/src/DocContent.generated.qml   (Qt singleton)
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        ▼                                           ▼
      DocMarkdown.tsx (React)                        DocMarkdown.qml (Qt)
      AST → semantic markup + tokens                 AST → DocText / ChaSetCopyableBadge
```

Two invariants make this work:

1. **Markdown exists only at build time.** Neither stack ships a Markdown parser. The AST is the
   contract; each renderer owns its own typography.
2. **Renderers resolve through tokens, never through HTML.** Qt's built-in
   `Text { textFormat: TextEdit.MarkdownText }` is deliberately **not** used: its point sizes come
   from generated HTML and bypass `ThemeTokens.sp()` (see `Typography.generated.qml`), so UI
   scaling would silently desynchronise the headline/body ratio.

## 3. Dialect (closed whitelist)

`generate-doc-content.mjs` fails the build on anything outside this list. A silently-ignored node
type would render as blank space on one stack — worse than the drift being fixed.

| Allowed | Syntax | Notes |
| :--- | :--- | :--- |
| Front matter | `id`, `component`, `category`, `title`, `description` | all required; `id` must match the directory |
| Heading | `## text {#section-id}` | `h2` only; the explicit id is required for CJK headings |
| Paragraph | plain text | `**strong**`, `*em*`, `` `code` `` |
| List | `- item` / `1. item` | one nesting level |
| Table | GFM pipe table | rendered with `ChaSetTable`-style cells on Qt |
| Token link | `[label](token:name)` | renders as inline mono **and** feeds the chip row |
| Slot | ```` ```demo overview ```` , ```` ```anatomy ```` , ```` ```props ```` | native escape hatch |

Rejected on purpose: raw HTML, images, blockquotes, nested lists, non-`token:` links.

## 4. Derived chip rows

The `CopyableBadge` row is **not authored**. Every `token:` link in a section body is collected in
order, de-duplicated, and emitted as a trailing `chips` block. This removes a class of bug that
already existed: React used to render four chips while the prose only mentioned three.

## 5. Slots and incremental migration

Markdown owns structure, headings and prose. Anything interactive stays native:

```md
## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 [duration-quick](token:duration-quick) 时长内…

```demo overview
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
- Front matter carries that locale's `title` / `description`; `DocMarkdown` picks the AST by the
  active `ChaSetI18n` locale, falling back to `spec/i18n/meta.json` `defaultLocale`.
- The generator refuses to emit if two locales of the same doc expose different section id
  sequences — a translated page cannot silently lose a section.

## 7. Gates

| Gate | What it prevents |
| :--- | :--- |
| `generate-doc-content.mjs` | dialect violations, unknown slots, missing front matter, locale section drift |
| `scripts/check-doc-content.mjs` (`pnpm check:docs`, wired into `pnpm gate`) | one stack consuming sections the other does not; a slot declared in Markdown but implemented on only one stack; authored sections nobody renders |
| `verify-showcase-parity.mjs` | still guards the native skeleton (previews, anatomy, props tables) |

`check-doc-content.mjs` ships a `selfTest()` that the gate runs first, because the detectors are
regexes over two different page syntaxes (JSX and QML) and a stale regex would otherwise pass
forever.

## 8. Migrating a page

1. Create `spec/content/<doc-id>/zh-CN.md` and `en-US.md`; copy the *better* of the two existing
   wordings rather than merging them.
2. `pnpm gen:docs`.
3. React: replace the section block with `<DocMarkdown id="<doc-id>" section="<id>" />`.
4. Qt: replace the block with `DocMarkdown { width: parent.width; docId: "<doc-id>"; section: "<id>" }`.
5. `pnpm gate` — the doc content gate fails until both stacks consume the same section set.

## 9. Known gaps

- **Rendered spacing is not pixel-identical** between stacks, by design: break points, line
  height and block rhythm belong to each platform's typography stack. Living-doc pages are out of
  scope for `pnpm test:pixel`, which covers atomic components only.
- **`ChaSetCopyableBadge` (size `sm`, variant `secondary`) renders light-on-dark chips in dark
  mode**, while React's `Badge variant="secondary"` renders dark chips. Verified as pre-existing
  on `CodeBlockDocPage` — unrelated to the Markdown pipeline, tracked separately so it is not
  mistaken for a regression here.
