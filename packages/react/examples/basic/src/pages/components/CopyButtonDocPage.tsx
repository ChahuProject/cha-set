import React from 'react';
import { CopyButton, Card, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function CopyButtonDocPage() {
  const reactCode = `<div className="flex items-center gap-4">
  <CopyButton text="pnpm add @chahu/cha-set" />
  <CopyButton text="https://chahu.design" label="Copy URL" />
</div>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Copy Button"
      description="One-click clipboard copy button with transient success checkmark feedback and customizable timeout."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click either copy button below to copy the target string to your system clipboard.
        </p>

        <ComponentPreview
          qtCode={`Row {\n    spacing: 12\n    ChaSetCopyButton {\n        text: "pnpm add @chahu/cha-set"\n        onCopiedToClipboard: function(txt) { console.log("Copied: " + txt) }\n    }\n    ChaSetCopyButton {\n        text: "https://chahu.design"\n        label: "Copy Link"\n        variant: "outline"\n    }\n    ChaSetCopyButton {\n        text: "export const SECRET = 'sk_live_948271';"\n        label: "Copy Secret"\n        variant: "default"\n    }\n}`} title="Copy Button Sandbox" reactCode={reactCode}>
          <div className="flex flex-wrap items-center gap-4">
            <CopyButton text="pnpm add @chahu/cha-set" />
            <CopyButton text="https://chahu.design" label="Copy Link" />
            <CopyButton text="export const SECRET = 'sk_live_948271';" variant="default" label="Copy Secret" />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { CopyButton } from '@chahu/cha-set';

<CopyButton text="pnpm add @chahu/cha-set" label="Copy Command" />`}
        qtCode={`import ChaSet

ChaSetCopyButton {
    text: "pnpm add @chahu/cha-set"
    label: "Copy Command"
    onCopiedToClipboard: (txt) => console.log("Copied:", txt)
}`}
      />



            <ComponentReference
        name="CopyButton"
        componentId="copy-button"
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
    </DocLayout>
  );
}
