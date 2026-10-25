import React, { useState } from 'react';
import { ThemeSettings, DEFAULT_THEME_CONFIG, Card, CodeBlock, CopyableBadge, useChaSetI18n } from '@chahu/cha-set';
import type { ThemeConfig } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
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

            <DocMarkdown id="theme-settings" section="keyboard" />

      <DocMarkdown id="theme-settings" section="props" />
    </DocLayout>
  );
}
