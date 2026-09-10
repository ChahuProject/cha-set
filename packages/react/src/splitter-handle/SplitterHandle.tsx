import * as React from 'react';
import { cn } from '../lib/utils';
import type { SplitterEdge } from '@chahu/spec/splitter-handle';

export interface SplitterHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  edge?: SplitterEdge;
  targetSize?: number;
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
  liveUpdate?: boolean;
  hitThickness?: number;
  visualThickness?: number;
  activeVisualThickness?: number;
  disabled?: boolean;
  onSizeChanging?: (newSize: number) => void;
  onSizeChanged?: (finalSize: number) => void;
  onDoubleClicked?: () => void;
}

export const SplitterHandle = React.forwardRef<HTMLDivElement, SplitterHandleProps>(
  (
    {
      edge = 'left',
      targetSize = 200,
      minSize = 100,
      maxSize = 1000,
      defaultSize,
      liveUpdate = true,
      hitThickness = 6,
      visualThickness = 1,
      activeVisualThickness = 2,
      disabled = false,
      onSizeChanging,
      onSizeChanged,
      onDoubleClicked,
      className,
      style,
      tabIndex = 0,
      ...props
    },
    ref,
  ) => {
    const isVertical = edge === 'left' || edge === 'right';
    const [isDragging, setIsDragging] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const dragStartRef = React.useRef<{
      startX: number;
      startY: number;
      startSize: number;
      lastClamped: number;
    }>({
      startX: 0,
      startY: 0,
      startSize: targetSize,
      lastClamped: targetSize,
    });

    const clampSize = React.useCallback(
      (val: number) => Math.max(minSize, Math.min(maxSize, val)),
      [minSize, maxSize],
    );

    const calculateSize = React.useCallback(
      (clientX: number, clientY: number) => {
        const { startX, startY, startSize } = dragStartRef.current;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        let computed = startSize;
        if (edge === 'left') {
          computed = startSize - deltaX;
        } else if (edge === 'right') {
          computed = startSize + deltaX;
        } else if (edge === 'top') {
          computed = startSize - deltaY;
        } else if (edge === 'bottom') {
          computed = startSize + deltaY;
        }

        return clampSize(computed);
      },
      [edge, clampSize],
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture fallback if not supported
      }

      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startSize: targetSize,
        lastClamped: targetSize,
      };
      setIsDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || disabled) return;
      e.preventDefault();
      const clamped = calculateSize(e.clientX, e.clientY);
      dragStartRef.current.lastClamped = clamped;
      onSizeChanging?.(clamped);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
      setIsDragging(false);
      const clamped = calculateSize(e.clientX, e.clientY);
      onSizeChanged?.(clamped);
    };

    const handleDoubleClick = () => {
      if (disabled) return;
      if (onDoubleClicked) {
        onDoubleClicked();
      } else {
        const resetSize = defaultSize !== undefined ? defaultSize : minSize;
        onSizeChanged?.(resetSize);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      let nextSize = targetSize;
      const step = 10;

      if (
        (isVertical && e.key === 'ArrowLeft') ||
        (!isVertical && e.key === 'ArrowUp')
      ) {
        e.preventDefault();
        nextSize = edge === 'left' || edge === 'top' ? targetSize + step : targetSize - step;
      } else if (
        (isVertical && e.key === 'ArrowRight') ||
        (!isVertical && e.key === 'ArrowDown')
      ) {
        e.preventDefault();
        nextSize = edge === 'left' || edge === 'top' ? targetSize - step : targetSize + step;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextSize = minSize;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextSize = maxSize;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleDoubleClick();
        return;
      } else {
        return;
      }

      const clamped = clampSize(nextSize);
      onSizeChanging?.(clamped);
      onSizeChanged?.(clamped);
    };

    const isActive = isDragging || isHovered;
    const currentVisualThickness = isActive ? activeVisualThickness : visualThickness;

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        aria-valuenow={targetSize}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        tabIndex={disabled ? -1 : tabIndex}
        data-slot="splitter-handle"
        data-edge={edge}
        data-dragging={isDragging ? 'true' : 'false'}
        data-active={isActive ? 'true' : 'false'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative select-none touch-none transition-colors outline-none z-10',
          disabled ? 'cursor-not-allowed opacity-50' : isVertical ? 'cursor-col-resize' : 'cursor-row-resize',
          'focus-visible:ring-1 focus-visible:ring-primary',
          className,
        )}
        style={{
          width: isVertical ? `${hitThickness}px` : '100%',
          height: isVertical ? '100%' : `${hitThickness}px`,
          ...style,
        }}
        {...props}
      >
        <div
          data-slot="splitter-handle-visual"
          className={cn(
            'absolute transition-all duration-100 pointer-events-none',
            isActive ? 'bg-primary opacity-100' : 'bg-border opacity-75',
          )}
          style={{
            ...(edge === 'left' && {
              left: 0,
              top: 0,
              bottom: 0,
              width: `${currentVisualThickness}px`,
            }),
            ...(edge === 'right' && {
              right: 0,
              top: 0,
              bottom: 0,
              width: `${currentVisualThickness}px`,
            }),
            ...(edge === 'top' && {
              top: 0,
              left: 0,
              right: 0,
              height: `${currentVisualThickness}px`,
            }),
            ...(edge === 'bottom' && {
              bottom: 0,
              left: 0,
              right: 0,
              height: `${currentVisualThickness}px`,
            }),
          }}
        />
      </div>
    );
  },
);

SplitterHandle.displayName = 'SplitterHandle';
