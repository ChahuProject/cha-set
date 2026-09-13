import * as React from 'react';
import { CopyButton } from '../copy-button/CopyButton';
import { cn } from '../lib/utils';
import { VirtualList, type VirtualListHandle } from '../virtual/VirtualList';
import { AnsiText } from './ansi';
import type { LogConsoleProps } from './types';
import { logsToPlainText, shouldStickToBottom } from './utils';

const MemoLogLine = React.memo(function MemoLogLine({ text }: { text: string }) {
  return (
    <div className="break-all font-mono text-xs leading-relaxed text-foreground select-text">
      <AnsiText text={text} />
    </div>
  );
});

/**
 * LogConsole — high-performance virtualized terminal/log viewer with smart
 * stick-to-bottom autoscroll, ANSI color parsing, and one-click plain text copy.
 */
export function LogConsole({
  lines,
  className,
  emptyText = 'No logs',
  showCopy = true,
  showLineCount = true,
  autoScroll = true,
  copyTitle = 'Copy all logs',
}: LogConsoleProps) {
  const [sticking, setSticking] = React.useState(true);
  const listRef = React.useRef<VirtualListHandle>(null);

  React.useEffect(() => {
    if (autoScroll && sticking && lines.length > 0) {
      listRef.current?.scrollToIndex(lines.length - 1, 'end');
    }
  }, [lines, sticking, autoScroll]);

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted/30 select-text',
        className,
      )}
    >
      {lines.length > 0 && (showCopy || showLineCount) && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-md border border-border/60 bg-background/85 px-1.5 py-0.5 shadow-2xs backdrop-blur-xs select-none">
          {showLineCount && (
            <span className="tabular-nums text-[0.6875rem] text-muted-foreground">
              {lines.length} lines
            </span>
          )}
          {showCopy && (
            <CopyButton
              text={() => logsToPlainText(lines)}
              title={copyTitle}
              className="h-5 w-5 p-0"
              iconClassName="size-3"
            />
          )}
        </div>
      )}

      <VirtualList
        ref={listRef}
        items={lines}
        estimateSize={20}
        className="min-h-0 flex-1 p-2 select-text"
        emptyNode={
          <div className="flex h-full min-h-[6rem] items-center justify-center text-xs text-muted-foreground select-text">
            {emptyText}
          </div>
        }
        onScroll={distanceToBottom => {
          if (autoScroll) {
            setSticking(shouldStickToBottom(distanceToBottom));
          }
        }}
        renderRow={text => <MemoLogLine text={text} />}
      />
    </div>
  );
}
