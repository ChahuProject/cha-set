import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  type CollapsibleVariant,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function CollapsibleDocPage() {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [variant, setVariant] = useState<CollapsibleVariant>('default');

  const heroReactCode = `<Collapsible open={${open}} onOpenChange={setOpen} variant="${variant}"${disabled ? ' disabled' : ''}>
  <div className="flex items-center justify-between space-x-4 px-4 py-2 border rounded-md">
    <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" size="sm" className="w-9 p-0"${disabled ? ' disabled' : ''}>
        <span className="text-xs">▼</span>
      </Button>
    </CollapsibleTrigger>
  </div>
  <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm mt-2">
    @radix-ui/primitives
  </div>
  <CollapsibleContent className="space-y-2 mt-2">
    <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
      @radix-ui/colors
    </div>
    <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
      @stitches/react
    </div>
  </CollapsibleContent>
</Collapsible>`;

  const heroQtCode = `ChaSetCollapsible {
    width: 320
    title: "@peduarte starred 3 repositories"
    open: ${open}
    disabled: ${disabled}

    Column {
        width: parent.width
        spacing: 8
        topPadding: 8

        Rectangle {
            width: parent.width
            height: 36
            radius: 6
            color: ThemeTokens.panel
            border.color: ThemeTokens.border

            Text {
                anchors.centerIn: parent
                text: "@radix-ui/colors"
                color: ThemeTokens.text
                font.pixelSize: 13
            }
        }

        Rectangle {
            width: parent.width
            height: 36
            radius: 6
            color: ThemeTokens.panel
            border.color: ThemeTokens.border

            Text {
                anchors.centerIn: parent
                text: "@stitches/react"
                color: ThemeTokens.text
                font.pixelSize: 13
            }
        }
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Collapsible"
      description="An interactive component which expands and collapses a panel of content."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'default-open', title: 'Default Open' },
        { id: 'disabled', title: 'Disabled State' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Toggle the collapsible open/closed state or disable user interaction with live controls.
        </p>

        <ComponentPreview
          title="Collapsible Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">State:</span>
                <Tabs value={open ? 'true' : 'false'} onValueChange={(v) => setOpen(v === 'true')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="false" className="h-6 px-2.5 text-xs">Collapsed</TabsTrigger>
                    <TabsTrigger value="true" className="h-6 px-2.5 text-xs">Expanded</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Variant:</span>
                <Tabs value={variant} onValueChange={(v) => setVariant(v as CollapsibleVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="card" className="h-6 px-2.5 text-xs">Card</TabsTrigger>
                    <TabsTrigger value="ghost" className="h-6 px-2.5 text-xs">Ghost</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Disabled:</span>
                <Tabs value={disabled ? 'true' : 'false'} onValueChange={(v) => setDisabled(v === 'true')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="false" className="h-6 px-2.5 text-xs">False</TabsTrigger>
                    <TabsTrigger value="true" className="h-6 px-2.5 text-xs">True</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          }
        >
          <div className="w-full max-w-sm p-4">
            <Collapsible open={open} onOpenChange={setOpen} disabled={disabled} variant={variant}>
              <div className="flex items-center justify-between space-x-4 px-4 py-2 border border-border rounded-md bg-card">
                <h4 className="text-sm font-semibold text-foreground">
                  @peduarte starred 3 repositories
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0" disabled={disabled}>
                    <span className={`text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <div className="rounded-md border border-border px-4 py-2 font-mono text-sm mt-2 bg-muted/40">
                @radix-ui/primitives
              </div>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="rounded-md border border-border px-4 py-2 font-mono text-sm bg-muted/40">
                  @radix-ui/colors
                </div>
                <div className="rounded-md border border-border px-4 py-2 font-mono text-sm bg-muted/40">
                  @stitches/react
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 3. Default Open */}
      <section id="default-open" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Default Open
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Render an uncontrolled collapsible with initial expanded state via <code>defaultOpen</code>.
        </p>
        <Card className="p-6">
          <CardContent className="space-y-4 p-0 max-w-sm">
            <Collapsible defaultOpen>
              <div className="flex items-center justify-between border px-4 py-2 rounded-md bg-card">
                <span className="text-sm font-medium">Advanced Project Settings</span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <span className="text-xs">▼</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="border rounded-md p-3 text-xs text-muted-foreground">
                  Build flags: --release --target=x86_64-pc-windows-msvc
                </div>
                <div className="border rounded-md p-3 text-xs text-muted-foreground">
                  Render pipeline: Vulkan 1.3 / D3D12 Ultimate
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </section>

      {/* 4. Disabled State */}
      <section id="disabled" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Disabled State
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Disables trigger interaction and dims opacity to prevent user expansion.
        </p>
        <Card className="p-6">
          <CardContent className="space-y-4 p-0 max-w-sm">
            <Collapsible disabled>
              <div className="flex items-center justify-between border px-4 py-2 rounded-md opacity-50 bg-card">
                <span className="text-sm font-medium">Locked Premium Settings</span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0" disabled>
                    <span className="text-xs">🔒</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </Collapsible>
          </CardContent>
        </Card>
      </section>

      {/* 5. Props Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="collapsible" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <h3 className="text-base font-medium text-foreground mb-2">Collapsible</h3>
        <PropsTable
          props={[
            {
              name: 'open',
              type: 'boolean',
              default: 'undefined',
              description: 'Controlled open state of the collapsible panel.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description: 'Initial open state for uncontrolled usage.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              default: 'undefined',
              description: 'Callback invoked when open state changes.',
            },
            {
              name: 'variant',
              type: "'default' | 'card' | 'ghost'",
              default: "'default'",
              description: 'Visual container styling variant.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether user interaction is disabled.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional custom CSS classes.',
            },
          ]}
        />

        <h3 className="text-base font-medium text-foreground mt-6 mb-2">CollapsibleTrigger</h3>
        <PropsTable
          props={[
            {
              name: 'asChild',
              type: 'boolean',
              default: 'false',
              description: 'Merges trigger props onto its immediate child element.',
            },
            {
              name: 'render',
              type: 'ReactElement | ((props, state) => ReactElement)',
              default: 'undefined',
              description: 'Custom element or render function to replace default button.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional custom CSS classes.',
            },
          ]}
        />

        <h3 className="text-base font-medium text-foreground mt-6 mb-2">CollapsibleContent</h3>
        <PropsTable
          props={[
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional custom CSS classes for the expandable container.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
