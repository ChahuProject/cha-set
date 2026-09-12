import React, { useState } from 'react';
import { Switch, type SwitchSize, Checkbox, Tabs, TabsList, TabsTrigger, Card, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SwitchDocPage() {
  const [size, setSize] = useState<SwitchSize>('default');
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDesc, setShowDesc] = useState(true);

  const heroReactCode = `<Switch
  size="${size}"
  checked={${checked}}
  disabled={${disabled}}
  readOnly={${readOnly}}
  loading={${loading}}
  onCheckedChange={setChecked}
  label="Airplane Mode"
  ${showDesc ? 'description="Disable cellular, Wi-Fi, and Bluetooth radios."\n' : ''}/>`;

  const heroQtCode = `ChaSetSwitch {
    size: "${size}"
    checked: ${checked}
    disabled: ${disabled}
    readOnly: ${readOnly}
    loading: ${loading}
    label: "Airplane Mode"
    ${showDesc ? 'description: "Disable cellular, Wi-Fi, and Bluetooth radios."\n    ' : ''}onToggled: function(checked) {
        // handle toggle
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Switch"
      description="A control that allows the user to toggle between checked and not checked states, with support for async loading, read-only mode, and helper descriptions."
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
          Explore interactive switch behaviors, async loading, read-only states, descriptions, and sizes across Web and Qt Desktop.
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
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4">
                <Checkbox
                  size="sm"
                  checked={checked}
                  onCheckedChange={(val) => setChecked(val as boolean)}
                  label="Checked"
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
                  checked={loading}
                  onCheckedChange={(val) => setLoading(val as boolean)}
                  label="Loading"
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
          <div className="flex items-center justify-center p-6">
            <Switch
              size={size}
              checked={checked}
              disabled={disabled}
              readOnly={readOnly}
              loading={loading}
              onCheckedChange={setChecked}
              label="Airplane Mode"
              description={showDesc ? 'Disable cellular, Wi-Fi, and Bluetooth radios.' : undefined}
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
          Import and render Switch standalone or with companion labels and descriptions in your React JSX or Qt QML tree.
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
      description="Receive daily push updates on this device."
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
            <span className="text-xs font-medium text-foreground">Standard Toggle</span>
            <span className="text-xs text-muted-foreground">Standard track with smooth spring animation</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch defaultChecked={false} label="Off" />
              <Switch defaultChecked={true} label="On" />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Async Loading State</span>
            <span className="text-xs text-muted-foreground">Busy indicator while awaiting server confirmation</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch loading defaultChecked={false} label="Connecting..." />
              <Switch loading defaultChecked={true} label="Syncing..." />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">With Helper Description</span>
            <span className="text-xs text-muted-foreground">Multi-line title and descriptive subtext</span>
            <div className="pt-2">
              <Switch
                defaultChecked={true}
                label="Automatic cloud synchronization"
                description="Upload changes in real time when network is available."
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Disabled & Read-Only States</span>
            <span className="text-xs text-muted-foreground">Dimmed non-interactive vs locked presentation</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch disabled defaultChecked={false} label="Disabled Off" />
              <Switch readOnly defaultChecked={true} label="Read-only On" />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Size Variants</span>
            <span className="text-xs text-muted-foreground">Default size vs compact toolbar density</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch size="default" defaultChecked={true} label="Default size" />
              <Switch size="sm" defaultChecked={true} label="Small size (sm)" />
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
        <KeyboardShortcutsTable componentId="switch" />
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
              description: 'The size scale of the switch track and thumb.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true, prevents user interaction and applies muted opacity.',
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: 'Prevents toggling state while retaining focusability and full opacity.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: 'Renders an active spinner inside the thumb and blocks interaction.',
            },
            {
              name: 'label',
              type: 'React.ReactNode',
              default: '—',
              description: 'Optional companion label rendered alongside the switch track.',
            },
            {
              name: 'description',
              type: 'React.ReactNode',
              default: '—',
              description: 'Optional helper text rendered below the label.',
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
