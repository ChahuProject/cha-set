import React from 'react';
import { CopyButton, Card, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function CopyButtonDocPage() {
  const reactCode = `<div className="flex items-center gap-4">
  <CopyButton text="pnpm add @chahu/cha-set" />
  <CopyButton text="https://chahu.design" label="Copy URL" />
</div>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Copy Button"
      description="One-click clipboard copy button with transient success checkmark feedback and customizable timeout."
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
          Click either copy button below to copy the target string to your system clipboard.
        </p>

        <ComponentPreview title="Copy Button Sandbox" reactCode={reactCode}>
          <div className="flex flex-wrap items-center gap-4">
            <CopyButton text="pnpm add @chahu/cha-set" />
            <CopyButton text="https://chahu.design" label="Copy Link" />
            <CopyButton text="export const SECRET = 'sk_live_948271';" variant="default" label="Copy Secret" />
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
        <KeyboardShortcutsTable componentId="copy-button" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'text', type: 'string | (() => string | Promise<string>)', default: "''", description: 'Text string written to clipboard on click.' },
            { name: 'label', type: 'string', default: "''", description: 'Optional companion label alongside the icon.' },
            { name: 'copiedLabel', type: 'string', default: "'Copied!'", description: 'Label text displayed after successful copy.' },
            { name: 'timeout', type: 'number', default: '2000', description: 'Duration in ms to show the copied checkmark state.' },
            { name: 'variant', type: "'ghost' | 'outline' | 'default' | 'secondary'", default: "'ghost'", description: 'Button visual variant.' },
            { name: 'size', type: "'icon-xs' | 'icon-sm' | 'sm' | 'default'", default: "label ? 'sm' : 'icon-xs'", description: 'Button sizing preset.' },
            { name: 'onCopy', type: '(copiedText: string) => void', default: 'undefined', description: 'Callback fired when text is copied.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
