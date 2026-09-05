import React, { useState } from 'react';
import { Button } from '@chahu/cha-set';

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'tsx', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`relative group rounded-lg overflow-hidden border border-border bg-muted/40 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60 bg-muted/60 text-muted-foreground text-[0.6875rem]">
        <span className="font-semibold uppercase tracking-wider">{language}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-[0.6875rem] gap-1 text-muted-foreground hover:text-foreground"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg className="size-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto m-0 leading-relaxed text-foreground/90 font-mono whitespace-pre selection:bg-primary/20">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
