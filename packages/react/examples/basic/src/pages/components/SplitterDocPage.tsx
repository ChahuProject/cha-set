import React, { useState } from 'react';
import { Splitter, Badge, Button, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SplitterDocPage() {
  const [size, setSize] = useState(35);
  const [verticalSize, setVerticalSize] = useState(65);

  const horizontalReactCode = `<div className="flex h-48 border rounded-md">
  <div style={{ width: \`\${size}%\` }} className="p-4 text-xs">
    Left Pane (Sidebar)
  </div>
  <Splitter size={size} onChange={setSize} orientation="vertical" />
  <div style={{ width: \`\${100 - size}%\` }} className="p-4 text-xs">
    Right Pane (Main Content)
  </div>
</div>`;

  const horizontalQtCode = `ChaSetSplitter {
    width: 480
    height: 192
    orientation: "vertical"
    initialSize: 35
    minRatio: 0.20
    maxRatio: 0.80
    leftItem: Component { ... }
    rightItem: Component { ... }
}`;

  const verticalReactCode = `<div className="flex flex-col h-64 border rounded-md">
  <div style={{ height: \`\${verticalSize}%\` }} className="p-4 text-xs">
    Top Pane (Editor Canvas)
  </div>
  <Splitter size={verticalSize} onChange={setVerticalSize} orientation="horizontal" />
  <div style={{ height: \`\${100 - verticalSize}%\` }} className="p-4 text-xs">
    Bottom Pane (Terminal Console)
  </div>
</div>`;

  const verticalQtCode = `ChaSetSplitter {
    width: 480
    height: 220
    orientation: "horizontal"
    initialSize: 65
    minRatio: 0.20
    maxRatio: 0.80
    leftItem: Component { ... }
    rightItem: Component { ... }
}`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Splitter"
      description="Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits."
      tocItems={[
        { id: 'overview', title: 'Horizontal Splitter' },
        { id: 'vertical', title: 'Vertical Splitter' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Horizontal Splitter
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Hover over the gutter between panes and drag horizontally to resize panels. Double-click to reset.
        </p>

        <ComponentPreview
          title="Horizontal Splitter Sandbox"
          reactCode={horizontalReactCode}
          qtCode={horizontalQtCode}
        >
          <div className="w-full max-w-lg">
            <div className="flex h-48 border border-border rounded-md bg-card overflow-hidden">
              <div
                style={{ width: `${size}%` }}
                className="h-full p-4 text-xs text-muted-foreground bg-muted/20 overflow-hidden shrink-0"
              >
                <strong className="text-foreground block mb-2">Navigation Tree</strong>
                <ul className="space-y-1 font-mono">
                  <li>▾ src</li>
                  <li className="pl-3">▸ components</li>
                  <li className="pl-3">▸ layout</li>
                </ul>
              </div>

              <Splitter size={size} onChange={setSize} orientation="vertical" minSize={20} maxSize={80} />

              <div
                style={{ width: `${100 - size}%` }}
                className="h-full p-4 text-xs text-muted-foreground flex flex-col justify-center items-center gap-2 overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">Editor Workspace</span>
                  <Badge variant="secondary">{Math.round(100 - size)}%</Badge>
                </div>
                <span>Drag splitter handle to resize panes</span>
                <Button variant="outline" size="xs" onClick={() => setSize(35)}>
                  Reset (35%)
                </Button>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="vertical" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Vertical Splitter
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Top and bottom pane split with horizontal divider line. Drag vertically to resize console output.
        </p>

        <ComponentPreview
          title="Vertical Splitter Sandbox"
          reactCode={verticalReactCode}
          qtCode={verticalQtCode}
        >
          <div className="w-full max-w-lg">
            <div className="flex flex-col h-64 border border-border rounded-md bg-card overflow-hidden">
              <div
                style={{ height: `${verticalSize}%` }}
                className="w-full p-4 text-xs text-muted-foreground bg-muted/20 flex flex-col justify-center items-center gap-1 overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">Editor Canvas</span>
                  <Badge variant="secondary">{Math.round(verticalSize)}%</Badge>
                </div>
                <span>Drag splitter handle vertically to resize</span>
              </div>

              <Splitter size={verticalSize} onChange={setVerticalSize} orientation="horizontal" minSize={20} maxSize={80} />

              <div
                style={{ height: `${100 - verticalSize}%` }}
                className="w-full p-4 text-xs text-muted-foreground flex flex-col justify-center items-center gap-2 overflow-hidden shrink-0 bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">Terminal Console</span>
                  <Badge variant="outline">{Math.round(100 - verticalSize)}%</Badge>
                </div>
                <Button variant="outline" size="xs" onClick={() => setVerticalSize(65)}>
                  Reset (65%)
                </Button>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Motion tokens and kinematic timing contracts for Splitter divider gutters.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            Gutter indicator color and opacity transitions animate smoothly over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-quick</code> (150ms) using{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve (Qt counterpart:{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.motionQuick</code> and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.easeStandard</code>).
          </li>
          <li>
            Divider dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.
          </li>
          <li>
            Respects <code className="text-xs bg-muted px-1 rounded">prefers-reduced-motion</code> on Web and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.animationsEnabled</code> in Qt.
          </li>
        </ul>
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="splitter" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'size', type: 'number', default: 'undefined', description: 'Controlled percentage width/height (0-100).' },
            { name: 'onChange', type: '(size: number) => void', default: 'undefined', description: 'Callback fired on drag with new percentage.' },
            { name: 'initialSize', type: 'number', default: '50', description: 'Initial size percentage for uncontrolled usage.' },
            { name: 'minSize', type: 'number', default: '0', description: 'Minimum allowed percentage bound.' },
            { name: 'maxSize', type: 'number', default: '100', description: 'Maximum allowed percentage bound.' },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Orientation of the divider.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
