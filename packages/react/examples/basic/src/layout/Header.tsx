import React from 'react';
import {
  Button,
  Badge,
  Tooltip,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@chahu/cha-set';

export interface HeaderProps {
  mode: string;
  onToggleMode: () => void;
  onOpenSearch: () => void;
  onToggleTuner: () => void;
  showTuner: boolean;
  onOpenExport: () => void;
}

export function Header({
  mode,
  onToggleMode,
  onOpenSearch,
  onToggleTuner,
  showTuner,
  onOpenExport,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <a href="#/get-started/introduction" className="flex items-center gap-2 font-bold text-foreground hover:opacity-85 transition-opacity">
            <span className="text-xl leading-none">🍵</span>
            <span className="text-base tracking-tight">ChaSet</span>
          </a>
          <Badge variant="outline" size="sm" className="font-medium text-muted-foreground bg-muted/60">
            v0.1.0
          </Badge>
        </div>

        {/* Center Search Trigger */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenSearch}
          className="hidden sm:inline-flex items-center justify-between gap-3 w-64 md:w-80 text-muted-foreground font-normal bg-muted/30 hover:bg-muted/60"
        >
          <div className="flex items-center gap-2">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search components & docs...</span>
          </div>
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Tooltip content="Toggle theme controls" side="bottom">
            <Button
              type="button"
              variant={showTuner ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleTuner}
            >
              <span>🎨</span>
              <span className="hidden md:inline">Studio Tuner</span>
            </Button>
          </Tooltip>

          <Tooltip content="Export Theme Config" side="bottom">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenExport}
            >
              <span>📋</span>
              <span className="hidden md:inline">Export</span>
            </Button>
          </Tooltip>

          {/* Quick Jump Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden lg:inline-flex items-center gap-1.5">
                <span>⚡ Jump to</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Featured Engines</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { window.location.hash = '#/components/generic-data-table'; }}>
                📊 Generic Data Table
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { window.location.hash = '#/components/query-builder'; }}>
                🔍 Query Builder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { window.location.hash = '#/components/virtual-list'; }}>
                📜 Virtual List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { window.location.hash = '#/components/draggable-modal'; }}>
                🪟 Draggable Modal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { window.location.hash = '#/components/splitter'; }}>
                ✂️ Splitter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Theme Mode Toggle */}
          <Tooltip content={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} side="bottom">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleMode}
              aria-label="Toggle theme appearance"
            >
              {mode === 'dark' ? (
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </Button>
          </Tooltip>

          {/* GitHub Icon */}
          <Tooltip content="GitHub Repository" side="bottom">
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="GitHub Repository"
            >
              <a
                href="https://github.com/chahu/cha-set"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </Button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
