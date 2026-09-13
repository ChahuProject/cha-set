import * as React from 'react';
import { Slider, type SliderSize } from '../slider';
import { cn } from '../lib/utils';

export interface SnapSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'value'> {
  value?: number;
  defaultValue?: number;
  count?: number;
  labels?: string[];
  leftLabel?: string;
  rightLabel?: string;
  showTicks?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: SliderSize;
  onChange?: (index: number) => void;
  onValueChange?: (index: number) => void;
}

export const SnapSlider = React.forwardRef<HTMLDivElement, SnapSliderProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      count: propCount,
      labels = [],
      leftLabel = '',
      rightLabel = '',
      showTicks = true,
      disabled = false,
      readOnly = false,
      size = 'default',
      onChange,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const effectiveCount = Math.max(2, propCount ?? (labels.length > 0 ? labels.length : 5));
    const maxIndex = effectiveCount - 1;

    const isControlled = value !== undefined;
    const [internalIndex, setInternalIndex] = React.useState<number>(() =>
      Math.max(0, Math.min(maxIndex, defaultValue)),
    );

    const currentIndex = Math.max(0, Math.min(maxIndex, isControlled ? value : internalIndex));

    const handleValueChange = React.useCallback(
      (newVal: number) => {
        const snapped = Math.round(newVal);
        if (!isControlled) {
          setInternalIndex(snapped);
        }
        onChange?.(snapped);
        onValueChange?.(snapped);
      },
      [isControlled, onChange, onValueChange],
    );

    const activeLabelText =
      labels && currentIndex >= 0 && currentIndex < labels.length
        ? labels[currentIndex]
        : String(currentIndex);

    return (
      <div
        ref={ref}
        data-slot="snap-slider"
        className={cn('w-full flex flex-col gap-1', className)}
        {...props}
      >
        <Slider
          min={0}
          max={maxIndex}
          step={1}
          value={currentIndex}
          onValueChange={handleValueChange}
          showTicks={showTicks}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={currentIndex}
          aria-valuetext={activeLabelText}
        />
        {(leftLabel || rightLabel || labels.length > 0) && (
          <div className="flex items-center justify-between text-xs mt-0.5 select-none">
            <span className="text-muted-foreground text-left min-w-[3.5rem]">
              {leftLabel}
            </span>
            <span className="font-semibold text-foreground text-center flex-1 truncate px-2">
              {activeLabelText}
            </span>
            <span className="text-muted-foreground text-right min-w-[3.5rem]">
              {rightLabel}
            </span>
          </div>
        )}
      </div>
    );
  },
);

SnapSlider.displayName = 'SnapSlider';
