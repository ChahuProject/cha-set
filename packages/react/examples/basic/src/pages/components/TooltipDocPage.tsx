import React, { useState } from 'react';
import { Button, Card, Tabs, TabsList, TabsTrigger, Checkbox, Input, Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, type TooltipSide, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function TooltipDocPage() {
  const [side, setSide] = useState<TooltipSide>('top');
  const [text, setText] = useState('Save document');
  const [shortcut, setShortcut] = useState('Ctrl+S');
  const [arrow, setArrow] = useState(true);
  const [delay, setDelay] = useState(200);
  const [disabled, setDisabled] = useState(false);

  const heroReactCode = `<Tooltip content="${text}" shortcut="${shortcut}" arrow={${arrow}} side="${side}" delayDuration={${delay}} disabled={${disabled}}>
  <Button variant="outline">Hover or Focus Me</Button>
</Tooltip>`;

  const heroQtCode = `ChaSetTooltip {
    text: "${text}"
    shortcut: "${shortcut}"
    arrow: ${arrow}
    side: "${side}"
    delay: ${delay}
    disabled: ${disabled}

    ChaSetButton {
        text: "Hover or Focus Me"
        variant: "outline"
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Tooltip"
      description="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'examples', title: 'Examples & States' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test interactive hover delays, side positioning, keyboard shortcut badges, directional arrows, and disabled behavior across Web and Qt Quick Desktop.
        </p>

        <ComponentPreview
          title="Tooltip Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Side Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Side:</span>
                <Tabs value={side} onValueChange={(v) => setSide(v as TooltipSide)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="top" className="h-6 px-2.5 text-xs">Top</TabsTrigger>
                    <TabsTrigger value="bottom" className="h-6 px-2.5 text-xs">Bottom</TabsTrigger>
                    <TabsTrigger value="left" className="h-6 px-2.5 text-xs">Left</TabsTrigger>
                    <TabsTrigger value="right" className="h-6 px-2.5 text-xs">Right</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Delay Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Delay:</span>
                <Tabs value={String(delay)} onValueChange={(v) => setDelay(Number(v))}>
                  <TabsList className="h-8">
                    <TabsTrigger value="0" className="h-6 px-2.5 text-xs">Instant (0ms)</TabsTrigger>
                    <TabsTrigger value="200" className="h-6 px-2.5 text-xs">Default (200ms)</TabsTrigger>
                    <TabsTrigger value="500" className="h-6 px-2.5 text-xs">500ms</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Text:</span>
                <Input
                  size="sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-36 h-8 text-xs"
                />
              </div>

              {/* Shortcut Input */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Shortcut:</span>
                <Input
                  size="sm"
                  value={shortcut}
                  onChange={(e) => setShortcut(e.target.value)}
                  className="w-24 h-8 text-xs"
                />
              </div>

              {/* Arrow Toggle */}
              <Checkbox
                size="sm"
                checked={arrow}
                onCheckedChange={(val) => setArrow(Boolean(val))}
                label="Arrow"
              />

              {/* Disabled Toggle */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label="Disabled"
              />
            </div>
          }
        >
          <div className="flex items-center justify-center py-12">
            <Tooltip
              content={text}
              shortcut={shortcut}
              arrow={arrow}
              side={side}
              delayDuration={delay}
              disabled={disabled}
            >
              <Button variant="outline">Hover or Focus Me</Button>
            </Tooltip>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 3. Anatomy */}
      <section id="anatomy" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Anatomy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tooltip can be used as a compound component structure or via the ergonomic shorthand wrapper.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Compound Pattern</h3>
            <CodeBlock
              code={`import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from '@chahu/cha-set';

export function CompoundTooltipDemo() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Add to library
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Convenience Shorthand</h3>
            <CodeBlock
              code={`import { Tooltip, Button } from '@chahu/cha-set';

export function ShorthandTooltipDemo() {
  return (
    <Tooltip content="Add to library" side="top">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      {/* 4. Examples & States */}
      <section id="examples" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual matrix of common Tooltip configurations across all 4 directional placements and interaction states.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Top Placement (Default)</span>
            <span className="text-xs text-muted-foreground mb-3">Centered horizontally above the target</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content="Tooltip above target" side="top" delayDuration={0}>
                <Button variant="secondary" size="sm">Top Tooltip</Button>
              </Tooltip>
            </div>
          </div>

          {/* Bottom Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Bottom Placement</span>
            <span className="text-xs text-muted-foreground mb-3">Centered horizontally below the target</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content="Tooltip below target" side="bottom" delayDuration={0}>
                <Button variant="secondary" size="sm">Bottom Tooltip</Button>
              </Tooltip>
            </div>
          </div>

          {/* Left Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Left Placement</span>
            <span className="text-xs text-muted-foreground mb-3">Centered vertically to the left of the target</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content="Tooltip on left" side="left" delayDuration={0}>
                <Button variant="secondary" size="sm">Left Tooltip</Button>
              </Tooltip>
            </div>
          </div>

          {/* Right Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Right Placement</span>
            <span className="text-xs text-muted-foreground mb-3">Centered vertically to the right of the target</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content="Tooltip on right" side="right" delayDuration={0}>
                <Button variant="secondary" size="sm">Right Tooltip</Button>
              </Tooltip>
            </div>
          </div>

          {/* Keyboard Shortcut */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Keyboard Shortcut Hint</span>
            <span className="text-xs text-muted-foreground mb-3">Productivity hint badge for fast power-user discovery</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content="Save Document" shortcut="Ctrl+S" side="top" delayDuration={0}>
                <Button variant="secondary" size="sm">Save Action</Button>
              </Tooltip>
            </div>
          </div>

          {/* Directional Arrow */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">Directional Arrow</span>
            <span className="text-xs text-muted-foreground mb-3">Pointer triangle anchored directly toward trigger</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content="Anchored Pointer" arrow side="top" delayDuration={0}>
                <Button variant="secondary" size="sm">With Arrow</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Props Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="tooltip" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'content',
              type: 'ReactNode | string',
              default: "''",
              description: 'The content rendered inside the floating tooltip bubble.',
            },
            {
              name: 'shortcut',
              type: 'string',
              default: "''",
              description: 'Keyboard shortcut badge rendered inside the tooltip bubble.',
            },
            {
              name: 'arrow',
              type: 'boolean',
              default: 'false',
              description: 'Whether to render a directional arrow pointing toward the trigger element.',
            },
            {
              name: 'side',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'top'",
              description: 'The preferred placement relative to the trigger element.',
            },
            {
              name: 'delayDuration',
              type: 'number',
              default: '200',
              description: 'Hover delay in milliseconds before the tooltip opens.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Prevents the tooltip from opening when hovering or focusing.',
            },
            {
              name: 'asChild',
              type: 'boolean',
              default: 'false',
              description: 'Merges trigger props and event handlers directly onto the single child element.',
            },
            {
              name: 'open',
              type: 'boolean',
              default: 'undefined',
              description: 'Controlled open state of the tooltip.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              default: 'undefined',
              description: 'Callback executed when the open state changes.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS class names applied to the element.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
