import React from 'react';
import { CopyableBadge, useChaSetI18n } from '@chahu/cha-set';
import {
  docContent,
  docContentDefaultLocale,
  type DocBlock,
  type DocInline,
  type DocPage,
} from '../data/docContent.generated';

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
      case 'token':
        return (
          <code key={key} className="font-mono text-foreground">
            {node.v}
          </code>
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
      const Tag = block.level >= 3 ? 'h3' : 'h2';
      return (
        <Tag
          key={key}
          id={block.id}
          className={
            block.level >= 3
              ? 'text-base font-semibold tracking-tight text-foreground mb-2'
              : 'text-xl font-bold tracking-tight text-foreground mb-3'
          }
        >
          {renderInline(block.inlines, key)}
        </Tag>
      );
    }
    case 'para':
      return (
        <p key={key} className="text-sm text-muted-foreground mb-4">
          {renderInline(block.inlines, key)}
        </p>
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
    case 'chips':
      return (
        <div key={key} className="flex flex-wrap items-center gap-2 pt-3">
          {block.tokens.map((token) => (
            <CopyableBadge key={`${key}-${token}`} size="sm" text={token} className="font-mono text-xs" />
          ))}
        </div>
      );
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

/**
 * Renders the spec/content Markdown AST.
 *
 * This component owns typography and spacing only — the prose itself is single-sourced,
 * so the Qt renderer (DocMarkdown.qml) can never drift from it in wording or structure.
 */
export function DocMarkdown({ id, section, slots }: DocMarkdownProps) {
  const { locale } = useChaSetI18n();
  const byLocale = docContent[id];
  const page: DocPage | undefined = byLocale?.[locale] ?? byLocale?.[docContentDefaultLocale];

  if (!page) {
    return <div className="text-sm text-destructive">Missing spec/content for “{id}”.</div>;
  }

  const sections = section ? page.sections.filter((entry) => entry.id === section) : page.sections;

  if (!sections.length) {
    return <div className="text-sm text-destructive">Missing section “{section}” in {id}.md.</div>;
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
