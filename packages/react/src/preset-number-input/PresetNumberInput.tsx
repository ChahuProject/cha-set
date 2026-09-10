import * as React from 'react';
import { Input } from '../input';
import { cn } from '../lib/utils';

export interface PresetNumberInputProps {
  /** Current value of the numeric input */
  value?: string;
  /** Callback invoked when value changes */
  onChange?: (val: string) => void;
  /** Array of numeric presets */
  presets?: number[];
  /** Placeholder text */
  placeholder?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether to show the clear/reset option */
  allowClear?: boolean;
  /** Label for the clear/reset option */
  clearLabel?: string;
  /** Custom class for the internal input component */
  inputClassName?: string;
  /** Container class name */
  className?: string;
  /** Accessibility label for the input element */
  'aria-label'?: string;
}

const DEFAULT_PRESETS = [64, 128, 256, 512, 1024, 2048, 4096, 8192];

function formatPresetLabel(val: number): string {
  if (val >= 1024) {
    const k = val / 1024;
    return `${val % 1024 === 0 ? k : k.toFixed(1)}K`;
  }
  return `${val}px`;
}

export function PresetNumberInput({
  value = '',
  onChange,
  presets = DEFAULT_PRESETS,
  placeholder,
  disabled = false,
  allowClear = true,
  clearLabel = 'None',
  inputClassName,
  className,
  'aria-label': ariaLabel,
}: PresetNumberInputProps) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1);
      return;
    }
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // If disabled while open, immediately close
  React.useEffect(() => {
    if (disabled && open) {
      setOpen(false);
    }
  }, [disabled, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      if (!open) {
        setOpen(true);
        setHighlightedIndex(0);
      } else if (presets.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % presets.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (!open) {
        setOpen(true);
        setHighlightedIndex(presets.length - 1);
      } else if (presets.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + presets.length) % presets.length);
      }
    } else if (e.key === 'Enter') {
      if (open && highlightedIndex >= 0 && highlightedIndex < presets.length) {
        e.preventDefault();
        onChange?.(String(presets[highlightedIndex]));
        setOpen(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      data-slot="preset-number-input"
      className={cn('relative inline-flex flex-col', className)}
    >
      <Input
        type="number"
        min={0}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onClick={() => {
          if (!disabled) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        className={cn('h-8 text-xs', inputClassName)}
      />
      {open && !disabled && (
        <div
          role="listbox"
          aria-label="Presets"
          className="absolute left-0 top-full z-50 mt-1 max-h-48 min-w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground outline-hidden animate-in fade-in-50 zoom-in-95"
        >
          {allowClear && (
            <button
              type="button"
              role="option"
              aria-selected={value === ''}
              className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange?.('');
                setOpen(false);
              }}
              onClick={() => {
                onChange?.('');
                setOpen(false);
              }}
            >
              <span>{clearLabel}</span>
            </button>
          )}
          {presets.map((preset, idx) => (
            <button
              key={preset}
              type="button"
              role="option"
              data-highlighted={highlightedIndex === idx ? true : undefined}
              aria-selected={value === String(preset)}
              className={cn(
                'flex w-full items-center justify-between gap-4 rounded px-2 py-1 text-left text-xs tabular-nums text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors',
                highlightedIndex === idx && 'bg-accent text-accent-foreground',
              )}
              onPointerEnter={() => setHighlightedIndex(idx)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange?.(String(preset));
                setOpen(false);
              }}
              onClick={() => {
                onChange?.(String(preset));
                setOpen(false);
              }}
            >
              <span>{preset}</span>
              <span className="text-[0.65rem] text-muted-foreground/70">
                {formatPresetLabel(preset)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
