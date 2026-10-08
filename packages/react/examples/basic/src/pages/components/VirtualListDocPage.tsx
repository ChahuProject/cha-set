import React, { useMemo, useRef } from 'react';
import { VirtualList, type VirtualListHandle, Badge, Button, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function VirtualListDocPage() {
  const { t } = useChaSetI18n();
  const listRef = useRef<VirtualListHandle>(null);

  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: t('desktopComposite.virtualList.itemTitle', 'Dataset Item #{{index}}', { index: i + 1 }),
      tag: i % 2 === 0 ? t('desktopComposite.virtualList.production', 'Production') : t('desktopComposite.virtualList.staging', 'Staging'),
    }));
  }, [t]);

  const reactCode = `const listRef = useRef<VirtualListHandle>(null);

// Programmatic jump
listRef.current?.scrollToIndex(500, 'center');

<VirtualList
  ref={listRef}
  items={items}
  estimateSize={36}
  className="h-64 border rounded-md"
  renderItem={(item, index) => (
    <div className="flex items-center justify-between px-3 h-9 border-b border-border/50 text-xs">
      <span>{item.title}</span>
      <Badge size="sm">{item.tag}</Badge>
    </div>
  )}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Virtual List"
      description={t('components.virtual-list.description', 'High-performance windowed 100k+ row list powered by TanStack Virtual, rendering only DOM nodes visible in the active viewport.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.virtualList.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.virtualList.renderingHint', 'Rendering {{count}} virtual items smoothly at 60fps. Use the controls below to trigger programmatic scrolling or scroll rapidly to observe instant windowing.', { count: '10,000' })}
        </p>

        <ComponentPreview
          qtCode={`ChaSetVirtualList {
    width: 340
    height: 260
    model: 10000
    delegate: Rectangle {
        width: parent.width
        height: 36
        // ...delegate...
    }
}`} title={t('desktopComposite.virtualList.sandboxTitle', 'Virtual List Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(0, 'start')}
              >
                {t('desktopComposite.virtualList.btnTop', 'Top (#1)')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(500, 'center')}
              >
                {t('desktopComposite.virtualList.btn500', 'Index #500')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(2500, 'center')}
              >
                {t('desktopComposite.virtualList.btn2500', 'Index #2,500')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(items.length - 1, 'end')}
              >
                {t('desktopComposite.virtualList.btnBottom', 'Bottom (#10,000)')}
              </Button>
            </div>

            <VirtualList
              ref={listRef}
              items={items}
              estimateSize={36}
              className="h-64 border border-border rounded-md bg-card overflow-auto"
              renderRow={(item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 h-9 border-b border-border/40 text-xs hover:bg-muted/40 transition-colors"
                >
                  <span className="font-mono text-foreground">{item.title}</span>
                  <Badge size="sm" variant={item.id % 2 === 0 ? 'secondary' : 'outline'}>
                    {item.tag}
                  </Badge>
                </div>
              )}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { VirtualList } from '@chahu/cha-set';

<VirtualList count={10000} itemHeight={36} renderItem={(index) => <div>Row {index}</div>} />`}
        qtCode={`import ChaSet

ChaSetVirtualList {
    width: parent.width
    height: 400
    count: 10000
    itemHeight: 36
}`}
      />



            <ComponentReference
        name="VirtualList"
        componentId="virtual-list"
        props={[
            { name: 'items', type: 'readonly T[]', default: '[]', description: t('components.virtualList.itemsDesc', 'Array of data items to virtualize.') },
            { name: 'renderRow', type: '(item: T, index: number) => ReactNode', default: 'undefined', description: t('components.virtualList.renderRowDesc', 'Callback rendering an individual row.') },
            { name: 'renderItem', type: '(item: T, index: number) => ReactNode', default: 'undefined', description: t('components.virtualList.renderItemDesc', 'Alias for renderRow.') },
            { name: 'estimateSize', type: 'number | ((index: number) => number)', default: '36', description: t('components.virtualList.estimateSizeDesc', 'Estimated item height for measurement.') },
            { name: 'gap', type: 'number', default: '0', description: t('components.virtualList.gapDesc', 'Vertical gap between adjacent items.') },
            { name: 'overscan', type: 'number', default: '8', description: t('components.virtualList.overscanDesc', 'Number of buffer items rendered beyond viewport bounds.') },
            { name: 'emptyNode', type: 'ReactNode', default: 'null', description: t('components.virtualList.emptyNodeDesc', 'Content rendered when items array is empty.') },
            { name: 'onScroll', type: '(distanceToBottom: number) => void', default: 'undefined', description: t('components.virtualList.onScrollDesc', 'Scroll event callback receiving distance to bottom.') },
            { name: 'ref', type: 'Ref<VirtualListHandle>', default: 'undefined', description: t('components.virtualList.refDesc', 'Handle exposing scrollToIndex(index, align).') },
          ]}
      />
    </DocLayout>
  );
}
