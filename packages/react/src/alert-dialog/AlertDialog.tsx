import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import * as React from 'react';
import { cn } from '../lib/utils';
import { buttonVariants } from '../button';

export interface AlertDialogProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {}

export function AlertDialogRoot({ ...props }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

export interface AlertDialogTriggerProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Trigger> {
  asChild?: boolean;
}

export function AlertDialogTrigger({
  render,
  asChild = false,
  children,
  ...props
}: AlertDialogTriggerProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      render={renderProp}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </AlertDialogPrimitive.Trigger>
  );
}

export interface AlertDialogPortalProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Portal> {}

export function AlertDialogPortal({ ...props }: AlertDialogPortalProps) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

export interface AlertDialogOverlayProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Backdrop> {}

export function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs duration-100',
        'data-open:animate-in data-open:fade-in-0',
        'data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

export interface AlertDialogContentProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Popup> {}

export function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-background p-6 shadow-2xl duration-150 outline-hidden',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
          'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
  );
}

export interface AlertDialogHeaderProps extends React.ComponentProps<'div'> {}

export function AlertDialogHeader({
  className,
  ...props
}: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-1.5 text-left', className)}
      {...props}
    />
  );
}

export interface AlertDialogFooterProps extends React.ComponentProps<'div'> {}

export function AlertDialogFooter({
  className,
  ...props
}: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

export interface AlertDialogTitleProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Title> {
  asChild?: boolean;
}

export function AlertDialogTitle({
  className,
  asChild = false,
  render,
  children,
  ...props
}: AlertDialogTitleProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      render={renderProp}
      className={cn('text-base font-semibold leading-none text-foreground', className)}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </AlertDialogPrimitive.Title>
  );
}

export interface AlertDialogDescriptionProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Description> {
  asChild?: boolean;
}

export function AlertDialogDescription({
  className,
  asChild = false,
  render,
  children,
  ...props
}: AlertDialogDescriptionProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      render={renderProp}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </AlertDialogPrimitive.Description>
  );
}

export interface AlertDialogActionProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Close> {}

export function AlertDialogAction({
  className,
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant: 'default' }), className)}
      {...props}
    />
  );
}

export interface AlertDialogCancelProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Close> {}

export function AlertDialogCancel({
  className,
  ...props
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  );
}

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Overlay: AlertDialogOverlay,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
});
