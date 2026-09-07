import * as React from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import { Button } from '../button/Button';
import { XIcon } from '../lib/icons';
import { ScrollArea } from '../scroll-area/ScrollArea';
import { cn } from '../lib/utils';

export interface FloatingWindowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  topActions?: React.ReactNode;
}

export function FloatingWindow({
  open,
  onOpenChange,
  title,
  children,
  className,
  defaultWidth = 600,
  defaultHeight = 450,
  minWidth = 360,
  minHeight = 240,
  topActions,
}: FloatingWindowProps) {
  const rndRef = React.useRef<Rnd | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onOpenChange]);

  if (!open || typeof document === 'undefined') return null;

  const innerW = window.innerWidth;
  const innerH = window.innerHeight;
  const initialPos = {
    x: Math.max(16, (innerW - defaultWidth) / 2),
    y: Math.max(16, (innerH - defaultHeight) / 2),
    width: defaultWidth,
    height: defaultHeight,
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <Rnd
        ref={rndRef}
        default={initialPos}
        minWidth={minWidth}
        minHeight={minHeight}
        bounds="window"
        dragHandleClassName="floating-window-header"
        style={{ display: 'flex', flexDirection: 'column' }}
        className={cn(
          'z-10 overflow-hidden rounded-xl border bg-popover text-sm text-popover-foreground shadow-2xl',
          className,
        )}
      >
        <div className="floating-window-header flex shrink-0 cursor-move select-none items-center justify-between gap-2 border-b border-border/60 bg-muted/30 py-2 pl-4 pr-2">
          <span className="truncate text-sm font-medium text-foreground">{title}</span>
          <div className="flex items-center gap-1 shrink-0">
            {topActions}
            <Button
              size="icon-xs"
              variant="ghost"
              className="size-6 cursor-pointer rounded-md hover:bg-muted"
              onClick={() => onOpenChange(false)}
              aria-label="Close floating window"
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>
        </div>
        <ScrollArea className="min-h-0 flex-1 p-4">{children}</ScrollArea>
      </Rnd>
    </div>,
    document.body,
  );
}
