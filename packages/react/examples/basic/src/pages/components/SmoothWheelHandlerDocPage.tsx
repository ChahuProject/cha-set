import React, { useState } from 'react';
import { SmoothWheelHandler, Card, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SmoothWheelHandlerDocPage() {
  const [speed, setSpeed] = useState(1.2);
  const [duration, setDuration] = useState(200);
  const [mapShift, setMapShift] = useState(true);

  const heroReactCode = `<SmoothWheelHandler
  scrollOrientation="vertical"
  speedMultiplier={${speed}}
  duration={${duration}}
  className="h-64 border rounded-lg p-4 bg-muted/20"
>
  <div className="space-y-3">
    {Array.from({ length: 25 }, (_, i) => (
      <div key={i} className="p-3 bg-card border rounded shadow-xs">
        Item #{i + 1} with smooth kinematic momentum
      </div>
    ))}
  </div>
</SmoothWheelHandler>`;

  const heroQtCode = `ChaSetScrollArea {
    width: parent.width
    height: 260

    ChaSetSmoothWheelHandler {
        targetItem: parent
        speedMultiplier: ${speed}
        duration: ${duration}
        mapVerticalToHorizontal: ${mapShift}
    }

    Column {
        spacing: 8
        Repeater {
            model: 25
            ChaSetCard {
                width: 320
                Text { text: "Item #" + (index + 1); color: ThemeTokens.text }
            }
        }
    }
}`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Smooth Wheel Handler"
      description="Desktop kinematic scrolling helper providing continuous physical momentum damping, Shift+wheel horizontal conversion, and gesture mutex."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'kinematics', title: 'Kinematic Features' },
        { id: 'keyboard', title: 'Keyboard & Wheel Navigation' },
        { id: 'code', title: 'Implementation Code' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span>Speed:</span>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="rounded border border-border bg-background px-2 py-1 text-foreground"
                >
                  <option value={1.0}>1.0x (Standard)</option>
                  <option value={1.2}>1.2x (Responsive)</option>
                  <option value={1.5}>1.5x (Fast)</option>
                  <option value={2.0}>2.0x (Hyper)</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span>Damping Duration:</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="rounded border border-border bg-background px-2 py-1 text-foreground"
                >
                  <option value={100}>100ms (Tight)</option>
                  <option value={200}>200ms (Natural)</option>
                  <option value={350}>350ms (Soft Glide)</option>
                </select>
              </label>
            </div>
          }
        >
          <div className="w-full max-w-md mx-auto py-4">
            <SmoothWheelHandler
              scrollOrientation="vertical"
              speedMultiplier={speed}
              duration={duration}
              className="h-64 border border-border rounded-xl p-3 bg-muted/10 overflow-auto"
            >
              <div className="space-y-2.5">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="p-3 bg-card border border-border/60 rounded-lg shadow-xs flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground">Smooth Scroll Item #{i + 1}</span>
                    <span className="text-muted-foreground font-mono">pos: {i * 48}px</span>
                  </div>
                ))}
              </div>
            </SmoothWheelHandler>
          </div>
        </ComponentPreview>
      </section>

      <section id="kinematics" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Kinematic Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Continuous Momentum Accumulation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When rapid successive wheel ticks occur, delta offsets are accumulated onto the existing target position rather than jerking backwards or stuttering.
            </p>
          </Card>
          <Card className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Shift+Wheel Horizontal Translation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In horizontal viewports or long-scroll carousels, automatically intercepts vertical wheel actions while holding Shift and maps them to horizontal translation.
            </p>
          </Card>
          <Card className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Gesture & Drag Decoupling</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instantly terminates smooth scroll interpolation when the user touches the thumb handle or flicks with touchpads, ensuring zero physical friction.
            </p>
          </Card>
        </div>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard & Wheel Navigation</h2>
        <KeyboardShortcutsTable componentId="smooth-wheel-handler" />
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
              name: 'scrollOrientation',
              type: "'vertical' | 'horizontal'",
              default: "'vertical'",
              required: false,
              description: 'Primary direction of scrolling for the target viewport.',
            },
            {
              name: 'mapVerticalToHorizontal',
              type: 'boolean',
              default: 'false',
              required: false,
              description: 'Whether to map vertical wheel ticks to horizontal axis movement.',
            },
            {
              name: 'speedMultiplier',
              type: 'number',
              default: '1.2',
              required: false,
              description: 'Scroll speed multiplier applied to raw delta values.',
            },
            {
              name: 'duration',
              type: 'number',
              default: '200',
              required: false,
              description: 'Duration in milliseconds for the OutCubic damping transition.',
            },
            {
              name: 'fixedStepSize',
              type: 'number',
              default: '0',
              required: false,
              description: 'Optional quantized pixel step per wheel notch (0 for dynamic).',
            },
            {
              name: 'consumeEvent',
              type: 'boolean',
              default: 'true',
              required: false,
              description: 'Whether to prevent propagation of handled wheel events to parent windows.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
