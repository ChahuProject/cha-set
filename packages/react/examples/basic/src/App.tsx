import { useEffect, useState } from 'react';
import { ThemeTuner, type ThemeOverrides } from './components/ThemeTuner';
import { ComponentPlayground } from './components/ComponentPlayground';
import { ExportModal } from './components/ExportModal';
import ColorsSection from './sections/ColorsSection';
import TypeRadiusSection from './sections/TypeRadiusSection';
import ButtonSection from './sections/ButtonSection';

function applyTheme(mode: string, accent: string, overrides: ThemeOverrides) {
  const html = document.documentElement;

  // 1. Toggle dark mode class
  html.classList.toggle('dark', mode === 'dark');

  // 2. Set accent dataset
  if (accent) html.setAttribute('data-theme', accent);
  else html.removeAttribute('data-theme');

  // 3. Clear existing custom properties
  const customProps = [
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--accent',
    '--accent-foreground',
    '--destructive',
    '--background',
    '--card',
    '--border',
    '--ring',
    '--radius',
  ];
  for (const prop of customProps) {
    html.style.removeProperty(prop);
  }

  // 4. Inject active overrides
  if (overrides.primary) html.style.setProperty('--primary', overrides.primary);
  if (overrides.primaryForeground) html.style.setProperty('--primary-foreground', overrides.primaryForeground);
  if (overrides.secondary) html.style.setProperty('--secondary', overrides.secondary);
  if (overrides.secondaryForeground) html.style.setProperty('--secondary-foreground', overrides.secondaryForeground);
  if (overrides.accent) html.style.setProperty('--accent', overrides.accent);
  if (overrides.accentForeground) html.style.setProperty('--accent-foreground', overrides.accentForeground);
  if (overrides.destructive) html.style.setProperty('--destructive', overrides.destructive);
  if (overrides.background) html.style.setProperty('--background', overrides.background);
  if (overrides.card) html.style.setProperty('--card', overrides.card);
  if (overrides.border) html.style.setProperty('--border', overrides.border);
  if (overrides.ring) html.style.setProperty('--ring', overrides.ring);
  if (overrides.radius) html.style.setProperty('--radius', overrides.radius);
}

export function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('cs-mode') ?? 'light');
  const [accent, setAccent] = useState(() => localStorage.getItem('cs-accent') ?? '');
  const [overrides, setOverrides] = useState<ThemeOverrides>(() => {
    try {
      const saved = localStorage.getItem('cs-overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showTuner, setShowTuner] = useState(true);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    applyTheme(mode, accent, overrides);
    localStorage.setItem('cs-mode', mode);
    localStorage.setItem('cs-accent', accent);
    localStorage.setItem('cs-overrides', JSON.stringify(overrides));
  }, [mode, accent, overrides]);

  const themeKey = `${mode}:${accent}:${JSON.stringify(overrides)}`;

  return (
    <>
      {/* Top Navbar */}
      <header className="topbar">
        <div className="brand-group">
          <span className="brand-badge">🍵</span>
          <div>
            <h1>ChaSet Studio</h1>
            <span className="brand-subtitle">Theme Tuner & Component Showcase</span>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className={`topbar-btn ${showTuner ? 'active' : ''}`}
            onClick={() => setShowTuner((v) => !v)}
            title="Toggle theme tuning controls"
          >
            🎨 Style Tuner
          </button>
          <button
            className="topbar-btn"
            onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            title="Toggle light / dark appearance"
          >
            {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="topbar-btn-primary" onClick={() => setExportModalOpen(true)}>
            📋 Export & Copy Config
          </button>
        </div>
      </header>

      <div className="body-grid">
        {/* Navigation Table of Contents */}
        <aside className="sidebar-toc">
          <nav className="toc" aria-label="Table of contents">
            <span className="toc-title">Navigation</span>
            <a href="#playground">Interactive Sandbox</a>
            <a href="#button">Button Matrix</a>
            <a href="#colors">Palette & Tokens</a>
            <a href="#type">Typography & Radius</a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Collapsible Style Tuner */}
          {showTuner && (
            <ThemeTuner
              mode={mode}
              setMode={setMode}
              accent={accent}
              setAccent={setAccent}
              overrides={overrides}
              setOverrides={setOverrides}
              onOpenExport={() => setExportModalOpen(true)}
            />
          )}

          {/* 1. Live Interactive Sandbox */}
          <ComponentPlayground />

          {/* 2. Full Button Matrix */}
          <ButtonSection />

          {/* 3. Palette & Tokens */}
          <ColorsSection themeKey={themeKey} />

          {/* 4. Typography & Radius */}
          <TypeRadiusSection />
        </main>
      </div>

      {/* One-Click Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        mode={mode}
        accent={accent}
        overrides={overrides}
      />
    </>
  );
}
