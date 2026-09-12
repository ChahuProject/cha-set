import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, Card, CodeBlock } from '@chahu/cha-set';
import { Checkbox, type CheckboxSize } from '../../../../../src/checkbox';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function CheckboxDocPage() {
  const [size, setSize] = useState<CheckboxSize>('default');
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [showDesc, setShowDesc] = useState(true);
  const [label, setLabel] = useState('Accept terms and conditions');
  const descriptionText = showDesc ? 'You agree to the automated billing policy and privacy guidelines.' : undefined;

  const heroReactCode = `<Checkbox
  size="${size}"
  checked={${indeterminate ? 'false' : checked}}
  indeterminate={${indeterminate}}
  disabled={${disabled}}
  readOnly={${readOnly}}
  invalid={${invalid}}
  label="${label}"
  ${descriptionText ? `description="${descriptionText}"\n  ` : ''}onCheckedChange={(val) => setChecked(val)}
/>`;

  const heroQtCode = `ChaSetCheckbox {
    size: "${size}"
    checked: ${indeterminate ? 'false' : checked}
    indeterminate: ${indeterminate}
    disabled: ${disabled}
    readOnly: ${readOnly}
    invalid: ${invalid}
    label: "${label}"
    ${descriptionText ? `description: "${descriptionText}"\n    ` : ''}onToggled: (val) => { /* handle toggle */ }
}`;

  return (
    <DocLayout
      category="Components"
      title="Checkbox"
      description="A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, helper descriptions, and companion labels."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'states', title: 'Examples & States' },
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
          Test interactive checkbox toggling, indeterminate states, helper descriptions, error states, and sizes across Web and Qt Desktop.
        </p>

        <ComponentPreview
          title="Checkbox Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <Tabs value={size} onValueChange={(v) => setSize(v as CheckboxSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4">
                <Checkbox
                  size="sm"
                  checked={checked && !indeterminate}
                  onCheckedChange={(val) => {
                    setChecked(val as boolean);
                    if (indeterminate) setIndeterminate(false);
                  }}
                  label="Checked"
                />

                <Checkbox
                  size="sm"
                  checked={indeterminate}
                  onCheckedChange={(val) => setIndeterminate(val as boolean)}
                  label="Indeterminate"
                />

                <Checkbox
                  size="sm"
                  checked={disabled}
                  onCheckedChange={(val) => setDisabled(val as boolean)}
                  label="Disabled"
                />

                <Checkbox
                  size="sm"
                  checked={readOnly}
                  onCheckedChange={(val) => setReadOnly(val as boolean)}
                  label="Read-Only"
                />

                <Checkbox
                  size="sm"
                  checked={invalid}
                  onCheckedChange={(val) => setInvalid(val as boolean)}
                  label="Invalid"
                />

                <Checkbox
                  size="sm"
                  checked={showDesc}
                  onCheckedChange={(val) => setShowDesc(val as boolean)}
                  label="Description"
                />
              </div>
            </div>
          }
        >
          <div className="py-6 flex items-center justify-center">
            <Checkbox
              size={size}
              checked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              label={label}
              description={descriptionText}
              onCheckedChange={(next) => {
                if (indeterminate) setIndeterminate(false);
                setChecked(next as boolean);
              }}
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

      {/* 3. Anatomy */}
      <section id="anatomy" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Anatomy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Render Checkbox standalone or with companion labels and descriptions in React JSX or Qt QML trees.
        </p>
        <CodeBlock
          code={`import { Checkbox } from '@chahu/cha-set';

export function CheckboxDemo() {
  const [agree, setAgree] = React.useState(false);

  return (
    <Checkbox
      checked={agree}
      onCheckedChange={setAgree}
      label="Service agreement"
      description="I agree to the service agreement and terms of use."
    />
  );
}`}
          language="tsx"
        />
      </section>

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual matrix of common checkbox configurations, sizes, descriptions, and states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">Unchecked & Checked</span>
            <span className="text-xs text-muted-foreground mb-2">Standard interactive states</span>
            <div className="flex flex-col gap-3">
              <Checkbox defaultChecked={false} label="Unchecked by default" />
              <Checkbox defaultChecked={true} label="Checked by default" />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">Indeterminate State</span>
            <span className="text-xs text-muted-foreground mb-2">Represents partially selected sub-options</span>
            <div className="flex flex-col gap-3">
              <Checkbox indeterminate label="Select all sub-tasks" />
              <div className="pl-6 flex flex-col gap-2">
                <Checkbox defaultChecked label="Task 1: Requirements" size="sm" />
                <Checkbox defaultChecked={false} label="Task 2: Implementation" size="sm" />
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">With Helper Description</span>
            <span className="text-xs text-muted-foreground mb-2">Detailed multi-line label and subtext</span>
            <div className="flex flex-col gap-3">
              <Checkbox
                defaultChecked
                label="Automatic background syncing"
                description="Sync data with remote servers every 5 minutes when idle."
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">Invalid / Error State</span>
            <span className="text-xs text-muted-foreground mb-2">Highlights unchecked required confirmation</span>
            <div className="flex flex-col gap-3">
              <Checkbox
                invalid
                defaultChecked={false}
                label="Mandatory compliance confirmation"
                description="Must be accepted before proceeding with setup."
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">Disabled & Read-Only States</span>
            <span className="text-xs text-muted-foreground mb-2">Dimmed non-interactive vs locked presentation</span>
            <div className="flex flex-col gap-3">
              <Checkbox disabled defaultChecked={false} label="Disabled unchecked" />
              <Checkbox readOnly defaultChecked={true} label="Read-only checked" />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">Size Variants</span>
            <span className="text-xs text-muted-foreground mb-2">Default vs Compact size</span>
            <div className="flex flex-col gap-3">
              <Checkbox size="default" defaultChecked label="Default size (text-sm)" />
              <Checkbox size="sm" defaultChecked label="Small size (sm, text-xs)" />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Keyboard Navigation */}
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="checkbox" />
      </section>

      {/* 6. Props Reference */}
      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'checked',
              type: 'boolean',
              default: 'false',
              description: 'The controlled checked state of the checkbox.',
            },
            {
              name: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description: 'The default checked state when uncontrolled.',
            },
            {
              name: 'indeterminate',
              type: 'boolean',
              default: 'false',
              description: 'Whether the checkbox is in an indeterminate state (takes visual precedence over checked).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables user interactions and applies 50% opacity.',
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: 'Prevents toggling state while retaining focusability and full opacity.',
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: 'Applies destructive error styling and aria-invalid attribute.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'The size variant: default or sm.',
            },
            {
              name: 'label',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional companion label rendered alongside the checkbox.',
            },
            {
              name: 'description',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional helper text rendered below the label.',
            },
            {
              name: 'onCheckedChange',
              type: '(checked: boolean) => void',
              default: 'undefined',
              description: 'Callback invoked when checked state changes.',
            },
            {
              name: 'forceHover',
              type: 'boolean',
              default: 'false',
              description: 'Visual testing aid to force hover state styles.',
            },
            {
              name: 'forceFocus',
              type: 'boolean',
              default: 'false',
              description: 'Visual testing aid to force focus ring styles.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS class names to apply to the checkbox button.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
