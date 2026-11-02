import React, { useState } from 'react';
import {
  SplitterHandle,
  Card,
  Button,
  Badge,
  CopyableBadge,
  ScrollArea,
  FileTextIcon,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';
import { NAVIGATION_DATA, FEATURE_CARDS_DATA } from '../../data/showcaseData.generated';

const navItems = NAVIGATION_DATA.flatMap((cat) => cat.items).slice(0, 16);
const featureCards = FEATURE_CARDS_DATA.slice(0, 6);

export function SplitterHandleDocPage() {
  const { t } = useChaSetI18n();
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [bottomHeight, setBottomHeight] = useState(120);
  const [selectedNavId, setSelectedNavId] = useState(navItems[0]?.id || 'button');

  const selectedItem = navItems.find((item) => item.id === selectedNavId) || navItems[0];

  const heroReactCode = `<div className="flex h-72 border border-border rounded-md overflow-hidden bg-card">
  {/* Resizable Sidebar with ScrollArea */}
  <div
    style={{ width: \`\${sidebarWidth * 0.0625}rem\` }}
    className="relative bg-muted/30 flex flex-col shrink-0 min-w-0"
  >
    <div className="p-3 border-b border-border/50 flex items-center justify-between text-xs font-medium shrink-0">
      <span className="truncate">Sidebar</span>
      <Badge variant="secondary">{sidebarWidth}</Badge>
    </div>
    <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
      <div className="p-2 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className="px-2.5 py-1.5 text-xs rounded hover:bg-accent/50 cursor-pointer truncate"
          >
            {item.title}
          </div>
        ))}
      </div>
    </ScrollArea>
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

  {/* Main Viewport Area with ScrollArea */}
  <div className="flex-1 min-w-0 flex flex-col bg-background">
    <div className="p-3 border-b border-border/50 flex items-center justify-between text-xs shrink-0">
      <span className="font-semibold text-foreground">Main Viewport</span>
      <Badge variant="outline">Scrollable</Badge>
    </div>
    <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
      <div className="p-4 space-y-3">
        {featureCards.map((card) => (
          <div key={card.id} className="p-3 border border-border/60 rounded-md bg-card">
            <div className="font-medium text-xs text-foreground">{card.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
</div>`;

  const heroQtCode = `Row {
    anchors.fill: parent

    // Resizable Sidebar with ChaSetScrollArea
    Rectangle {
        width: root.sidebarWidth
        height: parent.height
        color: ThemeTokens.panel
        clip: true

        ChaSetScrollArea {
            anchors.fill: parent
            anchors.topMargin: 36
            contentWidth: width
            contentHeight: sidebarCol.implicitHeight

            Column {
                id: sidebarCol
                width: parent.width
                // Navigation items list...
            }
        }

        ChaSetSplitterHandle {
            edge: "right"
            targetSize: root.sidebarWidth
            minSize: 140
            maxSize: 400
            defaultSize: 200
            onSizeChanging: (newSize) => root.sidebarWidth = newSize
            onSizeChanged: (finalSize) => root.sidebarWidth = finalSize
        }
    }

    // Main Viewport Area with ChaSetScrollArea
    Rectangle {
        width: parent.width - root.sidebarWidth
        height: parent.height
        color: ThemeTokens.background
        clip: true

        ChaSetScrollArea {
            anchors.fill: parent
            anchors.topMargin: 36
            contentWidth: width
            contentHeight: mainCol.implicitHeight

            Column {
                id: mainCol
                width: parent.width
                // Feature cards list...
            }
        }
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
            <Card className="flex h-72 border border-border rounded-md overflow-hidden bg-card text-card-foreground">
              {/* Resizable Sidebar */}
              <div
                style={{ width: `${sidebarWidth * 0.0625}rem` }}
                className="relative bg-muted/30 flex flex-col shrink-0 min-w-0"
              >
                <div className="p-3 border-b border-border/50 flex items-center justify-between text-xs font-medium shrink-0">
                  <span className="truncate text-foreground">{t('surfaces.splitterHandle.sidebar')}</span>
                  <Badge variant="secondary" className="shrink-0 font-mono text-[0.625rem]">{Math.round(sidebarWidth)}</Badge>
                </div>
                <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
                  <div className="p-2 space-y-1">
                    {navItems.map((item) => {
                      const isSelected = item.id === selectedNavId;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedNavId(item.id)}
                          className={`px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-accent text-accent-foreground font-medium'
                              : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileTextIcon className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <Badge variant="outline" className="text-[0.5625rem] px-1 py-0 shrink-0">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
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

              {/* Main Content Viewport */}
              <div className="flex-1 min-w-0 flex flex-col bg-background text-foreground">
                <div className="p-3 border-b border-border/50 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-foreground truncate">{t('surfaces.splitterHandle.mainContent')}</span>
                    <Badge variant="outline" className="text-[0.625rem] shrink-0">
                      {t('surfaces.splitterHandle.scrollable')}
                    </Badge>
                  </div>
                  <span className="text-[0.625rem] text-muted-foreground/70 hidden sm:inline truncate">
                    {t('surfaces.splitterHandle.focusHint')}
                  </span>
                </div>
                <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
                  <div className="p-4 space-y-3">
                    <div className="p-3 rounded-md bg-muted/40 border border-border/50 text-xs">
                      <div className="font-semibold text-foreground mb-1">
                        {t('surfaces.splitterHandle.fluidLayoutTitle')}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('surfaces.splitterHandle.fluidLayoutDesc')}
                      </p>
                      {selectedItem && (
                        <div className="mt-2 text-[0.6875rem] text-primary font-medium">
                          {t('surfaces.splitterHandle.activeItem', { name: selectedItem.title })}
                        </div>
                      )}
                    </div>
                    {featureCards.map((card) => (
                      <div key={card.id} className="p-3 border border-border/60 rounded-md bg-card text-card-foreground">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium text-xs text-foreground truncate">{card.title}</span>
                          <Badge variant="secondary" className="text-[0.5625rem] shrink-0">
                            {card.badge}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
        <Card className="w-full max-w-xl mx-auto h-64 flex flex-col overflow-hidden bg-card text-card-foreground">
          <div className="flex-1 min-h-0 flex flex-col bg-background text-foreground">
            <div className="px-3 py-2 border-b border-border/50 text-xs font-semibold text-foreground flex items-center justify-between shrink-0">
              <span>{t('surfaces.splitterHandle.editorCanvasArea')}</span>
              <Badge variant="outline" className="text-[0.625rem]">
                {t('surfaces.splitterHandle.canvasBadge')}
              </Badge>
            </div>
            <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
              <div className="p-3 space-y-1 font-mono text-xs text-muted-foreground">
                <p className="text-foreground/90">&#47;&#47; ChaSet Splitter Handle Component</p>
                <p>import &#123; SplitterHandle &#125; from &apos;@chahu/cha-set&apos;;</p>
                <p>&nbsp;</p>
                <p>const [height, setHeight] = useState(120);</p>
                <p>&nbsp;</p>
                <p>&lt;div style=&#123;&#123; height &#125;&#125; className=&quot;relative&quot;&gt;</p>
                <p>&nbsp;&nbsp;&lt;SplitterHandle edge=&quot;top&quot; targetSize=&#123;height&#125; /&gt;</p>
                <p>&lt;/div&gt;</p>
              </div>
            </ScrollArea>
          </div>
          <div
            style={{ height: `${bottomHeight * 0.0625}rem` }}
            className="relative bg-muted/40 flex flex-col shrink-0 min-h-0"
          >
            <div className="p-2 border-b border-border/50 text-xs flex items-center justify-between shrink-0">
              <span className="font-semibold text-foreground">{t('surfaces.splitterHandle.terminalConsole')}</span>
              <Badge variant="secondary" className="font-mono text-[0.625rem]">{Math.round(bottomHeight)}</Badge>
            </div>
            <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
              <div className="p-2 font-mono text-[0.6875rem] text-muted-foreground space-y-1">
                <p>{t('surfaces.splitterHandle.logBuildStarted')}</p>
                <p>{t('surfaces.splitterHandle.logSchemasLoaded')}</p>
                <p>{t('surfaces.splitterHandle.logClamped')}</p>
                <p>{t('surfaces.splitterHandle.logReady')}</p>
              </div>
            </ScrollArea>
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
