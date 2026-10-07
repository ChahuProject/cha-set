import React from 'react';
import { Button, CopyButton, Separator, ListIcon, useChaSetI18n } from '@chahu/cha-set';
import { TableOfContents, type TocItem } from './TableOfContents';
import { useToc } from './TocContext';
import { useResponsive } from './useResponsive';

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
  tocItems,
  children,
}: DocLayoutProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { items, setTocOpen } = useToc();
  const { isWide } = useResponsive();
  const { t } = useChaSetI18n();

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const localizedDescription = t(`components.${slug}.description`, description);

  return (
    <div className="flex w-full min-w-0 justify-center">
      <main className="w-full max-w-4xl min-w-0 px-4 py-8 md:px-8 lg:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <span>{t('showcase.docs', 'Docs')}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{t('showcase.categories.' + category, category)}</span>
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
              {items.length > 0 && !isWide && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTocOpen(true)}
                  className="gap-1.5 cursor-pointer"
                >
                  <ListIcon className="size-3.5" />
                  <span>{t('showcase.outline', 'Outline')}</span>
                </Button>
              )}
              <CopyButton
                variant="outline"
                size="sm"
                text={typeof window !== 'undefined' ? window.location.href : ''}
                label={t('common.copyLink', 'Copy Link')}
              />
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {localizedDescription}
          </p>
        </div>
        <Separator className="mb-8" />

        {/* Page Content */}
        <div className="prose-content" ref={contentRef}>{children}</div>
      </main>

      {/* Right Table of Contents — explicit labels when provided, otherwise
          auto-scanned from the rendered content. The container ref is always
          passed so heading depths can be resolved from the live DOM. */}
      <TableOfContents items={tocItems} containerRef={contentRef} />
    </div>
  );
}
