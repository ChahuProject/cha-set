import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function PopoverDocPage() {
  const reactCode = `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Dimensions</h4>
        <p className="text-xs text-muted-foreground">
          Set the dimensions for the layer.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-xs">Width</span>
          <Input defaultValue="100%" className="col-span-2 h-7 text-xs" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-xs">Height</span>
          <Input defaultValue="25px" className="col-span-2 h-7 text-xs" />
        </div>
      </div>
    </div>
  </PopoverContent>
</Popover>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Popover"
      description="Displays rich content in a floating portal anchored to a trigger, with accessible focus management."
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
          Click the button below to toggle the anchored popover card.
        </p>

        <ComponentPreview title="Popover Sandbox" reactCode={reactCode}>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none text-foreground text-sm">Dimensions</h4>
                  <p className="text-xs text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-xs text-muted-foreground">Width</span>
                    <Input defaultValue="100%" className="col-span-2 h-7 text-xs" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-xs text-muted-foreground">Height</span>
                    <Input defaultValue="25px" className="col-span-2 h-7 text-xs" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
        <KeyboardShortcutsTable componentId="popover" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Open state change handler.' },
            { name: 'modal', type: 'boolean', default: 'false', description: 'Whether the popover is rendered as modal.' },
            { name: 'sideOffset', type: 'number', default: '4', description: 'Offset distance from trigger.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
