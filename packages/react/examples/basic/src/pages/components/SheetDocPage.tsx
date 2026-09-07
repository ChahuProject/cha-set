import React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
  Input,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function SheetDocPage() {
  const reactCode = `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Side Drawer</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right text-xs">Name</span>
        <Input defaultValue="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right text-xs">Username</span>
        <Input defaultValue="@peduarte" className="col-span-3" />
      </div>
    </div>
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
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the trigger below to open a side drawer sliding in from the right edge.
        </p>

        <ComponentPreview title="Sheet Sandbox" reactCode={reactCode}>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Side Drawer</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-xs text-muted-foreground">Name</span>
                  <Input defaultValue="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-xs text-muted-foreground">Username</span>
                  <Input defaultValue="@peduarte" className="col-span-3" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
            { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: 'Edge of the viewport that the drawer slides in from.' },
            { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Callback fired when open state changes.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
