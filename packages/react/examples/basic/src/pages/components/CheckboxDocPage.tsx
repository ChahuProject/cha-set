import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
} from '@chahu/cha-set';
import { Checkbox, type CheckboxSize } from '../../../../../src/checkbox';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function CheckboxDocPage() {
  const [size, setSize] = useState<CheckboxSize>('default');
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState('Accept terms and conditions');

  const heroReactCode = `<Checkbox
  size="${size}"
  checked={${indeterminate ? 'false' : checked}}
  indeterminate={${indeterminate}}
  disabled={${disabled}}
  label="${label}"
  onCheckedChange={(val) => setChecked(val)}
/>`;

  const heroQtCode = `ChaSetCheckbox {
    size: "${size}"
    checked: ${indeterminate ? 'false' : checked}
    indeterminate: ${indeterminate}
    disabled: ${disabled}
    label: "${label}"
    onToggled: (val) => { /* handle toggle */ }
}`;

  return (
    <DocLayout
      category="Components"
      title="Checkbox"
      description="A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, and companion labels."
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
          Test interactive checkbox toggling, indeterminate states, companion labels, and sizes across Web and Qt Desktop.
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
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default (16px)</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (14px)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Checked Toggle */}
              <Checkbox
                size="sm"
                checked={checked && !indeterminate}
                onCheckedChange={(val) => {
                  setChecked(val);
                  if (indeterminate) setIndeterminate(false);
                }}
                label="Checked"
              />

              {/* Indeterminate Toggle */}
              <Checkbox
                size="sm"
                checked={indeterminate}
                onCheckedChange={(val) => setIndeterminate(val)}
                label="Indeterminate"
              />

              {/* Disabled Toggle */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label="Disabled"
              />
            </div>
          }
        >
          <div className="py-6 flex items-center justify-center">
            <Checkbox
              size={size}
              checked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              label={label}
              onCheckedChange={(next) => {
                if (indeterminate) setIndeterminate(false);
                setChecked(next);
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
          Render Checkbox standalone or with a companion label in React JSX or Qt QML trees.
        </p>
        <CodeBlock
          code={`import { Checkbox } from '@chahu/cha-set';

export function CheckboxDemo() {
  const [agree, setAgree] = React.useState(false);

  return (
    <Checkbox
      checked={agree}
      onCheckedChange={setAgree}
      label="I agree to the service agreement and privacy policy"
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
          Visual matrix of common checkbox configurations, sizes, and states.
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
            <span className="text-xs font-semibold text-foreground">Disabled States</span>
            <span className="text-xs text-muted-foreground mb-2">Non-interactive with 50% opacity</span>
            <div className="flex flex-col gap-3">
              <Checkbox disabled defaultChecked={false} label="Disabled unchecked" />
              <Checkbox disabled defaultChecked={true} label="Disabled checked" />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">Size Variants</span>
            <span className="text-xs text-muted-foreground mb-2">Default 16px vs Compact 14px size</span>
            <div className="flex flex-col gap-3">
              <Checkbox size="default" defaultChecked label="Default size (16px box, text-sm)" />
              <Checkbox size="sm" defaultChecked label="Small size (14px box, text-xs)" />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="checkbox" />
      </section>

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
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'The size variant: default (16px box) or sm (14px box).',
            },
            {
              name: 'label',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional companion label rendered alongside the checkbox.',
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
