import React from 'react';
import { CopyButton, ScrollArea } from '@chahu/cha-set';

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'tsx', className = '' }: CodeBlockProps) {
  return (
    <div className={`relative group rounded-lg overflow-hidden border border-border bg-muted/40 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60 bg-muted/60 text-muted-foreground text-[0.6875rem]">
        <span className="font-semibold uppercase tracking-wider">{language}</span>
        <CopyButton
          text={code}
          label="Copy"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[0.6875rem] gap-1 text-muted-foreground hover:text-foreground"
          title="Copy code to clipboard"
        />
      </div>
      <ScrollArea
        showVerticalScrollBar={false}
        showHorizontalScrollBar={true}
        showButtons={false}
        className="w-full"
        viewportClassName="p-4"
      >
        <pre className="m-0 leading-relaxed text-foreground/90 font-mono whitespace-pre selection:bg-primary/20">
          <code>{code.trim()}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
