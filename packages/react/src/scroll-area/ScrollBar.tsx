import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../lib/utils';
import { ScrollBarStartCluster, ScrollBarEndCluster } from './ScrollBarButtons';

export interface ScrollBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Scrollbar orientation. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Whether to show to-top/bottom & page-up/down stepper buttons. @default true */
  showButtons?: boolean;
  /** Viewport scroll step ratio for page buttons. @default 0.85 */
  pageStepRatio?: number;
  /** Whether stepper buttons trigger smooth scrolling. @default true */
  smoothScroll?: boolean;
  /** Custom hot zone thickness in pixels or rem string. @default 8 (0.5rem) */
  hitSize?: number | string;
  /** Collapsed indicator thickness in pixels or rem string. @default 4 (0.25rem) */
  collapsedSize?: number | string;
  /** Expanded indicator thickness in pixels or rem string. @default 8 (0.5rem) */
  expandedSize?: number | string;
  /** Whether to keep mounted when hidden. @default true */
  keepMounted?: boolean;
}

function toRem(val?: number | string): string | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'number') return `${val / 16}rem`;
  return val;
}

export const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  function ScrollBar(
    {
      className,
      orientation = 'vertical',
      showButtons = true,
      pageStepRatio = 0.85,
      smoothScroll = true,
      hitSize = 8,
      collapsedSize = 4,
      expandedSize = 8,
      keepMounted = true,
      children,
      style,
      ...props
    },
    ref,
  ) {
    const isVertical = orientation === 'vertical';

    return (
      <div
        ref={ref}
        data-orientation={orientation}
        style={{
          ...(isVertical
            ? {
                width: toRem(hitSize),
                top: 0,
                bottom: 'var(--scroll-area-corner-height, 0px)',
                right: 0,
              }
            : {
                height: toRem(hitSize),
                left: 0,
                right: 'var(--scroll-area-corner-width, 0px)',
                bottom: 0,
              }),
          ...style,
        }}
        className={cn(
          'group absolute select-none touch-none transition-colors duration-150 z-20 flex',
          isVertical
            ? 'flex-col items-center hover:bg-muted/30'
            : 'flex-row items-center hover:bg-muted/30',
          className,
        )}
        {...props}
      >
        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto shrink-0',
              isVertical ? 'h-5 w-full' : 'w-5 h-full',
            )}
          >
            <ScrollBarStartCluster
              orientation={orientation}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
            />
          </div>
        )}

        <BaseScrollArea.Scrollbar
          orientation={orientation}
          keepMounted={keepMounted}
          style={{
            position: 'relative',
            top: 'auto',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            insetInlineStart: 'auto',
            insetInlineEnd: 'auto',
            ...(isVertical ? { width: '100%' } : { height: '100%' }),
          }}
          className={cn(
            'flex-1 cursor-pointer select-none touch-none',
            isVertical ? 'w-full py-0.5' : 'h-full px-0.5',
          )}
        >
          <BaseScrollArea.Thumb
            className={cn(
              'absolute z-20 flex items-center justify-center cursor-pointer transition-all duration-150',
              isVertical ? 'top-0 inset-x-0 min-h-4 my-0.5' : 'left-0 inset-y-0 min-w-4 mx-0.5',
            )}
          >
            {children ?? (
              <div
                className={cn(
                  'rounded-full bg-border transition-all duration-150',
                  'group-hover:bg-muted-foreground/50 active:bg-foreground/60',
                  isVertical ? 'h-full w-1 group-hover:w-2' : 'w-full h-1 group-hover:h-2',
                )}
              />
            )}
          </BaseScrollArea.Thumb>
        </BaseScrollArea.Scrollbar>

        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto shrink-0',
              isVertical ? 'h-5 w-full' : 'w-5 h-full',
            )}
          >
            <ScrollBarEndCluster
              orientation={orientation}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
            />
          </div>
        )}
      </div>
    );
  },
);
