import React, { useState, useRef } from 'react';
import {
  AdaptivePopup,
  Button,
  Badge,
  SegmentedControl,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function AdaptivePopupDocPage() {
  const { t } = useChaSetI18n();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'down' | 'up'>('down');
  const [maxHeightLimit, setMaxHeightLimit] = useState<number>(-1);
  const [itemCount, setItemCount] = useState<number>(5);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sampleTargets = Array.from({ length: itemCount }, (_, i) => ({
    id: i + 1,
    name: `Render Layer #${i + 1}`,
    type: i % 2 === 0 ? 'Color Attachment' : 'Depth Stencil',
  }));

  const heroReactCode = `<div ref={containerRef} className="relative h-[22.5rem] w-full overflow-hidden ...">
  <Button
    ref={triggerRef}
    onClick={() => setOpen(!open)}
  >
    {open ? 'Close Adaptive Popup' : 'Open Adaptive Popup'}
  </Button>

  <AdaptivePopup
    open={${open}}
    onOpenChange={setOpen}
    placement="${placement}"
    align="center"
    maxHeight={${maxHeightLimit}}
    anchorRef={triggerRef}
    containerRef={containerRef}
    className="w-80"
    header={
      <div className="p-3">
        <h4 className="text-xs font-semibold text-foreground">Select Render Target</h4>
      </div>
    }
    footer={
      <div className="p-2 flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Close</Button>
      </div>
    }
  >
    <div className="py-2 space-y-1">
      {items.map(item => (
        <div key={item.id} className="p-2 rounded hover:bg-muted/40 text-xs flex justify-between">
          <span>{item.name}</span>
          <Badge variant="outline" size="sm">{item.type}</Badge>
        </div>
      ))}
    </div>
  </AdaptivePopup>
</div>`;

  const heroQtCode = `Rectangle {
    id: previewArea
    width: parent.width
    height: ThemeTokens.dp(360)
    color: ThemeTokens.color("panelRaised")
    border.color: ThemeTokens.border
    border.width: 1
    radius: ThemeTokens.dp(8)
    clip: true

    ChaSetButton {
        id: triggerBtn
        text: "Toggle Adaptive Popup"
        variant: "outline"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: "${placement}" === "down" ? parent.top : undefined
        anchors.topMargin: "${placement}" === "down" ? ThemeTokens.dp(32) : 0
        anchors.bottom: "${placement}" === "up" ? parent.bottom : undefined
        anchors.bottomMargin: "${placement}" === "up" ? ThemeTokens.dp(32) : 0
        onClicked: popup.toggle()
    }

    ChaSetAdaptivePopup {
        id: popup
        parent: previewArea
        container: previewArea
        anchorItem: triggerBtn
        anchorAlign: "center"
        placement: "${placement}"
        maxHeight: ${maxHeightLimit}
        width: 320

        headerItems: [
            RowLayout {
                Text { text: "Select Render Target" }
            }
        ]

        Column {
            Repeater {
                model: ${itemCount}
                Text { text: "Render Layer #" + (index + 1) }
            }
        }

        footerItems: [
            RowLayout {
                ChaSetButton { text: "Close"; onClicked: popup.close() }
            }
        ]
    }
}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Adaptive Popup"
      description={t(
        'components.adaptivePopup.description',
        'Content-driven adaptive height popup with zero unnecessary scrollbars and 3-tier layout.',
      )}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.adaptivePopup.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.adaptivePopup.overviewDesc',
            'Content-driven adaptive height popup expands to its natural content height without scrollbars when host space is sufficient, and clamps to the window viewport boundary when space is constrained.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.adaptivePopup.sandboxTitle', 'Adaptive Popup Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('overlays.adaptivePopup.placement', 'Placement:')}</span>
                <SegmentedControl
                  size="sm"
                  value={placement}
                  onValueChange={(val) => setPlacement(val as 'down' | 'up')}
                  options={[
                    { label: t('overlays.adaptivePopup.down', 'Down'), value: 'down' },
                    { label: t('overlays.adaptivePopup.up', 'Up'), value: 'up' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('overlays.adaptivePopup.maxHeight', 'Max Height:')}</span>
                <SegmentedControl
                  size="sm"
                  value={String(maxHeightLimit)}
                  onValueChange={(val) => setMaxHeightLimit(Number(val))}
                  options={[
                    { label: t('overlays.adaptivePopup.auto', 'Auto'), value: '-1' },
                    { label: '200', value: '200' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setItemCount(Math.max(1, itemCount - 2))}>
                  {t('overlays.adaptivePopup.removeItems', '-2 Items')}
                </Button>
                <Badge variant="outline" size="sm">
                  {itemCount}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => setItemCount(itemCount + 3)}>
                  {t('overlays.adaptivePopup.addItems', '+3 Items')}
                </Button>
              </div>
            </div>
          }
        >
          <div
            ref={containerRef}
            className="relative w-full h-[22.5rem] rounded-lg border border-dashed border-border bg-muted/10 flex items-center justify-center overflow-hidden"
          >
            <div className="text-center text-xs text-muted-foreground/60 absolute top-3 select-none pointer-events-none">
              {t('desktopComposite.adaptivePopup.boundedCanvasHint', 'Bounded preview container (adapts and clamps inside this area)')}
            </div>

            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-200 ${
                placement === 'down' ? 'top-8' : 'bottom-8'
              }`}
            >
              <Button
                ref={triggerRef}
                variant="default"
                onClick={() => setOpen(!open)}
              >
                {open ? t('overlays.adaptivePopup.closePopup', 'Close Adaptive Popup') : t('overlays.adaptivePopup.openPopup', 'Open Adaptive Popup')}
              </Button>
            </div>

            <AdaptivePopup
              open={open}
              onOpenChange={setOpen}
              placement={placement}
              align="center"
              maxHeight={maxHeightLimit}
              anchorRef={triggerRef}
              containerRef={containerRef}
              className="w-80"
              header={
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {t('desktopComposite.adaptivePopup.headerTitle', 'Active Render Targets')}
                  </span>
                  <Badge variant="secondary" size="sm" className="text-[0.625rem]">
                    {sampleTargets.length}
                  </Badge>
                </div>
              }
              footer={
                <div className="p-2.5 flex items-center justify-between bg-muted/20">
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {placement === 'up' ? 'Placement: Up' : 'Placement: Down'}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                    {t('overlays.adaptivePopup.done', 'Done')}
                  </Button>
                </div>
              }
            >
              <div className="py-2 space-y-1.5">
                {sampleTargets.map((target) => (
                  <div
                    key={target.id}
                    className="p-2 rounded border border-border/40 bg-card/50 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground">{target.name}</span>
                    <Badge variant="outline" size="sm" className="font-mono text-[0.625rem]">
                      {target.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </AdaptivePopup>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { AdaptivePopup } from '@chahu/cha-set';

<AdaptivePopup open={open} placement="down">
  <div>Content</div>
</AdaptivePopup>`}
        qtCode={`import ChaSet

ChaSetAdaptivePopup {
    placement: "down"
    width: 320
}`}
      />

      {/* Section: Variants & Placement */}
      <section id="variants" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.adaptivePopup.variantsTitle', 'Variants & Placement')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.adaptivePopup.variantsDesc',
            'Demonstrates downward and upward adaptive expansion and explicit maxHeight capping.',
          )}
        </DocText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-3">
            <span className="text-xs font-semibold text-foreground">
              {t('overlays.adaptivePopup.downwardTitle', 'Downward Natural Sizing (Placement: Down)')}
            </span>
            <DocText role="p" className="text-xs text-muted-foreground">
              {t('overlays.adaptivePopup.downwardDesc', 'Default mode. Expands down from anchor coordinates and clamps before reaching the bottom edge of the host.')}
            </DocText>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-3">
            <span className="text-xs font-semibold text-foreground">
              {t('overlays.adaptivePopup.upwardTitle', 'Upward Clamping (Placement: Up)')}
            </span>
            <DocText role="p" className="text-xs text-muted-foreground">
              {t('overlays.adaptivePopup.upwardDesc', 'Useful for taskbars and status items. AnchorY represents the desired bottom edge, expanding upward into the window.')}
            </DocText>
          </div>
        </div>
      </section>

      {/* Section: Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.adaptivePopup.animationsTitle', 'Animations')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.adaptivePopup.animationsDesc',
            'Entrance and exit utilize short duration entrance easings, automatically disabled when animationsEnabled is false.',
          )}
        </DocText>
      </section>

      <DocMarkdown id="adaptive-popup" section="keyboard" />
      <DocMarkdown id="adaptive-popup" section="props" />
    </DocLayout>
  );
}
