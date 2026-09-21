import React, { useState } from 'react';
import { ScaleOsd, Card, CodeBlock, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function ScaleOsdDocPage() {
  const [scale, setScale] = useState(1.0);
  const [visible, setVisible] = useState(true);

  const heroReactCode = `<ScaleOsd
  value={scale}
  step={0.1}
  min={0.2}
  max={3.0}
  visible={visible}
  autoHideDuration={1400}
  onChange={setScale}
/>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Scale OSD"
      description="Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide."
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
          title="Scale OSD Sandbox"
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-muted-foreground">Quick Zoom:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale(0.5);
                  setVisible(true);
                }}
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale(1.0);
                  setVisible(true);
                }}
              >
                100%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale(2.0);
                  setVisible(true);
                }}
              >
                200%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisible((v) => !v)}
              >
                {visible ? 'Hide OSD' : 'Show OSD'}
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-md mx-auto py-12 flex flex-col items-center justify-center relative min-h-[12rem]">
            <Card className="w-full p-8 bg-card border flex flex-col items-center justify-center gap-4">
              <div
                className="w-24 h-24 rounded-lg bg-primary/20 border border-primary flex items-center justify-center text-xs font-semibold text-primary transition-transform duration-short ease-standard"
                style={{ transform: `scale(${scale})` }}
              >
                Preview Box
              </div>
              <p className="text-xs text-muted-foreground">
                Hover over the floating OSD below to pause auto-hide countdown.
              </p>
            </Card>

            <div className="mt-4">
              <ScaleOsd
                value={scale}
                step={0.1}
                min={0.2}
                max={3.0}
                visible={visible}
                autoHideDuration={2000}
                placement="bottom-center"
                onChange={setScale}
                onVisibilityChange={setVisible}
              />
            </div>
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
          Motion tokens and kinematic timing contracts for ScaleOsd visibility.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            OSD enter and exit transitions animate smoothly over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-short</code> (120ms) using{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve (Qt counterpart:{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.motionShort</code> and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.easeStandard</code>).
          </li>
          <li>
            Auto-hide timer runs with a 1400ms countdown, pausing deterministically on mouse hover.
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
          Keyboard shortcuts and button activation patterns.
        </p>
        <KeyboardShortcutsTable componentId="scale-osd" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'value',
              type: 'number',
              default: '1.0',
              description: 'Current scale ratio (e.g. 1.0 represents 100%).',
            },
            {
              name: 'defaultValue',
              type: 'number',
              default: '1.0',
              description: 'Initial scale ratio in uncontrolled mode.',
            },
            {
              name: 'step',
              type: 'number',
              default: '0.1',
              description: 'Step increment applied on +/- button click.',
            },
            {
              name: 'min',
              type: 'number',
              default: '0.2',
              description: 'Minimum allowed zoom scale ratio.',
            },
            {
              name: 'max',
              type: 'number',
              default: '3.0',
              description: 'Maximum allowed zoom scale ratio.',
            },
            {
              name: 'visible',
              type: 'boolean',
              default: 'undefined',
              description: 'Controlled visibility state.',
            },
            {
              name: 'autoHideDuration',
              type: 'number',
              default: '1400',
              description: 'Duration in ms before auto-hiding (pauses on hover).',
            },
            {
              name: 'showControls',
              type: 'boolean',
              default: 'true',
              description: 'Whether to display +/- and reset buttons.',
            },
            {
              name: 'placement',
              type: '"bottom-center" | "top-center" | "bottom-right" | "top-right"',
              default: '"bottom-center"',
              description: 'Fixed viewport anchor position.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables all controls and user interaction.',
            },
            {
              name: 'onChange',
              type: '(value: number) => void',
              default: 'undefined',
              description: 'Callback fired when scale value changes.',
            },
            {
              name: 'onStep',
              type: '(delta: number) => void',
              default: 'undefined',
              description: 'Callback fired on step adjustments.',
            },
            {
              name: 'onReset',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired when resetting to 100%.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
