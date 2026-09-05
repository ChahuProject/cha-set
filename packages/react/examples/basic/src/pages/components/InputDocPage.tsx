import React, { useState } from 'react';
import {
  Input,
  type InputSize,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function InputDocPage() {
  const [size, setSize] = useState<InputSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState('Enter your email...');
  const [type, setType] = useState<'text' | 'password'>('text');

  const heroReactCode = `<div className="w-full max-w-sm flex flex-col gap-2">
  <Input
    type="${type}"
    size="${size}"
    placeholder="${placeholder}"
    value="${value}"
    disabled={${disabled}}
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
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Explore interactive input behaviors, sizes, states, and responsive token styling across Web and Qt Desktop.
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
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default (36px)</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (32px)</TabsTrigger>
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

              {/* Disabled Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary size-3.5 cursor-pointer"
                />
                <span className="text-muted-foreground">Disabled</span>
              </label>
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
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              We will never share your email with anyone else.
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
  return <Input type="email" placeholder="Email" />;
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
            <span className="text-xs text-muted-foreground mb-2">Compact 32px height for tight toolbars</span>
            <Input size="sm" placeholder="Compact input..." />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Disabled State</span>
            <span className="text-xs text-muted-foreground mb-2">Non-interactive with 50% opacity</span>
            <Input disabled placeholder="Disabled field" value="preset value" />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">Password Field</span>
            <span className="text-xs text-muted-foreground mb-2">Masked character input for secure data</span>
            <Input type="password" placeholder="Enter password..." defaultValue="supersecret" />
          </div>
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
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'The height and padding scale of the input (default: 36px, sm: 32px).',
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
