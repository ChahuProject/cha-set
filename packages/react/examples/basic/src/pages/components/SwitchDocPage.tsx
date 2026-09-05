import React, { useState } from 'react';
import {
  Switch,
  type SwitchSize,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function SwitchDocPage() {
  const [size, setSize] = useState<SwitchSize>('default');
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const heroReactCode = `<Switch
  size="${size}"
  checked={${checked}}
  disabled={${disabled}}
  onCheckedChange={setChecked}
  label="Airplane Mode"
/>`;

  const heroQtCode = `ChaSetSwitch {
    size: "${size}"
    checked: ${checked}
    disabled: ${disabled}
    label: "Airplane Mode"
    onToggled: function(checked) {
        // handle toggle
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Switch"
      description="A control that allows the user to toggle between checked and not checked states."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'states', title: 'Examples & States' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Explore interactive switch behaviors, sizes, states, and responsive token styling across Web and Qt Desktop.
        </p>

        <ComponentPreview
          title="Switch Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <Tabs value={size} onValueChange={(v) => setSize(v as SwitchSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default (36x20)</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (28x16)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Checked Toggle */}
              <Checkbox
                size="sm"
                checked={checked}
                onCheckedChange={(val) => setChecked(val)}
                label="Checked"
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
          <div className="flex items-center justify-center p-6">
            <Switch
              size={size}
              checked={checked}
              disabled={disabled}
              onCheckedChange={setChecked}
              label="Airplane Mode"
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
          Import and render Switch standalone or with a companion label in your React JSX or Qt QML tree.
        </p>
        <CodeBlock
          code={`import { Switch } from '@chahu/cha-set';

export function SwitchDemo() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <Switch
      checked={enabled}
      onCheckedChange={setEnabled}
      label="Enable Notifications"
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
          Visual matrix of common switch configurations and interactive states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Default Toggle</span>
            <span className="text-xs text-muted-foreground">Standard 36x20 track with smooth spring animation</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch defaultChecked={false} label="Off" />
              <Switch defaultChecked={true} label="On" />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Small Size (sm)</span>
            <span className="text-xs text-muted-foreground">Compact 28x16 track for dense table rows or toolbars</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch size="sm" defaultChecked={false} label="Compact Off" />
              <Switch size="sm" defaultChecked={true} label="Compact On" />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Disabled States</span>
            <span className="text-xs text-muted-foreground">Non-interactive with 50% opacity for locked settings</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch disabled defaultChecked={false} label="Disabled Off" />
              <Switch disabled defaultChecked={true} label="Disabled On" />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Companion Label Association</span>
            <span className="text-xs text-muted-foreground">Clicking either label or track toggles the switch</span>
            <div className="flex items-center gap-4 pt-2">
              <Switch defaultChecked={true} label="Sync data across devices" />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
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
              description: 'The controlled checked state of the switch.',
            },
            {
              name: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description: 'The default checked state for uncontrolled usage.',
            },
            {
              name: 'onCheckedChange',
              type: '(checked: boolean) => void',
              default: '—',
              description: 'Event handler called when the checked state changes.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'The size scale of the switch track and thumb (default: 36x20, sm: 28x16).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true, prevents user interaction and applies muted opacity.',
            },
            {
              name: 'label',
              type: 'React.ReactNode',
              default: '—',
              description: 'Optional companion label rendered alongside the switch track.',
            },
            {
              name: 'forceHover',
              type: 'boolean',
              default: 'false',
              description: 'Visual testing aid to programmatically force hover styling.',
            },
            {
              name: 'forceFocus',
              type: 'boolean',
              default: 'false',
              description: 'Visual testing aid to programmatically force focus ring styling.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS class names to apply to the switch track element.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
