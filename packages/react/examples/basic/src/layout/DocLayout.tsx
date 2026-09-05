import React, { useState } from 'react';
import { Button } from '@chahu/cha-set';
import { TableOfContents, type TocItem } from './TableOfContents';

export interface DocLayoutProps {
  category: string;
  title: string;
  description: string;
  tocItems?: TocItem[];
  children: React.ReactNode;
}

export function DocLayout({
  category,
  title,
  description,
  tocItems = [],
  children,
}: DocLayoutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPage = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex w-full min-w-0 justify-center">
      <main className="w-full max-w-4xl min-w-0 px-4 py-8 md:px-8 lg:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <span>Docs</span>
          <span>/</span>
          <span className="text-foreground font-medium">{category}</span>
          <span>/</span>
          <span className="text-foreground font-semibold">{title}</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-border mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPage}
                title="Copy page link"
              >
                {copied ? (
                  <>
                    <svg className="size-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span>Copy Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Page Content */}
        <div className="prose-content">{children}</div>
      </main>

      {/* Right Table of Contents */}
      {tocItems.length > 0 && <TableOfContents items={tocItems} />}
    </div>
  );
}
