import * as React from 'react';
import { cn } from '../lib/utils';

export type RangeSliderSize = 'default' | 'sm';

export interface RangeSliderProps {
  /** Range value as a [low, high] tuple */
  value?: [number, number];
  /** Default range value for uncontrolled mode */
  defaultValue?: [number, number];
  /** Minimum range boundary (default: 0) */
  min?: number;
  /** Maximum range boundary (default: 100) */
  max?: number;
  /** Step increment for keyboard navigation and dragging (default: (max - min) / 100) */
  step?: number;
  /** Minimum number of steps between thumbs (default: 0) */
  minStepsBetweenThumbs?: number;
  /** Callback fired when the range changes */
  onChange?: (value: [number, number]) => void;
  /** Alias for onChange */
  onValueChange?: (value: [number, number]) => void;
  /** Aria label prefix for the thumbs */
  ariaLabel?: string;
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Whether the range slider is read-only */
  readOnly?: boolean;
  /** Sizing variant ('default' | 'sm') */
  size?: RangeSliderSize;
  /** Whether to show value tooltips above thumbs on hover/drag/focus */
  showTooltip?: boolean;
  /** Custom formatter for the tooltip value */
  formatValue?: (val: number) => string;
  /** Container class name */
  className?: string;
}

export function RangeSlider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step,
  minStepsBetweenThumbs = 0,
  onChange,
  onValueChange,
  ariaLabel,
  disabled = false,
  readOnly = false,
  size = 'default',
  showTooltip = false,
  formatValue,
  className,
}: RangeSliderProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const draggingRef = React.useRef<'low' | 'high' | null>(null);
  const [activeDragging, setActiveDragging] = React.useState<'low' | 'high' | null>(null);
  const [hoveredThumb, setHoveredThumb] = React.useState<'low' | 'high' | null>(null);
  const [focusedThumb, setFocusedThumb] = React.useState<'low' | 'high' | null>(null);
  
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<[number, number]>(
    value ?? defaultValue ?? [min, max],
  );
  const currentRange = isControlled ? value : internalValue;

  const isValid = max > min;
  const isInteractive = !disabled && !readOnly && isValid;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => {
    if (!step || step <= 0) return v;
    const steps = Math.round((v - min) / step);
    return clamp(min + steps * step);
  };
  const getRatio = (v: number) => (isValid ? ((clamp(v) - min) / (max - min)) * 100 : 50);
  const stepSize = step ?? (max - min) / 100;
  const minGap = minStepsBetweenThumbs * stepSize;

  const notifyChange = (next: [number, number]) => {
    onChange?.(next);
    onValueChange?.(next);
  };

  const getValueFromClientX = (clientX: number): number => {
    const track = trackRef.current;
    if (!track || !isValid) return min;
    const rect = track.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / (rect.width || 1)));
    return snap(clamp(min + t * (max - min)));
  };

  const setLow = (v: number) => {
    if (!isInteractive) return;
    const [_, currentHigh] = currentRange;
    const maxLow = currentHigh - minGap;
    const newLow = snap(clamp(Math.min(v, maxLow)));
    const next: [number, number] = [newLow, currentHigh];
    if (!isControlled) {
      setInternalValue(next);
    }
    notifyChange(next);
  };

  const setHigh = (v: number) => {
    if (!isInteractive) return;
    const [currentLow, _] = currentRange;
    const minHigh = currentLow + minGap;
    const newHigh = snap(clamp(Math.max(v, minHigh)));
    const next: [number, number] = [currentLow, newHigh];
    if (!isControlled) {
      setInternalValue(next);
    }
    notifyChange(next);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    e.preventDefault();
    const v = getValueFromClientX(e.clientX);
    const [currentLow, currentHigh] = currentRange;
    const distLow = Math.abs(v - currentLow);
    const distHigh = Math.abs(v - currentHigh);

    if (distHigh < distLow) {
      setHigh(v);
      draggingRef.current = 'high';
      setActiveDragging('high');
    } else {
      setLow(v);
      draggingRef.current = 'low';
      setActiveDragging('low');
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleThumbPointerDown = (which: 'low' | 'high') => (e: React.PointerEvent) => {
    if (!isInteractive) return;
    e.stopPropagation();
    e.preventDefault();
    draggingRef.current = which;
    setActiveDragging(which);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !isInteractive) return;
    const v = getValueFromClientX(e.clientX);
    if (draggingRef.current === 'low') {
      setLow(v);
    } else {
      setHigh(v);
    }
  };

  const handlePointerUp = () => {
    draggingRef.current = null;
    setActiveDragging(null);
  };

  const handleKeyDown = (which: 'low' | 'high') => (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    const [currentLow, currentHigh] = currentRange;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (which === 'low') setLow(currentLow - stepSize);
      else setHigh(currentHigh - stepSize);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (which === 'low') setLow(currentLow + stepSize);
      else setHigh(currentHigh + stepSize);
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (which === 'low') notifyChange([min, currentHigh]);
      else notifyChange([currentLow, Math.max(currentLow + minGap, currentLow)]);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (which === 'low') notifyChange([Math.min(currentHigh - minGap, currentHigh), currentHigh]);
      else notifyChange([currentLow, max]);
    }
  };

  const lowRatio = getRatio(currentRange[0]);
  const highRatio = getRatio(currentRange[1]);
  const isSm = size === 'sm';

  const showLowTooltip =
    showTooltip &&
    (activeDragging === 'low' || hoveredThumb === 'low' || focusedThumb === 'low');
  const showHighTooltip =
    showTooltip &&
    (activeDragging === 'high' || hoveredThumb === 'high' || focusedThumb === 'high');

  return (
    <div
      data-slot="range-slider"
      className={cn(
        'relative w-full select-none touch-none',
        disabled ? 'cursor-not-allowed opacity-50' : (readOnly ? 'cursor-default' : ''),
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          'relative',
          isSm ? 'h-4' : 'h-6',
          disabled ? 'cursor-not-allowed' : (readOnly ? 'cursor-default' : 'cursor-pointer'),
        )}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={cn(
            'absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-input',
            isSm ? 'h-1' : 'h-1.5',
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-primary',
            isSm ? 'h-1' : 'h-1.5',
          )}
          style={{ left: `${lowRatio}%`, width: `${highRatio - lowRatio}%` }}
        />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel ? `${ariaLabel} low` : 'Low value'}
          aria-valuemin={min}
          aria-valuemax={currentRange[1]}
          aria-valuenow={currentRange[0]}
          aria-readonly={readOnly}
          aria-orientation="horizontal"
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-primary bg-background shadow-xs outline-none transition-shadow duration-quick ease-standard',
            isSm ? 'size-3' : 'size-4',
            readOnly
              ? 'cursor-default'
              : 'cursor-grab focus-visible:ring-2 focus-visible:ring-ring/60 active:cursor-grabbing active:ring-2 active:ring-ring/60',
          )}
          style={{ left: `${lowRatio}%` }}
          onPointerDown={handleThumbPointerDown('low')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setHoveredThumb('low')}
          onMouseLeave={() => setHoveredThumb(null)}
          onFocus={() => setFocusedThumb('low')}
          onBlur={() => setFocusedThumb(null)}
          onKeyDown={handleKeyDown('low')}
        >
          {showLowTooltip && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-popover px-1.5 py-0.5 text-[0.6875rem] font-medium text-popover-foreground shadow-sm border border-border pointer-events-none tabular-nums whitespace-nowrap">
              {formatValue ? formatValue(currentRange[0]) : currentRange[0]}
            </div>
          )}
        </div>
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel ? `${ariaLabel} high` : 'High value'}
          aria-valuemin={currentRange[0]}
          aria-valuemax={max}
          aria-valuenow={currentRange[1]}
          aria-readonly={readOnly}
          aria-orientation="horizontal"
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-primary bg-background shadow-xs outline-none transition-shadow duration-quick ease-standard',
            isSm ? 'size-3' : 'size-4',
            readOnly
              ? 'cursor-default'
              : 'cursor-grab focus-visible:ring-2 focus-visible:ring-ring/60 active:cursor-grabbing active:ring-2 active:ring-ring/60',
          )}
          style={{ left: `${highRatio}%` }}
          onPointerDown={handleThumbPointerDown('high')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setHoveredThumb('high')}
          onMouseLeave={() => setHoveredThumb(null)}
          onFocus={() => setFocusedThumb('high')}
          onBlur={() => setFocusedThumb(null)}
          onKeyDown={handleKeyDown('high')}
        >
          {showHighTooltip && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-popover px-1.5 py-0.5 text-[0.6875rem] font-medium text-popover-foreground shadow-sm border border-border pointer-events-none tabular-nums whitespace-nowrap">
              {formatValue ? formatValue(currentRange[1]) : currentRange[1]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
