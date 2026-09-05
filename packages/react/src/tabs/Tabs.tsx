import * as React from 'react';
import { forwardRef } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../lib/utils';

export interface TabsProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.Root> {
  className?: string;
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  { className, ...props },
  ref,
) {
  return (
    <BaseTabs.Root
      ref={ref}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
});

export interface TabsListProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.List> {
  className?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className, ...props }, ref) {
    return (
      <BaseTabs.List
        ref={ref}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
          className,
        )}
        {...props}
      />
    );
  },
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.Tab> {
  className?: string;
  /** Programmatically force the hover state for visual testing and snapshot parity. */
  forceHover?: boolean;
  /** Programmatically force the active/selected state for visual testing and snapshot parity. */
  forceActive?: boolean;
}

export const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  function TabsTrigger(
    { className, forceHover, forceActive, ...props },
    ref,
  ) {
    return (
      <BaseTabs.Tab
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          'text-muted-foreground hover:text-foreground',
          'data-active:bg-background data-active:text-foreground data-active:shadow-xs',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs',
          forceHover && 'text-foreground',
          forceActive && 'bg-background text-foreground shadow-xs',
          className,
        )}
        {...props}
      />
    );
  },
);

export interface TabsContentProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.Panel> {
  className?: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ className, ...props }, ref) {
    return (
      <BaseTabs.Panel
        ref={ref}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      />
    );
  },
);

// Compound component pattern support
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
