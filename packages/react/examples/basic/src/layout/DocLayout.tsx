import React from 'react';
import { CopyButton, Separator } from '@chahu/cha-set';
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
        <div className="flex flex-col gap-2 pb-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <CopyButton
                variant="outline"
                size="sm"
                text={typeof window !== 'undefined' ? window.location.href : ''}
                label="Copy Link"
              />
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <Separator className="mb-8" />

        {/* Page Content */}
        <div className="prose-content">{children}</div>
      </main>

      {/* Right Table of Contents */}
      {tocItems.length > 0 && <TableOfContents items={tocItems} />}
    </div>
  );
}
