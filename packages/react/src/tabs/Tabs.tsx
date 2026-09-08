import * as React from 'react';
import { forwardRef, createContext, useContext } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../lib/utils';

export type TabsVariant = 'default' | 'line';

const TabsVariantContext = createContext<TabsVariant>('default');

export interface TabsProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.Root> {
  className?: string;
  variant?: TabsVariant;
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  { className, variant = 'default', children, ...props },
  ref,
) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <BaseTabs.Root
        ref={ref}
        data-slot="tabs"
        data-variant={variant}
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </BaseTabs.Root>
    </TabsVariantContext.Provider>
  );
});

export interface TabsListProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.List> {
  className?: string;
  variant?: TabsVariant;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className, variant: variantProp, ...props }, ref) {
    const contextVariant = useContext(TabsVariantContext);
    const variant = variantProp ?? contextVariant;

    return (
      <BaseTabs.List
        ref={ref}
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          variant === 'line'
            ? 'inline-flex h-9 items-center justify-start border-b border-border bg-transparent p-0 text-muted-foreground w-full gap-4 rounded-none'
            : 'inline-flex h-8 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-fit',
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
  variant?: TabsVariant;
  /** Programmatically force the hover state for visual testing and snapshot parity. */
  forceHover?: boolean;
  /** Programmatically force the active/selected state for visual testing and snapshot parity. */
  forceActive?: boolean;
}

export const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  function TabsTrigger(
    { className, variant: variantProp, forceHover, forceActive, ...props },
    ref,
  ) {
    const contextVariant = useContext(TabsVariantContext);
    const variant = variantProp ?? contextVariant;

    const defaultVariantClasses = cn(
      'rounded-md px-3 py-1',
      'data-active:bg-background data-active:text-foreground data-active:shadow-xs',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs',
      forceActive && 'bg-background text-foreground shadow-xs',
    );

    const lineVariantClasses = cn(
      'rounded-none border-b-2 border-transparent px-3 py-1.5 -mb-px font-medium',
      'data-active:border-primary data-active:text-foreground data-active:shadow-none',
      'data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
      forceActive && 'border-primary text-foreground shadow-none',
    );

    return (
      <BaseTabs.Tab
        ref={ref}
        data-slot="tabs-trigger"
        data-variant={variant}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          'text-muted-foreground hover:text-foreground',
          '[&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0',
          variant === 'line' ? lineVariantClasses : defaultVariantClasses,
          forceHover && 'text-foreground',
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
        data-slot="tabs-content"
        className={cn(
          'mt-2 min-w-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
