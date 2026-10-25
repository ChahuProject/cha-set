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



      <DocMarkdown id="language-settings" section="animations" />

            <DocMarkdown id="language-settings" section="keyboard" />

      <DocMarkdown id="language-settings" section="props" />
    </DocLayout>
  );
}
