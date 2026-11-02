import * as React from 'react';
import { cn } from '../lib/utils';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderSize = 'default' | 'sm';
export type SliderValue = number | [number, number];

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: SliderValue;
  defaultValue?: SliderValue;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  minStepsBetweenThumbs?: number;
  commitOnRelease?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: SliderSize;
  orientation?: SliderOrientation;
  showTicks?: boolean;
  marks?: string[];
  count?: number;
  labels?: string[];
  leftLabel?: string;
  rightLabel?: string;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  onValueChange?: (value: any) => void;
  onChange?: (value: any) => void;
  onValueCommit?: (value: any) => void;
  name?: string;
  forceHover?: boolean;
  forceFocus?: boolean;
  ariaLabel?: string;
}

function snapToStep(val: number, min: number, max: number, step: number): number {
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const clamped = Math.min(Math.max(val, safeMin), safeMax);
  if (step <= 0) return clamped;
  const steps = Math.round((clamped - safeMin) / step);
  const stepped = safeMin + steps * step;
  const stepDecimals = (step.toString().split('.')[1] || '').length;
  const result = Number(Math.min(safeMax, Math.max(safeMin, stepped)).toFixed(stepDecimals));
  return result;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min: propMin,
      max: propMax,
      step = 1,
      range = false,
      minStepsBetweenThumbs = 0,
      commitOnRelease = false,
      disabled = false,
      readOnly = false,
      size = 'default',
      orientation = 'horizontal',
      showTicks = false,
      marks,
      count,
      labels,
      leftLabel,
      rightLabel,
      showTooltip = false,
      formatValue,
      onValueChange,
      onChange,
      onValueCommit,
      name,
      forceHover = false,
      forceFocus = false,
      ariaLabel,
      onClick,
      ...props
    },
    ref,
  ) => {
    // Mode determination
    const isRange =
      range ||
      Array.isArray(value) ||
      (Array.isArray(defaultValue) && defaultValue.length === 2);

    const effectiveMin = propMin ?? 0;
    const effectiveMax =
      propMax ?? (count !== undefined && count > 1 ? count - 1 : 100);

    const min = Math.min(effectiveMin, effectiveMax);
    const max = Math.max(effectiveMin, effectiveMax);

    // Initial state setup
    const isControlled = value !== undefined;

    // Single mode state
    const [internalSingle, setInternalSingle] = React.useState<number>(() => {
      if (typeof defaultValue === 'number') return defaultValue;
      return min;
    });

    // Range mode state
    const [internalRange, setInternalRange] = React.useState<[number, number]>(() => {
      if (Array.isArray(defaultValue) && defaultValue.length === 2) {
        return [defaultValue[0], defaultValue[1]];
      }
      return [min, max];
    });

    // Current committed values
    const currentSingle = isControlled
      ? typeof value === 'number'
        ? snapToStep(value, min, max, step)
        : min
      : snapToStep(internalSingle, min, max, step);

    const currentRange: [number, number] = React.useMemo(() => {
      return isControlled
        ? Array.isArray(value) && value.length === 2
          ? [snapToStep(value[0], min, max, step), snapToStep(value[1], min, max, step)]
          : [min, max]
        : [
            snapToStep(internalRange[0], min, max, step),
            snapToStep(internalRange[1], min, max, step),
          ];
    }, [isControlled, value, internalRange, min, max, step]);

    // Transient drag state (used during active dragging)
    const [dragSingle, setDragSingle] = React.useState<number>(currentSingle);
    const [dragRange, setDragRange] = React.useState<[number, number]>(currentRange);
    const [isDragging, setIsDragging] = React.useState(false);
    const [activeThumbIndex, setActiveThumbIndex] = React.useState<0 | 1 | null>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [focusedThumb, setFocusedThumb] = React.useState<0 | 1 | null>(null);

    // Sync transient states when not dragging
    React.useEffect(() => {
      if (!isDragging) {
        setDragSingle((prev) => (prev === currentSingle ? prev : currentSingle));
      }
    }, [currentSingle, isDragging]);

    const rangeStart = currentRange[0];
    const rangeEnd = currentRange[1];
    React.useEffect(() => {
      if (!isDragging) {
        setDragRange((prev) => {
          if (prev[0] === rangeStart && prev[1] === rangeEnd) {
            return prev;
          }
          return [rangeStart, rangeEnd];
        });
      }
    }, [rangeStart, rangeEnd, isDragging]);

    // DOM references
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const trackRef = React.useRef<HTMLSpanElement | null>(null);
    const thumb0Ref = React.useRef<HTMLSpanElement | null>(null);
    const thumb1Ref = React.useRef<HTMLSpanElement | null>(null);

    const minGap = minStepsBetweenThumbs * step;

    // Tick computations
    const tickCount =
      marks && marks.length > 0
        ? marks.length
        : count && count > 1
        ? count
        : showTicks && step > 0
        ? Math.min(21, Math.max(2, Math.round((max - min) / step) + 1))
        : 0;

    const ticks = React.useMemo(() => {
      if (tickCount <= 0) return [];
      return Array.from({ length: tickCount }, (_, i) => {
        const pct = (i / (tickCount - 1)) * 100;
        const markLabel = marks && marks[i] !== undefined ? marks[i] : null;
        return { index: i, pct, label: markLabel };
      });
    }, [tickCount, marks]);

    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    // Commit functions
    const commitSingle = React.useCallback(
      (nextRaw: number) => {
        const nextVal = snapToStep(nextRaw, min, max, step);
        if (!isControlled) {
          setInternalSingle(nextVal);
        }
        if (nextVal !== currentSingle) {
          onValueChange?.(nextVal);
          onChange?.(nextVal);
        }
        onValueCommit?.(nextVal);
      },
      [min, max, step, isControlled, currentSingle, onValueChange, onChange, onValueCommit],
    );

    const commitRange = React.useCallback(
      (nextRange: [number, number]) => {
        const safe0 = snapToStep(nextRange[0], min, max, step);
        const safe1 = snapToStep(nextRange[1], min, max, step);
        const next: [number, number] = [Math.min(safe0, safe1 - minGap), Math.max(safe1, safe0 + minGap)];
        if (!isControlled) {
          setInternalRange(next);
        }
        if (next[0] !== currentRange[0] || next[1] !== currentRange[1]) {
          onValueChange?.(next);
          onChange?.(next);
        }
        onValueCommit?.(next);
      },
      [min, max, step, minGap, isControlled, currentRange, onValueChange, onChange, onValueCommit],
    );

    // Coordinate to value calculation
    const getValueFromCoords = React.useCallback(
      (clientX: number, clientY: number): number => {
        const root = rootRef.current;
        const track = trackRef.current;
        const target =
          track && (track.getBoundingClientRect().width > 0 || track.getBoundingClientRect().height > 0)
            ? track
            : root || track;
        if (!target) return min;
        const rect = target.getBoundingClientRect();
        let ratio = 0;
        if (orientation === 'horizontal') {
          const width = rect.width || 1;
          ratio = (clientX - rect.left) / width;
        } else {
          const height = rect.height || 1;
          ratio = (rect.bottom - clientY) / height;
        }
        ratio = Math.max(0, Math.min(1, ratio));
        return snapToStep(min + ratio * (max - min), min, max, step);
      },
      [orientation, min, max, step],
    );

    // Pointer down handler
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || readOnly || e.button !== 0) return;
      e.preventDefault();

      const clickedValue = getValueFromCoords(e.clientX, e.clientY);
      setIsDragging(true);

      if (!isRange) {
        thumb0Ref.current?.focus();
        setDragSingle(clickedValue);
        if (!commitOnRelease) {
          if (!isControlled) setInternalSingle(clickedValue);
          if (clickedValue !== currentSingle) {
            onValueChange?.(clickedValue);
            onChange?.(clickedValue);
          }
        }

        let latestValue = clickedValue;
        const onPointerMove = (moveEvt: PointerEvent) => {
          const nextVal = getValueFromCoords(moveEvt.clientX, moveEvt.clientY);
          latestValue = nextVal;
          setDragSingle(nextVal);
          if (!commitOnRelease) {
            if (!isControlled) setInternalSingle(nextVal);
            onValueChange?.(nextVal);
            onChange?.(nextVal);
          }
        };

        const onPointerUp = () => {
          setIsDragging(false);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          commitSingle(latestValue);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      } else {
        // Range mode: determine nearest thumb
        const d0 = Math.abs(clickedValue - currentRange[0]);
        const d1 = Math.abs(clickedValue - currentRange[1]);
        const activeIdx: 0 | 1 = d0 <= d1 ? 0 : 1;
        setActiveThumbIndex(activeIdx);
        setFocusedThumb(activeIdx);
        if (activeIdx === 0) thumb0Ref.current?.focus();
        else thumb1Ref.current?.focus();

        let initialRange: [number, number];
        if (activeIdx === 0) {
          const maxLow = currentRange[1] - minGap;
          initialRange = [Math.min(clickedValue, maxLow), currentRange[1]];
        } else {
          const minHigh = currentRange[0] + minGap;
          initialRange = [currentRange[0], Math.max(clickedValue, minHigh)];
        }

        setDragRange(initialRange);
        if (!commitOnRelease) {
          if (!isControlled) setInternalRange(initialRange);
          if (initialRange[0] !== currentRange[0] || initialRange[1] !== currentRange[1]) {
            onValueChange?.(initialRange);
            onChange?.(initialRange);
          }
        }

        let latestRange = initialRange;
        const onPointerMove = (moveEvt: PointerEvent) => {
          const nextCoordVal = getValueFromCoords(moveEvt.clientX, moveEvt.clientY);
          let updated: [number, number];
          if (activeIdx === 0) {
            const maxLow = currentRange[1] - minGap;
            updated = [Math.min(nextCoordVal, maxLow), currentRange[1]];
          } else {
            const minHigh = currentRange[0] + minGap;
            updated = [currentRange[0], Math.max(nextCoordVal, minHigh)];
          }
          latestRange = updated;
          setDragRange(updated);
          if (!commitOnRelease) {
            if (!isControlled) setInternalRange(updated);
            onValueChange?.(updated);
            onChange?.(updated);
          }
        };

        const onPointerUp = () => {
          setIsDragging(false);
          setActiveThumbIndex(null);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          commitRange(latestRange);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLSpanElement>,
      thumbIndex: 0 | 1 = 0,
    ) => {
      if (disabled || readOnly) return;
      const largeStep = Math.max(step * 10, (max - min) / 10);

      if (e.key === 'Tab') {
        if (isRange) {
          // Allow normal tab cycling between thumbs
          return;
        }
      }

      if (!isRange) {
        let nextVal = currentSingle;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            nextVal = currentSingle + step;
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            nextVal = currentSingle - step;
            break;
          case 'PageUp':
            e.preventDefault();
            nextVal = currentSingle + largeStep;
            break;
          case 'PageDown':
            e.preventDefault();
            nextVal = currentSingle - largeStep;
            break;
          case 'Home':
            e.preventDefault();
            nextVal = min;
            break;
          case 'End':
            e.preventDefault();
            nextVal = max;
            break;
          default:
            return;
        }
        commitSingle(nextVal);
      } else {
        // Range mode
        let [low, high] = currentRange;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            if (thumbIndex === 0) {
              low = Math.min(low + step, high - minGap);
            } else {
              high = Math.min(high + step, max);
            }
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            if (thumbIndex === 0) {
              low = Math.max(low - step, min);
            } else {
              high = Math.max(high - step, low + minGap);
            }
            break;
          case 'PageUp':
            e.preventDefault();
            if (thumbIndex === 0) {
              low = Math.min(low + largeStep, high - minGap);
            } else {
              high = Math.min(high + largeStep, max);
            }
            break;
          case 'PageDown':
            e.preventDefault();
            if (thumbIndex === 0) {
              low = Math.max(low - largeStep, min);
            } else {
              high = Math.max(high - largeStep, low + minGap);
            }
            break;
          case 'Home':
            e.preventDefault();
            if (thumbIndex === 0) low = min;
            else high = low + minGap;
            break;
          case 'End':
            e.preventDefault();
            if (thumbIndex === 1) high = max;
            else low = high - minGap;
            break;
          default:
            return;
        }
        commitRange([low, high]);
      }
    };

    // Calculate display percentages
    const span = Math.max(0.0001, max - min);
    const activeSingleVal = isDragging && commitOnRelease ? dragSingle : currentSingle;
    const activeRangeVal = isDragging && commitOnRelease ? dragRange : currentRange;

    const singlePct = Math.max(0, Math.min(100, ((activeSingleVal - min) / span) * 100));
    const rangeLowPct = Math.max(0, Math.min(100, ((activeRangeVal[0] - min) / span) * 100));
    const rangeHighPct = Math.max(0, Math.min(100, ((activeRangeVal[1] - min) / span) * 100));

    const isSm = size === 'sm';
    const hasLabels = Boolean(
      leftLabel || rightLabel || (labels && labels.length > 0),
    );

    const activeLabelText = React.useMemo(() => {
      if (labels && labels.length > 0) {
        const idx = Math.round(activeSingleVal);
        if (idx >= 0 && idx < labels.length) return labels[idx];
      }
      if (isRange) {
        const v0 = formatValue ? formatValue(activeRangeVal[0]) : String(activeRangeVal[0]);
        const v1 = formatValue ? formatValue(activeRangeVal[1]) : String(activeRangeVal[1]);
        return `${v0} - ${v1}`;
      }
      return formatValue ? formatValue(activeSingleVal) : String(activeSingleVal);
    }, [labels, activeSingleVal, isRange, activeRangeVal, formatValue]);

    return (
      <div
        ref={composedRef}
        data-slot="slider"
        data-orientation={orientation}
        data-size={size}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        className={cn(
          'relative flex touch-none select-none',
          orientation === 'horizontal'
            ? 'w-full flex-col justify-center'
            : 'h-full flex-col items-center justify-center',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : readOnly
            ? 'cursor-default'
            : 'cursor-pointer',
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={onClick}
        {...props}
      >
        <div
          className={cn(
            'relative flex items-center',
            orientation === 'horizontal' ? 'w-full h-4' : 'h-full w-4 flex-col justify-center',
          )}
        >
          {/* Track */}
          <span
            ref={trackRef}
            data-slot="slider-track"
            className={cn(
              'relative grow overflow-hidden rounded-full bg-secondary',
              orientation === 'horizontal'
                ? isSm
                  ? 'h-1 w-full'
                  : 'h-1.5 w-full'
                : isSm
                ? 'w-1 h-full'
                : 'w-1.5 h-full',
            )}
          >
            {/* Active Range Fill */}
            <span
              data-slot="slider-range"
              className={cn(
                'absolute bg-primary rounded-full',
                orientation === 'horizontal' ? 'h-full' : 'w-full',
              )}
              style={
                !isRange
                  ? orientation === 'horizontal'
                    ? { left: 0, width: `${singlePct}%` }
                    : { bottom: 0, height: `${singlePct}%` }
                  : orientation === 'horizontal'
                  ? { left: `${rangeLowPct}%`, width: `${rangeHighPct - rangeLowPct}%` }
                  : { bottom: `${rangeLowPct}%`, height: `${rangeHighPct - rangeLowPct}%` }
              }
            />
          </span>

          {/* Ticks */}
          {ticks.length > 0 && (
            <div
              data-slot="slider-ticks"
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-between',
                orientation === 'vertical' && 'flex-col',
              )}
            >
              {ticks.map((t) => {
                const isPassed = !isRange
                  ? t.pct <= singlePct
                  : t.pct >= rangeLowPct && t.pct <= rangeHighPct;
                return (
                  <span
                    key={t.index}
                    data-slot="slider-tick"
                    className={cn(
                      'rounded-full z-[1]',
                      orientation === 'horizontal' ? 'w-1 h-1' : 'h-1 w-1',
                      isPassed ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                    style={
                      orientation === 'horizontal'
                        ? { position: 'absolute', left: `${t.pct}%`, transform: 'translateX(-50%)' }
                        : { position: 'absolute', bottom: `${t.pct}%`, transform: 'translateY(50%)' }
                    }
                  />
                );
              })}
            </div>
          )}

          {/* Marks */}
          {marks && marks.length > 0 && (
            <div
              data-slot="slider-marks"
              className={cn(
                'absolute flex text-micro text-muted-foreground select-none pointer-events-none',
                orientation === 'horizontal'
                  ? 'w-full -bottom-4'
                  : 'h-full -right-6 flex-col-reverse',
              )}
            >
              {ticks.map((t) => (
                <span
                  key={t.index}
                  style={
                    orientation === 'horizontal'
                      ? { position: 'absolute', left: `${t.pct}%`, transform: 'translateX(-50%)' }
                      : { position: 'absolute', bottom: `${t.pct}%`, transform: 'translateY(50%)' }
                  }
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}

          {/* Thumb 0 (Single Thumb or Low Thumb in Range) */}
          <span
            ref={thumb0Ref}
            role="slider"
            data-slot="slider-thumb"
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel || (isRange ? 'Minimum' : undefined)}
            aria-valuemin={min}
            aria-valuemax={isRange ? currentRange[1] - minGap : max}
            aria-valuenow={!isRange ? activeSingleVal : activeRangeVal[0]}
            aria-orientation={orientation}
            aria-disabled={disabled}
            aria-readonly={readOnly || undefined}
            onFocus={() => setFocusedThumb(0)}
            onBlur={() => setFocusedThumb(null)}
            className={cn(
              /* theme-adaptive:allow decorative-thumb — slider thumb, no text content */
              'block rounded-full border-2 border-primary bg-background shadow-xs transition-[scale,box-shadow] duration-quick ease-standard focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 hover:scale-105 active:scale-95 z-10',
              disabled
                ? 'cursor-not-allowed'
                : readOnly
                ? 'cursor-default'
                : 'cursor-grab active:cursor-grabbing',
              isSm ? 'size-3' : 'size-4',
              isDragging &&
                (!isRange || activeThumbIndex === 0) &&
                !readOnly &&
                'cursor-grabbing scale-95',
              forceHover && 'scale-105',
              forceFocus && 'ring-1 ring-ring outline-hidden',
            )}
            style={
              orientation === 'horizontal'
                ? {
                    position: 'absolute',
                    left: `${!isRange ? singlePct : rangeLowPct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }
                : {
                    position: 'absolute',
                    bottom: `${!isRange ? singlePct : rangeLowPct}%`,
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                  }
            }
            onKeyDown={(e) => handleKeyDown(e, 0)}
          >
            {showTooltip &&
              (isDragging || isHovered || focusedThumb === 0 || forceHover || forceFocus) && (
                <div
                  data-slot="slider-tooltip"
                  className={cn(
                    'absolute pointer-events-none z-20 whitespace-nowrap rounded border border-border bg-popover px-1.5 py-0.5 text-xs font-mono font-medium text-popover-foreground shadow-xs select-none',
                    orientation === 'horizontal'
                      ? '-top-7 left-1/2 -translate-x-1/2'
                      : '-right-9 top-1/2 -translate-y-1/2',
                  )}
                >
                  {formatValue
                    ? formatValue(!isRange ? activeSingleVal : activeRangeVal[0])
                    : !isRange
                    ? activeSingleVal
                    : activeRangeVal[0]}
                </div>
              )}
          </span>

          {/* Thumb 1 (High Thumb for Range mode) */}
          {isRange && (
            <span
              ref={thumb1Ref}
              role="slider"
              data-slot="slider-thumb"
              tabIndex={disabled ? -1 : 0}
              aria-label={ariaLabel || 'Maximum'}
              aria-valuemin={currentRange[0] + minGap}
              aria-valuemax={max}
              aria-valuenow={activeRangeVal[1]}
              aria-orientation={orientation}
              aria-disabled={disabled}
              aria-readonly={readOnly || undefined}
              onFocus={() => setFocusedThumb(1)}
              onBlur={() => setFocusedThumb(null)}
              className={cn(
                /* theme-adaptive:allow decorative-thumb — slider thumb, no text content */
                'block rounded-full border-2 border-primary bg-background shadow-xs transition-[scale,box-shadow] duration-quick ease-standard focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 hover:scale-105 active:scale-95 z-10',
                disabled
                  ? 'cursor-not-allowed'
                  : readOnly
                  ? 'cursor-default'
                  : 'cursor-grab active:cursor-grabbing',
                isSm ? 'size-3' : 'size-4',
                isDragging && activeThumbIndex === 1 && !readOnly && 'cursor-grabbing scale-95',
                forceHover && 'scale-105',
                forceFocus && 'ring-1 ring-ring outline-hidden',
              )}
              style={
                orientation === 'horizontal'
                  ? {
                      position: 'absolute',
                      left: `${rangeHighPct}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }
                  : {
                      position: 'absolute',
                      bottom: `${rangeHighPct}%`,
                      left: '50%',
                      transform: 'translate(-50%, 50%)',
                    }
              }
              onKeyDown={(e) => handleKeyDown(e, 1)}
            >
              {showTooltip &&
                (isDragging || isHovered || focusedThumb === 1 || forceHover || forceFocus) && (
                  <div
                    data-slot="slider-tooltip"
                    className={cn(
                      'absolute pointer-events-none z-20 whitespace-nowrap rounded border border-border bg-popover px-1.5 py-0.5 text-xs font-mono font-medium text-popover-foreground shadow-xs select-none',
                      orientation === 'horizontal'
                        ? '-top-7 left-1/2 -translate-x-1/2'
                        : '-right-9 top-1/2 -translate-y-1/2',
                    )}
                  >
                    {formatValue ? formatValue(activeRangeVal[1]) : activeRangeVal[1]}
                  </div>
                )}
            </span>
          )}

          {name && (
            <input
              type="hidden"
              name={name}
              value={!isRange ? activeSingleVal : `${activeRangeVal[0]},${activeRangeVal[1]}`}
            />
          )}
        </div>

        {/* Labels row for Snap mode / presets */}
        {hasLabels && orientation === 'horizontal' && (
          <div className="flex items-center justify-between text-xs mt-1 select-none">
            <span className="text-muted-foreground text-left min-w-[3.5rem]">{leftLabel}</span>
            <span className="font-semibold text-foreground text-center flex-1 truncate px-2">
              {activeLabelText}
            </span>
            <span className="text-muted-foreground text-right min-w-[3.5rem]">{rightLabel}</span>
          </div>
        )}
      </div>
    );
  },
);

Slider.displayName = 'Slider';
