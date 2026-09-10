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
  const [optional, setOptional] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const heroReactCode = `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label
    htmlFor="email"
    size="${size}"${disabled ? ' disabled' : ''}${required ? ' required' : ''}${optional ? ' optional' : ''}${invalid ? ' invalid' : ''}
  >
    Email address
  </Label>
  <Input
    type="email"
    id="email"
    placeholder="name@example.com"
    size="${size}"${disabled ? ' disabled' : ''}${invalid ? ' invalid' : ''}
  />
</div>`;

  const heroQtCode = `Column {
    spacing: 6
    width: 260

    ChaSetLabel {
        text: "Email address"
        size: "${size}"
        disabled: ${disabled}
        required: ${required}
        optional: ${optional}
        invalid: ${invalid}
    }

    ChaSetInput {
        width: parent.width
        placeholder: "name@example.com"
        size: "${size}"
        disabled: ${disabled}
        invalid: ${invalid}
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
          Adjust size, required markers, optional indicators, validation states, and disabled appearance in real time.
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

              <Checkbox
                size="sm"
                label="Disabled"
                checked={disabled}
                onCheckedChange={(v) => setDisabled(v)}
              />

              <Checkbox
                size="sm"
                label="Required"
                checked={required}
                onCheckedChange={(v) => setRequired(v)}
              />

              <Checkbox
                size="sm"
                label="Optional"
                checked={optional}
                onCheckedChange={(v) => setOptional(v)}
              />

              <Checkbox
                size="sm"
                label="Invalid"
                checked={invalid}
                onCheckedChange={(v) => setInvalid(v)}
              />
            </div>
          }
        >
          <div className="grid w-full max-w-sm items-center gap-2 p-4">
            <Label
              htmlFor="sandbox-email"
              size={size}
              disabled={disabled}
              required={required}
              optional={optional}
              invalid={invalid}
            >
              Email address
            </Label>
            <Input
              type="email"
              id="sandbox-email"
              placeholder="name@example.com"
              size={size}
              disabled={disabled}
              invalid={invalid}
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
          Choose between standard text size and compact high-density size for toolbars or dense forms.
        </p>
        <Card className="p-6">
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">Default:</span>
              <Label size="default">Default Label</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">Small (sm):</span>
              <Label size="sm">Small Label</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          States & Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual matrix of label states including required asterisk, optional tag, validation error, helper description, and tooltips.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">Required Indicator</span>
              <span className="text-xs text-muted-foreground">Destructive asterisk denoting mandatory input fields</span>
              <div className="pt-2">
                <Label required>Work Email</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">Optional Indicator</span>
              <span className="text-xs text-muted-foreground">Muted tag denoting non-mandatory optional fields</span>
              <div className="pt-2">
                <Label optional>Alternative Phone</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">Validation Error (Invalid)</span>
              <span className="text-xs text-muted-foreground">Destructive text color highlighting a field with validation errors</span>
              <div className="pt-2">
                <Label invalid>Account Password</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">With Info Tooltip</span>
              <span className="text-xs text-muted-foreground">Help icon with contextual explanation on hover</span>
              <div className="pt-2">
                <Label tooltip="Used for two-factor authentication recovery codes">Recovery Email</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">With Helper Description</span>
              <span className="text-xs text-muted-foreground">Supporting guidance subtitle directly below the label</span>
              <div className="pt-2">
                <Label description="Enter your company legal name as registered with tax authorities">
                  Legal Entity Name
                </Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">Disabled State</span>
              <span className="text-xs text-muted-foreground">Dimmed opacity for non-interactive form elements</span>
              <div className="pt-2">
                <Label disabled>Archived Record ID</Label>
              </div>
            </div>
          </Card>
        </div>
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
              description: 'Text size variant (default or compact sm).',
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
              name: 'optional',
              type: 'boolean',
              default: 'false',
              description: 'Displays a muted optional text indicator.',
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: 'Displays destructive text color indicating validation error.',
            },
            {
              name: 'description',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Supporting helper text rendered beneath the label.',
            },
            {
              name: 'tooltip',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Contextual help tooltip text or node displayed with info icon.',
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
