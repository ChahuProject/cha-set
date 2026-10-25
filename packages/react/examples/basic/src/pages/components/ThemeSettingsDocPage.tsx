import React, { useState } from 'react';
import { ThemeSettings, DEFAULT_THEME_CONFIG, Card, CodeBlock, CopyableBadge, useChaSetI18n } from '@chahu/cha-set';
import type { ThemeConfig } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
  const { t } = useChaSetI18n();
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
      description={t('components.theme-settings.description', 'Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density.')}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('showcase.interactiveOverview', 'Interactive Overview')}</DocText>
        <ComponentPreview
          title={t('desktopComposite.themeSettings.sandboxTitle', 'Interactive Theme Settings')}
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
        <DocText role="h2">{t('showcase.animations', 'Animations')}</DocText>
        <DocText role="p" className="flex flex-wrap items-center gap-1.5">
          <span>{t('desktopComposite.themeSettings.animDescPrefix', 'ThemeSettings uses unified motion tokens for smooth state transitions across buttons, segmented controls, color pickers, and override drawers. Transitions use')}</span>
          <CopyableBadge size="sm" text="duration-quick" className="font-mono text-xs" />
          <span>{t('common.and', 'and')}</span>
          <CopyableBadge size="sm" text="ease-standard" className="font-mono text-xs" />.
          <span>{t('desktopComposite.taskHud.animReducedPrefix', 'Respects')}</span>
          <CopyableBadge size="sm" text="prefers-reduced-motion" className="font-mono text-xs" />
          <span>{t('desktopComposite.themeSettings.animDescSuffix', 'and Qt')}</span>
          <CopyableBadge size="sm" text="ThemeTokens.animationsEnabled" className="font-mono text-xs" />
          <span>{t('desktopComposite.themeSettings.animDescEnd', 'as global kill switches.')}</span>
        </DocText>
      </section>

      <ComponentReference
        name="ThemeSettings"
        componentId="theme-settings"
        props={[
          {
            name: 'config',
            type: 'ThemeConfig',
            default: 'DEFAULT_THEME_CONFIG',
            description: t('components.themeSettings.configDesc', 'Canonical theme configuration object containing mode, palette, decoration, typography, and uiScale.'),
          },
          {
            name: 'onChange',
            type: '(next: ThemeConfig) => void',
            default: 'undefined',
            description: t('components.themeSettings.onChangeDesc', 'Callback invoked when any theme property changes.'),
          },
          {
            name: 'onReset',
            type: '() => void',
            default: 'undefined',
            description: t('components.themeSettings.onResetDesc', 'Callback invoked when the reset button is activated.'),
          },
          {
            name: 'onExport',
            type: '(configJson: string) => void',
            default: 'undefined',
            description: t('components.themeSettings.onExportDesc', 'Callback invoked when exporting configuration JSON.'),
          },
          {
            name: 'onImport',
            type: '(jsonString: string) => boolean | void',
            default: 'undefined',
            description: t('components.themeSettings.onImportDesc', 'Callback invoked when importing and parsing configuration JSON.'),
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: t('components.themeSettings.disabledDesc', 'Disables all interactive controls and dims opacity.'),
          },
          {
            name: 'showReset',
            type: 'boolean',
            default: 'true',
            description: t('components.themeSettings.showResetDesc', 'Whether to display the reset button in header.'),
          },
          {
            name: 'showExport',
            type: 'boolean',
            default: 'true',
            description: t('components.themeSettings.showExportDesc', 'Whether to display the export JSON button in header.'),
          },
          {
            name: 'showImport',
            type: 'boolean',
            default: 'true',
            description: t('components.themeSettings.showImportDesc', 'Whether to display the import button in header.'),
          },
          {
            name: 'showTypography',
            type: 'boolean',
            default: 'false',
            description: t('components.themeSettings.showTypographyDesc', 'Whether to render typography font family and scale selection rows.'),
          },
          {
            name: 'textProvider',
            type: '(key: string, defaultText: string) => string',
            default: 'undefined',
            description: t('components.themeSettings.textProviderDesc', 'Optional internationalization string resolver callback.'),
          },
        ]}
      />
    </DocLayout>
  );
}
