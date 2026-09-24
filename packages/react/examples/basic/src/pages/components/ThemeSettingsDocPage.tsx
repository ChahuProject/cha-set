import React, { useState } from 'react';
import { ThemeSettings, DEFAULT_THEME_CONFIG, Card, CodeBlock } from '@chahu/cha-set';
import type { ThemeConfig } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

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

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ThemeSettings } from '@chahu/cha-set';

<ThemeSettings />`}
        qtCode={`import ChaSet

ChaSetThemeSettings {
    width: parent.width
}`}
      />



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

      <ComponentReference
        name="ThemeSettings"
        componentId="theme-settings"
        props={[
          {
            name: 'config',
            type: 'ThemeConfig',
            default: 'DEFAULT_THEME_CONFIG',
            description: 'Canonical theme configuration object containing mode, palette, decoration, typography, and uiScale.',
          },
          {
            name: 'onChange',
            type: '(next: ThemeConfig) => void',
            default: 'undefined',
            description: 'Callback invoked when any theme property changes.',
          },
          {
            name: 'onReset',
            type: '() => void',
            default: 'undefined',
            description: 'Callback invoked when the reset button is activated.',
          },
          {
            name: 'onExport',
            type: '(configJson: string) => void',
            default: 'undefined',
            description: 'Callback invoked when exporting configuration JSON.',
          },
          {
            name: 'onImport',
            type: '(jsonString: string) => boolean | void',
            default: 'undefined',
            description: 'Callback invoked when importing and parsing configuration JSON.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Disables all interactive controls and dims opacity.',
          },
          {
            name: 'showReset',
            type: 'boolean',
            default: 'true',
            description: 'Whether to display the reset button in header.',
          },
          {
            name: 'showExport',
            type: 'boolean',
            default: 'true',
            description: 'Whether to display the export JSON button in header.',
          },
          {
            name: 'showImport',
            type: 'boolean',
            default: 'true',
            description: 'Whether to display the import button in header.',
          },
          {
            name: 'showTypography',
            type: 'boolean',
            default: 'false',
            description: 'Whether to render typography font family and scale selection rows.',
          },
          {
            name: 'textProvider',
            type: '(key: string, defaultText: string) => string',
            default: 'undefined',
            description: 'Optional internationalization string resolver callback.',
          },
        ]}
      />
    </DocLayout>
  );
}
