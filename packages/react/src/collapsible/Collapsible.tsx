import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import * as React from 'react';
import { cn } from '../lib/utils';

export type CollapsibleVariant = 'default' | 'card' | 'ghost';

export interface CollapsibleProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  variant?: CollapsibleVariant;
}

const collapsibleVariantClasses: Record<CollapsibleVariant, string> = {
  default: 'w-full',
  card: 'w-full rounded-lg border border-border bg-card text-card-foreground p-3 shadow-xs',
  ghost: 'w-full rounded-lg bg-transparent text-foreground',
};

export function Collapsible({
  className,
  variant = 'default',
  ...props
}: CollapsibleProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      data-variant={variant}
      className={cn(collapsibleVariantClasses[variant], className)}
      {...props}
    />
  );
}

export interface CollapsibleTriggerProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {
  asChild?: boolean;
}

export function CollapsibleTrigger({
  className,
  render,
  asChild = false,
  children,
  ...props
}: CollapsibleTriggerProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      render={renderProp}
      className={cn(
        'cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </CollapsiblePrimitive.Trigger>
  );
}

export interface CollapsibleContentProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Panel> {}

export function CollapsibleContent({
  className,
  ...props
}: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        'overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 [&[hidden]:not([hidden="until-found"])]:hidden',
        className,
      )}
      {...props}
    />
  );
}
