import React, { useState } from 'react';
import { Splitter, Badge, Button, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SplitterDocPage() {
  const [size, setSize] = useState(35);

  const reactCode = `<div className="flex h-48 border rounded-md">
  <div style={{ width: \`\${size}%\` }} className="p-4 text-xs">
    Left Pane (Sidebar)
  </div>
  <Splitter size={size} onChange={setSize} orientation="vertical" />
  <div style={{ width: \`\${100 - size}%\` }} className="p-4 text-xs">
    Right Pane (Main Content)
  </div>
</div>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Splitter"
      description="Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits."
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
          Hover over the gutter between panes and drag horizontally to resize panels. Double-click to reset.
        </p>

        <ComponentPreview title="Splitter Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-lg">
            <div className="flex h-48 border border-border rounded-md bg-card overflow-hidden">
              <div
                style={{ width: `${size}%` }}
                className="h-full p-4 text-xs text-muted-foreground bg-muted/20 overflow-hidden shrink-0"
              >
                <strong className="text-foreground block mb-2">Navigation Tree</strong>
                <ul className="space-y-1 font-mono">
                  <li>▾ src</li>
                  <li className="pl-3">▸ components</li>
                  <li className="pl-3">▸ layout</li>
                </ul>
              </div>

              <Splitter size={size} onChange={setSize} orientation="vertical" minSize={20} maxSize={80} />

              <div
                style={{ width: `${100 - size}%` }}
                className="h-full p-4 text-xs text-muted-foreground flex flex-col justify-center items-center gap-2 overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">Editor Workspace</span>
                  <Badge variant="secondary">{Math.round(100 - size)}%</Badge>
                </div>
                <span>Drag splitter handle to resize panes</span>
                <Button variant="outline" size="xs" onClick={() => setSize(35)}>
                  Reset (35%)
                </Button>
              </div>
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
        <KeyboardShortcutsTable componentId="splitter" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'size', type: 'number', default: 'undefined', description: 'Controlled percentage width/height (0-100).' },
            { name: 'onChange', type: '(size: number) => void', default: 'undefined', description: 'Callback fired on drag with new percentage.' },
            { name: 'initialSize', type: 'number', default: '50', description: 'Initial size percentage for uncontrolled usage.' },
            { name: 'minSize', type: 'number', default: '0', description: 'Minimum allowed percentage bound.' },
            { name: 'maxSize', type: 'number', default: '100', description: 'Maximum allowed percentage bound.' },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Orientation of the divider.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
