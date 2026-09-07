import * as React from 'react';
import { CheckIcon, CopyIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export type ReadOnlyInputColorScheme = 'default' | 'destructive' | 'warning' | 'success';

export interface ReadOnlyInputProps {
  /** Value displayed in the read-only field */
  value: string;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Hover tooltip for the copy button (default: "Copy") */
  copyHint?: string;
  /** Tooltip when text is copied (default: "Copied") */
  copiedHint?: string;
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
  copyHint = 'Copy',
  copiedHint = 'Copied',
  colorScheme = 'default',
  className,
  inputClassName,
  onCopy,
}: ReadOnlyInputProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!value) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      }
      setCopied(true);
      onCopy?.(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  const scheme = colorSchemeMap[colorScheme];

  return (
    <div
      data-slot="read-only-input"
      className={cn(
        'group relative flex min-w-0 items-center rounded-md border bg-background/60 transition-colors',
        scheme.border,
        className,
      )}
    >
      <input
        readOnly
        value={value}
        placeholder={placeholder}
        onFocus={(e) => e.target.select()}
        onMouseUp={(e) => e.preventDefault()}
        className={cn(
          'min-w-0 flex-1 truncate bg-transparent py-1 pl-2 pr-7 font-mono text-xs outline-none placeholder:text-muted-foreground/60',
          scheme.text,
          inputClassName,
        )}
      />
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? copiedHint : copyHint}
        aria-label={copied ? copiedHint : copyHint}
        className="absolute right-1 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-muted-foreground/70 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {copied ? (
          <CheckIcon className="size-3 text-emerald-500 animate-in fade-in zoom-in-75 duration-150" />
        ) : (
          <CopyIcon className="size-3" />
        )}
      </button>
    </div>
  );
}
