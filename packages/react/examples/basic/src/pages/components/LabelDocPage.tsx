import React, { useState } from 'react';
import {
  Label,
  type LabelSize,
  Input,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function LabelDocPage() {
  const [size, setSize] = useState<LabelSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);

  const heroReactCode = `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email" size="${size}"${disabled ? ' disabled' : ''}${required ? ' required' : ''}>
    Email address
  </Label>
  <Input type="email" id="email" placeholder="name@example.com" size="${size}"${disabled ? ' disabled' : ''} />
</div>`;

  const heroQtCode = `Column {
    spacing: 6
    width: 260

    ChaSetLabel {
        text: "Email address"
        size: "${size}"
        disabled: ${disabled}
        required: ${required}
    }

    ChaSetInput {
        width: parent.width
        placeholder: "name@example.com"
        size: "${size}"
        disabled: ${disabled}
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Label"
      description="Renders an accessible label associated with form controls."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'sizes', title: 'Sizes' },
        { id: 'states', title: 'States' },
        { id: 'form-control', title: 'Form Association' },
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
          Adjust size, disabled, and required properties in real time with synchronized preview.
        </p>

        <ComponentPreview
          title="Label Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Size:</span>
                <Tabs value={size} onValueChange={(s) => setSize(s as LabelSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
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

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Required:</span>
                <Tabs value={required ? 'true' : 'false'} onValueChange={(v) => setRequired(v === 'true')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="false" className="h-6 px-2.5 text-xs">False</TabsTrigger>
                    <TabsTrigger value="true" className="h-6 px-2.5 text-xs">True</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          }
        >
          <div className="grid w-full max-w-sm items-center gap-2 p-4">
            <Label htmlFor="sandbox-email" size={size} disabled={disabled} required={required}>
              Email address
            </Label>
            <Input
              type="email"
              id="sandbox-email"
              placeholder="name@example.com"
              size={size}
              disabled={disabled}
            />
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

      {/* 3. Sizes */}
      <section id="sizes" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Sizes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose between standard text size (14px) and compact high-density size (12px).
        </p>
        <Card className="p-6">
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center gap-4">
              <span className="w-20 text-xs text-muted-foreground">Default:</span>
              <Label size="default">Default Label (14px)</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-xs text-muted-foreground">Small (sm):</span>
              <Label size="sm">Small Label (12px)</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Standard visual states for label including required marker and disabled appearance.
        </p>
        <Card className="p-6">
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">Standard:</span>
              <Label>Project Name</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">Required:</span>
              <Label required>Required Field</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">Disabled:</span>
              <Label disabled>Disabled Field</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. Form Association */}
      <section id="form-control" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Form Association
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Clicking the label activates or toggles the linked input element via <code>htmlFor</code>.
        </p>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base">Terms and Conditions</CardTitle>
            <CardDescription>Click the text below to toggle the checkbox</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="cursor-pointer">
                I accept the terms and conditions
              </Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Props Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="label" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'Text size variant (default = 14px, sm = 12px).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the label is displayed in a disabled dimmed state.',
            },
            {
              name: 'required',
              type: 'boolean',
              default: 'false',
              description: 'Displays a destructive colored asterisk marker.',
            },
            {
              name: 'htmlFor',
              type: 'string',
              default: 'undefined',
              description: 'ID of the form element the label is bound to.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional custom CSS classes.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
