import React, { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  Checkbox,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function PopoverDocPage() {
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
        popoverWidth: 260
        popoverHeight: 160

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
      category="Base Primitives"
      title="Popover"
      description="Displays rich interactive content in a floating portal anchored to a trigger, with accessible focus management."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'examples', title: 'Examples & States' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to toggle the anchored popover card, test side alignment, directional arrows, and draggable move handles.
        </p>

        <ComponentPreview
          title="Popover Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Side Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Side:</span>
                <Tabs value={side} onValueChange={(v) => setSide(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="top" className="h-6 px-2.5 text-xs">Top</TabsTrigger>
                    <TabsTrigger value="bottom" className="h-6 px-2.5 text-xs">Bottom</TabsTrigger>
                    <TabsTrigger value="left" className="h-6 px-2.5 text-xs">Left</TabsTrigger>
                    <TabsTrigger value="right" className="h-6 px-2.5 text-xs">Right</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Align Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Align:</span>
                <Tabs value={align} onValueChange={(v) => setAlign(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="start" className="h-6 px-2.5 text-xs">Start</TabsTrigger>
                    <TabsTrigger value="center" className="h-6 px-2.5 text-xs">Center</TabsTrigger>
                    <TabsTrigger value="end" className="h-6 px-2.5 text-xs">End</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Arrow Toggle */}
              <Checkbox
                size="sm"
                checked={arrow}
                onCheckedChange={(val) => setArrow(Boolean(val))}
                label="Arrow"
              />

              {/* Movable Toggle */}
              <Checkbox
                size="sm"
                checked={movable}
                onCheckedChange={(val) => setMovable(Boolean(val))}
                label="Movable"
              />
            </div>
          }
        >
          <div className="flex items-center justify-center py-12">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
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
            </Popover>
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* Examples & States */}
      <section id="examples" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Common interactive configurations including directional arrows and draggable repositioning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Directional Arrow Example */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">With Directional Arrow</span>
            <span className="text-xs text-muted-foreground mb-3">Anchored triangle indicator pointed directly at the trigger</span>
            <div className="flex items-center justify-center py-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">Arrow Popover</Button>
                </PopoverTrigger>
                <PopoverContent arrow side="top" className="w-64">
                  <p className="text-xs text-muted-foreground">This popover renders an anchored pointer triangle.</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Movable Popover Example */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Movable Drag Handle</span>
            <span className="text-xs text-muted-foreground mb-3">Interactive drag header to freely reposition the popover layer</span>
            <div className="flex items-center justify-center py-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">Movable Popover</Button>
                </PopoverTrigger>
                <PopoverContent movable side="bottom" className="w-64">
                  <p className="text-xs text-muted-foreground">Drag the top grip bar to move this popover anywhere.</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </section>
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="popover" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state when uncontrolled.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Open state change handler.' },
            { name: 'modal', type: 'boolean', default: 'false', description: 'Whether the popover is rendered as modal with backdrop.' },
            { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Placement side relative to trigger.' },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Alignment along the anchor edge.' },
            { name: 'sideOffset', type: 'number', default: '8', description: 'Distance offset from trigger.' },
            { name: 'alignOffset', type: 'number', default: '0', description: 'Offset distance along alignment edge.' },
            { name: 'arrow', type: 'boolean', default: 'false', description: 'Whether to render an anchored directional arrow.' },
            { name: 'movable', type: 'boolean', default: 'false', description: 'Enables interactive drag repositioning via handle.' },
            { name: 'moveLabel', type: 'string', default: "'Drag to move'", description: 'Accessible label for the drag handle button.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
