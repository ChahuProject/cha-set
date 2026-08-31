import * as React from 'react';
import { cn } from '../lib/utils';
import { useScrollAreaContext } from './context';

export interface ScrollBarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconOnly?: boolean;
}

export const ScrollBarButton = React.forwardRef<HTMLButtonElement, ScrollBarButtonProps>(
  function ScrollBarButton({ className, disabled, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          'inline-flex items-center justify-center size-2.5 rounded-[2px] text-muted-foreground/80 hover:text-foreground hover:bg-accent/80 active:bg-accent focus:outline-none transition-all duration-100 disabled:opacity-20 disabled:pointer-events-none cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export function ChevronsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m17 11-5-5-5 5" />
      <path d="m17 18-5-5-5 5" />
    </svg>
  );
}

export function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronsDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 6 5 5 5-5" />
      <path d="m7 13 5 5 5-5" />
    </svg>
  );
}

export function ChevronsLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChevronsRightIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-2.5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" />
    </svg>
  );
}

export interface ScrollBarStepperProps {
  orientation: 'vertical' | 'horizontal';
  pageStepRatio?: number;
  smoothScroll?: boolean;
}

export function ScrollBarStartCluster({
  orientation,
  pageStepRatio = 0.85,
  smoothScroll = true,
}: ScrollBarStepperProps) {
  const ctx = useScrollAreaContext();

  if (orientation === 'vertical') {
    const isAtTop = ctx ? ctx.scrollState.isAtTop : false;
    return (
      <div
        className="flex flex-col items-center justify-center gap-0.5 pointer-events-auto select-none p-0.5 h-5 w-full"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ScrollBarButton
          title="Scroll to Top"
          aria-label="Scroll to top"
          disabled={isAtTop}
          onClick={(e) => {
            e.stopPropagation();
            ctx?.scrollToTop(smoothScroll);
          }}
        >
          <ChevronsUpIcon />
        </ScrollBarButton>
        <ScrollBarButton
          title="Page Up"
          aria-label="Page up"
          disabled={isAtTop}
          onClick={(e) => {
            e.stopPropagation();
            ctx?.scrollPageUp(pageStepRatio, smoothScroll);
          }}
        >
          <ChevronUpIcon />
        </ScrollBarButton>
      </div>
    );
  }

  const isAtLeft = ctx ? ctx.scrollState.isAtLeft : false;
  return (
    <div
      className="flex flex-row items-center justify-center gap-0.5 pointer-events-auto select-none p-0.5 w-5 h-full"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <ScrollBarButton
        title="Scroll to Start"
        aria-label="Scroll to start"
        disabled={isAtLeft}
        onClick={(e) => {
          e.stopPropagation();
          ctx?.scrollToLeft(smoothScroll);
        }}
      >
        <ChevronsLeftIcon />
      </ScrollBarButton>
      <ScrollBarButton
        title="Page Left"
        aria-label="Page left"
        disabled={isAtLeft}
        onClick={(e) => {
          e.stopPropagation();
          ctx?.scrollPageLeft(pageStepRatio, smoothScroll);
        }}
      >
        <ChevronLeftIcon />
      </ScrollBarButton>
    </div>
  );
}

export function ScrollBarEndCluster({
  orientation,
  pageStepRatio = 0.85,
  smoothScroll = true,
}: ScrollBarStepperProps) {
  const ctx = useScrollAreaContext();

  if (orientation === 'vertical') {
    const isAtBottom = ctx ? ctx.scrollState.isAtBottom : false;
    return (
      <div
        className="flex flex-col items-center justify-center gap-0.5 pointer-events-auto select-none p-0.5 h-5 w-full"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ScrollBarButton
          title="Page Down"
          aria-label="Page down"
          disabled={isAtBottom}
          onClick={(e) => {
            e.stopPropagation();
            ctx?.scrollPageDown(pageStepRatio, smoothScroll);
          }}
        >
          <ChevronDownIcon />
        </ScrollBarButton>
        <ScrollBarButton
          title="Scroll to Bottom"
          aria-label="Scroll to bottom"
          disabled={isAtBottom}
          onClick={(e) => {
            e.stopPropagation();
            ctx?.scrollToBottom(smoothScroll);
          }}
        >
          <ChevronsDownIcon />
        </ScrollBarButton>
      </div>
    );
  }

  const isAtRight = ctx ? ctx.scrollState.isAtRight : false;
  return (
    <div
      className="flex flex-row items-center justify-center gap-0.5 pointer-events-auto select-none p-0.5 w-5 h-full"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <ScrollBarButton
        title="Page Right"
        aria-label="Page right"
        disabled={isAtRight}
        onClick={(e) => {
          e.stopPropagation();
          ctx?.scrollPageRight(pageStepRatio, smoothScroll);
        }}
      >
        <ChevronRightIcon />
      </ScrollBarButton>
      <ScrollBarButton
        title="Scroll to End"
        aria-label="Scroll to end"
        disabled={isAtRight}
        onClick={(e) => {
          e.stopPropagation();
          ctx?.scrollToRight(smoothScroll);
        }}
      >
        <ChevronsRightIcon />
      </ScrollBarButton>
    </div>
  );
}
