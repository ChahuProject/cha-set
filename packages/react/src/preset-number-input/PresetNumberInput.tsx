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
}: PresetNumberInputProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!open) return;
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
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              role="option"
              aria-selected={value === String(preset)}
              className="flex w-full items-center justify-between gap-4 rounded px-2 py-1 text-left text-xs tabular-nums text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
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
