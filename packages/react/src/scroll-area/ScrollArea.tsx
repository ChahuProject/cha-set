import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../lib/utils';
import { ScrollAreaContext, type ScrollState, type ScrollAreaContextValue } from './context';
import { ScrollBar } from './ScrollBar';

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root> {
  /** Whether to automatically render a vertical scrollbar. @default true */
  showVerticalScrollBar?: boolean;
  /** Whether to automatically render a horizontal scrollbar. @default false */
  showHorizontalScrollBar?: boolean;
  /** Whether stepper buttons appear on scrollbar hover. @default true */
  showButtons?: boolean;
  /** Step ratio for page up / page down buttons. @default 0.85 */
  pageStepRatio?: number;
  /** Whether stepper buttons use smooth scrolling. @default true */
  smoothScroll?: boolean;
  /** Whether scrollbars stay mounted in DOM when not overflowing. @default false */
  keepMounted?: boolean;
  /** Force scrollbar into hovered visual state (for deterministic testing). */
  forceHover?: boolean;
  /** Force scrollbar into active/dragging visual state (for deterministic testing). */
  forceActive?: boolean;
  /** Viewport class names. */
  viewportClassName?: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function scrollElementTo(
  el: HTMLElement,
  options: { top?: number; left?: number; behavior?: ScrollBehavior },
) {
  if (typeof el.scrollTo === 'function') {
    el.scrollTo(options);
  } else {
    if (options.top !== undefined) el.scrollTop = options.top;
    if (options.left !== undefined) el.scrollLeft = options.left;
  }
}

function scrollElementBy(
  el: HTMLElement,
  options: { top?: number; left?: number; behavior?: ScrollBehavior },
) {
  if (typeof el.scrollBy === 'function') {
    el.scrollBy(options);
  } else {
    if (options.top !== undefined) el.scrollTop += options.top;
    if (options.left !== undefined) el.scrollLeft += options.left;
  }
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      className,
      viewportClassName,
      children,
      showVerticalScrollBar = true,
      showHorizontalScrollBar = false,
      showButtons = true,
      pageStepRatio = 0.85,
      smoothScroll = true,
      keepMounted = false,
      forceHover = false,
      forceActive = false,
      ...props
    },
    ref,
  ) {
    const viewportRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [scrollState, setScrollState] = React.useState<ScrollState>({
      isAtTop: true,
      isAtBottom: false,
      isAtLeft: true,
      isAtRight: false,
      hasOverflowY: false,
      hasOverflowX: false,
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      clientHeight: 0,
      scrollWidth: 0,
      clientWidth: 0,
    });

    const updateScrollState = React.useCallback(() => {
      const el = viewportRef.current;
      if (!el) return;

      const { scrollTop, scrollLeft, scrollHeight, clientHeight, scrollWidth, clientWidth } = el;
      const hasMeasuredY = scrollHeight > 0 && clientHeight > 0;
      const hasMeasuredX = scrollWidth > 0 && clientWidth > 0;
      // Real measurements when layout is present; fallback to true for unmeasured/jsdom environments
      const hasOverflowY = hasMeasuredY ? scrollHeight > clientHeight : true;
      const hasOverflowX = hasMeasuredX ? scrollWidth > clientWidth : true;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = hasMeasuredY ? (hasOverflowY ? Math.ceil(scrollTop + clientHeight) >= Math.floor(scrollHeight) - 2 : true) : false;
      const isAtLeft = scrollLeft <= 1;
      const isAtRight = hasMeasuredX ? (hasOverflowX ? Math.ceil(scrollLeft + clientWidth) >= Math.floor(scrollWidth) - 2 : true) : false;

      setScrollState((prev) => {
        if (
          prev.isAtTop === isAtTop &&
          prev.isAtBottom === isAtBottom &&
          prev.isAtLeft === isAtLeft &&
          prev.isAtRight === isAtRight &&
          prev.hasOverflowY === hasOverflowY &&
          prev.hasOverflowX === hasOverflowX &&
          Math.abs(prev.scrollTop - scrollTop) < 1 &&
          Math.abs(prev.scrollLeft - scrollLeft) < 1
        ) {
          return prev;
        }
        return {
          isAtTop,
          isAtBottom,
          isAtLeft,
          isAtRight,
          hasOverflowY,
          hasOverflowX,
          scrollTop,
          scrollLeft,
          scrollHeight,
          clientHeight,
          scrollWidth,
          clientWidth,
        };
      });
    }, []);

    useIsomorphicLayoutEffect(() => {
      const el = viewportRef.current;
      if (!el) return;

      updateScrollState();

      const handleScroll = () => {
        updateScrollState();
      };

      el.addEventListener('scroll', handleScroll, { passive: true });

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          updateScrollState();
        });
        resizeObserver.observe(el);
        if (contentRef.current) {
          resizeObserver.observe(contentRef.current);
        }
      }

      return () => {
        el.removeEventListener('scroll', handleScroll);
        resizeObserver?.disconnect();
      };
    }, [updateScrollState]);

    const scrollToTop = React.useCallback(
      (smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        scrollElementTo(el, { top: 0, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollToBottom = React.useCallback(
      (smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        scrollElementTo(el, { top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollPageUp = React.useCallback(
      (ratio = 0.85, smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        const delta = el.clientHeight * ratio;
        scrollElementBy(el, { top: -delta, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollPageDown = React.useCallback(
      (ratio = 0.85, smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        const delta = el.clientHeight * ratio;
        scrollElementBy(el, { top: delta, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollToLeft = React.useCallback(
      (smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        scrollElementTo(el, { left: 0, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollToRight = React.useCallback(
      (smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        scrollElementTo(el, { left: el.scrollWidth, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollPageLeft = React.useCallback(
      (ratio = 0.85, smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        const delta = el.clientWidth * ratio;
        scrollElementBy(el, { left: -delta, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const scrollPageRight = React.useCallback(
      (ratio = 0.85, smooth = true) => {
        const el = viewportRef.current;
        if (!el) return;
        const delta = el.clientWidth * ratio;
        scrollElementBy(el, { left: delta, behavior: smooth ? 'smooth' : 'auto' });
      },
      [],
    );

    const contextValue = React.useMemo<ScrollAreaContextValue>(
      () => ({
        viewportRef,
        scrollState,
        scrollToTop,
        scrollToBottom,
        scrollPageUp,
        scrollPageDown,
        scrollToLeft,
        scrollToRight,
        scrollPageLeft,
        scrollPageRight,
      }),
      [
        scrollState,
        scrollToTop,
        scrollToBottom,
        scrollPageUp,
        scrollPageDown,
        scrollToLeft,
        scrollToRight,
        scrollPageLeft,
        scrollPageRight,
      ],
    );

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <BaseScrollArea.Root
          ref={ref}
          className={cn('relative overflow-hidden', className)}
          {...props}
        >
          <BaseScrollArea.Viewport
            ref={viewportRef}
            className={cn('size-full rounded-[inherit]', viewportClassName)}
          >
            <BaseScrollArea.Content ref={contentRef}>{children}</BaseScrollArea.Content>
          </BaseScrollArea.Viewport>

          {showVerticalScrollBar && (
            <ScrollBar
              orientation="vertical"
              showButtons={showButtons}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
              keepMounted={keepMounted}
              forceHover={forceHover}
              forceActive={forceActive}
            />
          )}

          {showHorizontalScrollBar && (
            <ScrollBar
              orientation="horizontal"
              showButtons={showButtons}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
              keepMounted={keepMounted}
              forceHover={forceHover}
              forceActive={forceActive}
            />
          )}

          <BaseScrollArea.Corner />
        </BaseScrollArea.Root>
      </ScrollAreaContext.Provider>
    );
  },
);

export const ScrollAreaViewport = BaseScrollArea.Viewport;
export const ScrollAreaContent = BaseScrollArea.Content;
export const ScrollAreaCorner = BaseScrollArea.Corner;
export const ScrollAreaThumb = BaseScrollArea.Thumb;
