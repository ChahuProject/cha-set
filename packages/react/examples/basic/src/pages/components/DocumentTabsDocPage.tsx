import React, { useState } from 'react';
import {
  DocumentTabs,
  TabItem,
  Button,
  Badge,
  SegmentedControl,
  Card,
  useChaSetI18n,
  PlusIcon,
  ChaSetLogoIcon,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

interface TabData {
  id: string;
  title: string;
  canClose: boolean;
}

const initialTabs: TabData[] = [
  { id: 'readme', title: 'README.md', canClose: false },
  { id: 'main', title: 'Main.qml', canClose: true },
  { id: 'tabs', title: 'DocumentTabs.tsx', canClose: true },
  { id: 'tokens', title: 'ThemeTokens.qml', canClose: true },
];

export function DocumentTabsDocPage() {
  const { t } = useChaSetI18n();

  // 1. Sandbox State
  const [tabs, setTabs] = useState<TabData[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<string>('main');
  const [nextId, setNextId] = useState<number>(1);

  // 2. Width Mode State
  const [widthMode, setWidthMode] = useState<'content' | 'fixed'>('content');
  const [modeActiveTab, setModeActiveTab] = useState<string>('t2');

  // 3. Overflow State
  const [overflowTabs, setOverflowTabs] = useState<string[]>(
    Array.from({ length: 20 }, (_, i) => `File_${i + 1}.cpp`),
  );
  const [overflowActive, setOverflowActive] = useState<number>(0);

  // 4. Shell Chrome State
  const [shellActive, setShellActive] = useState<string>('app');

  // 5. TabItem Micro-Interaction State
  const [itemActive, setItemActive] = useState<string>('normal');
  const [lastEvent, setLastEvent] = useState<string>(
    t('desktopComposite.documentTabs.actionIdle', 'Idle'),
  );

  const handleAddTab = () => {
    const id = `new_${nextId}`;
    const newTitle = t('desktopComposite.documentTabs.tabTitle', 'Doc {{index}}', {
      index: nextId,
    });
    setTabs((prev) => [...prev, { id, title: newTitle, canClose: true }]);
    setActiveTab(id);
    setNextId((n) => n + 1);
  };

  const handleCloseTab = (id: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== id);
      if (activeTab === id && filtered.length > 0) {
        setActiveTab(filtered[filtered.length - 1]?.id ?? '');
      }
      return filtered;
    });
    setLastEvent(
      t('desktopComposite.documentTabs.actionClosed', 'Closed Tab: {{id}}', { id }),
    );
  };

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Document Tabs"
      description={t(
        'components.documentTabs.description',
        'Desktop workspace document tab strip container with smooth horizontal scroll, adaptive width, close actions, and shell chrome integration.',
      )}
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'width-modes', title: t('desktopComposite.documentTabs.widthModeTitle', 'Width Modes (Adaptive vs Fixed)') },
        { id: 'overflow-scroll', title: t('desktopComposite.documentTabs.overflowTitle', 'Overflow & Smooth Kinematic Scrolling') },
        { id: 'shell-chrome', title: t('desktopComposite.documentTabs.shellChromeTitle', 'Frameless Title Bar Integration') },
        { id: 'tab-item', title: t('desktopComposite.documentTabs.tabItemTitle', 'ChaSetTabItem Atomic Micro-Interactions') },
        { id: 'anatomy', title: t('showcase.anatomy', 'Anatomy') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      {/* 1. Interactive Overview / Sandbox */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.documentTabs.overviewDesc',
            'Desktop multi-document and workspace tab bar container with smooth close animations, pinned tabs, dynamic additions, and trailing action slots.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.documentTabs.sandboxTitle', 'Document Tabs Sandbox')}
          reactCode={`<DocumentTabs
  trailing={
    <Button size="sm" variant="ghost" onClick={handleAddTab}>
      <PlusIcon className="size-3.5" />
    </Button>
  }
>
  {tabs.map((tab) => (
    <TabItem
      key={tab.id}
      text={tab.title}
      selected={activeTab === tab.id}
      canClose={tab.canClose}
      onClick={() => setActiveTab(tab.id)}
      onClose={() => handleCloseTab(tab.id)}
    />
  ))}
</DocumentTabs>`}
          qtCode={`ChaSetDocumentTabs {
    width: parent.width
    trailingItems: [
        ChaSetButton {
            size: "sm"
            variant: "ghost"
            icon: "plus"
            onClicked: root.addTab()
        }
    ]

    Repeater {
        model: root.tabsModel
        ChaSetTabItem {
            text: modelData.title
            selected: root.activeTabId === modelData.id
            canClose: modelData.canClose
            onClicked: root.activeTabId = modelData.id
            onCloseClicked: root.removeTab(modelData.id)
        }
    }
}`}
        >
          <div className="w-full max-w-2xl border border-border rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
            <DocumentTabs
              trailing={
                <Button
                  size="sm"
                  variant="ghost"
                  className="size-7 p-0"
                  onClick={handleAddTab}
                  title={t('desktopComposite.documentTabs.newTab', 'New Tab')}
                >
                  <PlusIcon className="size-3.5" />
                </Button>
              }
            >
              {tabs.map((tab) => (
                <TabItem
                  key={tab.id}
                  text={tab.title}
                  selected={activeTab === tab.id}
                  canClose={tab.canClose}
                  onClick={() => setActiveTab(tab.id)}
                  onClose={() => handleCloseTab(tab.id)}
                />
              ))}
            </DocumentTabs>

            <div className="p-6 bg-card text-foreground flex flex-col items-center justify-center gap-3 min-h-[9rem]">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {t('desktopComposite.documentTabs.totalTabs', 'Total Tabs: {{count}}', {
                    count: tabs.length,
                  })}
                </Badge>
                <Badge variant="secondary">
                  {t('desktopComposite.documentTabs.activeTab', 'Active: {{title}}', {
                    title: tabs.find((t) => t.id === activeTab)?.title || 'None',
                  })}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {tabs.length > 0
                  ? `Active document pane: ${activeTab}`
                  : 'All tabs closed. Click + to add a document tab.'}
              </p>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Width Modes */}
      <section id="width-modes" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t(
            'desktopComposite.documentTabs.widthModeTitle',
            'Width Modes (Adaptive vs Fixed)',
          )}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.documentTabs.widthModeDesc',
            'Switch between VS Code-style content-adaptive width and Chrome-style fixed width.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.documentTabs.widthModeTitle', 'Width Modes (Adaptive vs Fixed)')}
          reactCode={`<SegmentedControl
  value={widthMode}
  onValueChange={(val) => setWidthMode(val)}
  items={[
    { value: 'content', label: 'Adaptive (Content)' },
    { value: 'fixed', label: 'Fixed Width' },
  ]}
/>

<DocumentTabs>
  <TabItem text="Index" tabWidthMode={widthMode} />
  <TabItem text="UserProfileDialog.tsx" tabWidthMode={widthMode} />
  <TabItem text="ExtremelyLongFilenameForWidthTesting.qml" tabWidthMode={widthMode} />
</DocumentTabs>`}
          qtCode={`ChaSetSegmentedControl {
    currentIndex: root.isFixed ? 1 : 0
    model: ["Content", "Fixed"]
    onCurrentIndexChanged: root.isFixed = (currentIndex === 1)
}

ChaSetDocumentTabs {
    width: parent.width
    ChaSetTabItem {
        text: "Index"
        tabWidthMode: root.isFixed ? "fixed" : "content"
    }
    ChaSetTabItem {
        text: "UserProfileDialog.tsx"
        tabWidthMode: root.isFixed ? "fixed" : "content"
    }
}`}
        >
          <div className="w-full max-w-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t('common.mode', 'Mode:')}
              </span>
              <SegmentedControl
                value={widthMode}
                onValueChange={(val) => setWidthMode(val as 'content' | 'fixed')}
                options={[
                  {
                    value: 'content',
                    label: t(
                      'desktopComposite.documentTabs.modeContent',
                      'Adaptive Width (Content)',
                    ),
                  },
                  {
                    value: 'fixed',
                    label: t(
                      'desktopComposite.documentTabs.modeFixed',
                      'Fixed Width',
                    ),
                  },
                ]}
              />
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-card text-card-foreground">
              <DocumentTabs>
                <TabItem
                  text="Index.tsx"
                  tabWidthMode={widthMode}
                  selected={modeActiveTab === 't1'}
                  onClick={() => setModeActiveTab('t1')}
                />
                <TabItem
                  text="UserProfileDialog.tsx"
                  tabWidthMode={widthMode}
                  selected={modeActiveTab === 't2'}
                  onClick={() => setModeActiveTab('t2')}
                />
                <TabItem
                  text="CrossStackTypographyContractGateTestAssertion.qml"
                  tabWidthMode={widthMode}
                  selected={modeActiveTab === 't3'}
                  onClick={() => setModeActiveTab('t3')}
                />
              </DocumentTabs>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 3. Overflow & Smooth Kinematic Scrolling */}
      <section id="overflow-scroll" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t(
            'desktopComposite.documentTabs.overflowTitle',
            'Overflow & Smooth Kinematic Scrolling',
          )}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.documentTabs.overflowDesc',
            'Simulate 20+ tabs under heavy load to verify horizontal wheel scrolling, boundary damping, and responsive clipping.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.documentTabs.overflowTitle', 'Overflow & Smooth Kinematic Scrolling')}
          reactCode={`<DocumentTabs>
  {overflowTabs.map((name, i) => (
    <TabItem
      key={i}
      text={name}
      selected={overflowActive === i}
      onClick={() => setOverflowActive(i)}
    />
  ))}
</DocumentTabs>`}
          qtCode={`ChaSetDocumentTabs {
    width: parent.width
    Repeater {
        model: 20
        ChaSetTabItem {
            text: "File_" + (index + 1) + ".cpp"
            selected: root.overflowIndex === index
            onClicked: root.overflowIndex = index
        }
    }
}`}
        >
          <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setOverflowTabs((prev) => [
                    ...prev,
                    ...Array.from(
                      { length: 15 },
                      (_, i) => `Extra_${prev.length + i + 1}.ts`,
                    ),
                  ])
                }
              >
                {t('desktopComposite.documentTabs.addBatch', 'Batch Add 15 Tabs')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setOverflowTabs(
                    Array.from({ length: 20 }, (_, i) => `File_${i + 1}.cpp`),
                  )
                }
              >
                {t('desktopComposite.documentTabs.resetTabs', 'Reset Tabs')}
              </Button>
              <Badge variant="outline" className="ml-auto">
                {t('desktopComposite.documentTabs.totalTabs', 'Total Tabs: {{count}}', {
                  count: overflowTabs.length,
                })}
              </Badge>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-card text-card-foreground">
              <DocumentTabs>
                {overflowTabs.map((name, i) => (
                  <TabItem
                    key={i}
                    text={name}
                    selected={overflowActive === i}
                    onClick={() => setOverflowActive(i)}
                  />
                ))}
              </DocumentTabs>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 4. Frameless Title Bar Integration */}
      <section id="shell-chrome" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t(
            'desktopComposite.documentTabs.shellChromeTitle',
            'Frameless Title Bar Integration',
          )}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.documentTabs.shellChromeDesc',
            'Enable useShellChrome and transparent fill to embed the document tabs directly into the frameless native title bar.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.documentTabs.shellChromeTitle', 'Frameless Title Bar Integration')}
          reactCode={`<div className="flex items-center h-10 bg-muted/60 border-b border-border px-2">
  <ChaSetLogoIcon className="size-4 mr-2" />
  <DocumentTabs useShellChrome className="flex-1">
    <TabItem text="Editor.tsx" useShellChrome selected />
    <TabItem text="Config.json" useShellChrome />
  </DocumentTabs>
  <div className="flex items-center gap-1">
    {/* Window Controls */}
  </div>
</div>`}
          qtCode={`ChaSetDocumentTabs {
    useShellChrome: true
    shellTabFill: "transparent"
    ChaSetTabItem {
        useShellChrome: true
        text: "Editor.qml"
        selected: true
    }
}`}
        >
          <div className="w-full max-w-2xl border border-border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm">
            <div className="flex items-center h-10 bg-muted/50 text-foreground border-b border-border/50 px-2 gap-2">
              <ChaSetLogoIcon className="size-4 shrink-0 text-primary" />
              <DocumentTabs useShellChrome className="flex-1 h-9">
                <TabItem
                  text="Workspace.tsx"
                  useShellChrome
                  selected={shellActive === 'app'}
                  onClick={() => setShellActive('app')}
                />
                <TabItem
                  text="Styles.css"
                  useShellChrome
                  selected={shellActive === 'css'}
                  onClick={() => setShellActive('css')}
                />
                <TabItem
                  text="Schema.json"
                  useShellChrome
                  selected={shellActive === 'json'}
                  onClick={() => setShellActive('json')}
                />
              </DocumentTabs>
              <div className="flex items-center gap-1.5 shrink-0 px-1 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-border inline-block" />
                <span className="size-2.5 rounded-full bg-border inline-block" />
                <span className="size-2.5 rounded-full bg-destructive/60 inline-block" />
              </div>
            </div>

            <div className="h-24 p-4 bg-card text-foreground flex items-center justify-center text-xs text-muted-foreground">
              {t(
                'desktopComposite.documentTabs.windowMockTitle',
                'Chahu Workspace Studio',
              )}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 5. ChaSetTabItem Atomic Micro-Interactions */}
      <section id="tab-item" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t(
            'desktopComposite.documentTabs.tabItemTitle',
            'ChaSetTabItem Atomic Micro-Interactions',
          )}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.documentTabs.tabItemDesc',
            'Inspect TabItem standalone micro-interactions: close button hover highlight, long text tooltip, middle-click close, and right-click context menu.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.documentTabs.tabItemTitle', 'ChaSetTabItem Atomic Micro-Interactions')}
          reactCode={`<TabItem
  text="RegularDoc.tsx"
  selected={activeTab === 'normal'}
  onClick={() => setActiveTab('normal')}
  onClose={() => logEvent('Closed tab')}
  onMiddleClick={() => logEvent('Middle-clicked')}
  onContextMenu={(e) => logEvent('Context menu')}
/>`}
          qtCode={`ChaSetTabItem {
    text: "RegularDoc.qml"
    selected: root.selected
    onCloseClicked: console.log("closeClicked")
    onMiddleClicked: console.log("middleClicked")
    onContextMenuRequested: console.log("contextMenuRequested")
}`}
        >
          <div className="w-full max-w-2xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 p-4 border border-border rounded-lg bg-card text-card-foreground">
              <TabItem
                text={t(
                  'desktopComposite.documentTabs.singleTabNormal',
                  'RegularDoc.tsx',
                )}
                selected={itemActive === 'normal'}
                onClick={() => {
                  setItemActive('normal');
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionSelected',
                      'Selected Tab: {{id}}',
                      { id: 'RegularDoc.tsx' },
                    ),
                  );
                }}
                onClose={() =>
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionClosed',
                      'Closed Tab: {{id}}',
                      { id: 'RegularDoc.tsx' },
                    ),
                  )
                }
                onMiddleClick={() =>
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionMiddleClicked',
                      'Middle-click Closed: {{id}}',
                      { id: 'RegularDoc.tsx' },
                    ),
                  )
                }
                onContextMenu={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionContextMenu',
                      'Context Menu: {{id}}',
                      { id: 'RegularDoc.tsx' },
                    ),
                  );
                }}
              />

              <TabItem
                text={t(
                  'desktopComposite.documentTabs.singleTabPinned',
                  'CoreConfig.json (Pinned)',
                )}
                canClose={false}
                selected={itemActive === 'pinned'}
                onClick={() => {
                  setItemActive('pinned');
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionSelected',
                      'Selected Tab: {{id}}',
                      { id: 'CoreConfig.json' },
                    ),
                  );
                }}
              />

              <TabItem
                text={t(
                  'desktopComposite.documentTabs.singleTabLong',
                  'ExtremelyLongFileNameForTooltipTruncationExample.tsx',
                )}
                selected={itemActive === 'long'}
                onClick={() => {
                  setItemActive('long');
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionSelected',
                      'Selected Tab: {{id}}',
                      { id: 'LongFilename' },
                    ),
                  );
                }}
                onClose={() =>
                  setLastEvent(
                    t(
                      'desktopComposite.documentTabs.actionClosed',
                      'Closed Tab: {{id}}',
                      { id: 'LongFilename' },
                    ),
                  )
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t('desktopComposite.documentTabs.lastAction', 'Last Event: {{event}}', {
                  event: lastEvent,
                })}
              </span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { DocumentTabs, TabItem } from '@chahu/cha-set';

<DocumentTabs>
  <TabItem text="Document.tsx" selected />
  <TabItem text="README.md" canClose={false} />
</DocumentTabs>`}
        qtCode={`import ChaSet

ChaSetDocumentTabs {
    width: parent.width
    ChaSetTabItem {
        text: "Document.qml"
        selected: true
    }
    ChaSetTabItem {
        text: "README.md"
        canClose: false
    }
}`}
      />

      {/* Keyboard Navigation from Markdown */}
      <DocMarkdown id="document-tabs" section="keyboard" />

      {/* Props Reference from Markdown */}
      <DocMarkdown id="document-tabs" section="props" />
    </DocLayout>
  );
}
