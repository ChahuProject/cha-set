import React, { useState } from 'react';
import { KeybindingRecorder, formatKeybinding, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function KeybindingRecorderDocPage() {
  const { t } = useChaSetI18n();
  const [binding, setBinding] = useState('Ctrl+Shift+P');

  const reactCode = `<KeybindingRecorder
  value={binding}
  onValueChange={setBinding}
  placeholder="Click to record shortcut..."
/>`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Keybinding Recorder"
      description={t('components.keybinding-recorder.description', 'Interactive keyboard sequence recorder that captures desktop accelerator combinations (Ctrl, Alt, Shift, Meta).')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.keybindingRecorder.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.keybindingRecorder.overviewDesc', 'Click the recorder box below and press any key combination (e.g. {{example}}).', { example: 'Ctrl+Alt+S' })}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetKeybindingRecorder {
    width: 240
    value: "Ctrl+Shift+P"
    size: "default"
    clearable: true
    onKeybindingRecorded: function(b) { console.log(b) }
}`} title={t('desktopComposite.keybindingRecorder.sandboxTitle', 'Keybinding Recorder Sandbox')} reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <KeybindingRecorder
              value={binding}
              onValueChange={(val) => setBinding(typeof val === 'string' ? val : formatKeybinding(val))}
              placeholder={t('components.keybindingRecorder.placeholder', 'Press shortcut keys...')}
              recordingText={t('components.keybindingRecorder.recordingPrompt', 'Please press key combination (Esc to cancel)...')}
            />
            <span className="text-xs text-muted-foreground">
              {t('components.keybindingRecorder.recordedAccelerator', 'Recorded accelerator:')} <code className="text-foreground">{binding || t('components.keybindingRecorder.none', 'None')}</code>
            </span>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { KeybindingRecorder } from '@chahu/cha-set';

<KeybindingRecorder value="Ctrl+Shift+P" onChange={(k) => console.log(k)} />`}
        qtCode={`import ChaSet

ChaSetKeybindingRecorder {
    keySequence: "Ctrl+Shift+P"
    onKeySequenceChanged: (k) => console.log(k)
}`}
      />



      <section id="variants" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('components.keybindingRecorder.sizesAndStates', 'Sizes & States')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.keybindingRecorder.sizesAndStatesDesc', 'Available in default and sm sizing tiers, with optional clearing and disabled states.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetKeybindingRecorder { value: "Ctrl+K"; size: "default" }
ChaSetKeybindingRecorder { value: "Ctrl+Shift+P"; size: "sm" }
ChaSetKeybindingRecorder { value: "Alt+F4"; clearable: false }
ChaSetKeybindingRecorder { value: "Ctrl+C"; enabled: false }`}
          title={t('components.keybindingRecorder.sizesAndStates', 'Sizes & States')}
          reactCode={`<KeybindingRecorder value="Ctrl+K" size="default" />
<KeybindingRecorder value="Ctrl+Shift+P" size="sm" />
<KeybindingRecorder value="Alt+F4" clearable={false} />
<KeybindingRecorder value="Ctrl+C" disabled />`}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{t('components.keybindingRecorder.defaultWithClear', 'Default Size (with Clear)')}</span>
              <KeybindingRecorder value="Ctrl+K" size="default" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{t('components.keybindingRecorder.compactSm', 'Compact sm Tier')}</span>
              <KeybindingRecorder value="Ctrl+Shift+P" size="sm" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{t('components.keybindingRecorder.withoutClear', 'Without Clear Button')}</span>
              <KeybindingRecorder value="Alt+F4" clearable={false} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{t('components.keybindingRecorder.disabledTitle', 'Disabled State')}</span>
              <KeybindingRecorder value="Ctrl+C" disabled />
            </div>
          </div>
        </ComponentPreview>
      </section>

                        <DocMarkdown id="keybinding-recorder" section="keyboard" />

            <DocMarkdown id="keybinding-recorder" section="props" />
    </DocLayout>
  );
}
