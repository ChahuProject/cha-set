import React from 'react';

export interface TocItem {
  id: string;
  title: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (!items || items.length === 0) return null;

  return (
    <aside className="w-56 shrink-0 hidden xl:block border-l border-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto p-6 text-xs bg-background/50">
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[0.6875rem]">
          On this page
        </span>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors truncate"
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
