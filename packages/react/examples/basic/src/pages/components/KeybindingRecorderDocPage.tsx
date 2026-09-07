import React, { useState } from 'react';
import { KeybindingRecorder, Card } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

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
        { id: 'installation', title: 'Installation' },
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
          <div className="flex flex-col items-center gap-4">
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

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: "''", description: 'Active key combination string.' },
            { name: 'onValueChange', type: '(val: string) => void', default: 'undefined', description: 'Callback fired when new combination recorded.' },
            { name: 'clearable', type: 'boolean', default: 'true', description: 'Whether to render a clear button.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether recorder is disabled.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
