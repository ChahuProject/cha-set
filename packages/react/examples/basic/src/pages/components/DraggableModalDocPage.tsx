import React, { useState } from 'react';
import { DraggableModal, Button, Badge, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function DraggableModalDocPage() {
  const { t } = useChaSetI18n();
  const [open, setOpen] = useState(true);

  const sizeOptions = [
    { name: t('overlays.draggableModal.presetDefault', 'Default'), special: 'default' as const },
    { name: t('overlays.draggableModal.presetCompact', 'Compact (24rem x 18rem)'), widthRem: 24, heightRem: 18 },
    { name: t('overlays.draggableModal.presetWidescreen', 'Widescreen (40rem x 24rem)'), widthRem: 40, heightRem: 24 },
    { name: t('overlays.draggableModal.presetFullscreen', 'Fullscreen'), special: 'fullscreen' as const },
  ];

  const modalBody = (
    <div className="space-y-3 p-4 text-xs text-muted-foreground">
      <DocText role="h3">{t('overlays.draggableModal.diagnosticsTitle', 'Memory & Shader Diagnostics')}</DocText>
      <p>
        {t('overlays.draggableModal.diagnosticsDesc', 'Drag anywhere on the modal surface not occupied by controls to move; drag borders to resize.')}
      </p>
      <div className="flex items-center justify-between border-t border-border/50 pt-2 font-mono">
        <span>{t('overlays.draggableModal.heapUsed', 'Heap Memory Used:')}</span>
        <Badge variant="outline">42.8 MB</Badge>
      </div>
      <div className="flex items-center justify-between font-mono">
        <span>{t('overlays.draggableModal.activeTextures', 'Active Textures:')}</span>
        <Badge variant="secondary">{t('desktopComposite.draggableModal.allocBadge', '128 alloc')}</Badge>
      </div>
    </div>
  );

  const modalFooter = (
    <div className="flex justify-end p-3 bg-muted/20">
      <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
        {t('common.close', 'Close')}
      </Button>
    </div>
  );

  const reactCode = `{open && (
  <DraggableModal
    bounds="parent"
    initialPositionMode="center"
    defaultWidthRem={18.75}
    defaultHeightRem={12.5}
    sizeOptions={[
      { name: 'Default', special: 'default' },
      { name: 'Compact (24rem x 18rem)', widthRem: 24, heightRem: 18 },
      { name: 'Widescreen (40rem x 24rem)', widthRem: 40, heightRem: 24 },
      { name: 'Fullscreen', special: 'fullscreen' },
    ]}
    sizeMenuTooltip="Adjust window size"
    showCloseButton
    onClose={() => setOpen(false)}
    fixedFooter={
      <div className="flex justify-end p-3 bg-muted/20">
        <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    }
  >
    <div className="space-y-3 p-4 text-xs text-muted-foreground">
      <h3 className="text-sm font-medium text-foreground">${t('overlays.draggableModal.diagnosticsTitle', 'Memory & Shader Diagnostics')}</h3>
      <p>Drag anywhere on the modal surface not occupied by controls to move; drag borders to resize.</p>
      <div className="flex items-center justify-between border-t border-border/50 pt-2 font-mono">
        <span>Heap Memory Used:</span>
        <Badge variant="outline">42.8 MB</Badge>
      </div>
      <div className="flex items-center justify-between font-mono">
        <span>Active Textures:</span>
        <Badge variant="secondary">128 alloc</Badge>
      </div>
    </div>
  </DraggableModal>
)}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Draggable Modal"
      description={t('components.draggableModal.description', 'Desktop floating window with dragging title bar and bound viewport constraints.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.draggableModal.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.draggableModal.overviewDesc', 'Click the button below to open the draggable modal window, supporting size presets, drag repositioning, and auto-fitting height.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetDraggableModal {
    initialPositionMode: "center"
    sizeOptions: [
        { name: "Default", special: "default" },
        { name: "Compact (24rem x 18rem)", widthRem: 24, heightRem: 18 },
        { name: "Widescreen (40rem x 24rem)", widthRem: 40, heightRem: 24 },
        { name: "Fullscreen", special: "fullscreen" }
    ]
    width: 300
    height: 200
}`} title={t('desktopComposite.draggableModal.sandboxTitle', 'Draggable Modal Sandbox')} reactCode={reactCode}>
          <div className="flex w-full flex-col items-center gap-4">
            <Button variant="outline" onClick={() => setOpen(true)}>
              {open ? t('overlays.draggableModal.modalOpen', 'Modal is open') : t('overlays.draggableModal.openModal', 'Open Draggable Diagnostic Window')}
            </Button>

            <div className="relative h-[20rem] w-full overflow-hidden rounded-lg border border-border bg-muted/40">
              <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-xs text-muted-foreground">
                {t('overlays.draggableModal.canvasHint', 'Drag the modal around within this bounded canvas')}
              </p>

              {open && (
                <DraggableModal
                  bounds="parent"
                  initialPositionMode="center"
                  defaultWidthRem={18.75}
                  defaultHeightRem={12.5}
                  sizeOptions={sizeOptions}
                  sizeMenuTooltip={t('overlays.draggableModal.adjustSize', 'Adjust window size')}
                  showCloseButton
                  onClose={() => setOpen(false)}
                  fixedFooter={modalFooter}
                >
                  {modalBody}
                </DraggableModal>
              )}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { DraggableModal, Button } from '@chahu/cha-set';

<DraggableModal
  title="${t('overlays.draggableModal.floatingTools', 'Floating Tools')}"
  open={open}
  onOpenChange={setOpen}
>
  <div className="p-4">Floating window content</div>
</DraggableModal>`}
        qtCode={`import ChaSet

ChaSetDraggableModal {
    title: "Floating Tools"
    open: true
    initialPositionMode: "center"
}`}
      />



                        <DocMarkdown id="draggable-modal" section="keyboard" />

            <DocMarkdown id="draggable-modal" section="props" />
    </DocLayout>
  );
}
