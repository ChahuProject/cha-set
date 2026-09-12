import * as React from 'react';
import { cn } from '../lib/utils';
import { isHighlightable, toLines, tokenize } from './tokenize.generated';
import type { Token, TokenType } from './tokenize.generated';

/**
 * Inline color for a syntax token type.
 *
 * Mirrors the theme.css convention `--color-code-<t> = var(--code-<t>, var(--cs-code-<t>))`:
 * `--cs-code-<t>` is the library default shipped by tokens.css (launcher preset) and
 * `--code-<t>` is the host override hook. The very same palette reaches Qt through
 * CodeTokens.generated.qml, so both stacks color a token identically.
 */
export function tokenColorVar(type: TokenType): string {
  return `var(--code-${type}, var(--cs-code-${type}))`;
}

export interface HighlightedCodeProps {
  /** Source text. Leading/trailing blank space is trimmed before rendering. */
  code: string;
  /** Language id or alias resolved by the shared lexer. @default 'tsx' */
  language?: string;
  /** Emit colored token spans; when false the source renders monochrome. @default true */
  highlight?: boolean;
  /** Render a non-selectable, right-aligned line-number gutter. @default false */
  showLineNumbers?: boolean;
  /** Wrap long lines instead of letting the parent scroll horizontally. @default false */
  wrap?: boolean;
  className?: string;
}

/**
 * L2 highlighting primitive: turns source text into per-line, per-token spans.
 * It owns no chrome — CodeBlock supplies the surface, header and scrolling.
 */
export function HighlightedCode({
  code,
  language = 'tsx',
  highlight = true,
  showLineNumbers = false,
  wrap = false,
  className,
}: HighlightedCodeProps) {
  const lines = React.useMemo<Token[][]>(() => {
    const source = code.trim();
    if (!highlight || !isHighlightable(language)) {
      return toLines([{ t: 'plain' as TokenType, v: source }]);
    }
    return toLines(tokenize(source, language));
  }, [code, language, highlight]);

  // Reserve gutter width from the largest line number so digits never shift the code.
  const gutterMinWidth = `${String(lines.length).length + 1}ch`;

  const lineWrapClass = wrap ? 'flex-1 min-w-0 whitespace-pre-wrap break-words' : 'flex-none whitespace-pre';

  return (
    <pre
      data-slot="code-block-code"
      className={cn('m-0 p-3 font-mono text-xs leading-[1.4] text-foreground', className)}
    >
      <code className="block">
        {lines.map((line, index) => (
          <span key={index} className="flex" data-line={index + 1}>
            {showLineNumbers && (
              <span
                aria-hidden="true"
                data-slot="code-block-gutter"
                className="shrink-0 select-none pr-3 text-right text-muted-foreground"
                style={{ minWidth: gutterMinWidth }}
              >
                {index + 1}
              </span>
            )}
            <span className={lineWrapClass}>
              {line.length === 0 ? (
                <span>{'\u200b'}</span>
              ) : (
                line.map((token, tokenIndex) =>
                  token.t === 'plain' ? (
                    <React.Fragment key={tokenIndex}>{token.v}</React.Fragment>
                  ) : (
                    <span key={tokenIndex} data-token={token.t} style={{ color: tokenColorVar(token.t) }}>
                      {token.v}
                    </span>
                  ),
                )
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}
