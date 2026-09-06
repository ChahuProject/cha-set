import React, { useState } from 'react';
import {
  ColorPicker,
  type ColorPickerMode,
  type ColorPickerSize,
  Tabs,
  TabsList,
  TabsTrigger,
  Checkbox,
  Card,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function ColorPickerDocPage() {
  const [color, setColor] = useState('#1d7ae0');
  const [mode, setMode] = useState<ColorPickerMode>('inline');
  const [size, setSize] = useState<ColorPickerSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [movable, setMovable] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showHex, setShowHex] = useState(true);
  const [showSwatches, setShowSwatches] = useState(true);

  const heroReactCode = `<ColorPicker
  value="${color}"
  mode="${mode}"
  size="${size}"
  movable={${movable}}
  disabled={${disabled}}
  showPreview={${showPreview}}
  showHex={${showHex}}
  showSwatches={${showSwatches}}
  onChange={setColor}
/>`;

  const heroQtCode = `ChaSetColorPicker {
    value: "${color}"
    mode: "${mode}"
    size: "${size}"
    movable: ${movable}
    disabled: ${disabled}
    showPreview: ${showPreview}
    showHex: ${showHex}
    showSwatches: ${showSwatches}
    onHexChanged: function(newHex) {
        // handle color change
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="ColorPicker"
      description="An interactive color selection component featuring 4 selector panels (Square in HueRing, Circle Color Wheel, Triangle in HueRing, and Swatches), live hex input with copy button, and independent multi-channel sliders (RGB, HSV, CMYK, LAB)."
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
          Experiment with modes, sizes, swatches, and states across Web (React) and Desktop (Qt Quick).
        </p>

        <ComponentPreview
          title="ColorPicker Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Mode toggle */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Mode:</span>
                <Tabs value={mode} onValueChange={(v) => setMode(v as ColorPickerMode)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="inline" className="h-6 px-2.5 text-xs">Inline</TabsTrigger>
                    <TabsTrigger value="popover" className="h-6 px-2.5 text-xs">Popover</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Size selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <Tabs value={size} onValueChange={(v) => setSize(v as ColorPickerSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">SM</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Disabled toggle */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label="Disabled"
              />

              {/* Movable toggle */}
              <Checkbox
                size="sm"
                checked={movable}
                onCheckedChange={(val) => setMovable(val)}
                label="Movable"
              />

              {/* Show preview toggle */}
              <Checkbox
                size="sm"
                checked={showPreview}
                onCheckedChange={(val) => setShowPreview(val)}
                label="Preview"
              />

              {/* Show hex toggle */}
              <Checkbox
                size="sm"
                checked={showHex}
                onCheckedChange={(val) => setShowHex(val)}
                label="Hex Input"
              />

              {/* Show swatches toggle */}
              <Checkbox
                size="sm"
                checked={showSwatches}
                onCheckedChange={(val) => setShowSwatches(val)}
                label="Swatches"
              />
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-[360px]">
            <ColorPicker
              value={color}
              mode={mode}
              size={size}
              movable={movable}
              disabled={disabled}
              showPreview={showPreview}
              showHex={showHex}
              showSwatches={showSwatches}
              onChange={setColor}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Selected Color:</span>
              <span className="font-mono font-semibold text-foreground px-2 py-0.5 rounded bg-muted">
                {color}
              </span>
            </div>
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
          Render ColorPicker inline inside forms and inspectors, or in popover mode as a compact swatch button.
        </p>
        <CodeBlock
          code={`import { ColorPicker } from '@chahu/cha-set';

export function ColorPickerDemo() {
  const [accentColor, setAccentColor] = React.useState('#1d7ae0');

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <label className="text-sm font-medium">Theme Accent</label>
      <ColorPicker
        value={accentColor}
        mode="popover"
        onChange={setAccentColor}
      />
    </div>
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
          Matrix of common color picker configurations, modes, and sizes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popover Swatch Trigger */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Popover Dropdown Mode</span>
            <span className="text-xs text-muted-foreground">
              Compact trigger button showing current color and hex code with floating panel.
            </span>
            <div className="pt-2">
              <ColorPicker mode="popover" defaultValue="#ef4444" />
            </div>
          </Card>

          {/* Compact Size */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Compact Size (sm)</span>
            <span className="text-xs text-muted-foreground">
              Smaller dimensions and font size designed for tight sidebar panels.
            </span>
            <div className="pt-2">
              <ColorPicker size="sm" defaultValue="#22c55e" />
            </div>
          </Card>

          {/* Disabled State */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Disabled State</span>
            <span className="text-xs text-muted-foreground">
              Readonly display with 50% opacity and disabled pointer events.
            </span>
            <div className="pt-2">
              <ColorPicker disabled defaultValue="#8b5cf6" />
            </div>
          </Card>

          {/* Custom Preset Colors */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Custom Preset Swatches</span>
            <span className="text-xs text-muted-foreground">
              Specific project palette supplied via the presetColors prop.
            </span>
            <div className="pt-2">
              <ColorPicker
                defaultValue="#f59e0b"
                presetColors={['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#6366f1']}
              />
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
              name: 'value',
              type: 'string',
              default: '—',
              description: 'Controlled hex color value (e.g. #1D7AE0).',
            },
            {
              name: 'defaultValue',
              type: 'string',
              default: "'#1d7ae0'",
              description: 'Initial color value for uncontrolled usage.',
            },
            {
              name: 'mode',
              type: "'inline' | 'popover'",
              default: "'inline'",
              description: 'Display mode: inline panel card or popover dropdown trigger.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'Visual sizing scale for canvas, swatches, and inputs.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true, prevents user interaction and applies muted opacity.',
            },
            {
              name: 'movable',
              type: 'boolean',
              default: 'false',
              description: 'When true, allows dragging on empty background areas to reposition the component. Double-click resets position.',
            },
            {
              name: 'showPreview',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show the top preview header swatch and hex label.',
            },
            {
              name: 'showHex',
              type: 'boolean',
              default: 'true',
              description: 'Whether to display the editable HEX text input row.',
            },
            {
              name: 'showSwatches',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show the quick preset color swatch row.',
            },
            {
              name: 'presetColors',
              type: 'string[]',
              default: '16 default colors',
              description: 'Array of preset hex color strings displayed in swatches panel.',
            },
            {
              name: 'onChange',
              type: '(hex: string) => void',
              default: '—',
              description: 'Callback invoked whenever the selected color changes.',
            },
            {
              name: 'onValueChange',
              type: '(hex: string) => void',
              default: '—',
              description: 'Alias callback for onChange for contract consistency.',
            },
            {
              name: 'title',
              type: 'ReactNode',
              default: "'Color'",
              description: 'Custom label rendered in the preview header.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
