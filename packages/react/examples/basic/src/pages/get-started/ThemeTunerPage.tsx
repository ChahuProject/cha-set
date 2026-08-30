import React from 'react';
import { DocLayout } from '../../layout/DocLayout';
import { ThemeTuner, type ThemeOverrides } from '../../components/ThemeTuner';
import { ComponentPlayground } from '../../components/ComponentPlayground';

export interface ThemeTunerPageProps {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  accent: string;
  setAccent: React.Dispatch<React.SetStateAction<string>>;
  overrides: ThemeOverrides;
  setOverrides: React.Dispatch<React.SetStateAction<ThemeOverrides>>;
  onOpenExport: () => void;
}

export function ThemeTunerPage({
  mode,
  setMode,
  accent,
  setAccent,
  overrides,
  setOverrides,
  onOpenExport,
}: ThemeTunerPageProps) {
  return (
    <DocLayout
      category="Get Started"
      title="Theme Studio"
      description="Live interactive theme tuner. Fine-tune colors, radiuses, and accents with real-time feedback and one-click config export."
      tocItems={[
        { id: 'tuner', title: 'Theme Controls' },
        { id: 'playground', title: 'Live Sandbox' },
      ]}
    >
      <div className="space-y-8">
        <section id="tuner">
          <ThemeTuner
            mode={mode}
            setMode={setMode}
            accent={accent}
            setAccent={setAccent}
            overrides={overrides}
            setOverrides={setOverrides}
            onOpenExport={onOpenExport}
          />
        </section>

        <section id="playground">
          <ComponentPlayground />
        </section>
      </div>
    </DocLayout>
  );
}
