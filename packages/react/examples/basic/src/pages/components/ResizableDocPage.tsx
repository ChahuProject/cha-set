import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle, Button, Badge, SegmentedControl, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function ResizableDocPage() {
  const { t } = useChaSetI18n();
  const [playgroundDirection, setPlaygroundDirection] = useState<
    'horizontal' | 'vertical'
  >('horizontal');
  const [playgroundWithHandle, setPlaygroundWithHandle] = useState(true);

  // Dynamic real-time panel sizes
  const [horizLeft, setHorizLeft] = useState(35);
  const [nestedSidebar, setNestedSidebar] = useState(28);
  const [nestedEditor, setNestedEditor] = useState(65);
  const [playgroundFirst, setPlaygroundFirst] = useState(40);

  const horizontalCode = `<ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border border-border">
  <ResizablePanel defaultSize={35} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-6 bg-muted/20">
      <span className="font-semibold text-sm">Navigation Sidebar</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={65} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold text-sm">Editor Workspace</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`;

  const horizontalQtCode = `ChaSetResizable {
  width: 520
  height: 220
  orientation: Qt.Horizontal
  withHandle: true

  Rectangle {
    SplitView.preferredWidth: 180
    SplitView.minimumWidth: 40
    color: ThemeTokens.panel
  }
  Rectangle {
    SplitView.fillWidth: true
    color: ThemeTokens.background
  }
}`;

  const nestedCode = `<ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border border-border">
  <ResizablePanel defaultSize={28} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-4 bg-muted/20 text-xs">
      File Tree
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={72} minSize={5} maxSize={95}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={65} minSize={5} maxSize={95}>
        <div className="flex h-full items-center justify-center p-4 text-xs font-mono">
          main.rs (Code Editor)
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={5} maxSize={95}>
        <div className="flex h-full items-center justify-center p-4 bg-muted/30 text-xs font-mono">
          Terminal Console / Output
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`;

  const nestedQtCode = `ChaSetResizable {
  width: 520
  height: 240
  orientation: Qt.Horizontal
  withHandle: true

  Rectangle {
    SplitView.preferredWidth: 140
    color: ThemeTokens.panel
  }
  ChaSetResizable {
    SplitView.fillWidth: true
    orientation: Qt.Vertical
    withHandle: true

    Rectangle {
      SplitView.preferredHeight: 140
      color: ThemeTokens.background
    }
    Rectangle {
      SplitView.fillHeight: true
      color: ThemeTokens.panelRaised
    }
  }
}`;

  const playgroundReactCode = `<ResizablePanelGroup direction="${playgroundDirection}" className="min-h-56 rounded-lg border border-border">
  <ResizablePanel defaultSize={40} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-4 bg-muted/20 text-sm">
      Panel Alpha
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle={${playgroundWithHandle}} />
  <ResizablePanel defaultSize={60} minSize={5} maxSize={95}>
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
    SplitView.minimumWidth: 40
    color: ThemeTokens.panel
  }
  Rectangle {
    SplitView.fillWidth: true
    color: ThemeTokens.background
  }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Resizable"
      description={t('components.resizable.description', 'Accessible resizable panel groups and layout splitters.')}
    >
      {/* 1. Horizontal Split Overview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.resizable.horizontalTitle', 'Horizontal Split')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.resizable.horizontalDesc', 'Panels automatically adapt to available width and provide interactive drag handles with boundary limits.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.resizable.horizontalSandboxTitle', 'Horizontal Resizable Group')}
          reactCode={horizontalCode}
          qtCode={horizontalQtCode}
        >
          <div className="w-full">
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-64 rounded-lg border border-border bg-card overflow-hidden"
            >
              <ResizablePanel
                defaultSize={35}
                minSize={5}
                maxSize={95}
                onResize={(size) => {
                  const p = typeof size === 'number' ? size : size?.asPercentage;
                  if (typeof p === 'number') setHorizLeft(Math.round(p));
                }}
              >
                <div className="flex h-full flex-col justify-center items-center p-6 text-xs text-muted-foreground bg-muted/20">
                  <span className="font-semibold text-foreground mb-1.5 text-sm">{t('surfaces.resizable.explorerTree')}</span>
                  <Badge variant="outline">{t('surfaces.resizable.percentWidth', { width: horizLeft })}</Badge>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={65} minSize={5} maxSize={95}>
                <div className="flex h-full flex-col justify-center items-center p-6 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mb-1.5 text-sm">{t('surfaces.resizable.sourceCodeEditor')}</span>
                  <Badge variant="secondary">{t('surfaces.resizable.percentWidth', { width: 100 - horizLeft })}</Badge>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@chahu/cha-set';

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>Content</ResizablePanel>
</ResizablePanelGroup>`}
        qtCode={`import ChaSet

ChaSetResizable {
    width: parent.width
    orientation: Qt.Horizontal
}`}
      />



      {/* 2. Nested Splitters */}
      <section id="nested" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.resizable.nestedTitle', 'Nested Resizable Layout')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.resizable.nestedDesc', 'Embed vertical panel groups inside horizontal panels to construct multi-pane IDE workbenches and docking surfaces.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.resizable.nestedTitle', 'Nested Resizable Layout')}
          reactCode={nestedCode}
          qtCode={nestedQtCode}
        >
          <div className="w-full max-w-2xl">
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-60 rounded-lg border border-border bg-card overflow-hidden"
            >
              <ResizablePanel
                defaultSize={28}
                minSize={5}
                maxSize={95}
                onResize={(size) => {
                  const p = typeof size === 'number' ? size : size?.asPercentage;
                  if (typeof p === 'number') setNestedSidebar(Math.round(p));
                }}
              >
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/20">
                  <span className="font-semibold text-foreground mb-1.5">{t('surfaces.resizable.sidebar')}</span>
                  <Badge variant="outline">{t('surfaces.resizable.percentWidth', { width: nestedSidebar })}</Badge>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={72} minSize={5} maxSize={95}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    defaultSize={65}
                    minSize={5}
                    maxSize={95}
                    onResize={(size) => {
                      const p = typeof size === 'number' ? size : size?.asPercentage;
                      if (typeof p === 'number') setNestedEditor(Math.round(p));
                    }}
                  >
                    <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground mb-1.5">{t('surfaces.resizable.editorViewport')}</span>
                      <Badge variant="secondary">{t('surfaces.resizable.percentHeight', { height: nestedEditor })}</Badge>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={35} minSize={5} maxSize={95}>
                    <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/30">
                      <span className="font-semibold text-foreground mb-1.5">{t('surfaces.resizable.integratedTerminal')}</span>
                      <Badge variant="outline">{t('surfaces.resizable.percentHeight', { height: 100 - nestedEditor })}</Badge>
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
          {t('desktopComposite.resizable.playgroundTitle', 'Interactive Playground')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.resizable.playgroundDesc', 'Toggle between horizontal and vertical orientations and test visual grip handle styles dynamically.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.resizable.playgroundTitle', 'Interactive Playground')}
          reactCode={playgroundReactCode}
          qtCode={playgroundQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/20 border-b border-border text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">{t('surfaces.resizable.direction')}</span>
                <SegmentedControl
                  size="default"
                  value={playgroundDirection}
                  onValueChange={(val) => setPlaygroundDirection(val as 'horizontal' | 'vertical')}
                  options={[
                    { label: t('surfaces.resizable.horizontal'), value: 'horizontal' },
                    { label: t('surfaces.resizable.vertical'), value: 'vertical' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  size="sm"
                  variant={playgroundWithHandle ? 'default' : 'outline'}
                  onClick={() => setPlaygroundWithHandle((v) => !v)}
                >
                  {playgroundWithHandle ? t('surfaces.resizable.handleVisible') : t('surfaces.resizable.handleHidden')}
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
              <ResizablePanel
                defaultSize={40}
                minSize={5}
                maxSize={95}
                onResize={(size) => {
                  const p = typeof size === 'number' ? size : size?.asPercentage;
                  if (typeof p === 'number') setPlaygroundFirst(Math.round(p));
                }}
              >
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground bg-muted/20">
                  <span className="font-semibold text-foreground mb-1.5">{t('surfaces.resizable.panelAlpha')}</span>
                  <Badge variant="outline">
                    {playgroundDirection === 'horizontal' ? t('surfaces.resizable.percentWidth', { width: playgroundFirst }) : t('surfaces.resizable.percentHeight', { height: playgroundFirst })}
                  </Badge>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle={playgroundWithHandle} />
              <ResizablePanel defaultSize={60} minSize={5} maxSize={95}>
                <div className="flex h-full flex-col justify-center items-center p-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mb-1.5">{t('surfaces.resizable.panelBeta')}</span>
                  <Badge variant="secondary">
                    {playgroundDirection === 'horizontal' ? t('surfaces.resizable.percentWidth', { width: 100 - playgroundFirst }) : t('surfaces.resizable.percentHeight', { height: 100 - playgroundFirst })}
                  </Badge>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ComponentPreview>
      </section>

      {/* 4. Installation */}
      {/* 5. Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.resizable.animationsDesc', 'Motion tokens and kinematic timing contracts for Resizable dividers and handles.')}
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.resizable.animationsBullet1', 'Separator grip indicator border and hover highlight color transitions animate smoothly over duration-quick (150ms) using ease-standard curve (Qt: ThemeTokens.motionQuick / ThemeTokens.easeStandard).')}
          </li>
          <li>
            {t('desktopComposite.resizable.animationsBullet2', 'Panel resizing kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.')}
          </li>
          <li>
            {t('desktopComposite.resizable.animationsBullet3', 'Respects prefers-reduced-motion on Web and ThemeTokens.animationsEnabled in Qt.')}
          </li>
        </ul>
      </section>

      {/* 6. Keyboard Navigation */}
            <ComponentReference
        name="Resizable"
        componentId="resizable"
        props={[
            {
              name: 'direction',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: t('components.resizable.directionDesc', 'Direction of panel layout (also supports orientation prop).'),
            },
            {
              name: 'defaultSize',
              type: 'number',
              default: 'undefined',
              description: t('components.resizable.defaultSizeDesc', 'Initial percentage size allocated to the panel (0-100).'),
            },
            {
              name: 'minSize',
              type: 'number',
              default: '0',
              description: t('components.resizable.minSizeDesc', 'Minimum allowed percentage size constraint.'),
            },
            {
              name: 'maxSize',
              type: 'number',
              default: '100',
              description: t('components.resizable.maxSizeDesc', 'Maximum allowed percentage size constraint.'),
            },
            {
              name: 'collapsible',
              type: 'boolean',
              default: 'false',
              description: t('components.resizable.collapsibleDesc', 'Whether the panel collapses completely past its minimum size.'),
            },
            {
              name: 'withHandle',
              type: 'boolean',
              default: 'false',
              description: t('components.resizable.withHandleDesc', 'Renders an accessible tactile visual grip handle on the separator divider.'),
            },
          ]}
      />
    </DocLayout>
  );
}
