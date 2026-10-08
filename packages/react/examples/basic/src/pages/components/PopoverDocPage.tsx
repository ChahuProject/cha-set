import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Input, SegmentedControl, Checkbox, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function PopoverDocPage() {
  const { t } = useChaSetI18n();
  const [side, setSide] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('start');
  const [arrow, setArrow] = useState(true);
  const [movable, setMovable] = useState(false);

  const heroReactCode = `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent side="${side}" align="${align}" arrow={${arrow}} movable={${movable}} className="w-80">
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none text-foreground text-sm">Dimensions</h4>
        <p className="text-xs text-muted-foreground">
          Set the dimensions for the layer.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-xs text-muted-foreground">Width</span>
          <Input defaultValue="100%" className="col-span-2 h-7 text-xs" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-xs text-muted-foreground">Height</span>
          <Input defaultValue="2rem" className="col-span-2 h-7 text-xs" />
        </div>
      </div>
    </div>
  </PopoverContent>
</Popover>`;

  const heroQtCode = `ChaSetButton {
    text: "Open Popover"
    variant: "outline"
    onClicked: pop.open = !pop.open

    ChaSetPopover {
        id: pop
        side: "${side}"
        align: "${align}"
        arrow: ${arrow}
        movable: ${movable}
        popoverWidth: 320
        popoverHeight: 180

        Column {
            anchors.fill: parent
            spacing: 8
            Text { text: "Dimensions"; font.weight: Font.Bold }
            ChaSetInput { text: "100%" }
        }
    }
}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Popover"
      description={t('components.popover.description', 'Displays rich interactive content in a floating portal anchored to a trigger, with accessible focus management.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.popover.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.popover.overviewDesc', 'Click the button below to toggle the anchored popover card, test side alignment, directional arrows, and draggable move handles.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.popover.sandboxTitle', 'Popover Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Side Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('overlays.popover.side', 'Side:')}</span>
                <SegmentedControl
                  size="sm"
                  value={side}
                  onChange={(v) => setSide(v as any)}
                  options={[
                    { label: t('overlays.popover.sideTop', 'Top'), value: 'top' },
                    { label: t('overlays.popover.sideBottom', 'Bottom'), value: 'bottom' },
                    { label: t('overlays.popover.sideLeft', 'Left'), value: 'left' },
                    { label: t('overlays.popover.sideRight', 'Right'), value: 'right' },
                  ]}
                />
              </div>

              {/* Align Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('overlays.popover.align', 'Align:')}</span>
                <SegmentedControl
                  size="sm"
                  value={align}
                  onChange={(v) => setAlign(v as any)}
                  options={[
                    { label: t('overlays.popover.alignStart', 'Start'), value: 'start' },
                    { label: t('overlays.popover.alignCenter', 'Center'), value: 'center' },
                    { label: t('overlays.popover.alignEnd', 'End'), value: 'end' },
                  ]}
                />
              </div>

              {/* Arrow Toggle */}
              <Checkbox
                size="sm"
                checked={arrow}
                onCheckedChange={(val) => setArrow(Boolean(val))}
                label={t('overlays.popover.arrow', 'Arrow')}
              />

              {/* Movable Toggle */}
              <Checkbox
                size="sm"
                checked={movable}
                onCheckedChange={(val) => setMovable(Boolean(val))}
                label={t('overlays.popover.movable', 'Movable')}
              />
            </div>
          }
        >
          <div className="flex items-center justify-center py-12">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{t('overlays.popover.openPopover', 'Open Popover')}</Button>
              </PopoverTrigger>
              <PopoverContent
                side={side}
                align={align}
                arrow={arrow}
                movable={movable}
                className="w-80"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-foreground text-sm">{t('overlays.popover.dimensionsTitle', 'Dimensions')}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('overlays.popover.dimensionsDesc', 'Set the dimensions for the layer.')}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-xs text-muted-foreground">{t('overlays.popover.width', 'Width')}</span>
                      <Input defaultValue="100%" className="col-span-2 h-7 text-xs" />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-xs text-muted-foreground">{t('overlays.popover.height', 'Height')}</span>
                      <Input defaultValue="2rem" className="col-span-2 h-7 text-xs" />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Popover, PopoverTrigger, PopoverContent, Button } from '@chahu/cha-set';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-64 p-3">
    <p className="text-sm">Popover information panel.</p>
  </PopoverContent>
</Popover>`}
        qtCode={`import ChaSet

ChaSetPopover {
    contentItem: DocText { text: "Popover information panel." }
}`}
      />



      {/* Examples & States */}
      <section id="examples" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.examplesAndStates', 'Examples & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.popover.examplesDesc', 'Common interactive configurations including directional arrows and draggable repositioning.')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Directional Arrow Example */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('desktopComposite.popover.arrowTitle', 'With Directional Arrow')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('desktopComposite.popover.arrowDesc', 'Anchored triangle indicator pointed directly at the trigger')}</span>
            <div className="flex items-center justify-center py-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">{t('desktopComposite.popover.arrowButton', 'Arrow Popover')}</Button>
                </PopoverTrigger>
                <PopoverContent arrow side="top" className="w-64">
                  <p className="text-xs text-muted-foreground">{t('desktopComposite.popover.arrowContent', 'This popover renders an anchored pointer triangle.')}</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Movable Popover Example */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('desktopComposite.popover.movableTitle', 'Movable Drag Handle')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('desktopComposite.popover.movableDesc', 'Interactive drag header to freely reposition the popover layer')}</span>
            <div className="flex items-center justify-center py-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">{t('desktopComposite.popover.movableButton', 'Movable Popover')}</Button>
                </PopoverTrigger>
                <PopoverContent movable side="bottom" className="w-64">
                  <p className="text-xs text-muted-foreground">{t('desktopComposite.popover.movableContent', 'Drag the top grip bar to move this popover anywhere.')}</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </section>
      
            <ComponentReference
        name="Popover"
        componentId="popover"
        props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: t('components.popover.openDesc', 'Controlled open state.') },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: t('components.popover.defaultOpenDesc', 'Default open state when uncontrolled.') },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: t('components.popover.onOpenChangeDesc', 'Open state change handler.') },
            { name: 'modal', type: 'boolean', default: 'false', description: t('components.popover.modalDesc', 'Whether the popover is rendered as modal with backdrop.') },
            { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: t('components.popover.sideDesc', 'Placement side relative to trigger.') },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: t('components.popover.alignDesc', 'Alignment along the anchor edge.') },
            { name: 'sideOffset', type: 'number', default: '8', description: t('components.popover.sideOffsetDesc', 'Distance offset from trigger.') },
            { name: 'alignOffset', type: 'number', default: '0', description: t('components.popover.alignOffsetDesc', 'Offset distance along alignment edge.') },
            { name: 'arrow', type: 'boolean', default: 'false', description: t('components.popover.arrowDesc', 'Whether to render an anchored directional arrow.') },
            { name: 'movable', type: 'boolean', default: 'false', description: t('components.popover.movableDesc', 'Enables interactive drag repositioning via handle.') },
            { name: 'moveLabel', type: 'string', default: "'Drag to move'", description: t('components.popover.moveLabelDesc', 'Accessible label for the drag handle button.') },
          ]}
      />
    </DocLayout>
  );
}
