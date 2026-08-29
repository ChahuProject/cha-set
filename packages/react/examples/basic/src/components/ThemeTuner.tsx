import React from 'react';

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
  { id: '', label: 'Default', color: '#30a0ff' },
  { id: 'slate', label: 'Slate', color: '#64748b' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
  { id: 'yellow', label: 'Yellow', color: '#eab308' },
  { id: 'green', label: 'Green', color: '#22c55e' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
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
          <span className="tuner-icon">🎨</span>
          <strong>Theme & Style Tuner</strong>
        </div>
        <div className="tuner-actions">
          {hasOverrides && (
            <button className="btn-secondary-sm" onClick={clearOverrides} title="Reset all custom color overrides">
              Reset
            </button>
          )}
          <button className="btn-primary-sm" onClick={onOpenExport}>
            📋 Copy Config
          </button>
        </div>
      </div>

      <div className="tuner-body">
        {/* Preset Modes */}
        <div className="tuner-group">
          <label className="tuner-label">Appearance & Mode</label>
          <div className="segmented-control">
            <button
              className={`segmented-item ${mode === 'light' ? 'active' : ''}`}
              onClick={() => setMode('light')}
            >
              ☀️ Light
            </button>
            <button
              className={`segmented-item ${mode === 'dark' ? 'active' : ''}`}
              onClick={() => setMode('dark')}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Accent Themes */}
        <div className="tuner-group">
          <label className="tuner-label">Accent Theme Preset</label>
          <div className="accent-grid">
            {ACCENT_PRESETS.map((a) => (
              <button
                key={a.id}
                className={`accent-chip ${accent === a.id ? 'active' : ''}`}
                onClick={() => setAccent(a.id)}
                title={`Preset: ${a.label}`}
              >
                <span className="accent-dot" style={{ backgroundColor: a.color }} />
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Radius Slider */}
        <div className="tuner-group">
          <div className="tuner-label-row">
            <label className="tuner-label">Corner Radius (--radius)</label>
            <span className="tuner-value-badge">{overrides.radius || '0.5rem (Default)'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            step="2"
            value={overrides.radius ? parseInt(overrides.radius) : 8}
            onChange={(e) => updateOverride('radius', `${e.target.value}px`)}
            className="tuner-slider"
          />
          <div className="slider-ticks">
            <span>0px (Sharp)</span>
            <span>8px</span>
            <span>16px</span>
            <span>24px (Pill)</span>
          </div>
        </div>

        {/* Custom Color Overrides */}
        <div className="tuner-group">
          <label className="tuner-label">Live Color Overrides</label>
          <div className="color-inputs-grid">
            <div className="color-input-row">
              <label>Primary Action</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.primary || (mode === 'dark' ? '#30a0ff' : '#1d7ae0')}
                  onChange={(e) => updateOverride('primary', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="e.g. #3b82f6"
                  value={overrides.primary || ''}
                  onChange={(e) => updateOverride('primary', e.target.value)}
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>Primary Text</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.primaryForeground || '#ffffff'}
                  onChange={(e) => updateOverride('primaryForeground', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="#ffffff"
                  value={overrides.primaryForeground || ''}
                  onChange={(e) => updateOverride('primaryForeground', e.target.value)}
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>Secondary Bg</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.secondary || (mode === 'dark' ? '#252d3d' : '#e8ecf3')}
                  onChange={(e) => updateOverride('secondary', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="var(--secondary)"
                  value={overrides.secondary || ''}
                  onChange={(e) => updateOverride('secondary', e.target.value)}
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>Destructive</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.destructive || (mode === 'dark' ? '#ef4444' : '#dc2626')}
                  onChange={(e) => updateOverride('destructive', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="var(--destructive)"
                  value={overrides.destructive || ''}
                  onChange={(e) => updateOverride('destructive', e.target.value)}
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>Page Background</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.background || (mode === 'dark' ? '#0a0c14' : '#f4f6fa')}
                  onChange={(e) => updateOverride('background', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="var(--background)"
                  value={overrides.background || ''}
                  onChange={(e) => updateOverride('background', e.target.value)}
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>Card / Panel</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.card || (mode === 'dark' ? '#161b26' : '#ffffff')}
                  onChange={(e) => updateOverride('card', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="var(--card)"
                  value={overrides.card || ''}
                  onChange={(e) => updateOverride('card', e.target.value)}
                />
              </div>
            </div>

            <div className="color-input-row">
              <label>Focus Ring</label>
              <div className="color-field">
                <input
                  type="color"
                  value={overrides.ring || '#30a0ff'}
                  onChange={(e) => updateOverride('ring', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="var(--ring)"
                  value={overrides.ring || ''}
                  onChange={(e) => updateOverride('ring', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
