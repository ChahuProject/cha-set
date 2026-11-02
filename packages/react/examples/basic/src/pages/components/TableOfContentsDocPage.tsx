import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  TableOfContents,
  ScrollArea,
  Badge,
  Button,
  Switch,
  SegmentedControl,
  Slider,
  RotateCcwIcon,
  flattenTocItems,
  type TocItem,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocMarkdown } from '../../components/DocMarkdown';
import { DocText } from '../../components/DocText';

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
}

export function TableOfContentsDocPage() {
  const { t } = useChaSetI18n();
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [bannerHeight, setBannerHeight] = useState<number>(40);
  const [variant, setVariant] = useState<'default' | 'track' | 'flat'>('default');
  const [size, setSize] = useState<'default' | 'sm'>('default');
  const [showTrack, setShowTrack] = useState<boolean>(true);
  const [activeId, setActiveId] = useState<string>('architecture');

  const scrollAreaRootRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isScrollingToRef = useRef<boolean>(false);

  const demoItems: TocItem[] = [
    {
      id: 'introduction',
      title: t('surfaces.tableOfContents.items.introduction'),
      level: 1,
      children: [
        { id: 'motivation', title: t('surfaces.tableOfContents.items.motivation'), level: 2 },
        { id: 'design-principles', title: t('surfaces.tableOfContents.items.designPrinciples'), level: 2 },
      ],
    },
    {
      id: 'architecture',
      title: t('surfaces.tableOfContents.items.architecture'),
      level: 1,
      children: [
        {
          id: 'data-flow',
          title: t('surfaces.tableOfContents.items.dataFlow'),
          level: 2,
          children: [
            { id: 'signals', title: t('surfaces.tableOfContents.items.signals'), level: 3 },
            { id: 'batching', title: t('surfaces.tableOfContents.items.batching'), level: 3 },
          ],
        },
        { id: 'boundary', title: t('surfaces.tableOfContents.items.boundary'), level: 2 },
      ],
    },
    {
      id: 'implementation',
      title: t('surfaces.tableOfContents.items.implementation'),
      level: 1,
      children: [
        { id: 'banner-offset', title: t('surfaces.tableOfContents.items.bannerOffset'), level: 2 },
        { id: 'tree-rendering', title: t('surfaces.tableOfContents.items.treeRendering'), level: 2 },
      ],
    },
    {
      id: 'changelog',
      title: t('surfaces.tableOfContents.items.changelog'),
      level: 1,
    },
  ];

  const flatItems = useMemo(() => flattenTocItems(demoItems), [demoItems]);

  const handleTocSelect = (item: TocItem) => {
    setActiveId(item.id);
    const targetEl = sectionRefs.current[item.id];
    const viewport = scrollAreaRootRef.current?.querySelector('.toc-reading-viewport') as HTMLElement | null;
    if (targetEl && viewport) {
      isScrollingToRef.current = true;
      const viewportRect = viewport.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const relativeTop = targetRect.top - viewportRect.top + viewport.scrollTop;
      const offset = showBanner ? bannerHeight + 16 : 16;
      viewport.scrollTo({
        top: Math.max(0, relativeTop - offset),
        behavior: 'smooth',
      });
      setTimeout(() => {
        isScrollingToRef.current = false;
      }, 350);
    }
  };

  useEffect(() => {
    const viewport = scrollAreaRootRef.current?.querySelector('.toc-reading-viewport') as HTMLElement | null;
    if (!viewport) return;

    const handleScroll = () => {
      if (isScrollingToRef.current) return;
      const offset = (showBanner ? bannerHeight : 0) + 24;
      const viewportRect = viewport.getBoundingClientRect();

      // If at bottom, activate last item
      if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 16) {
        const last = flatItems[flatItems.length - 1];
        if (last && activeId !== last.id) {
          setActiveId(last.id);
        }
        return;
      }

      let currentActive = flatItems[0]?.id;
      for (const item of flatItems) {
        const el = sectionRefs.current[item.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const relTop = rect.top - viewportRect.top;
        if (relTop <= offset) {
          currentActive = item.id;
        }
      }
      if (currentActive && activeId !== currentActive) {
        setActiveId(currentActive);
      }
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      viewport.removeEventListener('scroll', handleScroll);
    };
  }, [flatItems, showBanner, bannerHeight, activeId]);

  const handleReset = () => {
    setShowBanner(true);
    setBannerHeight(40);
    setVariant('default');
    setSize('default');
    setShowTrack(true);
    setActiveId('introduction');
    const viewport = scrollAreaRootRef.current?.querySelector('.toc-reading-viewport') as HTMLElement | null;
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const heroReactCode = `<TableOfContents
  items={items}
  activeId="${activeId}"
  topOffset={${showBanner ? bannerHeight : 0}}
  targetOffset={${showBanner ? bannerHeight + 16 : 16}}
  variant="${variant}"
  size="${size}"
  showTrack={${showTrack}}
  onSelect={(item) => setActiveId(item.id)}
/>`;

  const heroQtCode = `ChaSetTableOfContents {
    items: demoItems
    activeId: "${activeId}"
    topOffset: ${showBanner ? bannerHeight : 0}
    targetOffset: ${showBanner ? bannerHeight + 16 : 16}
    variant: "${variant}"
    size: "${size}"
    showTrack: ${showTrack}
    onSelectItem: (item) => activeId = item.id
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Table of Contents"
      description={t('components.tableOfContents.description', 'Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support.')}
    >
      {/* 1. Interactive Overview */}
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('desktopComposite.tableOfContents.overviewHeading', 'Interactive Overview')}</DocText>
        <ComponentPreview
          title={t('desktopComposite.tableOfContents.sandboxTitle', 'Table of Contents Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('surfaces.tableOfContents.topBanner')}</span>
                <Switch checked={showBanner} onCheckedChange={setShowBanner} />
              </div>

              {showBanner && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t('surfaces.tableOfContents.bannerHeight')}</span>
                  <div className="w-24">
                    <Slider
                      value={bannerHeight}
                      min={24}
                      max={80}
                      step={4}
                      onValueChange={(val) => setBannerHeight(val)}
                    />
                  </div>
                  <span className="text-foreground font-mono">{bannerHeight}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('showcase.variant')}</span>
                <SegmentedControl
                  value={variant}
                  onValueChange={(val) => setVariant(val as 'default' | 'track' | 'flat')}
                  options={[
                    { value: 'default', label: t('common.default') },
                    { value: 'track', label: t('surfaces.tableOfContents.track') },
                    { value: 'flat', label: t('surfaces.tableOfContents.flat') },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('showcase.size')}</span>
                <SegmentedControl
                  value={size}
                  onValueChange={(val) => setSize(val as 'default' | 'sm')}
                  options={[
                    { value: 'default', label: t('common.default') },
                    { value: 'sm', label: t('surfaces.tableOfContents.small') },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('surfaces.tableOfContents.showTrack')}</span>
                <Switch checked={showTrack} onCheckedChange={setShowTrack} />
              </div>

              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcwIcon className="size-3.5 mr-1" />
                {t('common.reset')}
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-2xl mx-auto py-2 space-y-4">
            {/* Simulated Banner Container */}
            <div className="rounded-lg border border-border bg-card/60 overflow-hidden text-card-foreground">
              {showBanner && (
                <div
                  style={{ height: `${bannerHeight * 0.0625}rem` }}
                  className="w-full bg-primary/10 border-b border-primary/20 text-primary flex items-center justify-between px-4 transition-all duration-quick ease-standard shrink-0"
                >
                  <span className="text-xs font-semibold">
                    {t('surfaces.tableOfContents.bannerText')}
                  </span>
                  <span className="text-[0.625rem] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                    Offset: {bannerHeight}
                  </span>
                </div>
              )}

              {/* Main Content & TOC Layout Area */}
              <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                {/* Scrollable Reading Viewport */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="h-[22.5rem] w-full rounded-md border border-border/80 bg-background/50 overflow-hidden flex flex-col text-foreground">
                    <div className="px-3 py-2 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
                      <span className="text-xs font-semibold text-foreground">
                        {t('surfaces.tableOfContents.readingPaneTitle')}
                      </span>
                      <Badge variant="outline" className="text-[0.625rem] font-mono">
                        #{activeId}
                      </Badge>
                    </div>
                    <ScrollArea
                      ref={scrollAreaRootRef}
                      className="flex-1 min-h-0 w-full"
                      viewportClassName="toc-reading-viewport p-3"
                      showVerticalScrollBar
                      showHorizontalScrollBar={false}
                    >
                      <div className="space-y-3 pb-32">
                        {flatItems.map((item) => {
                          const isH1 = item.level === 1;
                          const isH2 = item.level === 2;
                          const isActive = activeId === item.id;
                          const camelKey = toCamelCase(item.id);

                          return (
                            <div
                              key={item.id}
                              ref={(el) => {
                                sectionRefs.current[item.id] = el;
                              }}
                              id={`toc-section-${item.id}`}
                              className={`rounded-md p-3 transition-colors duration-quick border ${
                                isActive
                                  ? 'bg-primary/5 border-primary/25'
                                  : 'bg-card/40 border-border/40'
                              } ${
                                isH1
                                  ? 'mt-3 first:mt-0'
                                  : isH2
                                  ? 'mt-2 ml-3'
                                  : 'mt-1.5 ml-6'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Badge
                                    variant={isH1 ? 'default' : isH2 ? 'secondary' : 'outline'}
                                    size="sm"
                                    className="shrink-0 font-mono text-[0.625rem]"
                                  >
                                    {`H${item.level ?? 1}`}
                                  </Badge>
                                  <span
                                    className={`truncate ${
                                      isH1
                                        ? 'text-sm font-semibold text-foreground'
                                        : isH2
                                        ? 'text-xs font-medium text-foreground'
                                        : 'text-xs font-normal text-muted-foreground'
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                </div>
                                <span className="text-[0.625rem] font-mono text-muted-foreground/60 shrink-0">
                                  #{item.id}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {t(`surfaces.tableOfContents.sections.${camelKey}`)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Table of Contents Nav Column */}
                <div className="w-56 shrink-0 p-3 rounded-md border border-border/60 bg-background/80 text-foreground">
                  <TableOfContents
                    items={demoItems}
                    activeId={activeId}
                    topOffset={showBanner ? bannerHeight : 0}
                    targetOffset={showBanner ? bannerHeight + 16 : 16}
                    variant={variant}
                    size={size}
                    showTrack={showTrack}
                    onSelect={handleTocSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { TableOfContents, type TocItem } from '@chahu/cha-set';\n\n<TableOfContents items={items} activeId={activeId} />`}
        qtCode={`import ChaSet\n\nChaSetTableOfContents {\n    items: demoItems\n    activeId: currentSectionId\n}`}
      />

      {/* 3. Footer Sections — prose is single-sourced from spec/content/table-of-contents/ */}
      <DocMarkdown id="table-of-contents" section="animations" />

      <DocMarkdown id="table-of-contents" section="keyboard" />

      <DocMarkdown id="table-of-contents" section="props" />
    </DocLayout>
  );
}
