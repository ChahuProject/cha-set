import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from '../button';
import { XIcon } from '../lib/icons';

export interface SheetProps
  extends React.ComponentProps<typeof SheetPrimitive.Root> {
  closeOnOverlayClick?: boolean;
}

export function SheetRoot({
  closeOnOverlayClick = true,
  disablePointerDismissal,
  ...props
}: SheetProps) {
  return (
    <SheetPrimitive.Root
      data-slot="sheet"
      disablePointerDismissal={disablePointerDismissal ?? !closeOnOverlayClick}
      {...props}
    />
  );
}

export interface SheetTriggerProps
  extends React.ComponentProps<typeof SheetPrimitive.Trigger> {
  asChild?: boolean;
}

export function SheetTrigger({
  render,
  asChild = false,
  children,
  ...props
}: SheetTriggerProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      render={renderProp}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </SheetPrimitive.Trigger>
  );
}

export interface SheetCloseProps
  extends React.ComponentProps<typeof SheetPrimitive.Close> {
  asChild?: boolean;
}

export function SheetClose({
  render,
  asChild = false,
  children,
  ...props
}: SheetCloseProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      render={renderProp}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </SheetPrimitive.Close>
  );
}

export interface SheetPortalProps
  extends React.ComponentProps<typeof SheetPrimitive.Portal> {}

export function SheetPortal({ ...props }: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

export interface SheetOverlayProps
  extends React.ComponentProps<typeof SheetPrimitive.Backdrop> {}

export function SheetOverlay({
  className,
  ...props
}: SheetOverlayProps) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs',
        'data-open:animate-fade-in',
        'data-closed:animate-fade-out',
        className,
      )}
      {...props}
    />
  );
}

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
export type SheetSize = 'sm' | 'default' | 'lg' | 'xl' | 'full';

const horizontalSizeClasses: Record<SheetSize, string> = {
  sm: 'sm:max-w-xs',
  default: 'sm:max-w-sm',
  lg: 'sm:max-w-md',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-full',
};

const verticalSizeClasses: Record<SheetSize, string> = {
  sm: 'max-h-48',
  default: 'max-h-80',
  lg: 'max-h-[50vh]',
  xl: 'max-h-[75vh]',
  full: 'max-h-screen',
};

export interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Popup> {
  side?: SheetSide;
  size?: SheetSize;
  showCloseButton?: boolean;
  overlayClassName?: string;
}

export function SheetContent({
  className,
  overlayClassName,
  children,
  side = 'right',
  size = 'default',
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  const isHorizontal = side === 'left' || side === 'right';
  const sizeClass = isHorizontal ? horizontalSizeClasses[size] : verticalSizeClasses[size];

  return (
    <SheetPortal>
      <SheetOverlay className={overlayClassName} />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-background bg-clip-padding text-sm text-foreground shadow-2xl outline-hidden',
          side === 'top' && 'inset-x-0 top-0 border-b border-border',
          side === 'bottom' && 'inset-x-0 bottom-0 border-t border-border',
          side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r border-border',
          side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l border-border',
          sizeClass,
          'data-open:animate-in data-open:fade-in-0 data-open:animate-in-medium data-open:animate-in-emphasized',
          side === 'top' && 'data-open:slide-in-from-top-10 data-closed:slide-out-to-top-10',
          side === 'bottom' && 'data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10',
          side === 'left' && 'data-open:slide-in-from-left-10 data-closed:slide-out-to-left-10',
          side === 'right' && 'data-open:slide-in-from-right-10 data-closed:slide-out-to-right-10',
          'data-closed:animate-out data-closed:fade-out-0 data-closed:animate-out-medium data-closed:animate-out-emphasized',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 rounded-xs opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

export interface SheetHeaderProps extends React.ComponentProps<'div'> {}

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-6 pb-0', className)}
      {...props}
    />
  );
}

export interface SheetFooterProps extends React.ComponentProps<'div'> {}

export function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-6 pt-0 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export interface SheetTitleProps
  extends React.ComponentProps<typeof SheetPrimitive.Title> {
  asChild?: boolean;
}

export function SheetTitle({
  className,
  asChild = false,
  render,
  children,
  ...props
}: SheetTitleProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      render={renderProp}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </SheetPrimitive.Title>
  );
}

export interface SheetDescriptionProps
  extends React.ComponentProps<typeof SheetPrimitive.Description> {
  asChild?: boolean;
}

export function SheetDescription({
  className,
  asChild = false,
  render,
  children,
  ...props
}: SheetDescriptionProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      render={renderProp}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </SheetPrimitive.Description>
  );
}

export const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Close: SheetClose,
  Portal: SheetPortal,
  Overlay: SheetOverlay,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
});
