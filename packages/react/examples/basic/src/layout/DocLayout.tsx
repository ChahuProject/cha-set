import React from 'react';
import { Button, CopyButton, Separator, ListIcon, useChaSetI18n } from '@chahu/cha-set';
import { TableOfContents, type TocItem } from './TableOfContents';
import { useToc } from './TocContext';
import { useResponsive } from './useResponsive';
import { DocText } from '../components/DocText';

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
        {/* Breadcrumb — micro type from the role table, not from utilities */}
        <div className="flex items-center gap-1.5 mb-2">
          <DocText role="micro" as="span">
            {t('showcase.docs', 'Docs')}
          </DocText>
          <DocText role="micro" as="span">
            /
          </DocText>
          <DocText role="micro" as="span" tone="default">
            {t('showcase.categories.' + category, category)}
          </DocText>
          <DocText role="micro" as="span">
            /
          </DocText>
          <DocText role="micro" as="span" tone="default">
            {title}
          </DocText>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-2 pb-6">
          <div className="flex items-center justify-between gap-4">
            <DocText role="display" as="h1">
              {title}
            </DocText>
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
          <DocText role="lead">
            {localizedDescription}
          </DocText>
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
