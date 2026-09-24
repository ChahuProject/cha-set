import React, { useState } from 'react';
import {
  TableOfContents,
  Card,
  Button,
  Switch,
  SegmentedControl,
  Slider,
  CodeBlock,
  RotateCcwIcon,
  type TocItem,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function TableOfContentsDocPage() {
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [bannerHeight, setBannerHeight] = useState<number>(40);
  const [variant, setVariant] = useState<'default' | 'track' | 'flat'>('default');
  const [size, setSize] = useState<'default' | 'sm'>('default');
  const [showTrack, setShowTrack] = useState<boolean>(true);
  const [activeId, setActiveId] = useState<string>('architecture');

  const demoItems: TocItem[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      level: 1,
      children: [
        { id: 'motivation', title: 'Motivation & Goals', level: 2 },
        { id: 'design-principles', title: 'Design Principles', level: 2 },
      ],
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      level: 1,
      children: [
        {
          id: 'data-flow',
          title: 'Core Data Flow',
          level: 2,
          children: [
            { id: 'signals', title: 'Reactive Signals', level: 3 },
            { id: 'batching', title: 'Update Batching', level: 3 },
          ],
        },
        { id: 'boundary', title: 'Platform Boundaries', level: 2 },
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation Notes',
      level: 1,
      children: [
        { id: 'banner-offset', title: 'Banner Offset Handling', level: 2 },
        { id: 'tree-rendering', title: 'Tree & Track Rendering', level: 2 },
      ],
    },
    {
      id: 'changelog',
      title: 'Release Changelog',
      level: 1,
    },
  ];

  const handleReset = () => {
    setShowBanner(true);
    setBannerHeight(40);
    setVariant('default');
    setSize('default');
    setShowTrack(true);
    setActiveId('architecture');
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
      description="Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          title="Table of Contents Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Top Banner:</span>
                <Switch checked={showBanner} onCheckedChange={setShowBanner} />
              </div>

              {showBanner && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Banner Height:</span>
                  <div className="w-24">
                    <Slider
                      value={[bannerHeight]}
                      min={24}
                      max={80}
                      step={4}
                      onValueChange={(val) => setBannerHeight(val[0])}
                    />
                  </div>
                  <span className="text-foreground font-mono">{bannerHeight}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Variant:</span>
                <SegmentedControl
                  value={variant}
                  onValueChange={(val) => setVariant(val as 'default' | 'track' | 'flat')}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'track', label: 'Track' },
                    { value: 'flat', label: 'Flat' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Size:</span>
                <SegmentedControl
                  value={size}
                  onValueChange={(val) => setSize(val as 'default' | 'sm')}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'sm', label: 'Small' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Show Track:</span>
                <Switch checked={showTrack} onCheckedChange={setShowTrack} />
              </div>

              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcwIcon className="size-3.5 mr-1" />
                Reset
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-xl mx-auto py-2 space-y-4">
            {/* Simulated Banner Container */}
            <div className="rounded-lg border border-border bg-card/60 overflow-hidden">
              {showBanner && (
                <div
                  style={{ height: `${bannerHeight * 0.0625}rem` }}
                  className="w-full bg-primary/10 border-b border-primary/20 text-primary flex items-center justify-between px-4 transition-all duration-quick ease-standard"
                >
                  <span className="text-xs font-semibold">
                    Global System Announcement: Scheduled maintenance at 02:00 UTC
                  </span>
                  <span className="text-[0.625rem] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                    Offset: {bannerHeight}
                  </span>
                </div>
              )}

              {/* Main Content & TOC Layout Area */}
              <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-3">
                  <div className="p-4 rounded-md border border-border/80 bg-background/50 space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Document Reading Pane</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Active outline target: <code className="text-primary font-mono">{activeId}</code>
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Notice how the table of contents tree reflects the nested heading structure, and smoothly aligns with the top banner height offset.
                    </p>
                  </div>
                </div>

                <div className="w-56 shrink-0 p-3 rounded-md border border-border/60 bg-background/80">
                  <TableOfContents
                    items={demoItems}
                    activeId={activeId}
                    topOffset={showBanner ? bannerHeight : 0}
                    targetOffset={showBanner ? bannerHeight + 16 : 16}
                    variant={variant}
                    size={size}
                    showTrack={showTrack}
                    onSelect={(item) => setActiveId(item.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <CodeBlock
          language="bash"
          code="pnpm add @chahu/cha-set"
        />
        <CodeBlock
          language="tsx"
          code={`import { TableOfContents, type TocItem } from '@chahu/cha-set';`}
        />
      </section>

      {/* 3. Animations */}
      <section id="animations" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Hover color changes and active indicator marker transitions are powered by the shared motion tokens{' '}
          <code className="text-primary font-mono">duration-quick</code> and{' '}
          <code className="text-primary font-mono">ease-standard</code>. When users enable reduced motion preferences (
          <code className="text-primary font-mono">prefers-reduced-motion</code> on Web,{' '}
          <code className="text-primary font-mono">ThemeTokens.animationsEnabled</code> on Desktop), animations transition instantaneously.
        </p>
      </section>

      {/* 4. Keyboard Navigation */}
      <section id="keyboard" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="table-of-contents" />
      </section>

      {/* 5. Props Reference */}
      <section id="props" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          props={[
            {
              name: 'items',
              type: 'TocItem[]',
              defaultValue: '[]',
              description: 'Hierarchical array of outline items with level and nested children.',
            },
            {
              name: 'activeId',
              type: 'string',
              defaultValue: '""',
              description: 'Currently active section ID.',
            },
            {
              name: 'topOffset',
              type: 'number | string',
              defaultValue: '0',
              description: 'Top offset for sticky positioning, accommodating global announcement banners.',
            },
            {
              name: 'targetOffset',
              type: 'number',
              defaultValue: '0',
              description: 'Safety scroll offset ensuring headings are not occluded by top banners.',
            },
            {
              name: 'variant',
              type: '"default" | "track" | "flat"',
              defaultValue: '"default"',
              description: 'Visual styling variant of the table of contents container.',
            },
            {
              name: 'size',
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description: 'Size density and font scaling of the outline labels.',
            },
            {
              name: 'showTrack',
              type: 'boolean',
              defaultValue: 'true',
              description: 'Whether to render the vertical guide track and active indicator marker.',
            },
            {
              name: 'showTitle',
              type: 'boolean',
              defaultValue: 'true',
              description: 'Whether to display the header title label.',
            },
            {
              name: 'title',
              type: 'string',
              defaultValue: '"On this page"',
              description: 'Header title text displayed above outline items.',
            },
            {
              name: 'onSelect',
              type: '(item: TocItem, event) => void',
              defaultValue: 'undefined',
              description: 'Callback fired when an outline item is selected or activated.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
