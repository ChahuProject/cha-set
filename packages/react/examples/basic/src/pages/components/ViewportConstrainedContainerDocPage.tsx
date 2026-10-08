import React, { useState } from 'react';
import { ViewportConstrainedContainer, Button, Badge, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function ViewportConstrainedContainerDocPage() {
  const { t } = useChaSetI18n();
  const [limit, setLimit] = useState<number | undefined>(220);
  const [margin, setMargin] = useState(16);

  const sampleItems = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Render Target #${i + 1}`,
    format: i % 2 === 0 ? 'RGBA8_UNORM' : 'D32_SFLOAT',
    size: `${1920 / (i % 4 + 1)}x${1080 / (i % 4 + 1)}`,
  }));

  const reactCode = `<ViewportConstrainedContainer
  maxHeight={${limit ?? 'undefined'}}
  minHeight={80}
  margin={${margin}}
  overflow="auto"
>
  <div className="p-3 space-y-2">
    {items.map(item => (
      <div key={item.id} className="p-2 rounded bg-muted/30 text-xs flex justify-between">
        <span>{item.title}</span>
        <Badge variant="outline" size="sm">{item.format}</Badge>
      </div>
    ))}
  </div>
</ViewportConstrainedContainer>`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Viewport Constrained Container"
      description={t('components.viewportConstrainedContainer.description', 'Container that dynamically bounds max-height based on available viewport space below the anchor rect, supporting custom upper limit overrides and smooth vertical scrolling.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.viewport.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.viewport.overviewDesc', 'The container dynamically measures the distance from its anchor to the bottom of the window (window.innerHeight - rect.top - margin) and clamps content height to prevent overflowing outside the viewport.')}
        </p>

        <ComponentPreview
          qtCode={`ChaSetViewportConstrainedContainer {
    width: 260
    maxHeight: 220
    margin: 16

    Column {
        width: parent.width
        padding: 12
        spacing: 8
        Repeater {
            model: 12
            Rectangle {
                width: parent.width - 24
                height: 32
                radius: 4
                color: ThemeTokens.color("panelRaised")
                Text {
                    anchors.centerIn: parent
                    text: "Item #" + (index + 1)
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
            }
        }
    }
}`} title={t('desktopComposite.viewport.sandboxTitle', 'Viewport Constrained Container Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={limit === 180 ? 'default' : 'outline'}
                onClick={() => setLimit(180)}
              >
                {t('surfaces.viewportConstrainedContainer.limit180')}
              </Button>
              <Button
                size="sm"
                variant={limit === 260 ? 'default' : 'outline'}
                onClick={() => setLimit(260)}
              >
                {t('surfaces.viewportConstrainedContainer.limit260')}
              </Button>
              <Button
                size="sm"
                variant={limit === undefined ? 'default' : 'outline'}
                onClick={() => setLimit(undefined)}
              >
                {t('surfaces.viewportConstrainedContainer.autoViewport')}
              </Button>
            </div>

            <ViewportConstrainedContainer
              maxHeight={limit}
              minHeight={80}
              margin={margin}
              className="w-full max-w-xs"
            >
              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-foreground mb-1">
                  {t('surfaces.viewportConstrainedContainer.activeFramebuffers', { count: sampleItems.length })}
                </div>
                {sampleItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded border border-border/50 bg-card/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground">{item.title}</span>
                    <Badge variant="outline" size="sm" className="font-mono text-[0.625rem]">{item.format}</Badge>
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ViewportConstrainedContainer } from '@chahu/cha-set';

<ViewportConstrainedContainer maxHeight={400}>
  <div className="p-4">Constrained content</div>
</ViewportConstrainedContainer>`}
        qtCode={`import ChaSet

ChaSetViewportConstrainedContainer {
    maxHeight: 400
}`}
      />



      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.viewport.variantsTitle', 'Variants & Limits')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.viewport.variantsDesc', 'Configure custom numeric overrides, string-based bounds, or custom margin offsets.')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('surfaces.viewportConstrainedContainer.strict150')}</span>
            <ViewportConstrainedContainer maxHeight={150} className="w-full">
              <div className="p-3 space-y-1.5">
                {sampleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-xs p-1.5 rounded bg-muted/40">
                    {item.title}
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('surfaces.viewportConstrainedContainer.alwaysScrollOverflow')}</span>
            <ViewportConstrainedContainer maxHeight={150} overflow="scroll" className="w-full">
              <div className="p-3 space-y-1.5">
                {sampleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-xs p-1.5 rounded bg-muted/40">
                    {item.title}
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('surfaces.viewportConstrainedContainer.highMargin48')}</span>
            <ViewportConstrainedContainer margin={48} maxHeight={150} className="w-full">
              <div className="p-3 space-y-1.5">
                {sampleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-xs p-1.5 rounded bg-muted/40">
                    {item.title}
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>
        </div>
      </section>

            <ComponentReference
        name="ViewportConstrainedContainer"
        componentId="viewport-constrained-container"
        props={[
            { name: 'maxHeight', type: 'number | string', default: 'undefined', description: t('components.viewportConstrainedContainer.maxHeightDesc', 'Optional upper limit on container max-height.') },
            { name: 'minHeight', type: 'number | string', default: '80', description: t('components.viewportConstrainedContainer.minHeightDesc', 'Minimum allowable height lower bound.') },
            { name: 'margin', type: 'number', default: '16', description: t('components.viewportConstrainedContainer.marginDesc', 'Reserved margin between container bottom and viewport bottom edge.') },
            { name: 'overflow', type: "'auto' | 'scroll'", default: "'auto'", description: t('components.viewportConstrainedContainer.overflowDesc', 'Vertical overflow scrolling strategy.') },
            { name: 'className', type: 'string', default: 'undefined', description: t('components.viewportConstrainedContainer.classNameDesc', 'Custom CSS class names for styling.') },
            { name: 'children', type: 'React.ReactNode', default: 'undefined', description: t('components.viewportConstrainedContainer.childrenDesc', 'Elements rendered inside the container.') },
          ]}
      />
    </DocLayout>
  );
}

