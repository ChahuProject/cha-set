import * as React from 'react';
import { cn } from '../lib/utils';

export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: SliderOrientation;
  showTicks?: boolean;
  marks?: string[];
  onValueChange?: (value: number) => void;
  onChange?: (value: number) => void;
  name?: string;
  forceHover?: boolean;
  forceFocus?: boolean;
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
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      orientation = 'horizontal',
      showTicks = false,
      marks,
      onValueChange,
      onChange,
      name,
      forceHover = false,
      forceFocus = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const rawValue = isControlled ? value : internalValue;
    const currentValue = snapToStep(rawValue, min, max, step);

    const [isDragging, setIsDragging] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const trackRef = React.useRef<HTMLSpanElement | null>(null);
    const thumbRef = React.useRef<HTMLSpanElement | null>(null);

    const tickCount = marks && marks.length > 0
      ? marks.length
      : showTicks
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

    const commitValue = React.useCallback(
      (nextRaw: number) => {
        const nextVal = snapToStep(nextRaw, min, max, step);
        if (!isControlled) {
          setInternalValue(nextVal);
        }
        if (nextVal !== currentValue) {
          onValueChange?.(nextVal);
          onChange?.(nextVal);
        }
      },
      [min, max, step, isControlled, currentValue, onValueChange, onChange],
    );

    const updateFromCoords = React.useCallback(
      (clientX: number, clientY: number) => {
        const track = trackRef.current || rootRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        let ratio = 0;
        if (orientation === 'horizontal') {
          const width = rect.width || 100;
          ratio = (clientX - rect.left) / width;
        } else {
          const height = rect.height || 100;
          ratio = (rect.bottom - clientY) / height;
        }
        ratio = Math.max(0, Math.min(1, ratio));
        const raw = min + ratio * (max - min);
        commitValue(raw);
      },
      [orientation, min, max, commitValue],
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      thumbRef.current?.focus();
      setIsDragging(true);
      updateFromCoords(e.clientX, e.clientY);

      const onPointerMove = (moveEvt: PointerEvent) => {
        updateFromCoords(moveEvt.clientX, moveEvt.clientY);
      };

      const onPointerUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.defaultPrevented || disabled || e.button !== 0) return;
      thumbRef.current?.focus();
      setIsDragging(true);
      updateFromCoords(e.clientX, e.clientY);

      const onMouseMove = (moveEvt: MouseEvent) => {
        updateFromCoords(moveEvt.clientX, moveEvt.clientY);
      };

      const onMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      updateFromCoords(e.clientX, e.clientY);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;
      let nextVal = currentValue;
      const largeStep = Math.max(step * 10, (max - min) / 10);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          nextVal = currentValue + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          nextVal = currentValue - step;
          break;
        case 'PageUp':
          e.preventDefault();
          nextVal = currentValue + largeStep;
          break;
        case 'PageDown':
          e.preventDefault();
          nextVal = currentValue - largeStep;
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

      commitValue(nextVal);
    };

    const percentage =
      max > min ? Math.max(0, Math.min(100, ((currentValue - min) / (max - min)) * 100)) : 0;

    return (
      <div
        ref={composedRef}
        data-slot="slider"
        data-orientation={orientation}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'relative flex touch-none select-none items-center',
          orientation === 'horizontal' ? 'w-full h-4' : 'h-full w-4 flex-col justify-center',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        onPointerDown={handlePointerDown}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        {...props}
      >
        <span
          ref={trackRef}
          data-slot="slider-track"
          className={cn(
            'relative grow overflow-hidden rounded-full bg-secondary',
            orientation === 'horizontal' ? 'h-1.5 w-full' : 'w-1.5 h-full',
          )}
        >
          <span
            data-slot="slider-range"
            className={cn(
              'absolute bg-primary rounded-full',
              orientation === 'horizontal' ? 'h-full' : 'w-full bottom-0',
            )}
            style={
              orientation === 'horizontal'
                ? { left: 0, width: `${percentage}%` }
                : { bottom: 0, height: `${percentage}%` }
            }
          />
        </span>
        {ticks.length > 0 && (
          <div
            data-slot="slider-ticks"
            className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-between',
              orientation === 'vertical' && 'flex-col',
            )}
          >
            {ticks.map((t) => (
              <span
                key={t.index}
                data-slot="slider-tick"
                className={cn(
                  'rounded-full z-[1]',
                  orientation === 'horizontal' ? 'w-1 h-1' : 'h-1 w-1',
                  t.pct <= percentage ? 'bg-primary' : 'bg-muted-foreground/40',
                )}
                style={
                  orientation === 'horizontal'
                    ? { position: 'absolute', left: `${t.pct}%`, transform: 'translateX(-50%)' }
                    : { position: 'absolute', bottom: `${t.pct}%`, transform: 'translateY(50%)' }
                }
              />
            ))}
          </div>
        )}
        {marks && marks.length > 0 && (
          <div
            data-slot="slider-marks"
            className={cn(
              'absolute flex text-[10px] text-muted-foreground select-none pointer-events-none',
              orientation === 'horizontal' ? 'w-full -bottom-4' : 'h-full -right-6 flex-col-reverse',
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
        <span
          ref={thumbRef}
          role="slider"
          data-slot="slider-thumb"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-orientation={orientation}
          aria-disabled={disabled}
          className={cn(
            'block size-4 rounded-full border-2 border-primary bg-background shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing',
            isDragging && 'cursor-grabbing scale-95',
            forceHover && 'scale-105',
            forceFocus && 'ring-1 ring-ring outline-hidden',
          )}
          style={
            orientation === 'horizontal'
              ? {
                  position: 'absolute',
                  left: `${percentage}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }
              : {
                  position: 'absolute',
                  bottom: `${percentage}%`,
                  left: '50%',
                  transform: 'translate(-50%, 50%)',
                }
          }
          onKeyDown={handleKeyDown}
        />
        {name && (
          <input
            type="hidden"
            name={name}
            value={currentValue}
          />
        )}
      </div>
    );
  },
);

Slider.displayName = 'Slider';
