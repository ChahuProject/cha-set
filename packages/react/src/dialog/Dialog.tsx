import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';

export interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  titleId: string;
  descriptionId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog compound components must be used within a Dialog');
  }
  return context;
}

export interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function DialogRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-desc`;

  const contextValue = React.useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      title,
      description,
      titleId,
      descriptionId,
    }),
    [open, setOpen, title, description, titleId, descriptionId],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, onClick, asChild = false, children, ...props }, ref) => {
    const { open, setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(true);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) {
            handleClick(e);
          }
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="dialog-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DialogTrigger.displayName = 'DialogTrigger';

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
  forceMount?: boolean;
  container?: HTMLElement | null;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      overlayClassName,
      children,
      forceMount = false,
      container,
      ...props
    },
    ref,
  ) => {
    const { open, setOpen, titleId, descriptionId } = useDialogContext();

    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          setOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, setOpen]);

    if (!open && !forceMount) {
      return null;
    }

    const content = (
      <div
        data-slot="dialog-portal"
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      >
        {/* Overlay */}
        <div
          data-slot="dialog-overlay"
          className={cn(
            'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in-0',
            overlayClassName,
          )}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* Card Container */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          data-slot="dialog-content"
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-2xl rounded-xl animate-in zoom-in-95 duration-150',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}

          {/* Top-Right Close Button */}
          <button
            type="button"
            data-slot="dialog-close-button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            ✕
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    );

    const targetContainer = container ?? (typeof document !== 'undefined' ? document.body : null);
    if (!targetContainer) {
      return content;
    }

    return createPortal(content, targetContainer);
  },
);
DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-header"
      className={cn('flex flex-col gap-1.5 text-left', className)}
      {...props}
    />
  ),
);
DialogHeader.displayName = 'DialogHeader';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2',
        className,
      )}
      {...props}
    />
  ),
);
DialogFooter.displayName = 'DialogFooter';

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, id, children, ...props }, ref) => {
    const { titleId, title } = useDialogContext();
    return (
      <h2
        ref={ref}
        id={id || titleId}
        data-slot="dialog-title"
        className={cn(
          'text-lg font-semibold leading-none tracking-tight text-foreground',
          className,
        )}
        {...props}
      >
        {children ?? title}
      </h2>
    );
  },
);
DialogTitle.displayName = 'DialogTitle';

export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, id, children, ...props }, ref) => {
    const { descriptionId, description } = useDialogContext();
    return (
      <p
        ref={ref}
        id={id || descriptionId}
        data-slot="dialog-description"
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      >
        {children ?? description}
      </p>
    );
  },
);
DialogDescription.displayName = 'DialogDescription';

export interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, asChild = false, children, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) {
            handleClick(e);
          }
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="dialog-close"
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DialogClose.displayName = 'DialogClose';

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
