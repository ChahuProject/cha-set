import * as React from 'react';
import {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogAction,
  DialogCancel,
  type DialogProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogActionProps,
  type DialogCancelProps,
  type DialogSize,
} from '../dialog';

export type AlertDialogProps = DialogProps & {
  onOpenChange?: (open: boolean, eventDetails?: any) => void;
};
export function AlertDialogRoot({ onOpenChange, ...props }: AlertDialogProps) {
  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      onOpenChange?.(open, { type: 'dialog' });
    },
    [onOpenChange],
  );
  return <DialogRoot variant="alert" onOpenChange={onOpenChange ? handleOpenChange : undefined} {...props} />;
}

export type AlertDialogTriggerProps = DialogTriggerProps;
export const AlertDialogTrigger = DialogTrigger;

export type AlertDialogPortalProps = DialogPortalProps;
export const AlertDialogPortal = DialogPortal;

export type AlertDialogOverlayProps = DialogOverlayProps;
export const AlertDialogOverlay = DialogOverlay;

export type AlertDialogSize = DialogSize;
export type AlertDialogContentProps = DialogContentProps;
export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  (props, ref) => <DialogContent ref={ref} variant="alert" {...props} />,
);
AlertDialogContent.displayName = 'AlertDialogContent';

export type AlertDialogHeaderProps = DialogHeaderProps;
export const AlertDialogHeader = DialogHeader;

export type AlertDialogFooterProps = DialogFooterProps;
export const AlertDialogFooter = DialogFooter;

export type AlertDialogTitleProps = DialogTitleProps;
export const AlertDialogTitle = DialogTitle;

export type AlertDialogDescriptionProps = DialogDescriptionProps;
export const AlertDialogDescription = DialogDescription;

export type AlertDialogActionProps = DialogActionProps;
export const AlertDialogAction = DialogAction;

export type AlertDialogCancelProps = DialogCancelProps;
export const AlertDialogCancel = DialogCancel;

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
