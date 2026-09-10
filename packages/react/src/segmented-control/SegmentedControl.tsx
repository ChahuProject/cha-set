import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import type { SegmentedControlOption, SegmentedControlSize } from '@chahu/spec/segmented-control';

export const segmentedControlVariants = cva(
  'inline-flex items-center rounded-lg bg-muted p-0.5 text-muted-foreground select-none border border-border/50',
  {
    variants: {
      size: {
        sm: 'h-[1.375rem] text-xs gap-0.5',
        default: 'h-7 text-xs gap-1',
        lg: 'h-9 text-sm gap-1',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const segmentedItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[0.3125rem] font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 cursor-pointer gap-1.5',
  {
    variants: {
      size: {
        sm: 'h-[1.125rem] px-2 text-[0.6875rem] leading-none',
        default: 'h-6 px-2.5 text-xs',
        lg: 'h-8 px-3 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof segmentedControlVariants> {
  options: SegmentedControlOption[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  onChange?: (value: string | number) => void;
  size?: SegmentedControlSize;
  title?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      onChange,
      size = 'default',
      title,
      disabled = false,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | number>(
      defaultValue !== undefined ? defaultValue : options[0]?.value ?? ''
    );

    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : uncontrolledValue;

    const handleSelect = (val: string | number) => {
      if (disabled) return;
      if (!isControlled) {
        setUncontrolledValue(val);
      }
      onValueChange?.(val);
      onChange?.(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const enabledOptions = options.filter((opt) => !opt.disabled);
      if (enabledOptions.length === 0) return;
      const currentIndex = enabledOptions.findIndex((opt) => opt.value === activeValue);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % enabledOptions.length;
        const target = enabledOptions[nextIndex];
        if (target) handleSelect(target.value);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
        const target = enabledOptions[prevIndex];
        if (target) handleSelect(target.value);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const target = enabledOptions[0];
        if (target) handleSelect(target.value);
      } else if (e.key === 'End') {
        e.preventDefault();
        const target = enabledOptions[enabledOptions.length - 1];
        if (target) handleSelect(target.value);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-2', fullWidth && 'w-full', className)}
        {...props}
      >
        {title && (
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {title}
          </span>
        )}
        <div
          role="radiogroup"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          className={cn(
            segmentedControlVariants({ size }),
            fullWidth && 'w-full flex',
            disabled && 'opacity-50 pointer-events-none'
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === activeValue;
            const isOptionDisabled = disabled || option.disabled;

            return (
              <button
                key={String(option.value)}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isOptionDisabled}
                tabIndex={-1}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  segmentedItemVariants({ size }),
                  fullWidth && 'flex-1',
                  isSelected
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                )}
              >
                {option.icon && (
                  <span data-slot="segmented-icon" className="inline-flex shrink-0 items-center justify-center">
                    {option.icon}
                  </span>
                )}
                <span>{option.label}</span>
                {option.badge !== undefined && (
                  <span
                    data-slot="segmented-badge"
                    className={cn(
                      'inline-flex items-center justify-center rounded-full px-1.5 text-[0.625rem] font-semibold leading-tight',
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted-foreground/15 text-muted-foreground'
                    )}
                  >
                    {option.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';

