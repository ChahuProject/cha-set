import { Button, SegmentedControl, Badge, Input, Slider, Tooltip, ColorPicker, PaletteIcon, CopyIcon, SunIcon, MoonIcon, MonitorIcon, useChaSetI18n } from '@chahu/cha-set';

export interface ThemeOverrides {
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  background?: string;
  card?: string;
  border?: string;
  ring?: string;
  radius?: string;
}

interface ThemeTunerProps {
  mode: string;
  setMode: (m: string) => void;
  accent: string;
  setAccent: (a: string) => void;
  overrides: ThemeOverrides;
  setOverrides: React.Dispatch<React.SetStateAction<ThemeOverrides>>;
  onOpenExport: () => void;
}

const ACCENT_PRESETS = [
  { id: '', key: 'common.default', fallback: 'Default', color: '#30a0ff' },
  { id: 'slate', key: 'theme.palette.slate', fallback: 'Slate', color: '#64748b' },
  { id: 'red', key: 'theme.palette.red', fallback: 'Red', color: '#ef4444' },
  { id: 'orange', key: 'theme.palette.orange', fallback: 'Orange', color: '#f97316' },
  { id: 'yellow', key: 'theme.palette.yellow', fallback: 'Yellow', color: '#eab308' },
  { id: 'green', key: 'theme.palette.green', fallback: 'Green', color: '#22c55e' },
  { id: 'blue', key: 'theme.palette.blue', fallback: 'Blue', color: '#3b82f6' },
  { id: 'violet', key: 'theme.palette.violet', fallback: 'Violet', color: '#8b5cf6' },
  { id: 'rose', key: 'theme.palette.rose', fallback: 'Rose', color: '#f43f5e' },
];

export const ThemeTuner: React.FC<ThemeTunerProps> = ({
  mode,
  setMode,
  accent,
  setAccent,
  overrides,
  setOverrides,
  onOpenExport,
}) => {
  const { t } = useChaSetI18n();

  const updateOverride = (key: keyof ThemeOverrides, value: string) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const clearOverrides = () => {
    setOverrides({});
  };

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="tuner-panel">
      <div className="tuner-header">
        <div className="tuner-title">
          <PaletteIcon className="size-4 text-primary" />
          <strong>{t('getStarted.themeTuner.tuner.title', 'Theme & Style Tuner')}</strong>
        </div>
        <div className="tuner-actions">
          {hasOverrides && (
            <Tooltip content={t('getStarted.themeTuner.tuner.resetTooltip', 'Reset all custom color overrides')} side="bottom">
              <Button
                variant="secondary"
                size="sm"
                onClick={clearOverrides}
              >
                {t('common.reset', 'Reset')}
              </Button>
            </Tooltip>
          )}
          <Tooltip content={t('getStarted.themeTuner.tuner.copyConfigTooltip', 'Export theme configuration as CSS, Tailwind, or JSON')} side="bottom">
            <Button variant="default" size="sm" onClick={onOpenExport} className="gap-1.5">
              <CopyIcon className="size-3.5" />
              {t('getStarted.themeTuner.tuner.copyConfig', 'Copy Config')}
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="tuner-body">
        {/* Preset Modes */}
        <div className="tuner-group">
          <label className="tuner-label">{t('getStarted.themeTuner.tuner.appearance', 'APPEARANCE & MODE')}</label>
          <SegmentedControl
            size="sm"
            value={mode}
            onChange={(v) => setMode(v as string)}
            options={[
              { label: t('theme.mode.light', 'Light'), value: 'light', icon: <SunIcon className="size-3.5" /> },
              { label: t('theme.mode.dark', 'Dark'), value: 'dark', icon: <MoonIcon className="size-3.5" /> },
              { label: t('theme.mode.system', 'System'), value: 'system', icon: <MonitorIcon className="size-3.5" /> },
            ]}
          />
        </div>

        {/* Accent Themes */}
        <div className="tuner-group">
          <label className="tuner-label">{t('getStarted.themeTuner.tuner.accentPreset', 'ACCENT THEME PRESET')}</label>
          <div className="accent-grid">
            {ACCENT_PRESETS.map((a) => {
              const label = t(a.key, a.fallback);
              return (
                <Button
                  key={a.id}
                  variant={accent === a.id ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start gap-1.5 h-7 px-2 text-xs font-normal"
                  onClick={() => setAccent(a.id)}
                  title={`Preset: ${label}`}
                >
                  <span className="accent-dot" style={{ backgroundColor: a.color }} />
                  <span>{label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Radius Slider */}
        <div className="tuner-group">
          <div className="tuner-label-row">
            <label className="tuner-label">{t('getStarted.themeTuner.tuner.cornerRadius', 'CORNER RADIUS (--RADIUS)')}</label>
            <Badge size="sm" variant="secondary">{overrides.radius || t('getStarted.themeTuner.tuner.radiusDefault', '0.5rem (Default)')}</Badge>
          </div>
          <div className="py-2">
            <Slider
              min={0}
              max={24}
              step={2}
              value={overrides.radius ? parseInt(overrides.radius) : 8}
              onValueChange={(val) => updateOverride('radius', `${val}px`)}
            />
          </div>
          <div className="slider-ticks">
            <span>{t('getStarted.themeTuner.tuner.radiusSharp', '0px (Sharp)')}</span>
            <span>8px</span>
            <span>16px</span>
            <span>{t('getStarted.themeTuner.tuner.radiusPill', '24px (Pill)')}</span>
          </div>
        </div>

        {/* Custom Color Overrides */}
        <div className="tuner-group">
          <label className="tuner-label">{t('getStarted.themeTuner.tuner.liveColorOverrides', 'LIVE COLOR OVERRIDES')}</label>
          <div className="color-inputs-grid">
            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.primaryAction', 'Primary Action')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.primary || (mode === 'dark' ? '#30a0ff' : '#1d7ae0')}
                  onChange={(val) => updateOverride('primary', val)}
                />
                <Input
                  size="sm"
                  placeholder="e.g. #3b82f6"
                  value={overrides.primary || ''}
                  onChange={(e) => updateOverride('primary', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.primaryText', 'Primary Text')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.primaryForeground || '#ffffff'}
                  onChange={(val) => updateOverride('primaryForeground', val)}
                />
                <Input
                  size="sm"
                  placeholder="#ffffff"
                  value={overrides.primaryForeground || ''}
                  onChange={(e) => updateOverride('primaryForeground', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.secondaryBg', 'Secondary Bg')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.secondary || (mode === 'dark' ? '#252d3d' : '#e8ecf3')}
                  onChange={(val) => updateOverride('secondary', val)}
                />
                <Input
                  size="sm"
                  placeholder="var(--secondary)"
                  value={overrides.secondary || ''}
                  onChange={(e) => updateOverride('secondary', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.destructive', 'Destructive')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.destructive || (mode === 'dark' ? '#ef4444' : '#dc2626')}
                  onChange={(val) => updateOverride('destructive', val)}
                />
                <Input
                  size="sm"
                  placeholder="var(--destructive)"
                  value={overrides.destructive || ''}
                  onChange={(e) => updateOverride('destructive', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.pageBackground', 'Page Background')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.background || (mode === 'dark' ? '#0a0c14' : '#f4f6fa')}
                  onChange={(val) => updateOverride('background', val)}
                />
                <Input
                  size="sm"
                  placeholder="var(--background)"
                  value={overrides.background || ''}
                  onChange={(e) => updateOverride('background', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.cardPanel', 'Card / Panel')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.card || (mode === 'dark' ? '#161b26' : '#ffffff')}
                  onChange={(val) => updateOverride('card', val)}
                />
                <Input
                  size="sm"
                  placeholder="var(--card)"
                  value={overrides.card || ''}
                  onChange={(e) => updateOverride('card', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>{t('getStarted.themeTuner.tuner.focusRing', 'Focus Ring')}</label>
              <div className="color-field">
                <ColorPicker
                  mode="popover"
                  size="sm"
                  value={overrides.ring || '#30a0ff'}
                  onChange={(val) => updateOverride('ring', val)}
                />
                <Input
                  size="sm"
                  placeholder="var(--ring)"
                  value={overrides.ring || ''}
                  onChange={(e) => updateOverride('ring', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
