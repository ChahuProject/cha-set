import React, { useState, useEffect } from 'react';
import { KeybindingManager, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';
import { showcaseShortcuts } from '../../services/showcaseShortcuts';

export function KeybindingManagerDocPage() {
  const { t } = useChaSetI18n();
  const [shortcutsState, setShortcutsState] = useState(() => showcaseShortcuts.getState());

  useEffect(() => {
    return showcaseShortcuts.subscribe(() => {
      setShortcutsState({ ...showcaseShortcuts.getState() });
    });
  }, []);

  const heroReactCode = `<KeybindingManager
  actions={actions}
  scopes={scopes}
  sections={sections}
  onBindingChange={(actionId, chordIndex, newKey) => {
    console.log('Binding changed:', actionId, chordIndex, newKey);
  }}
  onResetAction={(actionId) => console.log('Reset action:', actionId)}
  onResetAll={() => console.log('Reset all shortcuts')}
/>`;

  const heroQtCode = `ChaSetKeybindingManager {
    width: parent.width
    actions: root.showcaseActions
    scopes: root.showcaseScopes
    sections: root.showcaseSections
    onBindingChanged: function(actionId, chordIndex, newKey) {
        console.log("Binding changed:", actionId, chordIndex, newKey)
    }
    onActionResetRequested: function(actionId) {
        console.log("Reset action:", actionId)
    }
    onResetAllRequested: function() {
        console.log("Reset all shortcuts")
    }
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Keybinding Manager"
      description={t(
        'components.keybinding-manager.description',
        'Cross-stack keybinding and shortcut manager with reverse key search, conflict detection, and reset.',
      )}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('showcase.interactiveOverview', 'Interactive Overview')}</DocText>
        <ComponentPreview
          title={t('components.keybindingManager.sandboxTitle', 'Interactive Keybinding Manager')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
        >
          <div className="w-full max-w-3xl mx-auto py-2">
            <KeybindingManager
              actions={shortcutsState.actions}
              scopes={shortcutsState.scopes}
              sections={shortcutsState.sections}
              onBindingChange={(actionId, chordIndex, newKey) => {
                showcaseShortcuts.setBinding(actionId, chordIndex, newKey);
              }}
              onResetAction={(actionId) => {
                showcaseShortcuts.resetAction(actionId);
              }}
              onResetAll={() => {
                showcaseShortcuts.resetAll();
              }}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { KeybindingManager } from '@chahu/cha-set';

<KeybindingManager
  actions={actions}
  scopes={scopes}
  sections={sections}
  onBindingChange={(id, idx, key) => handleUpdate(id, idx, key)}
/>`}
        qtCode={`import ChaSet

ChaSetKeybindingManager {
    width: parent.width
    actions: myActions
    scopes: myScopes
    sections: mySections
    onBindingChanged: (id, idx, key) => handleUpdate(id, idx, key)
}`}
      />

      <DocMarkdown id="keybinding-manager" section="animations" />

      <DocMarkdown id="keybinding-manager" section="keyboard" />

      <DocMarkdown id="keybinding-manager" section="props" />
    </DocLayout>
  );
}
