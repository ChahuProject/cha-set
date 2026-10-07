import React, { useState } from 'react';
import { DraggableModal, Button, Badge, CodeBlock, XIcon, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function DraggableModalDocPage() {
  const { t } = useChaSetI18n();
  const [open, setOpen] = useState(false);

  const reactCode = `{open && (
  <DraggableModal
    showEscBadge
    initialPositionMode="center"
    sizeOptions={[
      { name: 'Default', special: 'default' },
      { name: 'Compact (24rem x 18rem)', widthRem: 24, heightRem: 18 },
      { name: 'Widescreen (40rem x 24rem)', widthRem: 40, heightRem: 24 },
      { name: 'Fullscreen', special: 'fullscreen' },
    ]}
    sizeMenuTooltip="Adjust window size"
    topControls={
      <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)}>
        <XIcon className="size-3" />
      </Button>
    }
    fixedFooter={
      <div className="flex justify-end p-3 bg-muted/20">
        <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    }
  >
    <div className="space-y-3 p-4 text-xs text-muted-foreground">
      <h3 className="text-sm font-medium text-foreground">Memory & Shader Diagnostics</h3>
      <p>Drag anywhere on the modal surface not occupied by controls to move; drag borders to resize.</p>
    </div>
  </DraggableModal>
)}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Draggable Modal"
      description="Desktop floating window with dragging title bar and bound viewport constraints."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to open the draggable modal window, supporting size presets, drag repositioning, and auto-fitting height.
        </p>

        <ComponentPreview
          qtCode={`ChaSetDraggableModal {
    title: "Floating Tools"
    initialPositionMode: "center"
    showEscBadge: true
    sizeOptions: [
        { name: "Default", special: "default" },
        { name: "Widescreen", widthRem: 32, heightRem: 20 },
        { name: "Fullscreen", special: "fullscreen" }
    ]
    width: 300
    height: 200
}`} title="Draggable Modal Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <Button variant="outline" onClick={() => setOpen(true)}>
              {open ? t('overlays.draggableModal.modalOpen', 'Modal is open') : t('overlays.draggableModal.openModal', 'Open Draggable Diagnostic Window')}
            </Button>

            {open && (
              <DraggableModal
                showEscBadge
                initialPositionMode="center"
                sizeOptions={[
                  { name: t('overlays.draggableModal.presetDefault', 'Default'), special: 'default' },
                  { name: t('overlays.draggableModal.presetCompact', 'Compact (24rem x 18rem)'), widthRem: 24, heightRem: 18 },
                  { name: t('overlays.draggableModal.presetWidescreen', 'Widescreen (40rem x 24rem)'), widthRem: 40, heightRem: 24 },
                  { name: t('overlays.draggableModal.presetFullscreen', 'Fullscreen'), special: 'fullscreen' },
                ]}
                sizeMenuTooltip={t('overlays.draggableModal.adjustSize', 'Adjust window size')}
                topControls={
                  <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)}>
                    <XIcon className="size-3" />
                  </Button>
                }
                fixedFooter={
                  <div className="flex justify-end p-3 bg-muted/20">
                    <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
                      {t('common.close', 'Close')}
                    </Button>
                  </div>
                }
              >
                <div className="space-y-3 p-4 text-xs text-muted-foreground">
                  <h3 className="text-sm font-medium text-foreground">{t('overlays.draggableModal.diagnosticsTitle', 'Memory & Shader Diagnostics')}</h3>
                  <p>
                    {t('overlays.draggableModal.diagnosticsDesc', 'Drag anywhere on the modal surface not occupied by controls to move; drag borders to resize.')}
                  </p>
                  <div className="flex items-center justify-between border-t border-border/50 pt-2 font-mono">
                    <span>{t('overlays.draggableModal.heapUsed', 'Heap Memory Used:')}</span>
                    <Badge variant="outline">42.8 MB</Badge>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span>{t('overlays.draggableModal.activeTextures', 'Active Textures:')}</span>
                    <Badge variant="secondary">128 alloc</Badge>
                  </div>
                </div>
              </DraggableModal>
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { DraggableModal, Button } from '@chahu/cha-set';

<DraggableModal
  title="Floating Tools"
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



            <ComponentReference
        name="DraggableModal"
        componentId="draggable-modal"
        props={[
            { name: 'children', type: 'ReactNode', default: 'undefined', description: '弹窗内容主体（可滚动容器）。' },
            { name: 'initialPositionMode', type: "'center' | 'top' | '居中' | '顶部靠上'", default: "'center'", description: '初始定位模式：居中或靠顶显示。' },
            { name: 'sizeOptions', type: 'DraggableModalSizeOption[]', default: 'undefined', description: '右上角尺寸切换档位列表。' },
            { name: 'sizeMenuTooltip', type: 'string', default: "'调整弹窗尺寸'", description: '尺寸菜单按钮的悬浮提示文本。' },
            { name: 'fixedFooter', type: 'ReactNode', default: 'undefined', description: '固定在底部的操作区域（不随内容滚动）。' },
            { name: 'topControls', type: 'ReactNode', default: 'undefined', description: '渲染在右上角操作栏内的附加控件（如关闭按钮）。' },
            { name: 'rootExtra', type: 'ReactNode', default: 'undefined', description: '根容器内部的附加内容（如浮动面板）。' },
            { name: 'autoFitHeight', type: 'boolean', default: 'true', description: '是否根据内容自然高度动态自适应贴高。' },
            { name: 'showEscBadge', type: 'boolean', default: 'false', description: '是否在右上角显示 ESC 键提示徽章。' },
            { name: 'defaultWidthRem', type: 'number', default: 'undefined', description: '初始宽度（rem 单位）。' },
            { name: 'defaultHeightRem', type: 'number', default: 'undefined', description: '初始高度（rem 单位）。' },
            { name: 'defaultWidth', type: 'number', default: '500', description: '初始宽度。' },
            { name: 'defaultHeight', type: 'number', default: '400', description: '初始高度。' },
            { name: 'topMarginRem', type: 'number', default: '4.5', description: '靠顶模式下的顶部外边距（rem 单位）。' },
            { name: 'remBase', type: 'number', default: '16', description: 'rem 换算基准比例。' },
          ]}
      />
    </DocLayout>
  );
}
