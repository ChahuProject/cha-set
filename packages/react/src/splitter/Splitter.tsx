import * as React from 'react';
import { cn } from '../lib/utils';

export interface SplitterProps {
  /** Controlled percentage size (0-100) */
  size?: number;
  /** Callback fired on drag with new percentage */
  onChange?: (size: number) => void;
  /** Initial percentage size (default: 50) */
  initialSize?: number;
  /** Minimum percentage size (default: 0) */
  minSize?: number;
  /** Maximum percentage size (default: 100) */
  maxSize?: number;
  /** Orientation of the divider (default: 'vertical' which separates left/right panes) */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function Splitter({
  size,
  onChange,
  initialSize = 50,
  minSize = 0,
  maxSize = 100,
  orientation = 'vertical',
  className,
}: SplitterProps) {
  const [internalSize, setInternalSize] = React.useState(initialSize);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragOriginRef = React.useRef<{
    startX: number;
    startY: number;
    startSize: number;
    containerDimension: number;
  } | null>(null);
  const selfRef = React.useRef<HTMLDivElement>(null);

  const currentSize = size ?? internalSize;
  const clamp = (val: number) => Math.min(maxSize, Math.max(minSize, val));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const parent = selfRef.current?.parentElement;
    const containerDimension =
      orientation === 'vertical'
        ? (parent?.clientWidth ?? window.innerWidth)
        : (parent?.clientHeight ?? window.innerHeight);

    if (containerDimension <= 0) return;
    dragOriginRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startSize: currentSize,
      containerDimension,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOriginRef.current;
    if (!origin) return;

    const delta =
      orientation === 'vertical' ? e.clientX - origin.startX : e.clientY - origin.startY;

    const nextSize = clamp(origin.startSize + (delta / origin.containerDimension) * 100);
    setInternalSize(nextSize);
    onChange?.(nextSize);
  };

  const handlePointerUp = () => {
    dragOriginRef.current = null;
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (!isDragging || typeof document === 'undefined') return;
    const cursorClass = orientation === 'vertical' ? 'cursor-col-resize' : 'cursor-row-resize';
    document.body.classList.add('select-none', cursorClass);
    return () => document.body.classList.remove('select-none', cursorClass);
  }, [isDragging, orientation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (orientation === 'vertical') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = clamp(currentSize - 2);
        setInternalSize(next);
        onChange?.(next);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = clamp(currentSize + 2);
        setInternalSize(next);
        onChange?.(next);
      }
    } else {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = clamp(currentSize - 2);
        setInternalSize(next);
        onChange?.(next);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = clamp(currentSize + 2);
        setInternalSize(next);
        onChange?.(next);
      }
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setInternalSize(minSize);
      onChange?.(minSize);
    } else if (e.key === 'End') {
      e.preventDefault();
      setInternalSize(maxSize);
      onChange?.(maxSize);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setInternalSize(initialSize);
      onChange?.(initialSize);
    }
  };

  return (
    <div
      ref={selfRef}
      role="separator"
      aria-orientation={orientation}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={() => {
        setInternalSize(initialSize);
        onChange?.(initialSize);
      }}
      data-slot="splitter"
      data-state={isDragging ? 'dragging' : 'idle'}
      className={cn(
        'group/splitter relative z-10 select-none touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring',
        orientation === 'vertical'
          ? 'mx-0.5 w-2 shrink-0 cursor-col-resize'
          : 'my-0.5 h-2 shrink-0 cursor-row-resize',
        className,
      )}
    >
      <div
        className={cn(
          'absolute rounded-full opacity-0 transition-opacity',
          orientation === 'vertical'
            ? 'inset-y-0 left-1/2 w-0.5 -translate-x-1/2'
            : 'inset-x-0 top-1/2 h-0.5 -translate-y-1/2',
          isDragging
            ? 'bg-primary opacity-100'
            : 'group-hover/splitter:bg-primary/70 group-hover/splitter:opacity-100',
        )}
      />
    </div>
  );
}
