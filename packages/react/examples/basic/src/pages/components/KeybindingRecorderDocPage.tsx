import React, { useState } from 'react';
import { KeybindingRecorder, formatKeybinding, Card, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function KeybindingRecorderDocPage() {
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
      description="Interactive keyboard sequence recorder that captures desktop accelerator combinations (Ctrl, Alt, Shift, Meta)."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the recorder box below and press any key combination (e.g. <code>Ctrl+Alt+S</code>).
        </p>

        <ComponentPreview
          qtCode={`ChaSetKeybindingRecorder {
    width: 240
    value: "Ctrl+Shift+P"
    size: "default"
    clearable: true
    onKeybindingRecorded: function(b) { console.log(b) }
}`} title="Keybinding Recorder Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <KeybindingRecorder
              value={binding}
              onValueChange={(val) => setBinding(typeof val === 'string' ? val : formatKeybinding(val))}
              placeholder="Press shortcut keys..."
            />
            <span className="text-xs text-muted-foreground">
              Recorded accelerator: <code className="text-foreground">{binding || 'None'}</code>
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
          Sizes & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Available in default and sm sizing tiers, with optional clearing and disabled states.
        </p>

        <ComponentPreview
          qtCode={`ChaSetKeybindingRecorder { value: "Ctrl+K"; size: "default" }
ChaSetKeybindingRecorder { value: "Ctrl+Shift+P"; size: "sm" }
ChaSetKeybindingRecorder { value: "Alt+F4"; clearable: false }
ChaSetKeybindingRecorder { value: "Ctrl+C"; enabled: false }`}
          title="Sizes & States"
          reactCode={`<KeybindingRecorder value="Ctrl+K" size="default" />
<KeybindingRecorder value="Ctrl+Shift+P" size="sm" />
<KeybindingRecorder value="Alt+F4" clearable={false} />
<KeybindingRecorder value="Ctrl+C" disabled />`}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Default Size (with Clear)</span>
              <KeybindingRecorder value="Ctrl+K" size="default" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Compact sm Tier</span>
              <KeybindingRecorder value="Ctrl+Shift+P" size="sm" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Without Clear Button</span>
              <KeybindingRecorder value="Alt+F4" clearable={false} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Disabled State</span>
              <KeybindingRecorder value="Ctrl+C" disabled />
            </div>
          </div>
        </ComponentPreview>
      </section>

            <ComponentReference
        name="KeybindingRecorder"
        componentId="keybinding-recorder"
        props={[
            { name: 'value', type: 'string | KeybindingValue', default: "''", description: 'Active key combination (string or structured object).' },
            { name: 'onValueChange', type: '(val: string | KeybindingValue) => void', default: 'undefined', description: 'Callback fired when new combination recorded.' },
            { name: 'onChange', type: '(value: KeybindingValue, str: string) => void', default: 'undefined', description: 'Dual callback receiving both structured object and string.' },
            { name: 'size', type: '"default" | "sm"', default: '"default"', description: 'Density and sizing variant.' },
            { name: 'clearable', type: 'boolean', default: 'true', description: 'Whether to render a clear button when shortcut is set.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether recorder interaction is disabled.' },
            { name: 'placeholder', type: 'string', default: "'No keybinding set'", description: 'Placeholder when no shortcut is defined.' },
            { name: 'recordingText', type: 'string', default: "'Press key combination (Esc to cancel)...'", description: 'Prompt displayed during active recording.' },
          ]}
      />
    </DocLayout>
  );
}
