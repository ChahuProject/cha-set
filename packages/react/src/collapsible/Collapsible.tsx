import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import * as React from 'react';
import { cn } from '../lib/utils';

export interface CollapsibleProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {}

export function Collapsible({ className, ...props }: CollapsibleProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn('w-full', className)}
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
