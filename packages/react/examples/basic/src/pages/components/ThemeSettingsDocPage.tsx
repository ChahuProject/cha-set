import React, { useState } from 'react';
import { ThemeSettings, DEFAULT_THEME_CONFIG, Card, CodeBlock } from '@chahu/cha-set';
import type { ThemeConfig } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export interface ThemeSettingsDocPageProps {
  config?: ThemeConfig;
  onChange?: (next: ThemeConfig) => void;
  onReset?: () => void;
}

export function ThemeSettingsDocPage({
  config: externalConfig,
  onChange: externalOnChange,
  onReset: externalOnReset,
}: ThemeSettingsDocPageProps = {}) {
  const [localConfig, setLocalConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const config = externalConfig ?? localConfig;
  const setConfig = externalOnChange ?? setLocalConfig;

  const heroReactCode = `<ThemeSettings
  config={${JSON.stringify(config, null, 2)}}
  onChange={(next) => setConfig(next)}
  onReset={() => console.log('Reset triggered')}
/>`;

  const heroQtCode = `ChaSetThemeSettings {
    config: ${JSON.stringify(config, null, 2)}
    onConfigChanged: function(next) {
        console.log("Theme updated:", JSON.stringify(next))
    }
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Theme Settings"
      description="Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          title="Interactive Theme Settings"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
        >
          <div className="w-full max-w-xl mx-auto py-4">
            <ThemeSettings
              config={config}
              onChange={setConfig}
              onReset={externalOnReset}
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <div className="space-y-3">
          <CodeBlock
            code="npm install @chahu/cha-set"
            language="bash"
            title="Terminal"
          />
          <CodeBlock
            code={`import { ThemeSettings, type ThemeConfig } from '@chahu/cha-set';`}
            language="tsx"
            title="Import"
          />
        </div>
      </section>

      <section id="animations" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ThemeSettings uses unified motion tokens for smooth state transitions across buttons, segmented
          controls, color pickers, and override drawers. Transitions use{' '}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">duration-quick</code> and{' '}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">ease-standard</code>.
          Respects <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">prefers-reduced-motion</code>{' '}
          and Qt <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">ThemeTokens.animationsEnabled</code> as global kill switches.
        </p>
      </section>

      <section id="keyboard" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="theme-settings" />
      </section>

      <section id="props" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'config',
              type: 'ThemeConfig',
              defaultValue: 'DEFAULT_THEME_CONFIG',
              description: 'Canonical theme configuration object containing mode, palette, decoration, typography, and uiScale.',
            },
            {
              name: 'onChange',
              type: '(next: ThemeConfig) => void',
              description: 'Callback invoked when any theme property changes.',
            },
            {
              name: 'onReset',
              type: '() => void',
              description: 'Callback invoked when the reset button is activated.',
            },
            {
              name: 'onExport',
              type: '(configJson: string) => void',
              description: 'Callback invoked when exporting configuration JSON.',
            },
            {
              name: 'onImport',
              type: '(jsonString: string) => boolean | void',
              description: 'Callback invoked when importing and parsing configuration JSON.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: 'Disables all interactive controls and dims opacity.',
            },
            {
              name: 'showReset',
              type: 'boolean',
              defaultValue: 'true',
              description: 'Whether to display the reset button in header.',
            },
            {
              name: 'showExport',
              type: 'boolean',
              defaultValue: 'true',
              description: 'Whether to display the export JSON button in header.',
            },
            {
              name: 'showImport',
              type: 'boolean',
              defaultValue: 'true',
              description: 'Whether to display the import button in header.',
            },
            {
              name: 'showTypography',
              type: 'boolean',
              defaultValue: 'false',
              description: 'Whether to render typography font family and scale selection rows.',
            },
            {
              name: 'textProvider',
              type: '(key: string, defaultText: string) => string',
              description: 'Optional internationalization string resolver callback.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
