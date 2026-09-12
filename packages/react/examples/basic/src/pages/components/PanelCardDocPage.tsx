import React from 'react';
import { PanelCard, Button, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function PanelCardDocPage() {
  const reactCode = `<PanelCard
  title="Inspector Panel"
  collapsible
  defaultCollapsed={false}
  actions={<Button variant="ghost" size="xs">Refresh</Button>}
>
  <p className="text-xs text-muted-foreground">
    Panel interior content with automated collapsible transitions.
  </p>
</PanelCard>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Panel Card"
      description="Card surface with integrated collapsible sections and header action slots for desktop sidebars and inspectors."
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
          Click the chevron icon or title to collapse and expand the card panel body.
        </p>

        <ComponentPreview title="Panel Card Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-md">
            <PanelCard
              title="Shader Pipeline Status"
              collapsible
              defaultCollapsed={false}
              actions={<Button variant="outline" size="xs">Recompile</Button>}
            >
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Vertex Shader:</span>
                  <span className="text-foreground font-mono">OK (12 stages)</span>
                </div>
                <div className="flex justify-between">
                  <span>Fragment Shader:</span>
                  <span className="text-foreground font-mono">OK (4 attachments)</span>
                </div>
                <div className="flex justify-between">
                  <span>WARP Driver:</span>
                  <span className="text-emerald-500 font-medium">DirectX 11 Active</span>
                </div>
              </div>
            </PanelCard>
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
        <KeyboardShortcutsTable componentId="panel-card" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'title', type: 'ReactNode', default: 'undefined', description: 'Panel header title text or element.' },
            { name: 'badgeText', type: 'string', default: 'undefined', description: 'Optional badge text displayed next to the title.' },
            { name: 'collapsible', type: 'boolean', default: 'false', description: 'Whether the panel content can be toggled collapsed.' },
            { name: 'collapsed', type: 'boolean', default: 'undefined', description: 'Controlled collapsed state.' },
            { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Initial collapsed state for uncontrolled mode.' },
            { name: 'onCollapsedChange', type: '(c: boolean) => void', default: 'undefined', description: 'Collapse change handler.' },
            { name: 'actions', type: 'ReactNode', default: 'undefined', description: 'Right-aligned header action elements.' },
            { name: 'size', type: "'default' | 'sm'", default: "'default'", description: 'Sizing scale of the card panel.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
