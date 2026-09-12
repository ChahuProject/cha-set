import React, { useState } from 'react';
import { Button, ButtonGroup, Input, Checkbox, type ButtonVariant, type ButtonSize, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function ButtonDocPage() {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState('Button');

  const isIconSize = size === 'icon' || size === 'icon-xs' || size === 'icon-sm' || size === 'icon-lg';

  const reactCode = `<Button
  variant="${variant}"
  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}${pressed ? '\n  pressed' : ''}
>
  ${isIconSize ? '⚙' : label}
</Button>`;

  const qtCode = `ChaSetButton {
    variant: "${variant}"
    size: "${size}"
    text: "${isIconSize ? '' : label}"
    loading: ${loading}
    disabled: ${disabled}
    fullWidth: ${fullWidth}
    pressed: ${pressed}
    onClicked: console.log("clicked")
}`;

  return (
    <DocLayout
      category="Components"
      title="Button"
      description="Displays a button or a component that looks like a button with multiple variants, sizes, and states."
      tocItems={[
        { id: 'preview', title: 'Interactive Preview' },
        { id: 'installation', title: 'Installation' },
        { id: 'examples', title: 'Examples' },
        { id: 'variants', title: 'Variants' },
        { id: 'sizes', title: 'Sizes' },
        { id: 'states', title: 'States' },
        { id: 'button-group', title: 'Button Group' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'API Reference' },
      ]}
    >
      {/* 1. Interactive Preview Hero */}
      <section id="preview">
        <ComponentPreview
          title="Interactive Button Sandbox"
          reactCode={reactCode}
          qtCode={qtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Variant Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Variant:</span>
                {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as ButtonVariant[]).map((v) => (
                  <Button
                    key={v}
                    type="button"
                    variant={variant === v ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVariant(v)}
                    className="h-6 px-2 text-[0.6875rem] capitalize font-medium"
                  >
                    {v}
                  </Button>
                ))}
              </div>

              {/* Size Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Size:</span>
                {(['xs', 'sm', 'default', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as ButtonSize[]).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={size === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSize(s)}
                    className="h-6 px-2 text-[0.6875rem] uppercase font-medium"
                  >
                    {s}
                  </Button>
                ))}
              </div>

              {/* Toggles */}
              <Checkbox
                size="sm"
                checked={loading}
                onCheckedChange={(val) => setLoading(val)}
                label="Loading"
              />

              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label="Disabled"
              />

              <Checkbox
                size="sm"
                checked={fullWidth}
                onCheckedChange={(val) => setFullWidth(val)}
                label="Full Width"
              />

              <Checkbox
                size="sm"
                checked={pressed}
                onCheckedChange={(val) => setPressed(val)}
                label="Pressed"
              />

              {/* Text input */}
              {!isIconSize && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-muted-foreground text-xs">Label:</span>
                  <Input
                    size="sm"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-28 h-7 text-xs"
                  />
                </div>
              )}
            </div>
          }
        >
          <div className={fullWidth ? 'w-full max-w-md px-4' : ''}>
            <Button
              variant={variant}
              size={size}
              loading={loading}
              disabled={disabled}
              fullWidth={fullWidth}
              pressed={pressed}
            >
              {isIconSize ? '⚙' : label}
            </Button>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="my-8">
        <h2 className="text-xl font-bold tracking-tight mb-3">Installation</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
        <p className="text-xs text-muted-foreground mt-2">
          Import styles and component in your application entry:
        </p>
        <CodeBlock
          code={`import { Button } from '@chahu/cha-set';\nimport '@chahu/cha-set/styles.css';`}
          language="tsx"
          className="mt-2"
        />
      </section>

      {/* 3. Examples */}
      <section id="examples" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-4">Examples</h2>

        {/* Variants */}
        <div id="variants" className="my-6">
          <h3 className="text-base font-semibold mb-2">Variants</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Use the <code className="text-primary font-mono">variant</code> prop to change the visual hierarchy.
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <CodeBlock
            code={`<Button variant="default">Default</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="destructive">Destructive</Button>\n<Button variant="link">Link</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* Sizes */}
        <div id="sizes" className="my-6">
          <h3 className="text-base font-semibold mb-2">Sizes</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Available in standardized sizes: <code className="font-mono">xs</code>, <code className="font-mono">sm</code>, <code className="font-mono">default</code>, <code className="font-mono">lg</code>, and icon variants.
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Settings">⚙</Button>
          </div>
          <CodeBlock
            code={`<Button size="xs">Extra Small</Button>\n<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon" aria-label="Settings">⚙</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* States */}
        <div id="states" className="my-6">
          <h3 className="text-base font-semibold mb-2">States & Loading</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Buttons handle loading, pressed, and disabled states automatically, preserving width and blocking pointer events.
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button loading loadingText="Saving...">Saving Changes</Button>
            <Button pressed>Active Toggle</Button>
            <Button disabled>Disabled Button</Button>
          </div>
          <CodeBlock
            code={`<Button loading loadingText="Saving...">Saving Changes</Button>\n<Button pressed>Active Toggle</Button>\n<Button disabled>Disabled Button</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* Button Group & Icons */}
        <div id="button-group" className="my-6">
          <h3 className="text-base font-semibold mb-2">Button Group & Icons</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Group related buttons cohesively with <code className="font-mono text-primary">ButtonGroup</code>, and enrich buttons with leading or trailing icons.
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-4">
            <Button leftIcon={<span>←</span>}>Back</Button>
            <Button rightIcon={<span>→</span>}>Next</Button>
            <ButtonGroup>
              <Button variant="outline">Left</Button>
              <Button variant="outline">Middle</Button>
              <Button variant="outline">Right</Button>
            </ButtonGroup>
          </div>
          <CodeBlock
            code={`<Button leftIcon={<span>←</span>}>Back</Button>\n<Button rightIcon={<span>→</span>}>Next</Button>\n\n<ButtonGroup>\n  <Button variant="outline">Left</Button>\n  <Button variant="outline">Middle</Button>\n  <Button variant="outline">Right</Button>\n</ButtonGroup>`}
            language="tsx"
            className="mt-3"
          />
        </div>
      </section>

      {/* 4. API Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="button" />
      </section>

      <section id="props" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">API Reference</h2>
        <PropsTable
          title="ButtonProps"
          props={[
            {
              name: 'variant',
              type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
              default: "'default'",
              description: 'Visual appearance and semantic intent.',
            },
            {
              name: 'size',
              type: "'default' | 'sm' | 'lg' | 'icon' | 'xs' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
              default: "'default'",
              description: 'Standardized dimensions scale.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: 'Shows spinning indicator and disables user interaction.',
            },
            {
              name: 'loadingText',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional content displayed while in loading state.',
            },
            {
              name: 'pressed',
              type: 'boolean',
              default: 'false',
              description: 'Toggle or selected state with active styling and aria-pressed.',
            },
            {
              name: 'leftIcon',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional leading icon displayed before children.',
            },
            {
              name: 'rightIcon',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional trailing icon displayed after children.',
            },
            {
              name: 'fullWidth',
              type: 'boolean',
              default: 'false',
              description: 'Stretches the button to 100% of the parent container width.',
            },
            {
              name: 'asChild',
              type: 'boolean',
              default: 'false',
              description: 'Passes props directly to the child element (polymorphism).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Blocks clicks and applies muted disabled styling.',
            },
            {
              name: 'type',
              type: "'button' | 'submit' | 'reset'",
              default: "'button'",
              description: 'HTML button type attribute.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
