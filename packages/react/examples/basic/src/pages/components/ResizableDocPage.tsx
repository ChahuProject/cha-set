import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle, Button, Badge, SegmentedControl, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function ResizableDocPage() {
  const [playgroundDirection, setPlaygroundDirection] = useState<
    'horizontal' | 'vertical'
  >('horizontal');
  const [playgroundWithHandle, setPlaygroundWithHandle] = useState(true);

  const horizontalCode = `<ResizablePanelGroup direction="horizontal" className="min-h-56 rounded-lg border border-border">
  <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
    <div className="flex h-full items-center justify-center p-6 bg-muted/20">
      <span className="font-semibold text-sm">Navigation Sidebar</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold text-sm">Editor Workspace</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`;

  const nestedCode = `<ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border border-border">
  <ResizablePanel defaultSize={25} minSize={15}>
    <div className="flex h-full items-center justify-center p-4 bg-muted/20 text-xs">
      File Tree
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={75}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={65} minSize={30}>
        <div className="flex h-full items-center justify-center p-4 text-xs font-mono">
          main.rs (Code Editor)
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={20}>
        <div className="flex h-full items-center justify-center p-4 bg-muted/30 text-xs font-mono">
          Terminal Console / Output
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`;

  const playgroundReactCode = `<ResizablePanelGroup direction="${playgroundDirection}" className="min-h-56 rounded-lg border border-border">
  <ResizablePanel defaultSize={40} minSize={20}>
    <div className="flex h-full items-center justify-center p-4 bg-muted/20 text-sm">
      Panel Alpha
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle={${playgroundWithHandle}} />
  <ResizablePanel defaultSize={60} minSize={20}>
    <div className="flex h-full items-center justify-center p-4 text-sm">
      Panel Beta
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`;

  const playgroundQtCode = `ChaSetResizable {
    width: parent.width
    height: 220
    orientation: ${playgroundDirection === 'horizontal' ? 'Qt.Horizontal' : 'Qt.Vertical'}
    withHandle: ${playgroundWithHandle}

    Rectangle {
        SplitView.preferredWidth: 150
        SplitView.minimumWidth: 80
        color: ThemeTokens.panel
    }
    Rectangle {
        SplitView.fillWidth: true
        color: ThemeTokens.background
    }
}`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Resizable"
      description="Accessible resizable panel groups and layout splitters with keyboard navigation and nested container support."
      tocItems={[
        { id: 'overview', title: 'Horizontal Split' },
        { id: 'nested', title: 'Nested Splitters' },
        { id: 'playground', title: 'Variants Playground' },
        { id: 'installation', title: 'Installation' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Horizontal Split Overview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Horizontal Split
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Panels automatically adapt to available width and provide interactive drag handles with boundary limits.
        </p>

        <ComponentPreview title="Horizontal Resizable Group" reactCode={horizontalCode}>
          <div className="w-full max-w-2xl">
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-52 rounded-lg border border-border bg-card overflow-hidden"
            >
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/20">
                  <span className="font-semibold text-foreground mb-1.5">Explorer Tree</span>
                  <Badge variant="outline">30% Initial Width</Badge>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70}>
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mb-1.5">Source Code Editor</span>
                  <Badge variant="secondary">70% Initial Width</Badge>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Nested Splitters */}
      <section id="nested" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Nested Splitters
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Embed vertical panel groups inside horizontal panels to construct multi-pane IDE workbenches and docking surfaces.
        </p>

        <ComponentPreview title="Nested Resizable Layout" reactCode={nestedCode}>
          <div className="w-full max-w-2xl">
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-60 rounded-lg border border-border bg-card overflow-hidden"
            >
              <ResizablePanel defaultSize={28} minSize={18}>
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/20">
                  <span className="font-semibold text-foreground mb-1.5">Sidebar</span>
                  <Badge variant="outline">28% Width</Badge>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={72}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={65} minSize={30}>
                    <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground mb-1.5">Editor Viewport</span>
                      <Badge variant="secondary">65% Height</Badge>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={35} minSize={20}>
                    <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/30">
                      <span className="font-semibold text-foreground mb-1.5">Integrated Terminal</span>
                      <Badge variant="outline">35% Height</Badge>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ComponentPreview>
      </section>

      {/* 3. Variants Playground */}
      <section id="playground" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants Playground
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Toggle between horizontal and vertical orientations and test visual grip handle styles dynamically.
        </p>

        <ComponentPreview
          title="Interactive Playground"
          reactCode={playgroundReactCode}
          qtCode={playgroundQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/20 border-b border-border text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Direction:</span>
                <SegmentedControl
                  size="sm"
                  value={playgroundDirection}
                  onValueChange={(val) => setPlaygroundDirection(val as 'horizontal' | 'vertical')}
                  options={[
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Vertical', value: 'vertical' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  size="sm"
                  variant={playgroundWithHandle ? 'default' : 'outline'}
                  onClick={() => setPlaygroundWithHandle((v) => !v)}
                >
                  {playgroundWithHandle ? 'Handle: Visible' : 'Handle: Hidden'}
                </Button>
              </div>
            </div>
          }
        >
          <div className="w-full max-w-2xl">
            <ResizablePanelGroup
              key={playgroundDirection}
              direction={playgroundDirection}
              className="min-h-56 rounded-lg border border-border bg-card overflow-hidden"
            >
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/20">
                  <span className="font-semibold text-foreground mb-1.5">Panel Alpha</span>
                  <Badge variant="outline">40% Initial</Badge>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle={playgroundWithHandle} />
              <ResizablePanel defaultSize={60} minSize={20}>
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mb-1.5">Panel Beta</span>
                  <Badge variant="secondary">60% Initial</Badge>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ComponentPreview>
      </section>

      {/* 4. Installation */}
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 5. Props Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="resizable" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'direction',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: 'Direction of panel layout (also supports orientation prop).',
            },
            {
              name: 'defaultSize',
              type: 'number',
              default: 'undefined',
              description: 'Initial percentage size allocated to the panel (0-100).',
            },
            {
              name: 'minSize',
              type: 'number',
              default: '0',
              description: 'Minimum allowed percentage size constraint.',
            },
            {
              name: 'maxSize',
              type: 'number',
              default: '100',
              description: 'Maximum allowed percentage size constraint.',
            },
            {
              name: 'collapsible',
              type: 'boolean',
              default: 'false',
              description: 'Whether the panel collapses completely past its minimum size.',
            },
            {
              name: 'withHandle',
              type: 'boolean',
              default: 'false',
              description: 'Renders an accessible tactile visual grip handle on the separator divider.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
