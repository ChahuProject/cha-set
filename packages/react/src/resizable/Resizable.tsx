import * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { cn } from '../lib/utils';

export type ResizablePanelGroupProps = React.ComponentProps<
  typeof ResizablePrimitive.Group
> & {
  direction?: 'horizontal' | 'vertical';
};

export function ResizablePanelGroup({
  className,
  direction,
  orientation = direction ?? 'horizontal',
  ...props
}: ResizablePanelGroupProps) {
  const resolvedOrientation = orientation ?? 'horizontal';
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      orientation={resolvedOrientation}
      aria-orientation={resolvedOrientation}
      className={cn(
        'flex h-full w-full aria-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

export type ResizablePanelProps = React.ComponentProps<
  typeof ResizablePrimitive.Panel
>;

export function ResizablePanel({
  className,
  ...props
}: ResizablePanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={className}
      {...props}
    />
  );
}

export interface ResizableHandleProps
  extends React.ComponentProps<typeof ResizablePrimitive.Separator> {
  withHandle?: boolean;
}

export function ResizableHandle({
  withHandle,
  className,
  onPointerDown,
  onClick,
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      {...props}
      data-slot="resizable-handle"
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90 z-20 cursor-col-resize aria-[orientation=horizontal]:cursor-row-resize',
        className,
      )}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown?.(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border border-border bg-background shadow-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-2.5 text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}
