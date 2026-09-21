import React, { useState } from 'react';
import { SnapSlider, Card, CodeBlock, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SnapSliderDocPage() {
  const [value, setValue] = useState(1);
  const labels = ['0.5x', '1.0x', '1.5x', '2.0x', '3.0x'];

  const heroReactCode = `<SnapSlider
  count={5}
  labels={["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]}
  leftLabel="Slow"
  rightLabel="Fast"
  value={value}
  onChange={setValue}
/>`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Snap Slider"
      description="Stepped discrete slider that snaps to defined stops with ticks and label row."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          title="Snap Slider Sandbox"
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-muted-foreground">Preset:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(0)}
              >
                0.5x (Min)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(1)}
              >
                1.0x (Normal)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(4)}
              >
                3.0x (Max)
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-sm mx-auto py-6">
            <Card className="p-6 bg-card border">
              <SnapSlider
                count={5}
                labels={labels}
                leftLabel="Slow"
                rightLabel="Fast"
                value={value}
                onChange={setValue}
              />
            </Card>
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground">
          Motion tokens and kinematic timing contracts for SnapSlider interaction.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            Thumb hover and scale micro-interactions animate smoothly over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-quick</code> (90ms) using{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve (Qt counterpart:{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.motionQuick</code> and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.easeStandard</code>).
          </li>
          <li>
            Thumb drag kinematics track pointer position in 60fps real-time without un-damped lag.
          </li>
          <li>
            Respects <code className="text-xs bg-muted px-1 rounded">prefers-reduced-motion</code> on Web and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.animationsEnabled</code> in Qt.
          </li>
        </ul>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <p className="text-sm text-muted-foreground">
          Keyboard shortcuts and discrete step navigation patterns.
        </p>
        <KeyboardShortcutsTable componentId="snap-slider" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'value',
              type: 'number',
              default: '0',
              description: 'Controlled current snap stop index.',
            },
            {
              name: 'defaultValue',
              type: 'number',
              default: '0',
              description: 'Default initial snap stop index in uncontrolled mode.',
            },
            {
              name: 'count',
              type: 'number',
              default: '5',
              description: 'Total number of discrete stops (defaults to labels.length if provided).',
            },
            {
              name: 'labels',
              type: 'string[]',
              default: '[]',
              description: 'Array of labels for each stop shown at the active center position.',
            },
            {
              name: 'leftLabel',
              type: 'string',
              default: '""',
              description: 'Boundary label on the bottom-left edge.',
            },
            {
              name: 'rightLabel',
              type: 'string',
              default: '""',
              description: 'Boundary label on the bottom-right edge.',
            },
            {
              name: 'showTicks',
              type: 'boolean',
              default: 'true',
              description: 'Whether to display tick marks on the slider track.',
            },
            {
              name: 'size',
              type: '"default" | "sm"',
              default: '"default"',
              description: 'Visual sizing variant.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the slider is disabled.',
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: 'Whether the slider is read-only.',
            },
            {
              name: 'onChange',
              type: '(index: number) => void',
              default: 'undefined',
              description: 'Callback fired when the selected stop index changes.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
