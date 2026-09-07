import * as React from 'react';
import { cn } from '../lib/utils';

export interface RangeSliderProps {
  /** Range value as a [low, high] tuple */
  value: [number, number];
  /** Minimum range boundary (default: 0) */
  min?: number;
  /** Maximum range boundary (default: 100) */
  max?: number;
  /** Step increment for keyboard navigation and dragging (default: (max - min) / 100) */
  step?: number;
  /** Callback fired when the range changes */
  onChange?: (value: [number, number]) => void;
  /** Aria label prefix for the thumbs */
  ariaLabel?: string;
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Container class name */
  className?: string;
}

export function RangeSlider({
  value,
  min = 0,
  max = 100,
  step,
  onChange,
  ariaLabel,
  disabled = false,
  className,
}: RangeSliderProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const draggingRef = React.useRef<'low' | 'high' | null>(null);
  const currentValueRef = React.useRef(value);

  React.useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  const isValid = max > min;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => {
    if (!step || step <= 0) return v;
    const steps = Math.round((v - min) / step);
    return clamp(min + steps * step);
  };
  const getRatio = (v: number) => (isValid ? ((clamp(v) - min) / (max - min)) * 100 : 50);
  const stepSize = step ?? (max - min) / 100;

  const getValueFromClientX = (clientX: number): number => {
    const track = trackRef.current;
    if (!track || !isValid) return min;
    const rect = track.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / (rect.width || 1)));
    return snap(clamp(min + t * (max - min)));
  };

  const setLow = (v: number) => {
    const [_, currentHigh] = currentValueRef.current;
    const newLow = snap(clamp(Math.min(v, currentHigh)));
    onChange?.([newLow, currentHigh]);
  };

  const setHigh = (v: number) => {
    const [currentLow, _] = currentValueRef.current;
    const newHigh = snap(clamp(Math.max(v, currentLow)));
    onChange?.([currentLow, newHigh]);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !isValid) return;
    e.preventDefault();
    const v = getValueFromClientX(e.clientX);
    const [currentLow, currentHigh] = currentValueRef.current;
    const distLow = Math.abs(v - currentLow);
    const distHigh = Math.abs(v - currentHigh);

    if (distHigh < distLow) {
      setHigh(v);
      draggingRef.current = 'high';
    } else {
      setLow(v);
      draggingRef.current = 'low';
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleThumbPointerDown = (which: 'low' | 'high') => (e: React.PointerEvent) => {
    if (disabled || !isValid) return;
    e.stopPropagation();
    e.preventDefault();
    draggingRef.current = which;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || disabled) return;
    const v = getValueFromClientX(e.clientX);
    if (draggingRef.current === 'low') {
      setLow(v);
    } else {
      setHigh(v);
    }
  };

  const handlePointerUp = () => {
    draggingRef.current = null;
  };

  const handleKeyDown = (which: 'low' | 'high') => (e: React.KeyboardEvent) => {
    if (disabled || !isValid) return;
    const [currentLow, currentHigh] = currentValueRef.current;

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
      if (which === 'low') onChange?.([min, currentHigh]);
      else onChange?.([currentLow, currentLow]);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (which === 'low') onChange?.([currentHigh, currentHigh]);
      else onChange?.([currentLow, max]);
    }
  };

  const lowRatio = getRatio(value[0]);
  const highRatio = getRatio(value[1]);

  return (
    <div
      data-slot="range-slider"
      className={cn(
        'relative w-full select-none touch-none',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <div
        ref={trackRef}
        className="relative h-6 cursor-pointer"
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-input" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${lowRatio}%`, width: `${highRatio - lowRatio}%` }}
        />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel ? `${ariaLabel} low` : 'Low value'}
          aria-valuemin={min}
          aria-valuemax={value[1]}
          aria-valuenow={value[0]}
          aria-orientation="horizontal"
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-primary bg-background shadow-xs outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/60 active:cursor-grabbing active:ring-2 active:ring-ring/60"
          style={{ left: `${lowRatio}%` }}
          onPointerDown={handleThumbPointerDown('low')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown('low')}
        />
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel ? `${ariaLabel} high` : 'High value'}
          aria-valuemin={value[0]}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          aria-orientation="horizontal"
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-primary bg-background shadow-xs outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/60 active:cursor-grabbing active:ring-2 active:ring-ring/60"
          style={{ left: `${highRatio}%` }}
          onPointerDown={handleThumbPointerDown('high')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown('high')}
        />
      </div>
    </div>
  );
}
