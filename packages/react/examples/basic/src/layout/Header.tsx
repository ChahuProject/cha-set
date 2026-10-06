import React from 'react';
import {
  Button,
  Badge,
  Kbd,
  Tooltip,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Separator,
  useChaSetI18n,
  ChaSetLogoIcon,
  GlobeIcon,
  MonitorIcon,
  PaletteIcon,
  CopyIcon,
  ZapIcon,
  TableIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  FileTextIcon,
  Maximize2Icon,
  PanelLeftIcon,
  ListIcon,
} from '@chahu/cha-set';
import { useToc } from './TocContext';
import { useResponsive } from './useResponsive';

export interface HeaderProps {
  mode: string;
  onToggleMode: () => void;
  onOpenSearch: () => void;
  onOpenTuner: () => void;
  isTunerActive: boolean;
  onOpenExport: () => void;
  onOpenSidebar?: () => void;
}

export function Header({
  mode,
  onToggleMode,
  onOpenSearch,
  onOpenTuner,
  isTunerActive,
  onOpenExport,
  onOpenSidebar,
}: HeaderProps) {
  const { preference, setPreference, supportedLocales, locale, t } = useChaSetI18n();
  const activeLocaleMeta = supportedLocales.find((l) => l.code === locale) || { nativeName: locale, code: locale };
  const tocContext = useToc();
  const { isMobile, isTablet, isWide, effectiveWidth } = useResponsive();

  return (
    <header
      data-slot="showcase-top-banner"
      className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="flex h-14 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Brand Group */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {onOpenSidebar && isMobile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onOpenSidebar}
              className="-ml-1 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <PanelLeftIcon className="size-4" />
            </Button>
          )}
          <a href="#/get-started/introduction" className="flex items-center gap-2 font-bold text-foreground hover:opacity-85 transition-opacity">
            <ChaSetLogoIcon className="size-5 text-primary shrink-0" />
            {effectiveWidth >= 380 && (
              <span className="text-base tracking-tight font-bold">ChaSet</span>
            )}
          </a>
        </div>

        {/* Center Search Trigger (Desktop >= 1024 effectiveWidth) */}
        {!isTablet && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onOpenSearch}
            className="inline-flex items-center justify-between gap-3 h-8 flex-1 max-w-sm mx-4 px-3 text-sm text-muted-foreground font-normal bg-muted/30 hover:bg-muted/60 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <SearchIcon className="size-4 shrink-0" />
              <span className="truncate">{t('showcase.searchPlaceholder', 'Search components & docs...')}</span>
            </div>
            <Kbd variant="outline" size="sm" className="shrink-0">
              ⌘K
            </Kbd>
          </Button>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          {/* Mobile/Tablet Search Icon Trigger (< 1024 effectiveWidth) */}
          {isTablet && (
            <Tooltip content={t('showcase.searchPlaceholder', 'Search components & docs...')} side="bottom">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onOpenSearch}
                className="inline-flex"
                aria-label={t('showcase.searchPlaceholder', 'Search components & docs...')}
              >
                <SearchIcon className="size-4" />
              </Button>
            </Tooltip>
          )}

          {/* Mobile/Tablet Table of Contents Trigger (< 1280 effectiveWidth) */}
          {!isWide && tocContext.items.length > 0 && (
            <Tooltip content={t('showcase.onThisPage', 'On this page')} side="bottom">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => tocContext.setTocOpen(true)}
                className="inline-flex"
                aria-label={t('showcase.onThisPage', 'On this page')}
              >
                <ListIcon className="size-4" />
              </Button>
            </Tooltip>
          )}

          {/* Quick Jump Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={isWide ? 'default' : 'icon'}
                className={isWide ? 'inline-flex w-auto px-2.5 gap-1.5' : 'inline-flex'}
                title={t('showcase.jumpTo', 'Jump to')}
                aria-label={t('showcase.jumpTo', 'Jump to')}
              >
                <ZapIcon className="size-4 text-primary shrink-0" />
                {isWide && <span className="text-xs">{t('showcase.jumpTo', 'Jump to')}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Featured Engines</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { window.location.hash = '#/components/generic-data-table'; }}>
                  <TableIcon className="size-3.5 mr-2 inline text-muted-foreground" />
                  Generic Data Table
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.hash = '#/components/query-builder'; }}>
                  <SearchIcon className="size-3.5 mr-2 inline text-muted-foreground" />
                  Query Builder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.hash = '#/components/virtual-list'; }}>
                  <FileTextIcon className="size-3.5 mr-2 inline text-muted-foreground" />
                  Virtual List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.hash = '#/components/draggable-modal'; }}>
                  <Maximize2Icon className="size-3.5 mr-2 inline text-muted-foreground" />
                  Draggable Modal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.hash = '#/components/splitter'; }}>
                  Splitter
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Studio Tuner */}
          <Tooltip content={t('showcase.studioTuner', 'Studio Tuner')} side="bottom">
            <Button
              type="button"
              variant={isTunerActive ? 'default' : 'outline'}
              size={!isTablet ? 'default' : 'icon'}
              onClick={onOpenTuner}
              className={!isTablet ? 'inline-flex w-auto px-2.5 gap-1.5' : 'inline-flex'}
              aria-label={t('showcase.studioTuner', 'Studio Tuner')}
            >
              <PaletteIcon className="size-4 shrink-0" />
              {!isTablet && <span className="text-xs">{t('showcase.studioTuner', 'Studio Tuner')}</span>}
            </Button>
          </Tooltip>

          {/* Export Theme Config */}
          <Tooltip content={t('showcase.exportTheme', 'Export')} side="bottom">
            <Button
              type="button"
              variant="outline"
              size={!isTablet ? 'default' : 'icon'}
              onClick={onOpenExport}
              className={!isTablet ? 'inline-flex w-auto px-2.5 gap-1.5' : 'inline-flex'}
              aria-label={t('showcase.exportTheme', 'Export')}
            >
              <CopyIcon className="size-4 shrink-0" />
              {!isTablet && <span className="text-xs">{t('showcase.exportTheme', 'Export')}</span>}
            </Button>
          </Tooltip>

          {/* Language Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={!isMobile ? 'default' : 'icon'}
                className={!isMobile ? 'inline-flex w-auto px-2.5 gap-1.5' : 'inline-flex'}
                title={t('showcase.switchLanguage', 'Switch Language')}
                aria-label={t('showcase.switchLanguage', 'Switch Language')}
              >
                <GlobeIcon className="size-4 shrink-0" />
                {!isMobile && <span className="text-xs font-medium">{activeLocaleMeta.nativeName}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('showcase.switchLanguage', 'Switch Language')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPreference('system')}>
                  <span className={`flex items-center gap-1.5 ${preference === 'system' ? 'font-semibold text-primary' : ''}`}>
                    <MonitorIcon className="size-3.5" />
                    {t('language.followSystem', 'Follow System')}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {supportedLocales.map((loc) => (
                  <DropdownMenuItem key={loc.code} onClick={() => setPreference(loc.code)}>
                    <span className={preference === loc.code ? 'font-semibold text-primary' : ''}>
                      {loc.nativeName} ({loc.code})
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {effectiveWidth >= 640 && (
            <Separator orientation="vertical" className="h-4 mx-0.5 sm:mx-1" />
          )}

          {/* Theme Mode Toggle */}
          <Tooltip
            content={
              mode === 'dark'
                ? t('theme.mode.dark', 'Dark')
                : mode === 'system'
                ? t('theme.mode.system', 'Follow System')
                : t('theme.mode.light', 'Light')
            }
            side="bottom"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleMode}
              aria-label="Toggle theme appearance"
            >
              {mode === 'dark' ? (
                <MoonIcon className="size-4" />
              ) : mode === 'system' ? (
                <MonitorIcon className="size-4" />
              ) : (
                <SunIcon className="size-4" />
              )}
            </Button>
          </Tooltip>

          {/* GitHub Icon */}
          {effectiveWidth >= 640 && (
            <Tooltip content="GitHub Repository" side="bottom">
              <Button
                asChild
                variant="outline"
                size="icon"
                aria-label="GitHub Repository"
                className="inline-flex"
              >
                <a
                  href="https://github.com/chahu/cha-set"
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* chaset-icon-exempt: GitHub brand mark — a filled 24-unit logotype with its own proportions, not a stroke glyph */}
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </Button>
            </Tooltip>
          )}

          {/* Version Badge */}
          {isWide && (
            <Badge variant="outline" size="sm" className="inline-flex font-medium text-muted-foreground bg-muted/60 shrink-0">
              v0.1.0
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
