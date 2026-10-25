import React from 'react';
import { useChaSetI18n } from '@chahu/cha-set';
import { buildDocAst, type DocBlock, type DocInline, type DocPage } from '../../../../../../spec/shared/docAst.mjs';
import { DocText } from './DocText';

/**
 * Living-doc prose is authored once in spec/content/<docId>/<locale>.md and parsed at
 * RUNTIME by the shared parser (spec/shared/docAst.mjs) — the same file the Qt renderer
 * imports. Nothing is code-generated, so editing an .md reloads the page directly.
 *
 * This component owns typography only: Markdown syntax maps onto the design system
 * (14px body, 20px h2, mono inline code) instead of raw HTML.
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
        // surface behind monospace text, inline with the sentence (never a trailing row).
        // Typography comes from the `code` role; only the chip surface is local.
        return (
          <DocText
            key={key}
            role="code"
            as="code"
            className="rounded-sm bg-secondary px-1.5 py-0.5 text-[0.85em]"
          >
            {node.v}
          </DocText>
        );
      default:
        return <React.Fragment key={key}>{node.v}</React.Fragment>;
    }
  });
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
          className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 text-sm text-foreground`}
        >
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
          ))}
        </ListTag>
      );
    }
    case 'table':
      return (
        <div key={key} className="overflow-x-auto my-4">
          <table className="w-full border-collapse text-sm text-foreground">
            <thead>
              <tr className="border-b border-border">
                {block.head.map((cell, cellIndex) => (
                  <th key={`${key}-h-${cellIndex}`} className="py-2 pr-4 text-left font-semibold">
                    {renderInline(cell, `${key}-h-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`${key}-r-${rowIndex}`} className="border-b border-border/50">
                  {row.map((cell, cellIndex) => (
                    <td key={`${key}-r-${rowIndex}-c-${cellIndex}`} className="py-2 pr-4 text-muted-foreground">
                      {renderInline(cell, `${key}-r-${rowIndex}-c-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
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
