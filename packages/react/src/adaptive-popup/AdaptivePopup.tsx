import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { ScrollArea } from '../scroll-area/ScrollArea';

export interface AdaptivePopupProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  minHeight?: number | string;
  maxHeight?: number | string;
  placement?: 'down' | 'up';
  anchorX?: number;
  anchorY?: number;
  edgeMargin?: number;
  contentInset?: number;
  useFullHostBand?: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  container?: HTMLElement | null | React.RefObject<HTMLElement | null>;
  align?: 'start' | 'center' | 'end';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export const AdaptivePopup = React.forwardRef<HTMLDivElement, AdaptivePopupProps>(
  function AdaptivePopup(
    {
      open = false,
      onOpenChange,
      minHeight = 120,
      maxHeight = -1,
      placement = 'down',
      anchorX = 0,
      anchorY = 0,
      edgeMargin = 12,
      contentInset = 16,
      useFullHostBand = false,
      anchorRef,
      containerRef,
      container,
      align = 'start',
      header,
      footer,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const popupRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const footerRef = React.useRef<HTMLDivElement>(null);

    const resolveContainer = React.useCallback((): HTMLElement | null => {
      if (containerRef && typeof containerRef === 'object' && 'current' in containerRef) {
        return containerRef.current;
      }
      if (container) {
        if (typeof container === 'object' && 'current' in container) {
          return (container as React.RefObject<HTMLElement | null>).current;
        }
        return container as HTMLElement;
      }
      return null;
    }, [containerRef, container]);

    const [computedStyle, setComputedStyle] = React.useState<{
      top: number;
      left: number;
      height: number;
      heightCapped: boolean;
    }>({
      top: 0,
      left: 0,
      height: typeof minHeight === 'number' ? minHeight : 120,
      heightCapped: false,
    });

    const minH = React.useMemo(() => {
      if (typeof minHeight === 'number') return minHeight;
      const parsed = Number.parseFloat(String(minHeight));
      return Number.isFinite(parsed) ? parsed : 120;
    }, [minHeight]);

    const maxH = React.useMemo(() => {
      if (typeof maxHeight === 'number') return maxHeight;
      const parsed = Number.parseFloat(String(maxHeight));
      return Number.isFinite(parsed) ? parsed : -1;
    }, [maxHeight]);

    const getRootFontSize = React.useCallback((): number => {
      if (typeof window === 'undefined') return 16;
      return Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
    }, []);

    const updatePositionRef = React.useRef<() => void>(() => {});

    // Recompute measurements whenever open, placement or dimensions change
    React.useLayoutEffect(() => {
      if (!open || typeof window === 'undefined') return;

      const updatePosition = () => {
        const containerEl = resolveContainer();
        let originX = anchorX;
        let originY = anchorY;

        const hostRect = containerEl
          ? containerEl.getBoundingClientRect()
          : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };

        const hostBandW = hostRect.width;
        const hostBandH = hostRect.height;

        const popupW = popupRef.current && popupRef.current.offsetWidth > 0 ? popupRef.current.offsetWidth : 320;

        if (anchorRef?.current) {
          const rect = anchorRef.current.getBoundingClientRect();
          if (containerEl) {
            originX = rect.left - hostRect.left + containerEl.scrollLeft;
            originY =
              placement === 'up'
                ? rect.top - hostRect.top + containerEl.scrollTop
                : rect.bottom - hostRect.top + containerEl.scrollTop + 4;
          } else {
            originX = rect.left;
            originY = placement === 'up' ? rect.top : rect.bottom + 4;
          }
          if (align === 'center') {
            originX = originX + (rect.width - popupW) / 2;
          } else if (align === 'end') {
            originX = originX + rect.width - popupW;
          }
        }

        // Measure natural heights
        const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
        const footerH = footerRef.current ? footerRef.current.offsetHeight : 0;
        const contentH = contentRef.current
          ? Math.max(contentRef.current.offsetHeight, contentRef.current.scrollHeight)
          : 0;
        const desiredH = Math.ceil(headerH + contentH + footerH + 2);

        // Calculate host available height
        let usable: number;
        if (useFullHostBand) {
          usable = hostBandH - edgeMargin * 2;
        } else if (placement === 'up') {
          usable = Math.max(edgeMargin, originY) - edgeMargin;
        } else {
          usable = hostBandH - Math.max(edgeMargin, originY) - edgeMargin;
        }

        if (maxH > 0) {
          usable = Math.min(usable, maxH);
        }

        const effectiveMinH = Math.min(minH, usable > 0 ? usable : minH);
        const hostAvailableH = Math.max(effectiveMinH, usable);
        const finalHeight = Math.max(effectiveMinH, Math.min(desiredH, hostAvailableH));
        const heightCapped = finalHeight < desiredH - 1;

        // Calculate clamped position
        const maxLeft = hostBandW - popupW - edgeMargin;
        const clampedLeft = Math.max(edgeMargin, Math.min(originX, Math.max(edgeMargin, maxLeft)));

        let clampedTop: number;
        if (placement === 'up') {
          const topCandidate = originY - finalHeight;
          const maxTop = hostBandH - finalHeight - edgeMargin;
          clampedTop = Math.max(edgeMargin, Math.min(topCandidate, Math.max(edgeMargin, maxTop)));
        } else {
          const maxTop = hostBandH - finalHeight - edgeMargin;
          clampedTop = Math.max(edgeMargin, Math.min(originY, Math.max(edgeMargin, maxTop)));
        }

        setComputedStyle({
          top: clampedLeft < minH && clampedTop < 0 ? 0 : clampedTop,
          left: clampedLeft,
          height: finalHeight,
          heightCapped,
        });
      };

      updatePositionRef.current = updatePosition;
      updatePosition();

      let resizeObserver: ResizeObserver | null = null;
      const containerEl = resolveContainer();
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => updatePosition());
        if (containerEl) resizeObserver.observe(containerEl);
        if (anchorRef?.current) resizeObserver.observe(anchorRef.current);
        if (popupRef.current) resizeObserver.observe(popupRef.current);
      }

      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        resizeObserver?.disconnect();
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [open, placement, anchorX, anchorY, edgeMargin, useFullHostBand, minH, maxH, anchorRef, containerRef, container, align, children, header, footer, resolveContainer]);

    // Re-run in useEffect so late-attaching containerRef / anchorRef on parent DOM nodes are picked up
    React.useEffect(() => {
      if (!open) return;
      updatePositionRef.current();
    }, [open]);

    // Dismiss on Escape
    React.useEffect(() => {
      if (!open) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange?.(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onOpenChange]);

    // Dismiss on click outside
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (popupRef.current && !popupRef.current.contains(target)) {
          if (anchorRef?.current && anchorRef.current.contains(target)) return;
          onOpenChange?.(false);
        }
      };
      document.addEventListener('pointerdown', onPointerDown);
      return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, onOpenChange, anchorRef]);

    if (!open) return null;

    const containerEl = resolveContainer();
    const isContained = Boolean(containerEl);

    const rootFontSize = getRootFontSize();

    const popupContent = (
      <div
        ref={(node) => {
          (popupRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="adaptive-popup"
        data-height-capped={computedStyle.heightCapped ? 'true' : 'false'}
        role="dialog"
        aria-modal="false"
        className={cn(
          isContained ? 'absolute' : 'fixed',
          'z-50 rounded-lg border border-border bg-popover text-popover-foreground shadow-md',
          'flex flex-col overflow-hidden',
          'duration-short ease-entrance animate-in fade-in-0 zoom-in-95',
          className,
        )}
        style={{
          top: `${computedStyle.top / rootFontSize}rem`,
          left: `${computedStyle.left / rootFontSize}rem`,
          height: `${computedStyle.height / rootFontSize}rem`,
          ...style,
        }}
        {...props}
      >
        {header && (
          <div ref={headerRef} className="flex-none border-b border-border/50">
            {header}
          </div>
        )}
        <ScrollArea
          className="flex-1 min-h-0 w-full"
          viewportClassName="w-full"
          contentClassName="w-full"
          showVerticalScrollBar={computedStyle.heightCapped}
          contentStyle={{
            paddingLeft: `${contentInset * 0.0625}rem`,
            paddingRight: `${contentInset * 0.0625}rem`,
          }}
        >
          <div ref={contentRef} className="w-full">
            {children}
          </div>
        </ScrollArea>
        {footer && (
          <div ref={footerRef} className="flex-none border-t border-border/50">
            {footer}
          </div>
        )}
      </div>
    );

    if (typeof document !== 'undefined') {
      return createPortal(popupContent, containerEl || document.body);
    }
    return popupContent;
  },
);
