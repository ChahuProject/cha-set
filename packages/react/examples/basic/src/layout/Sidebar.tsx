import React from 'react';
import { NAVIGATION_CONFIG } from '../types/navigation';

export interface SidebarProps {
  currentHash: string;
}

export function Sidebar({ currentHash }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto p-4 select-none bg-background/50">
      <nav className="flex flex-col gap-6" aria-label="Documentation Sidebar">
        {NAVIGATION_CONFIG.map((cat) => (
          <div key={cat.title} className="flex flex-col gap-1.5">
            <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              {cat.title}
            </h4>
            <div className="flex flex-col gap-0.5">
              {cat.items.map((item) => {
                const isActive = currentHash === item.href || (currentHash === '#/' && item.href === '#/get-started/introduction');
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-muted font-semibold text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold bg-primary/10 text-primary border border-primary/20">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
