import React, { useState } from 'react';
import { SplitterHandle, Card, Button, Badge, CopyableBadge, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function SplitterHandleDocPage() {
  const { t } = useChaSetI18n();
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
      description={t('components.splitterHandle.description', 'Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation.')}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('desktopComposite.splitterHandle.overviewHeading', 'Interactive Overview')}</DocText>
        <DocText role="p">
          {t('desktopComposite.splitterHandle.overviewDesc', 'Drag the right edge handle to resize the sidebar. Double click or press Enter to reset to 200.')}
        </DocText>

        <ComponentPreview title={t('desktopComposite.splitterHandle.sandboxTitle', 'Splitter Handle Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                {t('surfaces.splitterHandle.currentWidth')} <Badge variant="outline">{sidebarWidth}</Badge>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarWidth(200)}
              >
                {t('surfaces.splitterHandle.reset200')}
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
                <span>{t('surfaces.splitterHandle.sidebar')}</span>
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
                <span>{t('surfaces.splitterHandle.mainContent')}</span>
                <span className="text-xs text-muted-foreground/70">{t('surfaces.splitterHandle.focusHint')}</span>
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
        <DocText role="h2">{t('desktopComposite.splitterHandle.verticalTitle', 'Vertical Edge Handle')}</DocText>
        <DocText role="p" className="flex items-center gap-1.5 flex-wrap">
          <span>{t('desktopComposite.splitterHandle.horizontalPrefix', 'Handles can also be attached to horizontal edges (')}</span>
          <CopyableBadge size="sm" text="top" />
          <span>{t('common.or', 'or')}</span>
          <CopyableBadge size="sm" text="bottom" />
          <span>{t('desktopComposite.splitterHandle.horizontalSuffix', ') for bottom console or drawer resizing.')}</span>
        </DocText>
        <Card className="w-full max-w-xl mx-auto h-64 flex flex-col overflow-hidden bg-card">
          <div className="flex-1 p-4 text-sm text-muted-foreground">
            {t('surfaces.splitterHandle.editorCanvasArea')}
          </div>
          <div
            style={{ height: `${bottomHeight * 0.0625}rem` }}
            className="relative bg-muted/40 p-3 text-xs flex items-center justify-between shrink-0"
          >
            <span className="font-semibold">{t('surfaces.splitterHandle.terminalConsole')}</span>
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

      <DocMarkdown id="splitter-handle" section="animations" />

            <DocMarkdown id="splitter-handle" section="keyboard" />

      <DocMarkdown id="splitter-handle" section="props" />
    </DocLayout>
  );
}
