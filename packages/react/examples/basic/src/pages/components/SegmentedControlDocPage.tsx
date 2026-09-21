import React, { useState } from 'react';
import { SegmentedControl, Card, Button, Checkbox, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SegmentedControlDocPage() {
  const [selectedSize, setSelectedSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [activeView, setActiveView] = useState<string | number>('grid');
  const [disabled, setDisabled] = useState(false);

  const viewOptions = [
    { label: 'Grid', value: 'grid', icon: '⊞' },
    { label: 'List', value: 'list', icon: '☰' },
    { label: 'Gallery', value: 'gallery', icon: '▣', badge: 3 },
  ];

  const menuOptions = [
    { label: 'Off', value: 0 },
    { label: 'Line', value: 1 },
    { label: 'Dot', value: 2 },
  ];

  const heroReactCode = `<SegmentedControl
  size="${selectedSize}"
  options={[
    { label: 'Grid', value: 'grid', icon: '⊞' },
    { label: 'List', value: 'list', icon: '☰' },
    { label: 'Gallery', value: 'gallery', icon: '▣', badge: 3 },
  ]}
  value={activeView}
  onValueChange={setActiveView}
  disabled={${disabled}}
/>`;

  const heroQtCode = `ChaSetSegmentedControl {
    size: "${selectedSize}"
    options: [
        { label: "Grid", value: "grid", icon: "⊞" },
        { label: "List", value: "list", icon: "☰" },
        { label: "Gallery", value: "gallery", icon: "▣", badge: 3 }
    ]
    value: activeView
    disabled: ${disabled}
    onValueChanged: (val) => activeView = val
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Segmented Control"
      description="A compact pill-style segmented switch for toolbars, menus, and view toggles with icon and badge support."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'sizes', title: 'Sizes' },
        { id: 'fixed-width', title: 'Fixed Width & Truncation' },
        { id: 'menu', title: 'Menu & Inline Title' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
{ id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview title="Segmented Control Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Size:</span>
                <div className="flex items-center gap-1">
                  {(['sm', 'default', 'lg'] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedSize === s ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <Checkbox
                checked={disabled}
                onCheckedChange={(c) => setDisabled(Boolean(c))}
                label="Disabled"
              />
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <SegmentedControl
              size={selectedSize}
              options={viewOptions}
              value={activeView}
              onValueChange={setActiveView}
              disabled={disabled}
            />
            <div className="text-xs text-muted-foreground">
              Current selection: <span className="font-semibold text-foreground">{String(activeView)}</span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="sizes" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Sizes & Badges</h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Small (sm - Menu & Toolbar dense)</div>
            <SegmentedControl size="sm" options={viewOptions} defaultValue="grid" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Default (Standard controls)</div>
            <SegmentedControl size="default" options={viewOptions} defaultValue="grid" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Large (lg - Prominent tabs style)</div>
            <SegmentedControl size="lg" options={viewOptions} defaultValue="grid" />
          </div>
        </Card>
      </section>

      <section id="fixed-width" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Content-Adaptive & Fixed Width with Ellipsis</h2>
        <p className="text-sm text-muted-foreground">
          By default, segments auto-adapt to their content length. When <code>equalWidth</code>, <code>fullWidth</code>, or <code>itemWidth</code> is configured, segments enforce equal or fixed dimensions and truncate overflowing text with an ellipsis.
        </p>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Auto-Adaptive Content Width (Default)</div>
            <SegmentedControl
              options={[
                { label: 'Short', value: 'short' },
                { label: 'Variable Length Title', value: 'var' },
                { label: 'Long Description Tab', value: 'long' },
              ]}
              defaultValue="var"
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Fixed Width per Item with Ellipsis (itemWidth=110)</div>
            <SegmentedControl
              itemWidth={110}
              options={[
                { label: 'Compact', value: 'compact' },
                { label: 'Very Long Option Text That Truncates', value: 'long' },
                { label: 'Settings', value: 'settings' },
              ]}
              defaultValue="compact"
            />
          </div>
        </Card>
      </section>

      <section id="menu" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Menu & Inline Title</h2>
        <p className="text-sm text-muted-foreground">
          Supports an optional prefix title to seamlessly embed within context menu rows and parameter settings panels.
        </p>
        <Card className="p-6">
          <SegmentedControl
            title="Grid Style:"
            size="sm"
            options={menuOptions}
            defaultValue={1}
          />
        </Card>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="segmented-control" />
      </section>

      <section id="code" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Implementation Code</h2>
        <div className="space-y-4">
          <CodeBlock language="tsx" code={heroReactCode} />
          <CodeBlock language="qml" code={heroQtCode} />
        </div>
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'options',
              type: 'SegmentedControlOption[]',
              required: true,
              description: 'Array of option objects ({ label, value, icon?, badge?, disabled? }).',
            },
            {
              name: 'value',
              type: 'string | number',
              required: false,
              description: 'Controlled active value.',
            },
            {
              name: 'defaultValue',
              type: 'string | number',
              required: false,
              description: 'Initial value when uncontrolled.',
            },
            {
              name: 'onValueChange',
              type: '(value: string | number) => void',
              required: false,
              description: 'Callback invoked when a new segment is selected.',
            },
            {
              name: 'size',
              type: "'sm' | 'default' | 'lg'",
              default: "'default'",
              required: false,
              description: "Physical dimension variant ('sm', 'default', 'lg').",
            },
            {
              name: 'title',
              type: 'string',
              required: false,
              description: 'Optional prefix label displayed before the segments.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              required: false,
              description: 'Whether the entire segmented control is disabled.',
            },
            {
              name: 'fullWidth',
              type: 'boolean',
              default: 'false',
              required: false,
              description: 'Whether segments expand equally to fill the parent container.',
            },
            {
              name: 'equalWidth',
              type: 'boolean',
              default: 'false',
              required: false,
              description: 'Whether all segments share an identical fixed width while hugging content.',
            },
            {
              name: 'itemWidth',
              type: 'number',
              required: false,
              description: 'Explicit fixed width allocated to each segment option.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}

