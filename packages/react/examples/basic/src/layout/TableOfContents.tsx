import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@chahu/cha-set';

export interface TocItem {
  id: string;
  title: string;
}

export function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function scanDocSections(container: HTMLElement | null): TocItem[] {
  if (!container) return [];

  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(
      'section[id], [data-toc-id], [data-section-id], h2[id], h3[id], div[id]'
    )
  );

  const items: TocItem[] = [];
  const seenIds = new Set<string>();

  for (const el of candidates) {
    let id = el.getAttribute('data-toc-id') || el.getAttribute('data-section-id') || el.id;
    if (!id) continue;
    id = id.trim();
    if (seenIds.has(id)) continue;

    const isSection = el.tagName.toLowerCase() === 'section';
    const isHeading = el.tagName.toLowerCase() === 'h2' || el.tagName.toLowerCase() === 'h3';
    const hasDataAttr = el.hasAttribute('data-toc-id') || el.hasAttribute('data-toc-title') || el.hasAttribute('data-section-id');
    const childHeading = el.querySelector<HTMLElement>(':scope > h1, :scope > h2, :scope > h3, :scope > div > h2, :scope > div > h3, h2, h3, [data-toc-heading]');

    const isKnownSection = ['overview', 'installation', 'animations', 'keyboard', 'props', 'examples'].includes(id);

    if (!isSection && !isHeading && !hasDataAttr && !childHeading && !isKnownSection) {
      continue;
    }

    let title = el.getAttribute('data-toc-title');
    if (!title) {
      if (isHeading) {
        title = el.textContent?.trim() || '';
      } else if (childHeading && childHeading.textContent) {
        title = childHeading.textContent.trim();
      }
    }

    // Canonical Fallbacks
    if (!title || title === '' || (id === 'overview' && title.toLowerCase().includes('sandbox'))) {
      if (id === 'overview') {
        title = 'Interactive Overview';
      } else if (id === 'installation') {
        title = 'Installation';
      } else if (id === 'animations') {
        title = 'Animations';
      } else if (id === 'keyboard') {
        title = 'Keyboard Navigation';
      } else if (id === 'props') {
        title = 'Props Reference';
      } else {
        title = title || slugToTitle(id);
      }
    }

    seenIds.add(id);
    items.push({ id, title });
  }

  return items;
}

export interface TableOfContentsProps {
  items?: TocItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function TableOfContents({ items: propItems, containerRef }: TableOfContentsProps) {
  const [scannedItems, setScannedItems] = useState<TocItem[]>([]);

  useEffect(() => {
    if (propItems && propItems.length > 0) return;
    if (!containerRef?.current) return;

    const scan = () => {
      if (!containerRef.current) return;
      const detected = scanDocSections(containerRef.current);
      setScannedItems((prev) => {
        if (
          prev.length === detected.length &&
          prev.every((item, i) => item.id === detected[i].id && item.title === detected[i].title)
        ) {
          return prev;
        }
        return detected;
      });
    };

    scan();

    const observer = new MutationObserver(scan);
    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [propItems, containerRef]);

  const items = propItems && propItems.length > 0 ? propItems : scannedItems;
  const [activeId, setActiveId] = useState<string>(() => items[0]?.id || '');

  useEffect(() => {
    if (items.length > 0 && !items.some((item) => item.id === activeId)) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !items || items.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible && visible.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      const raw = window.location.hash;
      const baseRoute = raw.split('#').filter(Boolean).find((p) => p.startsWith('/')) || '/components/button';
      const cleanRoute = baseRoute.startsWith('/') ? `#${baseRoute}` : `/#${baseRoute}`;
      window.history.replaceState(null, '', `${window.location.pathname}${cleanRoute}#${id}`);
    }
  };

  return (
    <aside className="w-56 shrink-0 hidden xl:block border-l border-border h-[calc(100vh-3.5rem)] sticky top-14 text-xs bg-background/50 overflow-hidden">
      <ScrollArea className="h-full w-full" viewportClassName="p-6">
        <div className="flex flex-col gap-3">
          <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[0.6875rem]">
            On this page
          </span>
          <nav className="flex flex-col gap-2">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`transition-colors truncate cursor-pointer py-0.5 text-xs ${
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.title}
                </a>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
