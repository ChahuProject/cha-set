import * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { cn } from '../lib/utils';

export type ResizablePanelGroupProps = React.ComponentProps<
  typeof ResizablePrimitive.Group
> & {
  direction?: 'horizontal' | 'vertical';
  disableCursor?: boolean;
};

export function ResizablePanelGroup({
  className,
  direction,
  orientation = direction ?? 'horizontal',
  disableCursor = true,
  ...props
}: ResizablePanelGroupProps) {
  const resolvedOrientation = orientation ?? 'horizontal';
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      orientation={resolvedOrientation}
      aria-orientation={resolvedOrientation}
      disableCursor={disableCursor}
      className={cn(
        'flex h-full w-full aria-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

function normalizeSize(size: number | string | undefined): string | undefined {
  if (typeof size === 'number') {
    return `${size}%`;
  }
  return size;
}

export type ResizablePanelProps = Omit<
  React.ComponentProps<typeof ResizablePrimitive.Panel>,
  'defaultSize' | 'minSize' | 'maxSize' | 'collapsedSize'
> & {
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsedSize?: number | string;
};

export function ResizablePanel({
  className,
  defaultSize,
  minSize,
  maxSize,
  collapsedSize,
  ...props
}: ResizablePanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={className}
      defaultSize={normalizeSize(defaultSize) as any}
      minSize={normalizeSize(minSize) as any}
      maxSize={normalizeSize(maxSize) as any}
      collapsedSize={normalizeSize(collapsedSize) as any}
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
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      {...props}
      data-slot="resizable-handle"
      className={cn(
        'relative flex w-[0.0625rem] items-center justify-center bg-border transition-colors duration-quick ease-standard',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden',
        'aria-[orientation=horizontal]:h-[0.0625rem] aria-[orientation=horizontal]:w-full',
        'aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-3 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2',
        'z-20 cursor-col-resize aria-[orientation=horizontal]:cursor-row-resize select-none',
        'hover:bg-primary/80 data-[separator-hover=true]:bg-primary/80 data-[state=drag]:bg-primary',
        className,
      )}
    />
  );
}
