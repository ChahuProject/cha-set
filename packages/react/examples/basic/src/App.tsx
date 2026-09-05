import { useEffect, useState } from 'react';
import { Button } from '@chahu/cha-set';
import { type ThemeOverrides } from './components/ThemeTuner';
import { ExportModal } from './components/ExportModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { useRouter } from './router/useRouter';
import { ButtonDocPage } from './pages/components/ButtonDocPage';
import { ScrollAreaDocPage } from './pages/components/ScrollAreaDocPage';
import { IntroductionPage } from './pages/get-started/IntroductionPage';
import { TokensPage } from './pages/get-started/TokensPage';
import { ThemeTunerPage } from './pages/get-started/ThemeTunerPage';

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
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const harness = searchParams?.get('harness');

  // Isolated Component Visual Test Harness (Required for visual diff tests)
  if (harness === 'button') {
    let rawVariant = searchParams?.get('variant') ?? 'default';
    if (rawVariant === 'primary') rawVariant = 'default';
    const variant = rawVariant as any;

    let rawSize = searchParams?.get('size') ?? 'default';
    if (rawSize === 'md') rawSize = 'default';
    const size = rawSize as any;

    const label = searchParams?.get('label') ?? '·';
    const loading = searchParams?.get('loading') === 'true';
    const disabled = searchParams?.get('disabled') === 'true';
    const state = searchParams?.get('state') ?? 'idle';
    const theme = searchParams?.get('theme') ?? 'light';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div style={{ width: 220, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#020817' : '#ffffff', margin: 0, padding: 0 }}>
        <Button
          variant={variant}
          size={size}
          loading={loading}
          disabled={disabled}
          forceHover={state === 'hover'}
          forceActive={state === 'active'}
        >
          {label}
        </Button>
      </div>
    );
  }

  const { currentHash, navigate } = useRouter();
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

  const [showTuner, setShowTuner] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    applyTheme(mode, accent, overrides);
    localStorage.setItem('cs-mode', mode);
    localStorage.setItem('cs-accent', accent);
    localStorage.setItem('cs-overrides', JSON.stringify(overrides));
  }, [mode, accent, overrides]);

  const themeKey = `${mode}:${accent}:${JSON.stringify(overrides)}`;

  const renderActivePage = () => {
    switch (currentHash) {
      case '#/get-started/introduction':
      case '#/':
        return <IntroductionPage />;
      case '#/get-started/tokens':
        return <TokensPage themeKey={themeKey} />;
      case '#/get-started/theme-tuner':
        return (
          <ThemeTunerPage
            mode={mode}
            setMode={setMode}
            accent={accent}
            setAccent={setAccent}
            overrides={overrides}
            setOverrides={setOverrides}
            onOpenExport={() => setExportModalOpen(true)}
          />
        );
      case '#/components/scroll-area':
        return <ScrollAreaDocPage />;
      case '#/components/button':
      default:
        return <ButtonDocPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Top Navbar */}
      <Header
        mode={mode}
        onToggleMode={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
        onOpenSearch={() => setSearchModalOpen(true)}
        onToggleTuner={() => setShowTuner((v) => !v)}
        showTuner={showTuner}
        onOpenExport={() => setExportModalOpen(true)}
      />

      {/* Main App Grid */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Left Category Sidebar */}
        <Sidebar currentHash={currentHash} />

        {/* Dynamic Route Page Content */}
        <div className="flex-1 min-w-0">
          {renderActivePage()}
        </div>
      </div>

      {/* Quick Search Dialog (Cmd+K) */}
      <CommandSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={(href) => navigate(href)}
      />

      {/* One-Click Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        mode={mode}
        accent={accent}
        overrides={overrides}
      />
    </div>
  );
}
