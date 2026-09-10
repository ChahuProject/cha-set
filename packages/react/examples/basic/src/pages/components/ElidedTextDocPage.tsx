import React, { useState } from 'react';
import { ElidedText, Card, Button, Slider } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function ElidedTextDocPage() {
  const [containerWidth, setContainerWidth] = useState(240);
  const [alwaysShow, setAlwaysShow] = useState(false);
  const sampleText = 'C:\\Users\\Development\\Projects\\cha-set\\packages\\react\\src\\elided-text\\ElidedText.tsx';

  const heroReactCode = `<div style={{ width: ${containerWidth} }}>
  <ElidedText
    text="${sampleText}"
    alwaysShowTooltip={${alwaysShow}}
    tooltipPlacement="top"
  />
</div>`;

  const heroQtCode = `Item {
    width: ${containerWidth}
    height: 32

    ChaSetElidedText {
        anchors.fill: parent
        text: "${sampleText}"
        alwaysShowTooltip: ${alwaysShow}
        tooltipPlacement: "top"
    }
}`;

  return (
    <DocLayout
      category="Data Display"
      title="Elided Text"
      description="Smart text truncation with automatic overflow detection and contextual tooltip reveal."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'multiline', title: 'Multi-Line Clamping' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'code', title: 'Implementation Code' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <p className="text-sm text-muted-foreground">
          Resize the container below using the slider. When the text is clipped with an ellipsis, hovering reveals the full path in a tooltip. When wide enough, no tooltip appears.
        </p>

        <ComponentPreview
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Width: {containerWidth}px</span>
                <div className="w-32">
                  <Slider
                    value={[containerWidth]}
                    min={120}
                    max={480}
                    step={10}
                    onValueChange={(vals) => setContainerWidth(vals[0] ?? 240)}
                  />
                </div>
              </div>
              <Button
                variant={alwaysShow ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlwaysShow(!alwaysShow)}
              >
                Always Show: {alwaysShow ? 'On' : 'Off'}
              </Button>
            </div>
          }
        >
          <div className="py-6 flex flex-col items-center justify-center">
            <Card className="p-4 bg-muted/20 border-dashed">
              <div
                style={{ width: `${containerWidth}px` }}
                className="transition-all duration-150 border border-primary/20 p-2 rounded bg-card"
              >
                <ElidedText
                  text={sampleText}
                  alwaysShowTooltip={alwaysShow}
                  tooltipPlacement="top"
                />
              </div>
            </Card>
          </div>
        </ComponentPreview>
      </section>

      <section id="multiline" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Multi-Line Clamping</h2>
        <p className="text-sm text-muted-foreground">
          Using <code>maxLines={2}</code>, text wraps up to two lines before truncating with an ellipsis.
        </p>
        <Card className="p-4 max-w-sm">
          <ElidedText
            maxLines={2}
            text="ChaSet provides cross-stack design system primitives with pixel-level parity across React Web and Qt Quick desktop applications."
            tooltipPlacement="bottom"
          />
        </Card>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="elided-text" />
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
              name: 'text',
              type: 'string',
              required: true,
              description: 'The string content to display and measure for overflow.',
            },
            {
              name: 'tooltipText',
              type: 'string',
              required: false,
              description: 'Custom tooltip text override if different from raw text.',
            },
            {
              name: 'tooltipPlacement',
              type: "'top' | 'bottom' | 'left' | 'right' | 'auto'",
              default: "'top'",
              required: false,
              description: 'Placement direction of the floating tooltip.',
            },
            {
              name: 'tooltipDelay',
              type: 'number',
              default: '400',
              required: false,
              description: 'Delay in milliseconds before showing tooltip on hover.',
            },
            {
              name: 'alwaysShowTooltip',
              type: 'boolean',
              default: 'false',
              required: false,
              description: 'Force tooltip to appear on hover even if text is not elided.',
            },
            {
              name: 'showTooltipWhenElided',
              type: 'boolean',
              default: 'true',
              required: false,
              description: 'Enable tooltip reveal whenever overflow truncation is detected.',
            },
            {
              name: 'maxLines',
              type: 'number',
              default: '1',
              required: false,
              description: 'Maximum visible lines before truncating (1 = single line, >1 = clamp).',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
