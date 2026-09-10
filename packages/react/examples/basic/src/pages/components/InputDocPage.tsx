import React, { useState } from 'react';
import {
  Input,
  type InputSize,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  Checkbox,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function InputDocPage() {
  const [size, setSize] = useState<InputSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [passwordToggle, setPasswordToggle] = useState(true);
  const [value, setValue] = useState('user@chahu.dev');
  const [placeholder, setPlaceholder] = useState('Enter your email...');
  const [type, setType] = useState<'text' | 'password'>('text');

  const heroReactCode = `<div className="w-full max-w-sm flex flex-col gap-2">
  <Input
    type="${type}"
    size="${size}"
    placeholder="${placeholder}"
    value="${value}"
    disabled={${disabled}}
    invalid={${invalid}}
    clearable={${clearable}}
    passwordToggle={${passwordToggle}}
    onChange={(e) => setValue(e.target.value)}
  />
</div>`;

  const heroQtCode = `ChaSetInput {
    width: 280
    size: "${size}"
    type: "${type}"
    placeholderText: "${placeholder}"
    text: "${value}"
    disabled: ${disabled}
    invalid: ${invalid}
    clearable: ${clearable}
    passwordToggle: ${passwordToggle}
    onTextEdited: { /* handle text */ }
}`;

  return (
    <DocLayout
      category="Components"
      title="Input"
      description="Displays a form text input field or a component that looks like an input field."
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
          Explore interactive input behaviors, sizes, states, clearable action, password toggle, and responsive token styling across Web and Qt Desktop.
        </p>

        <ComponentPreview
          title="Input Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <Tabs value={size} onValueChange={(v) => setSize(v as InputSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Type Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Type:</span>
                <Tabs value={type} onValueChange={(v) => setType(v as 'text' | 'password')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="text" className="h-6 px-2.5 text-xs">Text</TabsTrigger>
                    <TabsTrigger value="password" className="h-6 px-2.5 text-xs">Password</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-4">
                <Checkbox
                  size="sm"
                  checked={disabled}
                  onCheckedChange={(val) => setDisabled(val)}
                  label="Disabled"
                />
                <Checkbox
                  size="sm"
                  checked={invalid}
                  onCheckedChange={(val) => setInvalid(val)}
                  label="Invalid"
                />
                <Checkbox
                  size="sm"
                  checked={clearable}
                  onCheckedChange={(val) => setClearable(val)}
                  label="Clearable"
                />
                {type === 'password' && (
                  <Checkbox
                    size="sm"
                    checked={passwordToggle}
                    onCheckedChange={(val) => setPasswordToggle(val)}
                    label="Password Toggle"
                  />
                )}
              </div>
            </div>
          }
        >
          <div className="w-full max-w-sm flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Email address</span>
              {value && <span className="text-[10px] font-mono opacity-70">{value.length} chars</span>}
            </div>
            <Input
              type={type}
              size={size}
              placeholder={placeholder}
              value={value}
              disabled={disabled}
              invalid={invalid}
              clearable={clearable}
              passwordToggle={passwordToggle}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              {invalid ? (
                <span className="text-destructive font-medium">Please enter a valid corporate email address.</span>
              ) : (
                'We will never share your email with anyone else.'
              )}
            </p>
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
          Import and render the Input component directly in your React JSX or Qt QML tree.
        </p>
        <CodeBlock
          code={`import { Input } from '@chahu/cha-set';

export function InputDemo() {
  return <Input type="email" placeholder="Email" clearable />;
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
          Visual matrix of common input configurations and states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Default Input</span>
            <span className="text-xs text-muted-foreground mb-2">Standard text input with placeholder</span>
            <Input placeholder="Enter username..." />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Small Size (sm)</span>
            <span className="text-xs text-muted-foreground mb-2">Compact height for tight toolbars</span>
            <Input size="sm" placeholder="Compact input..." />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Invalid / Error State</span>
            <span className="text-xs text-muted-foreground mb-2">Destructive highlight with error feedback</span>
            <Input invalid defaultValue="invalid-email@" placeholder="user@example.com" />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Clearable Field</span>
            <span className="text-xs text-muted-foreground mb-2">Clickable clear action or Escape key</span>
            <Input clearable defaultValue="Click cross to clear" />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Password with Toggle</span>
            <span className="text-xs text-muted-foreground mb-2">Interactive visibility eye button</span>
            <Input type="password" passwordToggle defaultValue="supersecret123" />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Disabled State</span>
            <span className="text-xs text-muted-foreground mb-2">Non-interactive with dimmed opacity</span>
            <Input disabled placeholder="Disabled field" value="preset value" />
          </div>
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
        <KeyboardShortcutsTable componentId="input" />
      </section>

      {/* 6. Props Reference */}
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
              description: 'The height and padding scale of the input.',
            },
            {
              name: 'type',
              type: 'string',
              default: "'text'",
              description: 'Standard HTML/Qt input type: "text" | "password" | "email" | "search" | "number".',
            },
            {
              name: 'placeholder',
              type: 'string',
              default: "''",
              description: 'Placeholder hint text displayed when input is empty.',
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
              description: 'Prevents editing value while keeping focusability.',
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: 'Applies destructive error styling and aria-invalid attribute.',
            },
            {
              name: 'clearable',
              type: 'boolean',
              default: 'false',
              description: 'Renders a clear button when text is present to wipe content.',
            },
            {
              name: 'passwordToggle',
              type: 'boolean',
              default: 'false',
              description: 'Renders an eye toggle button to reveal or mask passwords.',
            },
            {
              name: 'leftIcon',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Icon element rendered on the leading side of the input.',
            },
            {
              name: 'rightIcon',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Icon element rendered on the trailing side of the input.',
            },
            {
              name: 'onClear',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired when the clear button is clicked.',
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
              description: 'Additional CSS class names to apply to the input element.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
