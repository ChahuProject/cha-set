import * as React from 'react';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface DocumentTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  useShellChrome?: boolean;
  trailing?: React.ReactNode;
  leftPadding?: number | string;
  rightPadding?: number | string;
}

export const DocumentTabs = forwardRef<HTMLDivElement, DocumentTabsProps>(function DocumentTabs(
  {
    useShellChrome = false,
    trailing,
    leftPadding,
    rightPadding,
    className,
    children,
    ...props
  },
  ref,
) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    const dy = e.deltaY !== 0 ? e.deltaY : e.deltaX;
    if (dy !== 0) {
      scrollContainerRef.current.scrollLeft += dy;
    }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      data-slot="document-tabs"
      data-shell-chrome={useShellChrome ? 'true' : 'false'}
      className={cn(
        'relative flex items-center h-10 w-full overflow-hidden select-none',
        useShellChrome
          ? 'bg-transparent text-foreground'
          : 'bg-muted/40 text-foreground border-b border-border/50',
        className,
      )}
      style={{
        paddingLeft: leftPadding,
        paddingRight: rightPadding,
      }}
      {...props}
    >
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex items-center gap-1 h-full flex-1 overflow-x-auto overflow-y-hidden px-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {trailing && (
        <div className="flex items-center shrink-0 pr-2 pl-1 gap-1">
          {trailing}
        </div>
      )}
    </div>
  );
});

DocumentTabs.displayName = 'DocumentTabs';
