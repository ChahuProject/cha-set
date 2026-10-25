import React, { useState } from 'react';
import { LanguageSettings, CopyableBadge, CodeBlock, useChaSetI18n, type LocalePreference } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function LanguageSettingsDocPage() {
  const i18n = useChaSetI18n();
  const { t } = i18n;
  const [pref, setPref] = useState<LocalePreference>(i18n.preference);

  const heroReactCode = `<LanguageSettings
  preference="${pref}"
  onPreferenceChange={(next) => console.log('Language changed:', next)}
  showFollowSystem={true}
/>`;

  const heroQtCode = `ChaSetLanguageSettings {
    preference: "${pref}"
    showFollowSystem: true
    onPreferenceChanged: function(next) {
        console.log("Language changed:", next)
    }
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Language Settings"
      description={t('components.language-settings.description', 'Cross-stack language configuration card with system detection and cultural poetry quotes.')}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('showcase.interactiveOverview', 'Interactive Overview')}</DocText>
        <ComponentPreview
          title={t('desktopComposite.languageSettings.sandboxTitle', 'Interactive Language Settings')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
        >
          <div className="w-full max-w-xl mx-auto py-4">
            <LanguageSettings
              preference={pref}
              onPreferenceChange={(next) => {
                setPref(next);
                i18n.setPreference(next);
              }}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { LanguageSettings } from '@chahu/cha-set';

<LanguageSettings currentLocale="en-US" onLocaleChange={(l) => console.log(l)} />`}
        qtCode={`import ChaSet

ChaSetLanguageSettings {
    currentLocale: "en-US"
    onLocaleChanged: (l) => console.log(l)
}`}
      />



      <section id="animations" className="space-y-4">
        <DocText role="h2">{t('showcase.animations', 'Animations')}</DocText>
        <DocText role="p" className="flex flex-wrap items-center gap-1.5">
          <span>{t('desktopComposite.languageSettings.animDescPrefix', 'LanguageSettings utilizes smooth token transitions for card focus, active selection rings, and checkmark badge states. Transitions use')}</span>
          <CopyableBadge size="sm" text="duration-quick" className="font-mono text-xs" />
          <span>{t('common.and', 'and')}</span>
          <CopyableBadge size="sm" text="ease-standard" className="font-mono text-xs" />.
          <span>{t('desktopComposite.taskHud.animReducedPrefix', 'Respects')}</span>
          <CopyableBadge size="sm" text="prefers-reduced-motion" className="font-mono text-xs" />
          <span>{t('desktopComposite.languageSettings.animDescSuffix', 'and Qt')}</span>
          <CopyableBadge size="sm" text="ThemeTokens.animationsEnabled" className="font-mono text-xs" />
          <span>{t('desktopComposite.languageSettings.animDescEnd', 'as global kill switches.')}</span>
        </DocText>
      </section>

            <DocMarkdown id="language-settings" section="keyboard" />

      <DocMarkdown id="language-settings" section="props" />
    </DocLayout>
  );
}
