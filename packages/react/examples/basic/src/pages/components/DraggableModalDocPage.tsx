import React, { useState } from 'react';
import { DraggableModal, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function DraggableModalDocPage() {
  const [open, setOpen] = useState(false);

  const reactCode = `{open && (
  <DraggableModal
    showEscBadge
    initialPositionMode="center"
    sizeOptions={[
      { name: '默认', special: 'default' },
      { name: '紧凑 (24rem x 18rem)', widthRem: 24, heightRem: 18 },
      { name: '宽屏 (40rem x 24rem)', widthRem: 40, heightRem: 24 },
      { name: '全窗口', special: 'fullscreen' },
    ]}
    sizeMenuTooltip="调整弹窗尺寸"
    topControls={
      <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)}>
        ✕
      </Button>
    }
    fixedFooter={
      <div className="flex justify-end p-3 bg-muted/20">
        <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
          关闭
        </Button>
      </div>
    }
  >
    <div className="space-y-3 p-4 text-xs text-muted-foreground">
      <h3 className="text-sm font-medium text-foreground">诊断监测器</h3>
      <p>支持自由拖拽、边缘缩放、档位快速切换与高度自适应贴合。</p>
    </div>
  </DraggableModal>
)}`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Draggable Modal"
      description="桌面可拖拽与尺寸调整弹窗体，支持尺寸档位切换、自动贴高与靠顶布局。"
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          点击打开可拖拽弹窗体，支持通过右上角菜单切换尺寸档位、拖拽移动以及贴高自适应。
        </p>

        <ComponentPreview title="Draggable Modal Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <Button variant="outline" onClick={() => setOpen(true)}>
              {open ? '弹窗已打开' : '打开可拖拽诊断弹窗'}
            </Button>

            {open && (
              <DraggableModal
                showEscBadge
                initialPositionMode="center"
                sizeOptions={[
                  { name: '默认', special: 'default' },
                  { name: '紧凑 (24rem x 18rem)', widthRem: 24, heightRem: 18 },
                  { name: '宽屏 (40rem x 24rem)', widthRem: 40, heightRem: 24 },
                  { name: '全窗口', special: 'fullscreen' },
                ]}
                sizeMenuTooltip="调整弹窗尺寸"
                topControls={
                  <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)}>
                    ✕
                  </Button>
                }
                fixedFooter={
                  <div className="flex justify-end p-3 bg-muted/20">
                    <Button variant="secondary" size="xs" onClick={() => setOpen(false)}>
                      关闭
                    </Button>
                  </div>
                }
              >
                <div className="space-y-3 p-4 text-xs text-muted-foreground">
                  <h3 className="text-sm font-medium text-foreground">内存与着色器诊断</h3>
                  <p>
                    拖动弹窗任意未被交互元素占用的区域即可移动位置；也可拉伸窗口边框调整尺寸。
                  </p>
                  <div className="flex items-center justify-between border-t border-border/50 pt-2 font-mono">
                    <span>堆内存已用:</span>
                    <Badge variant="outline">42.8 MB</Badge>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span>活跃纹理:</span>
                    <Badge variant="secondary">128 alloc</Badge>
                  </div>
                </div>
              </DraggableModal>
            )}
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="draggable-modal" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
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
      </section>
    </DocLayout>
  );
}
