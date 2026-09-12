import * as React from 'react';
import { forwardRef, createContext, useContext } from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../lib/utils';

export type TabsVariant = 'default' | 'line';
export type TabsSize = 'default' | 'sm';

interface TabsContextValue {
  variant: TabsVariant;
  size: TabsSize;
}

const TabsContext = createContext<TabsContextValue>({
  variant: 'default',
  size: 'default',
});

export interface TabsProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.Root> {
  className?: string;
  variant?: TabsVariant;
  size?: TabsSize;
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  { className, variant = 'default', size = 'default', children, ...props },
  ref,
) {
  return (
    <TabsContext.Provider value={{ variant, size }}>
      <BaseTabs.Root
        ref={ref}
        data-slot="tabs"
        data-variant={variant}
        data-size={size}
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </BaseTabs.Root>
    </TabsContext.Provider>
  );
});

export interface TabsListProps
  extends React.ComponentPropsWithRef<typeof BaseTabs.List> {
  className?: string;
  variant?: TabsVariant;
  size?: TabsSize;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className, variant: variantProp, size: sizeProp, ...props }, ref) {
    const context = useContext(TabsContext);
    const variant = variantProp ?? context.variant;
    const size = sizeProp ?? context.size;

    return (
      <BaseTabs.List
        ref={ref}
        data-slot="tabs-list"
        data-variant={variant}
        data-size={size}
        className={cn(
          variant === 'line'
            ? cn(
                'inline-flex items-center justify-start border-b border-border bg-transparent p-0 text-muted-foreground w-full gap-4 rounded-none',
                size === 'sm' ? 'h-8' : 'h-9',
              )
            : cn(
                'inline-flex items-center justify-center rounded-lg bg-muted text-muted-foreground w-fit',
                size === 'sm' ? 'h-7 p-0.5' : 'h-8 p-1',
              ),
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
  size?: TabsSize;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Programmatically force the hover state for visual testing and snapshot parity. */
  forceHover?: boolean;
  /** Programmatically force the active/selected state for visual testing and snapshot parity. */
  forceActive?: boolean;
}

export const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  function TabsTrigger(
    {
      className,
      variant: variantProp,
      size: sizeProp,
      icon,
      badge,
      forceHover,
      forceActive,
      children,
      ...props
    },
    ref,
  ) {
    const context = useContext(TabsContext);
    const variant = variantProp ?? context.variant;
    const size = sizeProp ?? context.size;

    const defaultVariantClasses = cn(
      size === 'sm' ? 'rounded px-2 py-0.5 text-xs' : 'rounded-md px-3 py-1 text-sm',
      'data-active:bg-background data-active:text-foreground data-active:shadow-xs',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs',
      forceActive && 'bg-background text-foreground shadow-xs',
    );

    const lineVariantClasses = cn(
      size === 'sm'
        ? 'rounded-none border-b-2 border-transparent px-2.5 py-1 -mb-px text-xs font-medium'
        : 'rounded-none border-b-2 border-transparent px-3 py-1.5 -mb-px text-sm font-medium',
      'data-active:border-primary data-active:text-foreground data-active:shadow-none',
      'data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
      forceActive && 'border-primary text-foreground shadow-none',
    );

    return (
      <BaseTabs.Tab
        ref={ref}
        data-slot="tabs-trigger"
        data-variant={variant}
        data-size={size}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium ring-offset-background transition-[border-color,color,background-color,box-shadow] duration-quick ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          'text-muted-foreground hover:text-foreground',
          '[&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0',
          variant === 'line' ? lineVariantClasses : defaultVariantClasses,
          forceHover && 'text-foreground',
          className,
        )}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
        {children}
        {badge !== undefined && (
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-xs font-medium leading-none text-foreground">
            {badge}
          </span>
        )}
      </BaseTabs.Tab>
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

