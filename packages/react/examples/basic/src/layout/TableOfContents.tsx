import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@chahu/cha-set';

export interface TocItem {
  id: string;
  title: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
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
