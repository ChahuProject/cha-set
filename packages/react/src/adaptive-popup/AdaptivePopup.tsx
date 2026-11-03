import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';

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
      useFullHostBand = true,
      anchorRef,
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

    // Recompute measurements whenever open, placement or dimensions change
    React.useLayoutEffect(() => {
      if (!open || typeof window === 'undefined') return;

      const updatePosition = () => {
        let originX = anchorX;
        let originY = anchorY;

        if (anchorRef?.current) {
          const rect = anchorRef.current.getBoundingClientRect();
          originX = rect.left;
          originY = placement === 'up' ? rect.top : rect.bottom + 4;
        }

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        // Measure natural heights
        const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
        const footerH = footerRef.current ? footerRef.current.offsetHeight : 0;
        const contentH = contentRef.current ? contentRef.current.scrollHeight : 0;
        const desiredH = Math.ceil(headerH + contentH + footerH);

        // Calculate host available height
        let usable: number;
        if (useFullHostBand) {
          usable = windowH - edgeMargin * 2;
        } else if (placement === 'up') {
          usable = Math.max(edgeMargin, originY) - edgeMargin;
        } else {
          usable = windowH - Math.max(edgeMargin, originY) - edgeMargin;
        }

        if (maxH > 0) {
          usable = Math.min(usable, maxH);
        }

        const hostAvailableH = Math.max(minH, usable);
        const finalHeight = Math.max(minH, Math.min(desiredH, hostAvailableH));
        const heightCapped = finalHeight < desiredH - 1;

        // Calculate clamped position
        const popupW = popupRef.current ? popupRef.current.offsetWidth : 320;
        const maxLeft = windowW - popupW - edgeMargin;
        const clampedLeft = Math.max(edgeMargin, Math.min(originX, Math.max(edgeMargin, maxLeft)));

        let clampedTop: number;
        if (placement === 'up') {
          const topCandidate = originY - finalHeight;
          const maxTop = windowH - finalHeight - edgeMargin;
          clampedTop = Math.max(edgeMargin, Math.min(topCandidate, Math.max(edgeMargin, maxTop)));
        } else {
          const maxTop = windowH - finalHeight - edgeMargin;
          clampedTop = Math.max(edgeMargin, Math.min(originY, Math.max(edgeMargin, maxTop)));
        }

        setComputedStyle({
          top: clampedTop,
          left: clampedLeft,
          height: finalHeight,
          heightCapped,
        });
      };

      updatePosition();

      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [open, placement, anchorX, anchorY, edgeMargin, useFullHostBand, minH, maxH, anchorRef, children, header, footer]);

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
          'fixed z-50 rounded-lg border border-border bg-popover text-popover-foreground shadow-md',
          'flex flex-col overflow-hidden',
          'duration-short ease-entrance animate-in fade-in-0 zoom-in-95',
          className,
        )}
        style={{
          top: `${computedStyle.top * 0.0625}rem`,
          left: `${computedStyle.left * 0.0625}rem`,
          height: `${computedStyle.height * 0.0625}rem`,
          ...style,
        }}
        {...props}
      >
        {header && (
          <div ref={headerRef} className="flex-none border-b border-border/50">
            {header}
          </div>
        )}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          style={{
            paddingLeft: `${contentInset * 0.0625}rem`,
            paddingRight: `${contentInset * 0.0625}rem`,
          }}
        >
          {children}
        </div>
        {footer && (
          <div ref={footerRef} className="flex-none border-t border-border/50">
            {footer}
          </div>
        )}
      </div>
    );

    if (typeof document !== 'undefined') {
      return createPortal(popupContent, document.body);
    }
    return popupContent;
  },
);
