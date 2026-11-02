import * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { cn } from '../lib/utils';

const ResizableContext = React.createContext<{
  orientation: 'horizontal' | 'vertical';
}>({ orientation: 'horizontal' });

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
  resizeTargetMinimumSize = { fine: 16, coarse: 20 },
  children,
  ...props
}: ResizablePanelGroupProps) {
  const resolvedOrientation = orientation ?? 'horizontal';
  return (
    <ResizableContext.Provider value={{ orientation: resolvedOrientation }}>
      <ResizablePrimitive.Group
        data-slot="resizable-panel-group"
        orientation={resolvedOrientation}
        aria-orientation={resolvedOrientation}
        disableCursor={disableCursor}
        resizeTargetMinimumSize={resizeTargetMinimumSize}
        className={cn(
          'flex h-full w-full aria-[orientation=vertical]:flex-col',
          className,
        )}
        {...props}
      >
        {children}
      </ResizablePrimitive.Group>
    </ResizableContext.Provider>
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
  children,
  ...props
}: ResizableHandleProps) {
  const context = React.useContext(ResizableContext);
  const ariaOrientation = props['aria-orientation'] ?? (props as any)['ariaOrientation'];
  // In react-resizable-panels, horizontal group has vertical separators, and vertical group has horizontal separators.
  const isVertical = ariaOrientation
    ? ariaOrientation === 'vertical'
    : context.orientation !== 'vertical';

  return (
    <ResizablePrimitive.Separator
      {...props}
      data-slot="resizable-handle"
      className={cn(
        'group relative flex items-center justify-center z-20 select-none bg-transparent self-stretch',
        // Hit target: 16px hit target with negative margins preserving 1px net layout space
        isVertical
          ? 'w-4 -mx-[0.46875rem] cursor-col-resize'
          : 'w-full h-4 mx-0 -my-[0.46875rem] cursor-row-resize',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden',
        className,
      )}
    >
      <div
        data-slot="resizable-handle-line"
        className={cn(
          'pointer-events-none transition-all duration-quick ease-standard',
          'bg-border group-hover:bg-primary group-data-[separator=hover]:bg-primary group-data-[separator=active]:bg-primary',
          isVertical
            ? 'h-full w-[0.0625rem] group-hover:w-[0.1875rem] group-data-[separator=hover]:w-[0.1875rem] group-data-[separator=active]:w-[0.1875rem]'
            : 'w-full h-[0.0625rem] group-hover:h-[0.1875rem] group-data-[separator=hover]:h-[0.1875rem] group-data-[separator=active]:h-[0.1875rem]',
        )}
      />
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          className={cn(
            'z-10 flex items-center justify-center rounded-xs border border-border bg-card text-card-foreground shadow-xs transition-colors duration-quick ease-standard pointer-events-none',
            'group-hover:border-primary group-data-[separator=hover]:border-primary group-data-[separator=active]:border-primary',
            isVertical ? 'h-4 w-3' : 'h-3 w-4',
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-2.5 text-muted-foreground group-hover:text-primary transition-colors"
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
      {children}
    </ResizablePrimitive.Separator>
  );
}
