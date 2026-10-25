import React from 'react';
import { useChaSetI18n, Kbd, HoverCopy, Table } from '@chahu/cha-set';
import type { TableColumn } from '@chahu/cha-set';
import {
  buildDocAst,
  DOC_SCHEMAS,
  inlineText,
  type DocBlock,
  type DocInline,
  type DocPage,
  type DocTableCellKind,
} from '../../../../../../spec/shared/docAst.mjs';
import { DocText } from './DocText';

/**
 * Living-doc prose is authored once in spec/content/<docId>/<locale>.md and parsed at
 * RUNTIME by the shared parser (spec/shared/docAst.mjs) — the same file the Qt renderer
 * imports. Nothing is code-generated, so editing an .md reloads the page directly.
 *
 * This component owns typography only: Markdown syntax maps onto the design system
 * (14px body, 20px h2, mono inline code, real keycaps) instead of raw HTML.
 */
const rawDocs = import.meta.glob('../../../../../../spec/content/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

interface DocSource {
  docs: Record<string, Record<string, string>>;
}

const docSources: DocSource = { docs: {} };
for (const [path, source] of Object.entries(rawDocs)) {
  const match = /spec[/\\]content[/\\]([^/\\]+)[/\\]([^/\\]+)\.md$/.exec(path);
  const docId = match?.[1];
  const locale = match?.[2];
  if (!docId || !locale) continue;
  docSources.docs[docId] = docSources.docs[docId] ?? {};
  docSources.docs[docId][locale] = source;
}

const astCache = new Map<string, DocPage | null>();
const reportedErrors = new Set<string>();

function getPage(docId: string, locale: string): DocPage | null {
  const key = `${docId}/${locale}`;
  if (astCache.has(key)) return astCache.get(key) ?? null;

  const source = docSources.docs[docId]?.[locale];
  if (!source) {
    astCache.set(key, null);
    return null;
  }

  const { page, errors } = buildDocAst(source);
  if (errors.length && !reportedErrors.has(key)) {
    reportedErrors.add(key);
    console.error(`[DocMarkdown] ${docId}/${locale}.md has dialect errors:\n  ${errors.join('\n  ')}`);
  }
  astCache.set(key, page);
  return page;
}

export interface DocMarkdownProps {
  /** Doc id matching spec/content/<id>/. */
  id: string;
  /** Render a single section (incremental migration) or the whole page when omitted. */
  section?: string;
  /** Native implementations for `demo` / `anatomy` / `props` slots. */
  slots?: Record<string, React.ReactNode>;
}

function renderInline(nodes: DocInline[], keyPrefix: string): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.t) {
      case 'strong':
        return (
          <strong key={key} className="font-semibold text-foreground">
            {renderInline(node.c, key)}
          </strong>
        );
      case 'em':
        return <em key={key}>{renderInline(node.c, key)}</em>;
      case 'code':
        // Markdown code span rendered with the documented "token chip" feel: a small
        // surface behind monospace text with full-overlay hover-copy support.
        return (
          <HoverCopy
            key={key}
            text={node.v}
            radius="sm"
            className="inline-flex align-baseline"
          >
            <DocText
              role="code"
              as="code"
              className="rounded bg-secondary px-1.5 py-0.5 text-[0.85em] font-mono text-foreground"
            >
              {node.v}
            </DocText>
          </HoverCopy>
        );
      case 'kbd':
        // `[[Ctrl+K]]` — the raw shortcut string goes straight to the Kbd primitive, which
        // already owns the compact-symbol mapping and the "/" alternative syntax. Splitting
        // it here would create a second, drift-prone interpretation.
        return (
          <Kbd key={key} shortcut={node.v} compact="never" size="sm" variant="outline" className="mx-0.5 align-middle" />
        );
      default:
        return <React.Fragment key={key}>{node.v}</React.Fragment>;
    }
  });
}

/**
 * One table cell. Structured kinds (`code` / `copyable` / `kbd`) take plain text.
 * Both `code` and `copyable` render code chips with hover-copy (aligning with the
 * 4px rounded background, no badges in Markdown).
 */
function renderCell(cell: DocInline[], kind: DocTableCellKind, key: string): React.ReactNode {
  if (kind === 'rich') return <>{renderInline(cell, key)}</>;

  const text = inlineText(cell);
  switch (kind) {
    case 'code':
    case 'copyable':
      return text && text !== '—' ? (
        <HoverCopy
          text={text}
          radius="sm"
          className="inline-flex max-w-full align-middle"
        >
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground/90 max-w-full truncate block">
            {text}
          </code>
        </HoverCopy>
      ) : (
        <span className="opacity-40">—</span>
      );
    case 'kbd':
      return text ? <Kbd shortcut={text} compact="never" size="xs" variant="outline" /> : null;
    default:
      return <>{renderInline(cell, key)}</>;
  }
}

function renderBlock(block: DocBlock, index: number, slots: DocMarkdownProps['slots']): React.ReactNode {
  const key = `block-${index}`;
  switch (block.t) {
    case 'heading': {
      // Markdown level → doc role. Level is DATA: `#` is h1, `##` is h2 … and
      // anything at `####` or deeper collapses onto h4 (the scale stops there).
      const role = block.level <= 1 ? 'h1' : block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4';
      return (
        <DocText key={key} id={block.id} role={role} className={block.level <= 2 ? 'mb-3' : 'mb-2'}>
          {renderInline(block.inlines, key)}
        </DocText>
      );
    }
    case 'para':
      return (
        <DocText role="p" key={key} className="mb-4">
          {renderInline(block.inlines, key)}
        </DocText>
      );
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          key={key}
          className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 text-sm text-foreground mb-4`}
        >
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
          ))}
        </ListTag>
      );
    }
    case 'table': {
      // Schema → column descriptors for the design system's Table. An empty schema (`plain`)
      // maps the header row 1:1 and keeps every cell rich, so a schema-free table still
      // renders chips, bold and keycaps. A typed schema only says *what each column is* —
      // the chrome (header strip, borders, row rhythm) still comes from Table itself, which
      // is why a Markdown props table lands on the same pixels as the hand-written one.
      const spec = DOC_SCHEMAS[block.schema] ?? [];
      const columns: TableColumn[] = block.head.map((cell, cellIndex) => {
        const kind: DocTableCellKind = spec[cellIndex]?.kind ?? 'rich';
        return {
          key: `c${cellIndex}`,
          title: inlineText(cell),
          width: spec[cellIndex]?.width,
          render: (_value, row) => renderCell(row[`c${cellIndex}`] as DocInline[], kind, `${key}-${cellIndex}`),
        };
      });
      const data = block.rows.map((row) => {
        const record: Record<string, DocInline[]> = {};
        row.forEach((cell, cellIndex) => {
          record[`c${cellIndex}`] = cell;
        });
        return record;
      });
      return (
        <Table key={key} containerClassName="my-5" bordered columns={columns} data={data} />
      );
    }
    case 'slot':
      return <React.Fragment key={key}>{slots?.[block.name] ?? null}</React.Fragment>;
    default:
      return null;
  }
}

export function DocMarkdown({ id, section, slots }: DocMarkdownProps) {
  const { locale } = useChaSetI18n();
  const page = getPage(id, locale) ?? getPage(id, 'zh-CN');

  if (!page) {
    return <div className="text-sm text-destructive">Missing spec/content/{id}/{locale}.md.</div>;
  }

  const sections = section ? page.sections.filter((entry) => entry.id === section) : page.sections;

  if (!sections.length) {
    return (
      <div className="text-sm text-destructive">
        Missing section “{section}” in spec/content/{id}/{locale}.md.
      </div>
    );
  }

  if (section) {
    const blocks = sections.flatMap((entry) => entry.blocks);
    return (
      <section id={section} className="scroll-mt-20 my-10">
        {blocks.map((block, index) => renderBlock(block, index, slots))}
      </section>
    );
  }

  return (
    <div className="space-y-2">
      {sections.map((entry) => (
        <section key={entry.id} id={entry.id} className="scroll-mt-20 my-10">
          {entry.blocks.map((block, index) => renderBlock(block, index, slots))}
        </section>
      ))}
    </div>
  );
}
