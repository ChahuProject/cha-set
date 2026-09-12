import React, { useState } from 'react';
import { KeybindingRecorder, Card, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function KeybindingRecorderDocPage() {
  const [binding, setBinding] = useState('Ctrl+Shift+P');

  const reactCode = `<KeybindingRecorder
  value={binding}
  onValueChange={setBinding}
  placeholder="Click to record shortcut..."
/>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Keybinding Recorder"
      description="Interactive keyboard sequence recorder that captures desktop accelerator combinations (Ctrl, Alt, Shift, Meta)."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'variants', title: 'Sizes & States' },
        { id: 'installation', title: 'Installation' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the recorder box below and press any key combination (e.g. <code>Ctrl+Alt+S</code>).
        </p>

        <ComponentPreview title="Keybinding Recorder Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <KeybindingRecorder
              value={binding}
              onValueChange={setBinding}
              placeholder="Press shortcut keys..."
            />
            <span className="text-xs text-muted-foreground">
              Recorded accelerator: <code className="text-foreground">{binding || 'None'}</code>
            </span>
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Sizes & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Available in default and sm sizing tiers, with optional clearing and disabled states.
        </p>

        <ComponentPreview
          title="Sizes & States Preview"
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

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="keybinding-recorder" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
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
      </section>
    </DocLayout>
  );
}
