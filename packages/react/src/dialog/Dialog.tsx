import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import {
  DraggableModal,
  type DraggableModalSizeOption,
} from '../draggable-modal';
import { XIcon } from '../lib/icons';
import { splitFixedFooter } from '../lib/splitFixedFooter';
import { cn } from '../lib/utils';

export type { DraggableModalSizeOption as DialogSizeOption, DraggableModalSizeOption as 弹窗尺寸选项 };

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
  render?: React.ReactElement;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, onClick, asChild = false, render, children, ...props }, ref) => {
    const { open, setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(true);
      }
    };

    if (render && React.isValidElement(render)) {
      return React.cloneElement(render as React.ReactElement<any>, {
        ref,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          (render as React.ReactElement<any>).props.onClick?.(e);
          if (!e.defaultPrevented) {
            handleClick(e);
          }
        },
      });
    }

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

export interface DialogPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement | null;
}

export function DialogPortal({
  children,
  container,
}: DialogPortalProps) {
  const targetContainer = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!targetContainer) {
    return <>{children}</>;
  }
  return createPortal(children, targetContainer);
}

export interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  render?: React.ReactElement;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, asChild = false, render, children, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
      }
    };

    if (render && React.isValidElement(render)) {
      return React.cloneElement(render as React.ReactElement<any>, {
        ref,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          (render as React.ReactElement<any>).props.onClick?.(e);
          if (!e.defaultPrevented) {
            handleClick(e);
          }
        },
      });
    }

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

export interface DialogOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="dialog-overlay"
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
          className,
        )}
        onClick={handleClick}
        aria-hidden="true"
        {...props}
      />
    );
  },
);
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
  forceMount?: boolean;
  container?: HTMLElement | null;
  draggable?: boolean;
  showCloseButton?: boolean;
  showEscBadge?: boolean;
  defaultWidthRem?: number;
  defaultHeightRem?: number;
  minWidthRem?: number;
  minHeightRem?: number;
  initialPositionMode?: 'center' | 'top' | '居中' | '顶部靠上';
  topMarginRem?: number;
  autoFitHeight?: boolean;
  sizeOptions?: DraggableModalSizeOption[];
  sizeMenuTooltip?: string;
  dragHandleClassName?: string;
  contentClassName?: string;

  // Compatibility aliases
  内容类名?: string;
  默认宽度rem?: number;
  默认高度rem?: number;
  最小宽度rem?: number;
  最小高度rem?: number;
  初始位置模式?: 'center' | 'top' | '居中' | '顶部靠上';
  顶部边距rem?: number;
  自动贴高?: boolean;
  尺寸选项?: DraggableModalSizeOption[];
  尺寸按钮提示?: string;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      overlayClassName,
      children,
      forceMount = false,
      container,
      draggable = true,
      showCloseButton = true,
      showEscBadge = true,
      defaultWidthRem,
      defaultHeightRem,
      minWidthRem,
      minHeightRem,
      initialPositionMode,
      topMarginRem,
      autoFitHeight,
      sizeOptions,
      sizeMenuTooltip,
      dragHandleClassName,
      contentClassName,

      // Compatibility aliases
      内容类名,
      默认宽度rem,
      默认高度rem,
      最小宽度rem,
      最小高度rem,
      初始位置模式,
      顶部边距rem,
      自动贴高,
      尺寸选项,
      尺寸按钮提示,

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

    const effectiveContentClassName = contentClassName ?? 内容类名;
    const effectiveDefaultWidthRem = defaultWidthRem ?? 默认宽度rem;
    const effectiveDefaultHeightRem = defaultHeightRem ?? 默认高度rem;
    const effectiveMinWidthRem = minWidthRem ?? 最小宽度rem;
    const effectiveMinHeightRem = minHeightRem ?? 最小高度rem;
    const effectiveInitialPositionMode = initialPositionMode ?? 初始位置模式;
    const effectiveTopMarginRem = topMarginRem ?? 顶部边距rem;
    const effectiveAutoFitHeight = autoFitHeight ?? 自动贴高;
    const effectiveSizeOptions = sizeOptions ?? 尺寸选项;
    const effectiveSizeMenuTooltip = sizeMenuTooltip ?? 尺寸按钮提示;

    const { content, fixedFooter } = splitFixedFooter(children, DialogFooter);

    const closeControl = showCloseButton && (
      <DialogClose asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          data-slot="dialog-close-button"
          className="size-7 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogClose>
    );

    if (draggable) {
      return (
        <DialogPortal container={container}>
          <DialogOverlay className={overlayClassName} />
          <div
            data-slot="dialog-content-layer"
            className="fixed inset-0 z-50 pointer-events-none outline-none"
          >
            <DraggableModal
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={props['aria-labelledby'] ?? titleId}
              aria-describedby={props['aria-describedby'] ?? descriptionId}
              dataSlot="dialog-content"
              className={className}
              contentClassName={effectiveContentClassName}
              dragHandleClassName={dragHandleClassName}
              defaultWidthRem={effectiveDefaultWidthRem}
              defaultHeightRem={effectiveDefaultHeightRem}
              minWidthRem={effectiveMinWidthRem}
              minHeightRem={effectiveMinHeightRem}
              initialPositionMode={effectiveInitialPositionMode}
              topMarginRem={effectiveTopMarginRem}
              autoFitHeight={effectiveAutoFitHeight}
              sizeOptions={effectiveSizeOptions}
              sizeMenuTooltip={effectiveSizeMenuTooltip}
              showEscBadge={showEscBadge}
              fixedFooter={fixedFooter}
              topControls={closeControl}
              {...props}
            >
              {content}
            </DraggableModal>
          </div>
        </DialogPortal>
      );
    }

    return (
      <DialogPortal container={container}>
        <DialogOverlay className={overlayClassName} />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={props['aria-labelledby'] ?? titleId}
          aria-describedby={props['aria-describedby'] ?? descriptionId}
          data-slot="dialog-content"
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-2xl rounded-xl animate-in zoom-in-95 duration-150 pointer-events-auto',
            className,
          )}
          onClick={(e) => {
            e.stopPropagation();
            props.onClick?.(e);
          }}
          {...props}
        >
          {children}
          {closeControl && (
            <div className="absolute right-4 top-4">
              {closeControl}
            </div>
          )}
        </div>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-header"
      className={cn('flex flex-col gap-1.5 text-left pr-8', className)}
      {...props}
    />
  ),
);
DialogHeader.displayName = 'DialogHeader';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, showCloseButton = false, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      )}
    </div>
  ),
);
DialogFooter.displayName = 'DialogFooter';

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
  render?: React.ReactElement;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, id, asChild = false, render, children, ...props }, ref) => {
    const { titleId, title } = useDialogContext();
    const resolvedId = id || titleId;

    if (render && React.isValidElement(render)) {
      return React.cloneElement(render as React.ReactElement<any>, {
        ref,
        id: resolvedId,
        'data-slot': 'dialog-title',
      });
    }

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        id: resolvedId,
        'data-slot': 'dialog-title',
      });
    }

    return (
      <h2
        ref={ref}
        id={resolvedId}
        data-slot="dialog-title"
        className={cn(
          'text-base font-semibold leading-6 text-foreground tracking-tight',
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
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
  render?: React.ReactElement;
}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, id, asChild = false, render, children, ...props }, ref) => {
    const { descriptionId, description } = useDialogContext();
    const resolvedId = id || descriptionId;

    if (render && React.isValidElement(render)) {
      return React.cloneElement(render as React.ReactElement<any>, {
        ref,
        id: resolvedId,
        'data-slot': 'dialog-description',
      });
    }

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        id: resolvedId,
        'data-slot': 'dialog-description',
      });
    }

    return (
      <p
        ref={ref}
        id={resolvedId}
        data-slot="dialog-description"
        className={cn(
          'text-sm leading-6 text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
          className,
        )}
        {...props}
      >
        {children ?? description}
      </p>
    );
  },
);
DialogDescription.displayName = 'DialogDescription';

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
});
