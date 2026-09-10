import * as React from 'react';
import { Button, type ButtonProps } from '../button/Button';
import { CheckIcon, CopyIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'onClick' | 'onCopy'> {
  /** Text to copy to clipboard, or a function resolving text */
  text: string | (() => string | Promise<string>);
  /** Duration in milliseconds to display copied feedback (default: 2000) */
  timeout?: number;
  /** Hover title in idle state (default: "Copy") */
  title?: string;
  /** Hover title in copied state (default: "Copied") */
  copiedTitle?: string;
  /** Optional companion text label alongside the icon */
  label?: string;
  /** Optional companion text label when copied (defaults to "Copied!") */
  copiedLabel?: string;
  /** Class name for inner icons */
  iconClassName?: string;
  /** Optional callback fired when text is copied successfully */
  onCopy?: (copiedText: string) => void;
  /** Optional callback fired when copy fails */
  onError?: (error: unknown) => void;
  /** Custom children or render function */
  children?: React.ReactNode | ((copied: boolean) => React.ReactNode);
}

export function CopyButton({
  text,
  timeout = 2000,
  variant = 'ghost',
  size,
  title = 'Copy',
  copiedTitle = 'Copied',
  label,
  copiedLabel = 'Copied!',
  iconClassName = 'size-3.5',
  className,
  onCopy,
  onError,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const effectiveSize = size ?? (label ? 'sm' : 'icon-xs');

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const content = typeof text === 'function' ? await text() : text;
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(content);
      }
      setCopied(true);
      onCopy?.(content);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={effectiveSize}
      title={copied ? copiedTitle : title}
      aria-label={copied ? (label ? (copiedLabel ?? copiedTitle) : copiedTitle) : (label ?? title)}
      className={cn('transition-all duration-150', className)}
      onClick={handleCopy}
      {...props}
    >
      {typeof children === 'function' ? (
        children(copied)
      ) : children ? (
        children
      ) : label ? (
        <span className="inline-flex items-center gap-1.5 pointer-events-none">
          {copied ? (
            <CheckIcon className={cn(iconClassName, 'text-emerald-500 animate-in fade-in zoom-in-75 duration-150')} />
          ) : (
            <CopyIcon className={cn(iconClassName, 'text-muted-foreground transition-colors group-hover:text-foreground')} />
          )}
          <span className="text-xs">{copied ? copiedLabel : label}</span>
        </span>
      ) : copied ? (
        <CheckIcon className={cn(iconClassName, 'text-emerald-500 animate-in fade-in zoom-in-75 duration-150')} />
      ) : (
        <CopyIcon className={cn(iconClassName, 'text-muted-foreground transition-colors hover:text-foreground')} />
      )}
    </Button>
  );
}
