import React, { useState } from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, Button, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function AlertDialogDocPage() {
  const [deleted, setDeleted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [closeOnOverlay, setCloseOnOverlay] = useState(false);

  const reactCode = `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent size="${selectedSize}" closeOnOverlayClick={${closeOnOverlay}}>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={() => handleDelete()}>
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Alert Dialog"
      description="A modal dialog that interrupts the user with important content and requires confirmation."
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
          Click the destructive button below to trigger the confirmation modal. You can toggle size presets and overlay click behavior.
        </p>

        <ComponentPreview title="Alert Dialog Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium text-muted-foreground">Size:</span>
              {(['sm', 'default', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {s}
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
                <span>Close on overlay click</span>
              </label>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size={selectedSize} closeOnOverlayClick={closeOnOverlay}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => setDeleted(true)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {deleted && (
              <span className="text-xs text-destructive font-medium">
                Action confirmed! Account deletion dispatched.
              </span>
            )}
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
        <KeyboardShortcutsTable componentId="alert-dialog" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Callback fired when open state changes.' },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state for uncontrolled usage.' },
            { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Preset maximum width container sizing for AlertDialogContent.' },
            { name: 'closeOnOverlayClick', type: 'boolean', default: 'false', description: 'Whether clicking the backdrop overlay automatically dismisses the dialog.' },
            { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'", description: 'Button variant styling for AlertDialogAction.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
