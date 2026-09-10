import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Button,
  Input,
  type SheetSide,
  type SheetSize,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SheetDocPage() {
  const [side, setSide] = useState<SheetSide>('right');
  const [size, setSize] = useState<SheetSize>('default');
  const [closeOnOverlay, setCloseOnOverlay] = useState(true);

  const reactCode = `<Sheet closeOnOverlayClick={${closeOnOverlay}}>
  <SheetTrigger asChild>
    <Button variant="outline">Open ${side} Drawer</Button>
  </SheetTrigger>
  <SheetContent side="${side}" size="${size}">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4 px-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right text-xs text-muted-foreground">Name</span>
        <Input defaultValue="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right text-xs text-muted-foreground">Username</span>
        <Input defaultValue="@peduarte" className="col-span-3" />
      </div>
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="default">Save changes</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Sheet"
      description="Extends the dialog component to display content that slides in from any screen edge (top, right, bottom, left)."
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
          Choose a slide edge and size preset, then trigger the drawer modal.
        </p>

        <ComponentPreview title="Sheet Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="font-medium text-muted-foreground">Side:</span>
              {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize ${
                    side === s
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              ))}

              <span className="mx-2 text-border">|</span>

              <span className="font-medium text-muted-foreground">Size:</span>
              {(['sm', 'default', 'lg', 'xl', 'full'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSize(sz)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    size === sz
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {sz}
                </button>
              ))}

              <span className="mx-2 text-border">|</span>

              <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={closeOnOverlay}
                  onChange={(e) => setCloseOnOverlay(e.target.checked)}
                  className="rounded"
                />
                <span>Close on overlay</span>
              </label>
            </div>

            <Sheet closeOnOverlayClick={closeOnOverlay}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  Open {side} Drawer ({size})
                </Button>
              </SheetTrigger>
              <SheetContent side={side} size={size}>
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4 px-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right text-xs text-muted-foreground">Name</span>
                    <Input defaultValue="Pedro Duarte" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right text-xs text-muted-foreground">Username</span>
                    <Input defaultValue="@peduarte" className="col-span-3" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="default">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
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
        <KeyboardShortcutsTable componentId="sheet" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state for uncontrolled usage.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Callback fired when open state changes.' },
            { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: 'Edge of the viewport that the drawer slides in from.' },
            { name: 'size', type: "'sm' | 'default' | 'lg' | 'xl' | 'full'", default: "'default'", description: 'Preset drawer dimension sizing (width for left/right, height for top/bottom).' },
            { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Whether the top-right close icon button is rendered inside the drawer.' },
            { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: 'Whether clicking the backdrop automatically dismisses the sheet.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
