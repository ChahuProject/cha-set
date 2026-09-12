import React, { useState } from 'react';
import { InlineEditableText, Card, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function InlineEditableTextDocPage() {
  const [title, setTitle] = useState('My Awesome Project');

  const reactCode = `<InlineEditableText
  value={title}
  onValueChange={setTitle}
  placeholder="Click or double-click to edit..."
/>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Inline Editable Text"
      description="Text element that switches seamlessly to an input field on double-click or edit trigger, supporting Enter to save and Escape to cancel."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'variants', title: 'Sizes & Triggers' },
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
          Click or double-click on the text below to modify it. Press <code>Enter</code> to confirm or <code>Esc</code> to cancel.
        </p>

        <ComponentPreview title="Inline Editable Text Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-lg border border-border bg-card text-foreground text-base">
              <InlineEditableText
                value={title}
                onValueChange={setTitle}
                placeholder="Type a title..."
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Current state value: <strong className="text-foreground">{title}</strong>
            </span>
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Sizes & Interaction Triggers
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure single-click vs double-click activations and high-density sizing tiers.
        </p>

        <ComponentPreview
          title="Sizes & Triggers Preview"
          reactCode={`<InlineEditableText value="Single Click to Edit" trigger="click" size="default" />
<InlineEditableText value="Double Click to Edit" trigger="doubleClick" size="default" />
<InlineEditableText value="Compact sm Tier Label" size="sm" />
<InlineEditableText value="Read-only Disabled Text" disabled />`}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Single Click Activation (Default)</span>
              <InlineEditableText value="Project Architecture Doc" trigger="click" size="default" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Double Click Activation</span>
              <InlineEditableText value="Database Connection URI" trigger="doubleClick" size="default" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Compact sm Size</span>
              <InlineEditableText value="Sprint-42-Review" size="sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Disabled State</span>
              <InlineEditableText value="System Protected File" disabled />
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
        <KeyboardShortcutsTable componentId="inline-editable-text" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: "''", description: 'Current text value.' },
            { name: 'onValueChange', type: '(v: string) => void', default: 'undefined', description: 'Callback invoked upon confirming an edit.' },
            { name: 'onSave', type: '(v: string) => void | boolean | Promise<...>', default: 'undefined', description: 'Async save handler; returning false keeps edit mode open.' },
            { name: 'trigger', type: '"click" | "doubleClick"', default: '"click"', description: 'Mouse gesture that opens the inline input.' },
            { name: 'size', type: '"default" | "sm"', default: '"default"', description: 'Density and sizing variant.' },
            { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder when value is empty.' },
            { name: 'hint', type: 'string', default: "''", description: 'Hover tooltip hint.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether inline editing is disabled.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
