import * as React from 'react';
import { cn } from '../lib/utils';
import { SettingRow } from '../setting-row';
import { SegmentedControl } from '../segmented-control';
import { ColorPicker } from '../color-picker';
import { Slider } from '../slider';
import { Button } from '../button';
import { Badge } from '../badge';
import { Separator } from '../separator';
import {
  SunIcon,
  MoonIcon,
  MonitorIcon,
  CheckIcon,
  RotateCcwIcon,
  SlidersIcon,
  PaletteIcon,
  DownloadIcon,
  UploadIcon,
} from '../lib/icons';
import type { ThemeConfig, PaletteId, ThemeMode, DecorationStyleId } from '@chahu/spec/theme-settings';

export interface ThemeSettingsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  config?: ThemeConfig;
  onChange?: (next: ThemeConfig) => void;
  onReset?: () => void;
  onExport?: (configJson: string) => void;
  onImport?: (jsonString: string) => boolean | void;
  disabled?: boolean;
  showReset?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  showTypography?: boolean;
  showUiScale?: boolean;
  showHeader?: boolean;
  variant?: 'card' | 'embedded';
  textProvider?: (key: string, defaultText: string) => string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  version: 1,
  mode: 'system',
  palette: {
    id: 'neutral',
    customHex: '#30a0ff',
  },
  decoration: {
    styleId: 'simple',
    level: 50,
    overrides: {},
  },
  typography: {
    familyId: 'system',
    scaleId: 'default',
  },
  uiScale: 1.0,
};

export const CANONICAL_PALETTES: Array<{ id: PaletteId; name: string; hex: string }> = [
  { id: 'neutral', name: 'Neutral', hex: '#30a0ff' },
  { id: 'slate', name: 'Slate', hex: '#64748b' },
  { id: 'red', name: 'Red', hex: '#ef4444' },
  { id: 'orange', name: 'Orange', hex: '#f97316' },
  { id: 'yellow', name: 'Yellow', hex: '#eab308' },
  { id: 'green', name: 'Green', hex: '#22c55e' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'violet', name: 'Violet', hex: '#8b5cf6' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e' },
  { id: 'custom', name: 'Custom', hex: '#30a0ff' },
];

export const ThemeSettings = React.forwardRef<HTMLDivElement, ThemeSettingsProps>(
  (
    {
      config = DEFAULT_THEME_CONFIG,
      onChange,
      onReset,
      onExport,
      onImport,
      disabled = false,
      showReset = true,
      showExport = true,
      showImport = true,
      showTypography = false,
      showUiScale = true,
      showHeader,
      variant = 'card',
      textProvider = (_key, defaultText) => defaultText,
      className,
      ...props
    },
    ref
  ) => {
    const t = textProvider;
    const isEmbedded = variant === 'embedded';
    const shouldShowHeader = showHeader ?? !isEmbedded;

    const [importOpen, setImportOpen] = React.useState(false);
    const [importText, setImportText] = React.useState('');
    const [importError, setImportError] = React.useState<string | null>(null);
    const [showOverrides, setShowOverrides] = React.useState(
      Boolean(
        config.decoration.overrides &&
          Object.keys(config.decoration.overrides).length > 0
      )
    );

    const updateConfig = (updater: (prev: ThemeConfig) => ThemeConfig) => {
      if (disabled) return;
      const next = updater(config);
      onChange?.(next);
    };

    const handleModeChange = (val: string | number) => {
      updateConfig((prev) => ({
        ...prev,
        mode: val as ThemeMode,
      }));
    };

    const handlePaletteSelect = (id: PaletteId) => {
      updateConfig((prev) => ({
        ...prev,
        palette: {
          ...prev.palette,
          id,
          customHex: prev.palette?.customHex || '#30a0ff',
        },
      }));
    };

    const handleCustomHexChange = (hex: string) => {
      updateConfig((prev) => ({
        ...prev,
        palette: {
          id: 'custom',
          customHex: hex,
        },
      }));
    };

    const handleStyleChange = (val: string | number) => {
      updateConfig((prev) => ({
        ...prev,
        decoration: {
          ...prev.decoration,
          styleId: val as DecorationStyleId,
        },
      }));
    };

    const handleLevelChange = (level: number) => {
      updateConfig((prev) => ({
        ...prev,
        decoration: {
          ...prev.decoration,
          level: Math.round(level),
        },
      }));
    };

    const handleOverrideChange = (key: 'radius' | 'shadow' | 'motion', val: number | null) => {
      updateConfig((prev) => {
        const nextOverrides = { ...prev.decoration.overrides };
        if (val === null) {
          delete nextOverrides[key];
        } else {
          nextOverrides[key] = Math.round(val);
        }
        return {
          ...prev,
          decoration: {
            ...prev.decoration,
            overrides: nextOverrides,
          },
        };
      });
    };

    const handleUiScaleChange = (val: string | number) => {
      updateConfig((prev) => ({
        ...prev,
        uiScale: Number(val),
      }));
    };

    const handleReset = () => {
      if (disabled) return;
      onChange?.(DEFAULT_THEME_CONFIG);
      onReset?.();
    };

    const handleExport = () => {
      const jsonStr = JSON.stringify(config, null, 2);
      onExport?.(jsonStr);
      try {
        navigator.clipboard.writeText(jsonStr);
      } catch {
        // clipboard fallback
      }
    };

    const handleImportSubmit = () => {
      try {
        const parsed = JSON.parse(importText);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Invalid JSON payload');
        }
        if (parsed.version && parsed.version !== 1) {
          throw new Error('Unsupported configuration version');
        }
        const validated: ThemeConfig = {
          version: 1,
          mode: ['light', 'dark', 'system'].includes(parsed.mode) ? parsed.mode : 'system',
          palette: {
            id: CANONICAL_PALETTES.some((p) => p.id === parsed.palette?.id) ? parsed.palette.id : 'neutral',
            customHex: parsed.palette?.customHex || '#30a0ff',
          },
          decoration: {
            styleId: ['simple', 'expressive'].includes(parsed.decoration?.styleId) ? parsed.decoration.styleId : 'simple',
            level: typeof parsed.decoration?.level === 'number' ? Math.max(0, Math.min(100, parsed.decoration.level)) : 50,
            overrides: typeof parsed.decoration?.overrides === 'object' && parsed.decoration?.overrides !== null ? parsed.decoration.overrides : {},
          },
          typography: {
            familyId: ['system', 'sans', 'serif', 'mono'].includes(parsed.typography?.familyId) ? parsed.typography.familyId : 'system',
            scaleId: ['default', 'compact', 'comfortable'].includes(parsed.typography?.scaleId) ? parsed.typography.scaleId : 'default',
          },
          uiScale: typeof parsed.uiScale === 'number' ? Math.max(0.75, Math.min(2.0, parsed.uiScale)) : 1.0,
        };
        onChange?.(validated);
        onImport?.(JSON.stringify(validated));
        setImportOpen(false);
        setImportText('');
        setImportError(null);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'JSON parsing error');
      }
    };

    const modes = [
      { value: 'light' as const, label: t('theme.mode.light', 'Light'), icon: SunIcon },
      { value: 'dark' as const, label: t('theme.mode.dark', 'Dark'), icon: MoonIcon },
      { value: 'system' as const, label: t('theme.mode.system', 'System'), icon: MonitorIcon },
    ];

    return (
      <div
        ref={ref}
        data-slot="theme-settings"
        data-variant={variant}
        className={cn(
          'flex flex-col gap-5 text-foreground transition-all duration-quick ease-standard',
          isEmbedded
            ? 'p-0 bg-transparent'
            : 'rounded-xl border border-border/70 bg-card text-card-foreground p-5 shadow-xs',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        {...props}
      >
        {/* Header Actions */}
        {shouldShowHeader && (showReset || showExport || showImport) && (
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <PaletteIcon className="size-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground tracking-tight">
                  {t('theme.settings.title', 'Theme Configuration')}
                </span>
                <Badge variant="secondary" size="sm" className="font-mono text-caption">
                  v{config.version}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {showReset && (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={disabled}
                  className="text-caption text-muted-foreground hover:text-foreground"
                >
                  <RotateCcwIcon className="size-3 mr-1" />
                  {t('theme.settings.reset', 'Reset')}
                </Button>
              )}
              {showImport && (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setImportOpen(!importOpen)}
                  disabled={disabled}
                  className="text-caption text-muted-foreground hover:text-foreground"
                >
                  <UploadIcon className="size-3 mr-1" />
                  {t('theme.settings.import', 'Import')}
                </Button>
              )}
              {showExport && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleExport}
                  disabled={disabled}
                  className="text-caption font-medium"
                >
                  <DownloadIcon className="size-3 mr-1" />
                  {t('theme.settings.export', 'Export JSON')}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Import Drawer/Box */}
        {importOpen && (
          <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-muted/50 border border-border/80 animate-in fade-in-0 duration-quick ease-standard">
            <span className="text-xs font-medium text-foreground">
              {t('theme.settings.import.hint', 'Paste JSON configuration:')}
            </span>
            <textarea
              className="w-full h-24 p-2.5 text-xs font-mono rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"mode": "dark", "palette": { "id": "blue" }}'
            />
            {importError && (
              <span className="text-caption text-destructive">{importError}</span>
            )}
            <div className="flex justify-end gap-2">
              <Button size="xs" variant="ghost" onClick={() => setImportOpen(false)}>
                {t('theme.settings.cancel', 'Cancel')}
              </Button>
              <Button size="xs" variant="default" onClick={handleImportSubmit}>
                {t('theme.settings.apply', 'Apply')}
              </Button>
            </div>
          </div>
        )}

        {/* 1. Appearance Mode — Visual Mockup Cards */}
        <SettingRow
          name={t('theme.settings.mode.title', 'Appearance Mode')}
          description={t('theme.settings.mode.desc', 'Switch between Light, Dark, or System OS appearance')}
        >
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[22rem]" role="radiogroup" aria-label={t('theme.settings.mode.title', 'Appearance Mode')}>
            {modes.map((item) => {
              const isSelected = config.mode === item.value;
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={item.label}
                  onClick={() => handleModeChange(item.value)}
                  disabled={disabled}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 p-2 rounded-xl border text-center transition-all duration-quick cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.04] shadow-xs'
                      : 'border-border/70 bg-card hover:border-border hover:bg-muted/40'
                  )}
                >
                  {/* Visual Mockup Frame */}
                  <div
                    className={cn(
                      'relative w-full h-12 rounded-lg border overflow-hidden p-1.5 flex flex-col gap-1 transition-all',
                      item.value === 'light' && 'bg-white border-zinc-200/90 shadow-2xs',
                      item.value === 'dark' && 'bg-zinc-950 border-zinc-800 shadow-2xs',
                      item.value === 'system' && 'border-zinc-300 dark:border-zinc-700 overflow-hidden'
                    )}
                  >
                    {item.value === 'light' && (
                      <>
                        <div className="flex items-center gap-0.5 pb-0.5 border-b border-zinc-100">
                          <span className="size-1 rounded-full bg-red-400/80" />
                          <span className="size-1 rounded-full bg-amber-400/80" />
                          <span className="size-1 rounded-full bg-emerald-400/80" />
                        </div>
                        <div className="flex gap-1 flex-1 min-h-0">
                          <div className="w-1/4 h-full rounded-xs bg-zinc-100" />
                          <div className="flex-1 flex flex-col gap-0.5 justify-center">
                            <div className="h-1 w-full rounded-xs bg-zinc-200" />
                            <div className="h-1 w-2/3 rounded-xs bg-zinc-200/70" />
                          </div>
                        </div>
                      </>
                    )}

                    {item.value === 'dark' && (
                      <>
                        <div className="flex items-center gap-0.5 pb-0.5 border-b border-zinc-800">
                          <span className="size-1 rounded-full bg-zinc-600" />
                          <span className="size-1 rounded-full bg-zinc-600" />
                          <span className="size-1 rounded-full bg-zinc-600" />
                        </div>
                        <div className="flex gap-1 flex-1 min-h-0">
                          <div className="w-1/4 h-full rounded-xs bg-zinc-800" />
                          <div className="flex-1 flex flex-col gap-0.5 justify-center">
                            <div className="h-1 w-full rounded-xs bg-zinc-700" />
                            <div className="h-1 w-2/3 rounded-xs bg-zinc-700/70" />
                          </div>
                        </div>
                      </>
                    )}

                    {item.value === 'system' && (
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 h-full bg-white p-1.5 flex flex-col gap-1 border-r border-zinc-200">
                          <div className="flex items-center gap-0.5 pb-0.5 border-b border-zinc-100">
                            <span className="size-1 rounded-full bg-red-400/80" />
                            <span className="size-1 rounded-full bg-amber-400/80" />
                          </div>
                          <div className="flex gap-0.5 flex-1 min-h-0">
                            <div className="w-1/3 h-full rounded-xs bg-zinc-100" />
                            <div className="flex-1 flex flex-col gap-0.5 justify-center">
                              <div className="h-1 w-full rounded-xs bg-zinc-200" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2 h-full bg-zinc-950 p-1.5 flex flex-col gap-1">
                          <div className="flex items-center gap-0.5 pb-0.5 border-b border-zinc-800">
                            <span className="size-1 rounded-full bg-zinc-600" />
                            <span className="size-1 rounded-full bg-zinc-600" />
                          </div>
                          <div className="flex gap-0.5 flex-1 min-h-0">
                            <div className="w-1/3 h-full rounded-xs bg-zinc-800" />
                            <div className="flex-1 flex flex-col gap-0.5 justify-center">
                              <div className="h-1 w-full rounded-xs bg-zinc-700" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Label & Icon */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Icon className={cn('size-3.5', isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                    <span className={cn('text-xs', isSelected ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground group-hover:text-foreground')}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </SettingRow>

        <Separator />

        {/* 2. Accent Palette — Tactile Swatches with Contrast Checks */}
        <SettingRow
          name={t('theme.settings.palette.title', 'Accent Palette')}
          description={t('theme.settings.palette.desc', 'Choose from 10 canonical theme palettes or custom accent')}
        >
          <div className="flex flex-wrap items-center justify-end gap-2 max-w-[26rem]">
            {CANONICAL_PALETTES.map((p) => {
              const isSelected = config.palette.id === p.id;
              const isYellow = p.id === 'yellow';
              const paletteName = t(`theme.palette.${p.id}`, p.name);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePaletteSelect(p.id)}
                  disabled={disabled}
                  title={paletteName}
                  aria-label={paletteName}
                  className={cn(
                    'group relative inline-flex items-center justify-center size-7 rounded-full transition-all duration-quick cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'ring-1 ring-inset ring-black/15 dark:ring-white/20 shadow-2xs',
                    isSelected
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-xs'
                      : 'hover:scale-110 hover:-translate-y-0.5 opacity-90 hover:opacity-100 hover:shadow-xs'
                  )}
                  style={{
                    background:
                      p.id === 'neutral'
                        ? 'linear-gradient(135deg, #64748b 45%, #334155 55%)'
                        : p.id === 'custom'
                          ? 'conic-gradient(from 180deg at 50% 50%, #f43f5e, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #f43f5e)'
                          : p.hex,
                  }}
                >
                  {isSelected && (
                    <CheckIcon
                      className={cn(
                        'size-3.5 stroke-[2.5] drop-shadow-xs',
                        isYellow ? 'text-zinc-900' : 'text-white'
                      )}
                    />
                  )}
                </button>
              );
            })}

            {/* Custom Color Trigger Chip */}
            {config.palette.id === 'custom' && (
              <div className="flex items-center gap-1.5 pl-1.5 ml-0.5 border-l border-border/80">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/70 border border-border/80 text-caption font-mono text-foreground shadow-2xs">
                  <span
                    className="size-2.5 rounded-full border border-black/15 dark:border-white/20 shadow-2xs"
                    style={{ backgroundColor: config.palette.customHex || '#30a0ff' }}
                  />
                  <span className="font-semibold">{(config.palette.customHex || '#30a0ff').toUpperCase()}</span>
                </div>
                <ColorPicker
                  size="sm"
                  mode="popover"
                  value={config.palette.customHex || '#30a0ff'}
                  onChange={handleCustomHexChange}
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        </SettingRow>

        <Separator />

        {/* 3. Interface Style */}
        <SettingRow
          name={t('theme.settings.style.title', 'Interface Style')}
          description={t('theme.settings.style.desc', 'Simple flat presentation or expressive rich layered styling')}
        >
          <SegmentedControl
            size="sm"
            value={config.decoration.styleId}
            onChange={handleStyleChange}
            disabled={disabled}
            options={[
              { label: t('theme.style.simple', 'Simple'), value: 'simple' },
              { label: t('theme.style.expressive', 'Expressive'), value: 'expressive' },
            ]}
          />
        </SettingRow>

        <Separator />

        {/* 4. Decoration Intensity */}
        <SettingRow
          name={t('theme.settings.decoration.title', 'Decoration Level')}
          description={t('theme.settings.decoration.desc', 'Master intensity driving corner radii, shadows, and motion')}
          badge={
            <Badge variant="outline" size="sm" className="font-mono text-caption tabular-nums">
              {config.decoration.level}%
            </Badge>
          }
        >
          <div className="flex items-center gap-2.5 w-60">
            <Slider
              size="sm"
              min={0}
              max={100}
              step={1}
              value={config.decoration.level}
              onChange={handleLevelChange}
              disabled={disabled}
              className="flex-1"
            />
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setShowOverrides(!showOverrides)}
              className="text-caption font-medium shrink-0 text-muted-foreground hover:text-foreground"
            >
              <SlidersIcon className="size-3 mr-1" />
              {showOverrides ? t('theme.overrides.hide', 'Details') : t('theme.overrides.custom', 'Tune')}
            </Button>
          </div>
        </SettingRow>

        {/* Overrides Sub-Panel */}
        {showOverrides && (
          <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/70 ml-2 animate-in fade-in-0 duration-quick ease-standard">
            <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
              <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                {t('theme.overrides.title', 'Fine-Tuning Parameters')}
              </span>
              <Button
                size="xs"
                variant="ghost"
                className="h-5 px-1.5 text-caption text-muted-foreground hover:text-foreground"
                onClick={() => {
                  updateConfig((prev) => ({
                    ...prev,
                    decoration: { ...prev.decoration, overrides: {} },
                  }));
                }}
              >
                {t('theme.overrides.resetAll', 'Reset to Master')}
              </Button>
            </div>

            {/* Radius Override */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{t('theme.overrides.radius', 'Corner Radius')}</span>
                <span className="text-caption text-muted-foreground">{((6 + (config.decoration.overrides?.radius ?? config.decoration.level) * 0.08) / 16).toFixed(3)}rem</span>
              </div>
              <div className="flex items-center gap-2 w-48">
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  step={1}
                  value={config.decoration.overrides?.radius ?? config.decoration.level}
                  onChange={(v) => handleOverrideChange('radius', v)}
                  disabled={disabled}
                  className="flex-1"
                />
                <span className="text-caption font-mono w-7 text-right tabular-nums text-foreground">
                  {config.decoration.overrides?.radius ?? config.decoration.level}
                </span>
              </div>
            </div>

            {/* Shadow Override */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{t('theme.overrides.shadow', 'Shadow Elevation')}</span>
                <span className="text-caption text-muted-foreground">{((config.decoration.overrides?.shadow ?? config.decoration.level) / 100).toFixed(2)}x</span>
              </div>
              <div className="flex items-center gap-2 w-48">
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  step={1}
                  value={config.decoration.overrides?.shadow ?? config.decoration.level}
                  onChange={(v) => handleOverrideChange('shadow', v)}
                  disabled={disabled}
                  className="flex-1"
                />
                <span className="text-caption font-mono w-7 text-right tabular-nums text-foreground">
                  {config.decoration.overrides?.shadow ?? config.decoration.level}
                </span>
              </div>
            </div>

            {/* Motion Override */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{t('theme.overrides.motion', 'Motion Timing')}</span>
                <span className="text-caption text-muted-foreground">{Math.round(100 + (config.decoration.overrides?.motion ?? config.decoration.level) * 1.6)}ms</span>
              </div>
              <div className="flex items-center gap-2 w-48">
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  step={1}
                  value={config.decoration.overrides?.motion ?? config.decoration.level}
                  onChange={(v) => handleOverrideChange('motion', v)}
                  disabled={disabled}
                  className="flex-1"
                />
                <span className="text-caption font-mono w-7 text-right tabular-nums text-foreground">
                  {config.decoration.overrides?.motion ?? config.decoration.level}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. UI Scale */}
        {showUiScale && (
          <>
            <Separator />
            <SettingRow
              name={t('theme.settings.uiscale.title', 'Interface Scale')}
              description={t('theme.settings.uiscale.desc', 'Global display density and UI scaling factor')}
            >
              <SegmentedControl
                size="sm"
                value={config.uiScale}
                onChange={handleUiScaleChange}
                disabled={disabled}
                options={[
                  { label: '75%', value: 0.75 },
                  { label: '90%', value: 0.9 },
                  { label: '100%', value: 1.0 },
                  { label: '125%', value: 1.25 },
                  { label: '150%', value: 1.5 },
                ]}
              />
            </SettingRow>
          </>
        )}

        {/* 6. Typography (Optional) */}
        {showTypography && (
          <>
            <Separator />
            <SettingRow
              name={t('theme.settings.typography.title', 'Typography System')}
              description={t('theme.settings.typography.desc', 'Logical font family and type scale multiplier')}
            >
              <SegmentedControl
                size="sm"
                value={config.typography.familyId}
                onChange={(v) =>
                  updateConfig((prev) => ({
                    ...prev,
                    typography: { ...prev.typography, familyId: v as any },
                  }))
                }
                disabled={disabled}
                options={[
                  { label: 'System', value: 'system' },
                  { label: 'Sans', value: 'sans' },
                  { label: 'Serif', value: 'serif' },
                  { label: 'Mono', value: 'mono' },
                ]}
              />
            </SettingRow>
          </>
        )}
      </div>
    );
  }
);

ThemeSettings.displayName = 'ThemeSettings';
