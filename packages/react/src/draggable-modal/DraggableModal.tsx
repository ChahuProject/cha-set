import * as React from 'react';
import { Rnd } from 'react-rnd';
import { cn } from '../lib/utils';

export interface DraggableModalProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  dataSlot?: string;
  dragHandleClassName?: string;
  showEscBadge?: boolean;
  fixedFooter?: React.ReactNode;
  topControls?: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

const cancelDragSelector =
  "button, input, textarea, select, a, label, [role='option'], [role='combobox'], [data-no-drag], [data-no-drag] *";

export function DraggableModal({
  children,
  className,
  contentClassName,
  dataSlot = 'dialog-content',
  dragHandleClassName,
  showEscBadge = false,
  fixedFooter,
  topControls,
  defaultWidth = 500,
  defaultHeight = 400,
  minWidth = 300,
  minHeight = 200,
}: DraggableModalProps) {
  const rndRef = React.useRef<Rnd | null>(null);

  // Initial center position
  const initialPos = React.useMemo(() => {
    const isBrowser = typeof window !== 'undefined';
    const innerW = isBrowser ? window.innerWidth : 1024;
    const innerH = isBrowser ? window.innerHeight : 768;
    return {
      x: Math.max(16, (innerW - defaultWidth) / 2),
      y: Math.max(16, (innerH - defaultHeight) / 2),
      width: defaultWidth,
      height: defaultHeight,
    };
  }, [defaultWidth, defaultHeight]);

  return (
    <Rnd
      ref={rndRef}
      default={initialPos}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="window"
      dragHandleClassName={dragHandleClassName}
      cancel={cancelDragSelector}
      data-slot={dataSlot}
      style={{ display: 'flex', flexDirection: 'column' }}
      className={cn(
        'pointer-events-auto z-50 overflow-hidden rounded-xl border bg-popover text-sm text-popover-foreground shadow-2xl',
        !dragHandleClassName && 'cursor-move',
        className,
      )}
    >
      <div
        data-slot="draggable-modal-content"
        className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6', contentClassName)}
      >
        {children}
      </div>

      {fixedFooter && <div className="shrink-0 border-t border-border/50">{fixedFooter}</div>}

      {(showEscBadge || topControls) && (
        <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 pointer-events-auto">
          {showEscBadge && (
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center rounded border border-border/60 bg-muted/60 px-1.5 font-mono text-[0.625rem] text-muted-foreground">
              ESC
            </kbd>
          )}
          {topControls}
        </div>
      )}
    </Rnd>
  );
}
