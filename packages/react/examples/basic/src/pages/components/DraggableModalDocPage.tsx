import React, { useState } from 'react';
import { DraggableModal, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function DraggableModalDocPage() {
  const [open, setOpen] = useState(false);

  const reactCode = `<DraggableModal
  open={open}
  onClose={() => setOpen(false)}
  title="Floating Diagnostic Tool"
  defaultPosition={{ x: 100, y: 100 }}
>
  <div className="p-4 text-xs text-muted-foreground">
    Drag the title bar to move this floating window anywhere.
  </div>
</DraggableModal>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Draggable Modal"
      description="Desktop floating window with dragging title bar and bound viewport constraints."
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
          Open the draggable modal and drag it around your viewport.
        </p>

        <ComponentPreview title="Draggable Modal Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <Button variant="outline" onClick={() => setOpen(true)}>
              Open Floating Diagnostic Window
            </Button>

            <DraggableModal
              open={open}
              onClose={() => setOpen(false)}
              title="Memory Inspector"
              defaultPosition={{ x: 120, y: 120 }}
            >
              <div className="space-y-3 p-4 text-xs text-muted-foreground">
                <p>
                  This window can be dragged by its header title bar.
                </p>
                <div className="flex justify-between border-t border-border/50 pt-2 font-mono">
                  <span>Heap Used:</span>
                  <span className="text-foreground">42.8 MB</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Textures:</span>
                  <span className="text-foreground">128 alloc</span>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DraggableModal>
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
            { name: 'open', type: 'boolean', default: 'false', description: 'Whether the modal is visible.' },
            { name: 'onClose', type: '() => void', default: 'undefined', description: 'Close event callback.' },
            { name: 'title', type: 'ReactNode', default: 'undefined', description: 'Header bar title content.' },
            { name: 'defaultPosition', type: '{ x: number, y: number }', default: '{ x: 100, y: 100 }', description: 'Initial screen coordinate offset.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
