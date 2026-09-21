import React, { useState } from 'react';
import { LanguageSettings, CodeBlock, useChaSetI18n, type LocalePreference } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function LanguageSettingsDocPage() {
  const i18n = useChaSetI18n();
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
      description="Cross-stack language configuration card with system detection and cultural poetry quotes."
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
          title="Interactive Language Settings"
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

      <section id="installation" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <div className="space-y-3">
          <CodeBlock
            code="npm install @chahu/cha-set"
            language="bash"
            title="Terminal"
          />
          <CodeBlock
            code={`import { LanguageSettings, useChaSetI18n } from '@chahu/cha-set';`}
            language="tsx"
            title="Import"
          />
        </div>
      </section>

      <section id="animations" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          LanguageSettings utilizes smooth token transitions for card focus, active selection rings,
          and checkmark badge states. Transitions use{' '}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">duration-quick</code> and{' '}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">ease-standard</code>.
          Respects <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">prefers-reduced-motion</code>{' '}
          and Qt <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">ThemeTokens.animationsEnabled</code> as global kill switches.
        </p>
      </section>

      <section id="keyboard" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="language-settings" />
      </section>

      <section id="props" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'preference',
              type: 'LocalePreference ("system" | string)',
              defaultValue: '"system"',
              description: 'Active language preference, either "system" or an explicit language code.',
            },
            {
              name: 'onPreferenceChange',
              type: '(next: LocalePreference) => void',
              description: 'Callback triggered when user selects a different language or toggles system mode.',
            },
            {
              name: 'showFollowSystem',
              type: 'boolean',
              defaultValue: 'true',
              description: 'Whether to show the prominent Follow System option card with system detection.',
            },
            {
              name: 'variant',
              type: '"card" | "embedded"',
              defaultValue: '"card"',
              description: 'Visual container variant. "card" renders an outer bordered card with header; "embedded" renders inline content without outer frame.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              defaultValue: 'false',
              description: 'Whether the language selection controls are disabled.',
            },
            {
              name: 'textProvider',
              type: '(key: string, defaultText?: string) => string',
              description: 'Optional custom translation function for overriding component strings.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
