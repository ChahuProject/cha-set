import * as React from 'react';
import { CopyButton } from '../copy-button/CopyButton';
import { cn } from '../lib/utils';

export interface CodeBlockHeaderProps {
  /** Header label; empty/undefined renders no label (used when tabs occupy the slot). */
  label?: string | undefined;
  /** Text written to the clipboard by the built-in copy button. */
  code: string;
  showCopy?: boolean;
  copyLabel?: string | undefined;
  /** Slot rendered before the label, e.g. the multi-file tab list. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * L3 structural piece: the CodeBlock header row — label slot, tab slot, and the
 * copy affordance. It is intentionally chrome-only so CodeBlock can swap the
 * label for a tab list without duplicating the copy wiring.
 */
export function CodeBlockHeader({
  label,
  code,
  showCopy = true,
  copyLabel,
  children,
  className,
}: CodeBlockHeaderProps) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        'flex h-8 shrink-0 items-center justify-between gap-2 border-b border-border px-3',
        className,
      )}
    >
      <div className="flex min-w-0 items-center">
        {children}
        {label ? (
          <span
            data-slot="code-block-label"
            className="truncate font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </span>
        ) : null}
      </div>

      {showCopy && (
        <CopyButton
          text={code}
          label="Copy"
          copiedLabel="Copied!"
          title="Copy code to clipboard"
          copiedTitle="Copied"
          variant="ghost"
          size="sm"
          aria-label={copyLabel ?? (label ? `Copy ${label} to clipboard` : 'Copy code to clipboard')}
          className="h-6 shrink-0 gap-1 px-2 text-[0.6875rem] text-muted-foreground hover:text-foreground"
        />
      )}
    </div>
  );
}
