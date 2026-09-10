import React from 'react';
import { ReadOnlyInput } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function ReadOnlyInputDocPage() {
  const reactCode = `<ReadOnlyInput
  value="cs_live_94817264810294827104"
  showCopy
  masked
  maskChar="•"
/>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Read-Only Input"
      description="Protected input field for API keys, tokens, and IDs with built-in copy-to-clipboard action and masking toggle."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
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
          Safely expose secret credentials with optional masking and one-click copy.
        </p>

        <ComponentPreview title="Read-Only Input Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-md flex flex-col gap-4">
            <ReadOnlyInput
              value="cs_live_94817264810294827104"
              showCopy
            />
            <ReadOnlyInput
              value="ghp_3847291847291048291048291840"
              masked
              showCopy
            />
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
        <KeyboardShortcutsTable componentId="read-only-input" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: "''", description: 'Protected value displayed in the input.' },
            { name: 'showCopy', type: 'boolean', default: 'true', description: 'Whether to show the attached copy button.' },
            { name: 'masked', type: 'boolean', default: 'false', description: 'Whether to mask characters with bullets.' },
            { name: 'maskChar', type: 'string', default: "'•'", description: 'Character used for masking.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
