import React from 'react';

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
          <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[0.625rem] font-mono font-medium text-muted-foreground">
            v0.1.0
          </span>
        </div>

        {/* Center Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden sm:inline-flex items-center justify-between gap-3 w-64 md:w-80 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer shadow-2xs"
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
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTuner}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
              showTuner
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="Toggle theme controls"
          >
            <span>🎨</span>
            <span className="hidden md:inline">Studio Tuner</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Export Theme Config"
          >
            <span>📋</span>
            <span className="hidden md:inline">Export</span>
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Theme Mode Toggle */}
          <button
            type="button"
            onClick={onToggleMode}
            className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
          </button>

          {/* GitHub Icon */}
          <a
            href="https://github.com/chahu/cha-set"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Repository"
          >
            <svg className="size-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
