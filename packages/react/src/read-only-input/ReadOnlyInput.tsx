import * as React from 'react';
import { CopyButton } from '../copy-button/CopyButton';
import { cn } from '../lib/utils';

export type ReadOnlyInputColorScheme = 'default' | 'destructive' | 'warning' | 'success';
export type ReadOnlyInputSize = 'default' | 'sm';

export interface ReadOnlyInputProps {
  /** Value displayed in the read-only field */
  value: string;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Whether to show the copy button (default: true) */
  showCopy?: boolean;
  /** Hover tooltip for the copy button (default: "Copy") */
  copyHint?: string;
  /** Tooltip when text is copied (default: "Copied") */
  copiedHint?: string;
  /** Whether the text should be masked (e.g. for secret keys) */
  masked?: boolean;
  /** Custom character for masking (default: "•") */
  maskChar?: string;
  /** Whether to show the reveal/hide toggle button when masked */
  showMaskToggle?: boolean;
  /** Sizing variant ('default' | 'sm') */
  size?: ReadOnlyInputSize;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Color theme variant (default: "default") */
  colorScheme?: ReadOnlyInputColorScheme;
  /** Container class name */
  className?: string;
  /** Input element class name */
  inputClassName?: string;
  /** Optional callback after copy */
  onCopy?: (value: string) => void;
}

const colorSchemeMap: Record<ReadOnlyInputColorScheme, { border: string; text: string }> = {
  default: { border: 'hover:border-ring/60 focus-within:border-ring', text: 'text-foreground' },
  destructive: { border: 'border-destructive/40', text: 'text-destructive' },
  warning: { border: 'border-amber-500/40', text: 'text-amber-700 dark:text-amber-400' },
  success: { border: 'border-emerald-500/40', text: 'text-emerald-700 dark:text-emerald-400' },
};

export function ReadOnlyInput({
  value,
  placeholder,
  showCopy = true,
  copyHint = 'Copy',
  copiedHint = 'Copied',
  masked = false,
  maskChar = '•',
  showMaskToggle = true,
  size = 'default',
  disabled = false,
  colorScheme = 'default',
  className,
  inputClassName,
  onCopy,
}: ReadOnlyInputProps) {
  const [revealed, setRevealed] = React.useState(false);

  const scheme = colorSchemeMap[colorScheme];
  const isSm = size === 'sm';
  const isMaskedActive = masked && !revealed;
  const displayValue = isMaskedActive
    ? maskChar.repeat(value ? Math.min(value.length, 32) : 0)
    : value;

  const showToggle = masked && showMaskToggle;

  return (
    <div
      data-slot="read-only-input"
      className={cn(
        'group relative flex min-w-0 items-center rounded-md border bg-background/60 transition-colors',
        isSm ? 'h-7 px-1.5' : 'h-8 px-2',
        disabled && 'pointer-events-none opacity-50',
        scheme.border,
        className,
      )}
    >
      <input
        readOnly
        disabled={disabled}
        value={displayValue}
        placeholder={placeholder}
        onFocus={(e) => e.target.select()}
        onMouseUp={(e) => e.preventDefault()}
        className={cn(
          'min-w-0 flex-1 truncate bg-transparent font-mono text-xs outline-none placeholder:text-muted-foreground/60',
          scheme.text,
          inputClassName,
        )}
      />
      <div className="flex items-center gap-0.5 pl-1">
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label={revealed ? 'Hide secret' : 'Reveal secret'}
            onClick={() => setRevealed(!revealed)}
            className="flex size-5 cursor-pointer items-center justify-center rounded text-muted-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            {revealed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
        {showCopy && (
          <CopyButton
            text={value}
            title={copyHint}
            copiedTitle={copiedHint}
            size="icon-xs"
            variant="ghost"
            disabled={disabled}
            onCopy={onCopy}
            className="text-muted-foreground/70 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
          />
        )}
      </div>
    </div>
  );
}
