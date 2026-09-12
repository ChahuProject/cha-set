import * as React from 'react';
import { Card } from '../card/Card';
import { ScrollArea } from '../scroll-area/ScrollArea';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../tabs/Tabs';
import { cn } from '../lib/utils';
import { CodeBlockHeader } from './CodeBlockHeader';
import { HighlightedCode } from './HighlightedCode';
import { languageLabel } from './tokenize.generated';

export interface CodeBlockFileProps {
  /** Tab label, normally a file name. */
  name: string;
  /** File source text. */
  code: string;
  /** Per-file language override; falls back to the CodeBlock `language`. */
  language?: string;
}

export interface CodeBlockProps {
  /** Source text; ignored when `files` is provided. */
  code?: string;
  /** Language id or alias resolved by the shared lexer. @default 'tsx' */
  language?: string;
  /** Header title override; defaults to the resolved language label. */
  filename?: string;
  /** Multi-file tab group; when present it replaces the single-file body. */
  files?: CodeBlockFileProps[];
  /** Enable spec-driven syntax highlighting. @default true */
  highlight?: boolean;
  /** Render a line-number gutter. @default false */
  showLineNumbers?: boolean;
  /** Render the language / filename label in the header. @default true */
  showLanguage?: boolean;
  /** Render the built-in copy button in the header. @default true */
  showCopy?: boolean;
  /** Wrap long lines instead of scrolling horizontally. @default false */
  wrap?: boolean;
  /** Bound the content height (px-equivalent number, or any CSS length string). */
  maxHeight?: number | string;
  /** Drop the card chrome (border / background / header) for inline prose embedding. @default false */
  embedded?: boolean;
  /** Accessible label for the copy button. */
  copyLabel?: string;
  className?: string;
}

interface CodeBlockEntry {
  name: string;
  code: string;
  language: string;
}

const toLength = (value: number | string): string =>
  typeof value === 'number' ? `${value * 0.0625}rem` : value;

/**
 * L4 composite: card surface + header (label / tabs / copy) + scrollable,
 * syntax-highlighted body. Assembled entirely from ChaSet primitives
 * (Card, ScrollArea, Tabs, CopyButton) over the shared spec lexer, so React and
 * Qt tokenize and color identically without any third-party highlighter.
 */
export function CodeBlock({
  code = '',
  language = 'tsx',
  filename,
  files,
  highlight = true,
  showLineNumbers = false,
  showLanguage = true,
  showCopy = true,
  wrap = false,
  maxHeight,
  embedded = false,
  copyLabel,
  className,
}: CodeBlockProps) {
  const isMultiFile = files !== undefined && files.length > 0;

  const entries = React.useMemo<CodeBlockEntry[]>(() => {
    if (files && files.length > 0) {
      return files.map((file) => ({
        name: file.name,
        // Normalize once here so the rendered body and the copied text always agree.
        code: file.code.trim(),
        language: file.language ?? language,
      }));
    }
    return [{ name: filename ?? '', code: code.trim(), language }];
  }, [files, code, filename, language]);

  const [activeName, setActiveName] = React.useState(() => entries[0]!.name);
  const activeEntry = entries.find((entry) => entry.name === activeName) ?? entries[0]!;

  const activeFileName = activeEntry.name || languageLabel(activeEntry.language);

  // Qt parity: in multi-file mode the tab strip already names the active file, so
  // the header label slot stays empty (ChaSetCodeBlock gates it on `!multiFile`).
  // The accessible copy label still names the file so screen readers keep context.
  const label = showLanguage && !isMultiFile ? activeFileName : undefined;

  const bodyStyle = maxHeight === undefined ? undefined : { maxHeight: toLength(maxHeight) };

  const accessibleCopyLabel = copyLabel ?? `Copy ${activeFileName} to clipboard`;

  const renderBody = (entry: CodeBlockEntry) => (
    <ScrollArea
      data-slot="code-block-body"
      showVerticalScrollBar={maxHeight !== undefined}
      showHorizontalScrollBar={!wrap}
      showButtons={false}
      className="w-full"
      style={bodyStyle}
    >
      <HighlightedCode
        code={entry.code}
        language={entry.language}
        highlight={highlight}
        showLineNumbers={showLineNumbers}
        wrap={wrap}
      />
    </ScrollArea>
  );

  if (embedded) {
    return (
      <div data-slot="code-block" data-embedded="true" className={cn('w-full', className)}>
        {renderBody(activeEntry)}
      </div>
    );
  }

  if (!isMultiFile) {
    return (
      <Card data-slot="code-block" className={cn('overflow-hidden', className)}>
        <CodeBlockHeader
          label={label}
          code={activeEntry.code}
          showCopy={showCopy}
          copyLabel={accessibleCopyLabel}
        />
        {renderBody(activeEntry)}
      </Card>
    );
  }

  return (
    <Card data-slot="code-block" data-multi-file="true" className={cn('overflow-hidden', className)}>
      <Tabs value={activeEntry.name} onValueChange={setActiveName} className="gap-0">
        <CodeBlockHeader
          label={label}
          code={activeEntry.code}
          showCopy={showCopy}
          copyLabel={accessibleCopyLabel}
        >
          <TabsList className="mr-2 h-6 gap-0.5 bg-transparent p-0">
            {entries.map((entry) => (
              <TabsTrigger key={entry.name} value={entry.name} className="h-6 rounded px-2 font-mono text-[0.6875rem]">
                {entry.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </CodeBlockHeader>
        {entries.map((entry) => (
          <TabsContent
            key={entry.name}
            value={entry.name}
            // Motion: Base UI unmounts an inactive panel (keepMounted defaults to
            // false), so a mount-scoped enter animation replays on every tab switch
            // and the file swap cross-fades. Duration/easing come from the motion
            // tokens (short + entrance); prefers-reduced-motion zeroes them.
            className="mt-0 animate-in fade-in-0"
          >
            {renderBody(entry)}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
