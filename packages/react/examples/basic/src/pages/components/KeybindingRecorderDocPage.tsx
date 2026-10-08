import React, { useState } from 'react';
import { KeybindingRecorder, formatKeybinding, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.keybindingRecorder.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.keybindingRecorder.overviewDesc', 'Click the recorder box below and press any key combination (e.g. {{example}}).', { example: 'Ctrl+Alt+S' })}
        </p>

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('components.keybindingRecorder.sizesAndStates', 'Sizes & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.keybindingRecorder.sizesAndStatesDesc', 'Available in default and sm sizing tiers, with optional clearing and disabled states.')}
        </p>

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

            <ComponentReference
        name="KeybindingRecorder"
        componentId="keybinding-recorder"
        props={[
            { name: 'value', type: 'string | KeybindingValue', default: "''", description: t('components.keybindingRecorder.valueDesc', 'Active key combination (string or structured object).') },
            { name: 'onValueChange', type: '(val: string | KeybindingValue) => void', default: 'undefined', description: t('components.keybindingRecorder.onValueChangeDesc', 'Callback fired when new combination recorded.') },
            { name: 'onChange', type: '(value: KeybindingValue, str: string) => void', default: 'undefined', description: t('components.keybindingRecorder.onChangeDesc', 'Dual callback receiving both structured object and string.') },
            { name: 'size', type: '"default" | "sm"', default: '"default"', description: t('components.keybindingRecorder.sizeDesc', 'Size preset variant for regular or compact density.') },
            { name: 'clearable', type: 'boolean', default: 'true', description: t('components.keybindingRecorder.clearableDesc', 'Whether to display a clear button when a shortcut is set.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('components.keybindingRecorder.disabledDesc', 'Whether the recorder is disabled.') },
            { name: 'placeholder', type: 'string', default: "'No keybinding set'", description: t('components.keybindingRecorder.placeholderDesc', 'Placeholder when no shortcut is defined.') },
            { name: 'recordingText', type: 'string', default: "'Press key combination (Esc to cancel)...'", description: t('components.keybindingRecorder.recordingTextDesc', 'Prompt displayed during active recording.') },
          ]}
      />
    </DocLayout>
  );
}
