import { useEffect, useState } from 'react';
import ColorsSection from './sections/ColorsSection';
import TypeRadiusSection from './sections/TypeRadiusSection';
import ButtonSection from './sections/ButtonSection';

const ACCENTS: { id: string; label: string }[] = [
  { id: '', label: 'Default' },
  { id: 'slate', label: 'slate' },
  { id: 'red', label: 'red' },
  { id: 'orange', label: 'orange' },
  { id: 'yellow', label: 'yellow' },
  { id: 'green', label: 'green' },
  { id: 'blue', label: 'blue' },
  { id: 'violet', label: 'violet' },
  { id: 'rose', label: 'rose' },
];

function applyTheme(mode: string, accent: string) {
  const html = document.documentElement;
  html.classList.toggle('dark', mode === 'dark');
  if (accent) html.setAttribute('data-theme', accent);
  else html.removeAttribute('data-theme');
}

export function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('cs-mode') ?? 'light');
  const [accent, setAccent] = useState(() => localStorage.getItem('cs-accent') ?? '');

  useEffect(() => {
    applyTheme(mode, accent);
    localStorage.setItem('cs-mode', mode);
    localStorage.setItem('cs-accent', accent);
  }, [mode, accent]);

  const themeKey = `${mode}:${accent}`;

  return (
    <>
      <header className="topbar">
        <h1>ChaSet Showcase</h1>
        <div className="chipset" role="group" aria-label="Accent theme">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              className="chip"
              aria-pressed={accent === a.id}
              onClick={() => setAccent(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        <button
          className="chip"
          aria-pressed={mode === 'dark'}
          onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
        >
          {mode === 'dark' ? 'Dark' : 'Light'}
        </button>
      </header>

      <div className="body-grid">
        <nav className="toc" aria-label="Table of contents">
          <a href="#colors">Palette</a>
          <a href="#type">Typography / Radius / Charts</a>
          <a href="#button">Button</a>
        </nav>

        <main>
          <ColorsSection themeKey={themeKey} />
          <TypeRadiusSection />
          <ButtonSection />
        </main>
      </div>
    </>
  );
}
