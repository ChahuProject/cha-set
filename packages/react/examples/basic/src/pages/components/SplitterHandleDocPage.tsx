import React, { useState } from 'react';
import { SplitterHandle, Card, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SplitterHandleDocPage() {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [bottomHeight, setBottomHeight] = useState(120);

  const heroReactCode = `<div className="flex h-64 border rounded overflow-hidden">
  <div style={{ width: ${sidebarWidth} }} className="bg-muted/30 p-4">
    Sidebar Content (${sidebarWidth}px)
  </div>
  <SplitterHandle
    edge="right"
    targetSize={${sidebarWidth}}
    minSize={140}
    maxSize={400}
    onSizeChanging={setSidebarWidth}
    onSizeChanged={setSidebarWidth}
  />
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
            text: "Sidebar (" + root.sidebarWidth + "px)"
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
      category="Layout & Surface"
      title="Splitter Handle"
      description="Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'vertical', title: 'Vertical Edge (Top/Bottom)' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'code', title: 'Implementation Code' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <p className="text-sm text-muted-foreground">
          Drag the right edge handle to resize the sidebar. Double click or press Enter to reset to 200px.
        </p>

        <ComponentPreview
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-muted-foreground">Current Width: {sidebarWidth}px</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarWidth(200)}
              >
                Reset to 200px
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-xl mx-auto py-4">
            <Card className="flex h-64 border rounded-md overflow-hidden bg-card">
              <div
                style={{ width: `${sidebarWidth}px` }}
                className="bg-muted/40 p-4 flex flex-col justify-center items-center text-sm font-medium shrink-0 border-r border-border/20"
              >
                <span>Sidebar</span>
                <span className="text-xs text-muted-foreground">{sidebarWidth}px</span>
              </div>
              <SplitterHandle
                edge="right"
                targetSize={sidebarWidth}
                minSize={140}
                maxSize={400}
                defaultSize={200}
                onSizeChanging={setSidebarWidth}
                onSizeChanged={setSidebarWidth}
              />
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-sm text-muted-foreground">
                <span>Main Content Viewport</span>
                <span className="text-xs text-muted-foreground/70">Focus handle and use arrow keys to resize</span>
              </div>
            </Card>
          </div>
        </ComponentPreview>
      </section>

      <section id="vertical" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Vertical Edge (Bottom Panel)</h2>
        <p className="text-sm text-muted-foreground">
          Handles can also be attached to horizontal edges (<code>top</code> or <code>bottom</code>) for bottom console or drawer resizing.
        </p>
        <Card className="w-full max-w-xl mx-auto h-64 flex flex-col overflow-hidden bg-card">
          <div className="flex-1 p-4 text-sm text-muted-foreground">
            Editor / Log Canvas Area
          </div>
          <SplitterHandle
            edge="top"
            targetSize={bottomHeight}
            minSize={60}
            maxSize={180}
            defaultSize={120}
            onSizeChanging={setBottomHeight}
            onSizeChanged={setBottomHeight}
          />
          <div
            style={{ height: `${bottomHeight}px` }}
            className="bg-muted/40 p-3 text-xs flex items-center justify-between shrink-0 border-t border-border/20"
          >
            <span className="font-semibold">Terminal / Output Console</span>
            <span className="text-muted-foreground">{bottomHeight}px</span>
          </div>
        </Card>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="splitter-handle" />
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
              description: 'Minimum allowed size in pixels.',
            },
            {
              name: 'maxSize',
              type: 'number',
              default: '1000',
              required: false,
              description: 'Maximum allowed size in pixels.',
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
              description: 'Interactive mouse hit test zone thickness in pixels.',
            },
            {
              name: 'visualThickness',
              type: 'number',
              default: '1',
              required: false,
              description: 'Resting visible hairline thickness in pixels.',
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
      </section>
    </DocLayout>
  );
}
