import React, { useState } from 'react';
import { SplitterHandle, Card, Button, Badge, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SplitterHandleDocPage() {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [bottomHeight, setBottomHeight] = useState(120);

  const heroReactCode = `<div className="flex h-64 border rounded overflow-hidden">
  <div style={{ width: \`\${sidebarWidth * 0.0625}rem\` }} className="relative bg-muted/30 p-4">
    Sidebar Content (\${sidebarWidth})
    <SplitterHandle
      edge="right"
      targetSize={sidebarWidth}
      minSize={140}
      maxSize={400}
      onSizeChanging={setSidebarWidth}
      onSizeChanged={setSidebarWidth}
    />
  </div>
  <div className="flex-1 p-4">
    Main Viewport Area
  </div>
</div>`;

  const heroQtCode = `Row {
    width: parent.width
    height: 260

    Rectangle {
        width: root.sidebarWidth
        height: parent.height
        color: ThemeTokens.card

        Text {
            anchors.centerIn: parent
            text: "Sidebar (" + root.sidebarWidth + ")"
            color: ThemeTokens.text
        }

        ChaSetSplitterHandle {
            edge: "right"
            targetSize: root.sidebarWidth
            minSize: 140
            maxSize: 400
            onSizeChanging: (newSize) => root.sidebarWidth = newSize
            onSizeChanged: (finalSize) => root.sidebarWidth = finalSize
        }
    }

    Rectangle {
        width: parent.width - root.sidebarWidth
        height: parent.height
        color: ThemeTokens.background
    }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Splitter Handle"
      description="Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation."
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <p className="text-sm text-muted-foreground">
          Drag the right edge handle to resize the sidebar. Double click or press Enter to reset to 200.
        </p>

        <ComponentPreview title="Splitter Handle Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                Current Width: <Badge variant="outline">{sidebarWidth}</Badge>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarWidth(200)}
              >
                Reset to 200
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-xl mx-auto py-4">
            <Card className="flex h-64 border rounded-md overflow-hidden bg-card">
              <div
                style={{ width: `${sidebarWidth * 0.0625}rem` }}
                className="relative bg-muted/40 p-4 flex flex-col justify-center items-center text-sm font-medium shrink-0"
              >
                <span>Sidebar</span>
                <Badge variant="secondary" className="mt-1">{sidebarWidth}</Badge>
                <SplitterHandle
                  edge="right"
                  targetSize={sidebarWidth}
                  minSize={140}
                  maxSize={400}
                  defaultSize={200}
                  onSizeChanging={setSidebarWidth}
                  onSizeChanged={setSidebarWidth}
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-sm text-muted-foreground">
                <span>Main Content Viewport</span>
                <span className="text-xs text-muted-foreground/70">Focus handle and use arrow keys to resize</span>
              </div>
            </Card>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { SplitterHandle } from '@chahu/cha-set';

<SplitterHandle orientation="horizontal" onDrag={(delta) => console.log(delta)} />`}
        qtCode={`import ChaSet

ChaSetSplitterHandle {
    orientation: Qt.Horizontal
}`}
      />



      <section id="vertical-edge-handle" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Vertical Edge Handle</h2>
        <p className="text-sm text-muted-foreground">
          Handles can also be attached to horizontal edges (<code>top</code> or <code>bottom</code>) for bottom console or drawer resizing.
        </p>
        <Card className="w-full max-w-xl mx-auto h-64 flex flex-col overflow-hidden bg-card">
          <div className="flex-1 p-4 text-sm text-muted-foreground">
            Editor / Log Canvas Area
          </div>
          <div
            style={{ height: `${bottomHeight * 0.0625}rem` }}
            className="relative bg-muted/40 p-3 text-xs flex items-center justify-between shrink-0"
          >
            <span className="font-semibold">Terminal / Output Console</span>
            <Badge variant="secondary">{bottomHeight}</Badge>
            <SplitterHandle
              edge="top"
              targetSize={bottomHeight}
              minSize={60}
              maxSize={180}
              defaultSize={120}
              onSizeChanging={setBottomHeight}
              onSizeChanged={setBottomHeight}
            />
          </div>
        </Card>
      </section>

      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground">
          Motion tokens and kinematic timing contracts for SplitterHandle edge indicators.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            Active indicator color and opacity transitions animate smoothly over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-quick</code> (150ms) using{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve (Qt counterpart:{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.motionQuick</code> and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.easeStandard</code>).
          </li>
          <li>
            Handle dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.
          </li>
          <li>
            Respects <code className="text-xs bg-muted px-1 rounded">prefers-reduced-motion</code> on Web and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.animationsEnabled</code> in Qt.
          </li>
        </ul>
      </section>

      <ComponentReference
        name="SplitterHandle"
        componentId="splitter-handle"
        props={[
          {
            name: 'edge',
            type: "'left' | 'right' | 'top' | 'bottom'",
            default: "'left'",
            required: false,
            description: 'Which edge of the target panel the resize handle controls.',
          },
          {
            name: 'targetSize',
            type: 'number',
            default: '200',
            required: false,
            description: 'Current size (width or height) of the target element being resized.',
          },
          {
            name: 'minSize',
            type: 'number',
            default: '100',
            required: false,
            description: 'Minimum allowed size bound.',
          },
          {
            name: 'maxSize',
            type: 'number',
            default: '1000',
            required: false,
            description: 'Maximum allowed size bound.',
          },
          {
            name: 'defaultSize',
            type: 'number',
            required: false,
            description: 'Size restored when double-clicked or Enter is pressed.',
          },
          {
            name: 'liveUpdate',
            type: 'boolean',
            default: 'true',
            required: false,
            description: 'Whether size updates fire continuously during drag.',
          },
          {
            name: 'hitThickness',
            type: 'number',
            default: '6',
            required: false,
            description: 'Interactive mouse hit test zone thickness.',
          },
          {
            name: 'visualThickness',
            type: 'number',
            default: '1',
            required: false,
            description: 'Resting visible hairline thickness.',
          },
          {
            name: 'activeVisualThickness',
            type: 'number',
            default: '2',
            required: false,
            description: 'Highlighted visible hairline thickness when hovered or dragged.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Whether handle resizing is disabled.',
          },
        ]}
      />
    </DocLayout>
  );
}
