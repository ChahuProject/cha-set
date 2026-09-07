import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import * as React from 'react';
import { cn } from '../lib/utils';
import { GripHorizontalIcon } from '../lib/icons';

export interface PopoverProps
  extends React.ComponentProps<typeof PopoverPrimitive.Root> {}

export function PopoverRoot({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export interface PopoverTriggerProps
  extends React.ComponentProps<typeof PopoverPrimitive.Trigger> {
  asChild?: boolean;
}

export function PopoverTrigger({
  render,
  asChild = false,
  children,
  ...props
}: PopoverTriggerProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      render={renderProp}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </PopoverPrimitive.Trigger>
  );
}

export interface PopoverAnchorProps extends React.ComponentProps<'div'> {}

export function PopoverAnchor({ children, ...props }: PopoverAnchorProps) {
  return (
    <div data-slot="popover-anchor" {...props}>
      {children}
    </div>
  );
}

export interface PopoverContentProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Popup>, 'style'> {
  style?: React.CSSProperties;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  alignOffset?: number;
  movable?: boolean;
  moveLabel?: string;
}

export function PopoverContent({
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 8,
  alignOffset = 0,
  movable = false,
  moveLabel = 'Drag to move',
  children,
  style,
  ...props
}: PopoverContentProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const dragStartRef = React.useRef<{
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
    rect: DOMRect;
  } | null>(null);
  const [moveOffset, setMoveOffset] = React.useState({ x: 0, y: 0 });

  const updateMoveOffset = (clientX: number, clientY: number) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) return;

    const margin = 8;
    const dx = clientX - dragStart.pointerX;
    const dy = clientY - dragStart.pointerY;
    const minDx = margin - dragStart.rect.left;
    const maxDx = window.innerWidth - margin - dragStart.rect.right;
    const minDy = margin - dragStart.rect.top;
    const maxDy = window.innerHeight - margin - dragStart.rect.bottom;

    setMoveOffset({
      x: dragStart.offsetX + Math.min(Math.max(dx, minDx), maxDx),
      y: dragStart.offsetY + Math.min(Math.max(dy, minDy), maxDy),
    });
  };

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <PopoverPrimitive.Popup
          ref={contentRef}
          data-slot="popover-content"
          style={{
            ...style,
            translate: movable
              ? `${moveOffset.x}px ${moveOffset.y}px`
              : style?.translate,
          }}
          className={cn(
            'z-50 w-72 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md outline-hidden duration-100',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        >
          {movable && (
            <button
              type="button"
              className="flex items-center justify-center w-full py-0.5 mb-2 rounded cursor-grab active:cursor-grabbing hover:bg-accent text-muted-foreground"
              aria-label={moveLabel}
              title={moveLabel}
              onDoubleClick={() => setMoveOffset({ x: 0, y: 0 })}
              onPointerDown={(event) => {
                const rect = contentRef.current?.getBoundingClientRect();
                if (!rect) return;
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                dragStartRef.current = {
                  pointerX: event.clientX,
                  pointerY: event.clientY,
                  offsetX: moveOffset.x,
                  offsetY: moveOffset.y,
                  rect,
                };
              }}
              onPointerMove={(event) => {
                if (event.buttons !== 1) return;
                updateMoveOffset(event.clientX, event.clientY);
              }}
              onPointerUp={(event) => {
                dragStartRef.current = null;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={(event) => {
                dragStartRef.current = null;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
            >
              <GripHorizontalIcon className="size-4" />
            </button>
          )}
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export interface PopoverCloseProps
  extends React.ComponentProps<typeof PopoverPrimitive.Close> {}

export function PopoverClose({ ...props }: PopoverCloseProps) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

export interface PopoverTitleProps
  extends React.ComponentProps<typeof PopoverPrimitive.Title> {}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn('text-sm font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface PopoverDescriptionProps
  extends React.ComponentProps<typeof PopoverPrimitive.Description> {}

export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Close: PopoverClose,
  Title: PopoverTitle,
  Description: PopoverDescription,
});
