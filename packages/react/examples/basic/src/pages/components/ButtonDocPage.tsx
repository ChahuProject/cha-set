import React, { useState } from 'react';
import { Button, type ButtonVariant, type ButtonSize } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function ButtonDocPage() {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [label, setLabel] = useState('Button');

  const reactCode = `<Button
  variant="${variant}"
  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}
>
  ${size === 'icon' ? '⚙' : label}
</Button>`;

  const qtCode = `ChaSetButton {
    variant: "${variant}"
    size: "${size}"
    text: "${size === 'icon' ? '' : label}"
    loading: ${loading}
    disabled: ${disabled}
    fullWidth: ${fullWidth}
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
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Size:</span>
                {(['default', 'sm', 'lg', 'icon'] as ButtonSize[]).map((s) => (
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
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={loading}
                  onChange={(e) => setLoading(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Loading</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Disabled</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={fullWidth}
                  onChange={(e) => setFullWidth(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Full Width</span>
              </label>

              {/* Text input */}
              {size !== 'icon' && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-muted-foreground">Label:</span>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-28 px-2 py-0.5 rounded border border-border bg-background text-xs"
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
            >
              {size === 'icon' ? '⚙' : label}
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
            Available in four standardized sizes: <code className="font-mono">sm</code> (32px), <code className="font-mono">default</code> (36px), <code className="font-mono">lg</code> (40px), and <code className="font-mono">icon</code> (36×36px).
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button size="sm">Small (32px)</Button>
            <Button size="default">Default (36px)</Button>
            <Button size="lg">Large (40px)</Button>
            <Button size="icon" aria-label="Settings">⚙</Button>
          </div>
          <CodeBlock
            code={`<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon" aria-label="Settings">⚙</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* States */}
        <div id="states" className="my-6">
          <h3 className="text-base font-semibold mb-2">States & Loading</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Buttons handle loading and disabled states automatically, preserving width and blocking pointer events.
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button loading>Saving Changes</Button>
            <Button disabled>Disabled Button</Button>
          </div>
          <CodeBlock
            code={`<Button loading>Saving Changes</Button>\n<Button disabled>Disabled Button</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>
      </section>

      {/* 4. API Reference */}
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
              type: "'default' | 'sm' | 'lg' | 'icon'",
              default: "'default'",
              description: 'Height and padding dimensions.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: 'Shows spinning indicator and disables user interaction.',
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
