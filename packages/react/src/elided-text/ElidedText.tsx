import * as React from 'react';
import { cn } from '../lib/utils';
import { Tooltip, type TooltipSide } from '../tooltip/Tooltip';
import type { TooltipPlacement } from '@chahu/spec/elided-text';

export interface ElidedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  tooltipText?: string;
  tooltipPlacement?: TooltipPlacement;
  tooltipDelay?: number;
  alwaysShowTooltip?: boolean;
  showTooltipWhenElided?: boolean;
  maxLines?: number;
}

const placementToSideMap: Record<TooltipPlacement, TooltipSide> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  auto: 'top',
};

export const ElidedText = React.forwardRef<HTMLSpanElement, ElidedTextProps>(
  (
    {
      text,
      tooltipText,
      tooltipPlacement = 'top',
      tooltipDelay = 400,
      alwaysShowTooltip = false,
      showTooltipWhenElided = true,
      maxLines = 1,
      className,
      style,
      children,
      onMouseEnter,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLSpanElement | null>(null);
    const [isTruncated, setIsTruncated] = React.useState(false);

    const checkTruncation = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      const truncated =
        maxLines > 1
          ? el.scrollHeight > el.clientHeight
          : el.scrollWidth > el.clientWidth;
      setIsTruncated(truncated);
    }, [maxLines]);

    React.useEffect(() => {
      checkTruncation();
    }, [checkTruncation, text, children]);

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => {
        checkTruncation();
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [checkTruncation]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLSpanElement>) => {
      checkTruncation();
      onMouseEnter?.(event);
    };

    const displayText = text ?? (typeof children === 'string' ? children : '');
    const resolvedTooltip = tooltipText !== undefined ? tooltipText : displayText;
    const shouldShow =
      Boolean(resolvedTooltip) &&
      (alwaysShowTooltip || (showTooltipWhenElided && isTruncated));

    const side: TooltipSide = placementToSideMap[tooltipPlacement] ?? 'top';

    const mergedRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef && 'current' in forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        }
      },
      [forwardedRef],
    );

    const contentElement = (
      <span
        ref={mergedRef}
        data-slot="elided-text"
        data-truncated={isTruncated ? 'true' : 'false'}
        onMouseEnter={handleMouseEnter}
        className={cn(
          maxLines > 1
            ? 'overflow-hidden text-ellipsis'
            : 'truncate inline-block max-w-full align-bottom',
          className,
        )}
        style={{
          ...(maxLines > 1
            ? {
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }
            : {}),
          ...style,
        }}
        {...props}
      >
        {children ?? text}
      </span>
    );

    return (
      <Tooltip
        content={resolvedTooltip}
        side={side}
        delayDuration={tooltipDelay}
        disabled={!shouldShow}
      >
        {contentElement}
      </Tooltip>
    );
  },
);

ElidedText.displayName = 'ElidedText';
