import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { useExitAnimation } from '../lib/useExitAnimation';
import { Kbd } from '../kbd';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlign = 'start' | 'center' | 'end';

// Context for TooltipProvider (global/ancestor defaults)
interface TooltipProviderContextValue {
  delayDuration: number;
}

const TooltipProviderContext = React.createContext<TooltipProviderContextValue>({
  delayDuration: 200,
});

export interface TooltipProviderProps {
  delayDuration?: number;
  children: React.ReactNode;
}

export function TooltipProvider({ delayDuration = 200, children }: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

// Context for individual Tooltip instances
interface TooltipContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  side: TooltipSide;
  avoidCollisions: boolean;
  delayDuration: number;
  disabled: boolean;
  tooltipId: string;
  triggerElement: HTMLElement | null;
  setTriggerElement: (el: HTMLElement | null) => void;
  rootElement: HTMLElement | null;
  handleTriggerMouseEnter: (event?: React.MouseEvent) => void;
  handleTriggerMouseLeave: (event?: React.MouseEvent) => void;
  handleTriggerFocus: (event?: React.FocusEvent) => void;
  handleTriggerBlur: (event?: React.FocusEvent) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip compound components must be used within a Tooltip or TooltipRoot');
  }
  return context;
}

function composeEventHandlers<E extends React.SyntheticEvent<any, any>>(
  originalHandler?: ((event: E) => void) | undefined,
  ourHandler?: ((event?: any) => void) | undefined,
) {
  return (event: E) => {
    originalHandler?.(event);
    if (!event.defaultPrevented) {
      ourHandler?.(event);
    }
  };
}

export interface TooltipRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  side?: TooltipSide;
  avoidCollisions?: boolean;
  delayDuration?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  forceHover?: boolean;
}

export const TooltipRoot = React.forwardRef<HTMLDivElement, TooltipRootProps>(
  (
    {
      children,
      side = 'top',
      avoidCollisions = true,
      delayDuration: propDelay,
      disabled = false,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      forceHover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const providerContext = React.useContext(TooltipProviderContext);
    const delayDuration = propDelay !== undefined ? propDelay : providerContext.delayDuration;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = (isControlled ? controlledOpen : uncontrolledOpen) || forceHover;

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const reactId = React.useId();
    const tooltipId = `tooltip-${reactId}`;

    const updateOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const clearTimer = React.useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const handleTriggerMouseEnter = React.useCallback(() => {
      if (disabled) return;
      clearTimer();
      if (delayDuration <= 0) {
        updateOpen(true);
      } else {
        timerRef.current = setTimeout(() => {
          updateOpen(true);
        }, delayDuration);
      }
    }, [disabled, clearTimer, delayDuration, updateOpen]);

    const handleTriggerMouseLeave = React.useCallback(() => {
      clearTimer();
      updateOpen(false);
    }, [clearTimer, updateOpen]);

    const handleTriggerFocus = React.useCallback(() => {
      if (disabled) return;
      clearTimer();
      if (delayDuration <= 0) {
        updateOpen(true);
      } else {
        timerRef.current = setTimeout(() => {
          updateOpen(true);
        }, delayDuration);
      }
    }, [disabled, clearTimer, delayDuration, updateOpen]);

    const handleTriggerBlur = React.useCallback(() => {
      clearTimer();
      updateOpen(false);
    }, [clearTimer, updateOpen]);

    React.useEffect(() => {
      if (disabled && isOpen) {
        clearTimer();
        updateOpen(false);
      }
    }, [disabled, isOpen, clearTimer, updateOpen]);

    React.useEffect(() => {
      return () => {
        clearTimer();
      };
    }, [clearTimer]);

    React.useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          clearTimer();
          updateOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, clearTimer, updateOpen]);

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
    const [rootElement, setRootElement] = React.useState<HTMLDivElement | null>(null);

    const innerRootRef = React.useRef<HTMLDivElement | null>(null);
    const handleRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        innerRootRef.current = node;
        setRootElement(node);
        if (typeof ref === 'function') ref(node);
        else if (ref && 'current' in ref) (ref as any).current = node;
      },
      [ref],
    );

    const contextValue = React.useMemo<TooltipContextValue>(
      () => ({
        isOpen,
        setIsOpen: updateOpen,
        side,
        avoidCollisions,
        delayDuration,
        disabled,
        tooltipId,
        triggerElement,
        setTriggerElement,
        rootElement,
        handleTriggerMouseEnter,
        handleTriggerMouseLeave,
        handleTriggerFocus,
        handleTriggerBlur,
      }),
      [
        isOpen,
        updateOpen,
        side,
        avoidCollisions,
        delayDuration,
        disabled,
        tooltipId,
        triggerElement,
        rootElement,
        handleTriggerMouseEnter,
        handleTriggerMouseLeave,
        handleTriggerFocus,
        handleTriggerBlur,
      ],
    );

    return (
      <TooltipContext.Provider value={contextValue}>
        <div
          ref={handleRootRef}
          data-slot="tooltip-root"
          className={cn('relative inline-flex items-center justify-center', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipContext.Provider>
    );
  },
);

TooltipRoot.displayName = 'TooltipRoot';

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ asChild = false, children, className, ...props }, ref) => {
    const {
      isOpen,
      tooltipId,
      setTriggerElement,
      handleTriggerMouseEnter,
      handleTriggerMouseLeave,
      handleTriggerFocus,
      handleTriggerBlur,
    } = useTooltip();

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, any>>;
      const existingDescribedBy = child.props['aria-describedby'];
      const combinedDescribedBy = [existingDescribedBy, isOpen ? tooltipId : undefined]
        .filter(Boolean)
        .join(' ');

      return React.cloneElement(child, {
        ...props,
        ...child.props,
        ref: (node: HTMLElement | null) => {
          setTriggerElement(node);
          if (typeof ref === 'function') ref(node);
          else if (ref && 'current' in ref) (ref as any).current = node;

          const childRef = (child.props as any)?.ref ?? (child as any).ref;
          if (typeof childRef === 'function') childRef(node);
          else if (childRef && 'current' in childRef) childRef.current = node;
        },
        'data-slot': child.props['data-slot'] || 'tooltip-trigger',
        'aria-describedby': combinedDescribedBy || undefined,
        onMouseEnter: composeEventHandlers(child.props.onMouseEnter, handleTriggerMouseEnter),
        onMouseLeave: composeEventHandlers(child.props.onMouseLeave, handleTriggerMouseLeave),
        onFocus: composeEventHandlers(child.props.onFocus, handleTriggerFocus),
        onBlur: composeEventHandlers(child.props.onBlur, handleTriggerBlur),
        className: cn(child.props.className, className),
      });
    }

    const handleButtonRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        setTriggerElement(node);
        if (typeof ref === 'function') ref(node);
        else if (ref && 'current' in ref) (ref as any).current = node;
      },
      [ref, setTriggerElement],
    );

    return (
      <button
        type="button"
        ref={handleButtonRef}
        data-slot="tooltip-trigger"
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        onFocus={handleTriggerFocus}
        onBlur={handleTriggerBlur}
        className={cn('inline-flex items-center justify-center cursor-pointer', className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TooltipTrigger.displayName = 'TooltipTrigger';

const sidePositionClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

function computeTooltipPosition({
  triggerEl,
  contentEl,
  side,
  align,
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
}: {
  triggerEl: HTMLElement;
  contentEl: HTMLElement | null;
  side: TooltipSide;
  align: TooltipAlign;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
}): { top: number; left: number; side: TooltipSide } {
  const triggerRect = triggerEl.getBoundingClientRect();
  const contentWidth = contentEl && contentEl.offsetWidth > 0 ? contentEl.offsetWidth : 80;
  const contentHeight = contentEl && contentEl.offsetHeight > 0 ? contentEl.offsetHeight : 28;
  const margin = 8;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  let actualSide = side;

  // Collision detection / auto-flip if overflowing viewport boundary.
  // Disabled entirely when avoidCollisions is false: exact side placement.
  if (avoidCollisions) {
    if (side === 'top' && triggerRect.top - contentHeight - sideOffset < margin) {
      if (triggerRect.bottom + contentHeight + sideOffset <= viewportHeight - margin) {
        actualSide = 'bottom';
      }
    } else if (side === 'bottom' && triggerRect.bottom + contentHeight + sideOffset > viewportHeight - margin) {
      if (triggerRect.top - contentHeight - sideOffset >= margin) {
        actualSide = 'top';
      }
    } else if (side === 'left' && triggerRect.left - contentWidth - sideOffset < margin) {
      if (triggerRect.right + contentWidth + sideOffset <= viewportWidth - margin) {
        actualSide = 'right';
      }
    } else if (side === 'right' && triggerRect.right + contentWidth + sideOffset > viewportWidth - margin) {
      if (triggerRect.left - contentWidth - sideOffset >= margin) {
        actualSide = 'left';
      }
    }
  }

  let top = 0;
  let left = 0;

  if (actualSide === 'top' || actualSide === 'bottom') {
    top = actualSide === 'top'
      ? triggerRect.top - contentHeight - sideOffset
      : triggerRect.bottom + sideOffset;

    if (align === 'start') {
      left = triggerRect.left + alignOffset;
    } else if (align === 'end') {
      left = triggerRect.right - contentWidth - alignOffset;
    } else {
      left = triggerRect.left + (triggerRect.width - contentWidth) / 2 + alignOffset;
    }

    // Clamp horizontally to viewport bounds
    if (avoidCollisions) {
      left = Math.max(margin, Math.min(left, viewportWidth - contentWidth - margin));
    }
  } else {
    left = actualSide === 'left'
      ? triggerRect.left - contentWidth - sideOffset
      : triggerRect.right + sideOffset;

    if (align === 'start') {
      top = triggerRect.top + alignOffset;
    } else if (align === 'end') {
      top = triggerRect.bottom - contentHeight - alignOffset;
    } else {
      top = triggerRect.top + (triggerRect.height - contentHeight) / 2 + alignOffset;
    }

    // Clamp vertically to viewport bounds
    if (avoidCollisions) {
      top = Math.max(margin, Math.min(top, viewportHeight - contentHeight - margin));
    }
  }

  return { top, left, side: actualSide };
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  alignOffset?: number;
  shortcut?: string;
  arrow?: boolean;
  avoidCollisions?: boolean;
  portal?: boolean;
  container?: HTMLElement | null;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      side: propSide,
      align = 'center',
      sideOffset,
      alignOffset,
      shortcut,
      arrow = false,
      avoidCollisions: propAvoid,
      portal = true,
      container,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { isOpen, side: contextSide, tooltipId, triggerElement, rootElement, avoidCollisions: contextAvoid } = useTooltip();
    const side = propSide || contextSide || 'top';
    const avoidCollisions = propAvoid ?? contextAvoid ?? true;
    const { visible, exiting } = useExitAnimation(isOpen);

    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!);

    const [coords, setCoords] = React.useState<{ top: number; left: number; side: TooltipSide } | null>(null);
    const [inwardOffset, setInwardOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const resolvedAnchor = React.useMemo(() => {
      if (triggerElement) return triggerElement;
      // Fallback when asChild ref forwarding breaks (e.g. composite Button):
      // resolve the trigger DOM node from inside the root wrapper.
      if (rootElement) {
        const nested =
          (rootElement.querySelector?.(
            '[data-slot="tooltip-trigger"]',
          ) as HTMLElement | null) ??
          (rootElement.querySelector?.('[data-slot="button"]') as HTMLElement | null) ??
          (rootElement.querySelector?.('button') as HTMLElement | null);
        if (nested) return nested;
        return rootElement;
      }
      return null;
    }, [triggerElement, rootElement]);

    const anchor = resolvedAnchor;

    React.useLayoutEffect(() => {
      if (!visible) return;

      if (portal && typeof window !== 'undefined') {
        if (!anchor) return;

        const updatePosition = () => {
          const next = computeTooltipPosition({
            triggerEl: anchor,
            contentEl: innerRef.current,
            side,
            align,
            sideOffset,
            alignOffset,
            avoidCollisions,
          });
          setCoords(next);
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition, true);
        };
      } else if (!portal && innerRef.current && typeof window !== 'undefined') {
        const rect = innerRef.current.getBoundingClientRect();
        const margin = 8;
        let shiftX = 0;
        let shiftY = 0;

        if (rect.right > window.innerWidth - margin) {
          shiftX = -(rect.right - (window.innerWidth - margin));
        } else if (rect.left < margin) {
          shiftX = margin - rect.left;
        }

        if (rect.bottom > window.innerHeight - margin) {
          shiftY = -(rect.bottom - (window.innerHeight - margin));
        } else if (rect.top < margin) {
          shiftY = margin - rect.top;
        }

        setInwardOffset({ x: shiftX, y: shiftY });
      }
    }, [visible, portal, anchor, side, align, sideOffset, alignOffset, avoidCollisions, children, shortcut]);

    if (!visible) {
      return null;
    }

    const effectiveCoords = coords ?? (portal && anchor && typeof window !== 'undefined'
      ? computeTooltipPosition({
          triggerEl: anchor,
          contentEl: innerRef.current,
          side,
          align,
          sideOffset,
          alignOffset,
          avoidCollisions,
        })
      : null);

    const effectiveSide = effectiveCoords ? effectiveCoords.side : side;

    const computedStyle: React.CSSProperties = { ...style };
    if (portal) {
      computedStyle.position = 'fixed';
      if (effectiveCoords) {
        computedStyle.top = `${(effectiveCoords.top * 0.0625).toFixed(4)}rem`;
        computedStyle.left = `${(effectiveCoords.left * 0.0625).toFixed(4)}rem`;
        computedStyle.bottom = 'auto';
        computedStyle.right = 'auto';
        computedStyle.margin = 0;
      } else {
        // Hide until measured: a fixed bubble with no top/left lands at the
        // bottom-right corner (static position). Keep it invisible at origin
        // so the first paint never flashes at the wrong spot.
        computedStyle.top = '0rem';
        computedStyle.left = '0rem';
        computedStyle.visibility = 'hidden';
      }
    } else {
      if (sideOffset !== undefined) {
        const remVal = `${(sideOffset * 0.0625).toFixed(4)}rem`;
        if (side === 'top') computedStyle.marginBottom = remVal;
        else if (side === 'bottom') computedStyle.marginTop = remVal;
        else if (side === 'left') computedStyle.marginRight = remVal;
        else if (side === 'right') computedStyle.marginLeft = remVal;
      }

      if (inwardOffset.x !== 0) {
        const existingMargin = typeof computedStyle.marginLeft === 'string' ? parseFloat(computedStyle.marginLeft) : 0;
        computedStyle.marginLeft = `${(existingMargin + inwardOffset.x * 0.0625).toFixed(4)}rem`;
      }
      if (inwardOffset.y !== 0) {
        const existingMargin = typeof computedStyle.marginTop === 'string' ? parseFloat(computedStyle.marginTop) : 0;
        computedStyle.marginTop = `${(existingMargin + inwardOffset.y * 0.0625).toFixed(4)}rem`;
      }
    }

    const contentNode = (
      <div
        ref={innerRef}
        role="tooltip"
        id={tooltipId}
        data-slot="tooltip-content"
        data-side={side}
        data-align={align}
        data-state={visible ? (exiting ? 'closed' : 'open') : 'closed'}
        style={computedStyle}
        className={cn(
          portal ? 'fixed' : 'absolute',
          'whitespace-nowrap pointer-events-none select-none',
          'z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md inline-flex items-center gap-2',
          exiting ? 'animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-0 zoom-in-95',
          // Portal coordinates are explicit: the in-flow offset/translate
          // classes would double-shift the bubble, so they only apply inline.
          portal ? null : sidePositionClasses[side],
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {shortcut && (
          <Kbd
            data-slot="tooltip-shortcut"
            variant="outline"
            size="xs"
            compact="never"
            shortcut={shortcut}
          />
        )}
        {arrow && (
          <span
            data-slot="tooltip-arrow"
            className={cn(
              'absolute w-0 h-0 border-solid pointer-events-none',
              effectiveSide === 'top' && 'top-full left-1/2 -translate-x-1/2 border-t-[0.25rem] border-t-popover border-x-[0.25rem] border-x-transparent border-b-0',
              effectiveSide === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 border-b-[0.25rem] border-b-popover border-x-[0.25rem] border-x-transparent border-t-0',
              effectiveSide === 'left' && 'left-full top-1/2 -translate-y-1/2 border-l-[0.25rem] border-l-popover border-y-[0.25rem] border-y-transparent border-r-0',
              effectiveSide === 'right' && 'right-full top-1/2 -translate-y-1/2 border-r-[0.25rem] border-r-popover border-y-[0.25rem] border-y-transparent border-l-0',
            )}
          />
        )}
      </div>
    );

    if (portal && typeof document !== 'undefined') {
      return createPortal(contentNode, container || document.body);
    }

    return contentNode;
  },
);

TooltipContent.displayName = 'TooltipContent';

export interface TooltipProps extends Omit<TooltipRootProps, 'content'> {
  content?: React.ReactNode;
  shortcut?: string;
  arrow?: boolean;
  sideOffset?: number;
  alignOffset?: number;
  portal?: boolean;
  container?: HTMLElement | null;
}

const TooltipComponent = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      shortcut,
      arrow,
      avoidCollisions = true,
      sideOffset,
      alignOffset,
      portal = true,
      container,
      side = 'top',
      delayDuration,
      disabled = false,
      open,
      defaultOpen,
      onOpenChange,
      className,
      ...props
    },
    ref,
  ) => {
    if (content !== undefined) {
      const isElement = React.isValidElement(children);
      return (
        <TooltipRoot
          ref={ref}
          side={side}
          avoidCollisions={avoidCollisions}
          delayDuration={delayDuration}
          disabled={disabled}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          className={className}
          {...props}
        >
          {isElement ? (
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          ) : (
            <TooltipTrigger>{children}</TooltipTrigger>
          )}
          <TooltipContent
            side={side}
            shortcut={shortcut}
            arrow={arrow}
            avoidCollisions={avoidCollisions}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            portal={portal}
            container={container}
          >
            {content}
          </TooltipContent>
        </TooltipRoot>
      );
    }

    return (
      <TooltipRoot
        ref={ref}
        side={side}
        avoidCollisions={avoidCollisions}
        delayDuration={delayDuration}
        disabled={disabled}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className={className}
        {...props}
      >
        {children}
      </TooltipRoot>
    );
  },
);

TooltipComponent.displayName = 'Tooltip';

export const Tooltip = Object.assign(TooltipComponent, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

