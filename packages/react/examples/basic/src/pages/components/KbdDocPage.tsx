import React, { useState } from 'react';
import {
  Kbd,
  Shortcut,
  ShortcutBar,
  type KbdVariant,
  type KbdSize,
  type KbdCompact,
  SegmentedControl,
  Card,
  DropdownMenuItem,
  Badge,
  Button,
  Slider,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from '../../components/ComponentReference';

export function KbdDocPage() {
  const [variant, setVariant] = useState<KbdVariant>('outline');
  const [size, setSize] = useState<KbdSize>('default');
  const [compact, setCompact] = useState<KbdCompact>('auto');
  const [playgroundWidth, setPlaygroundWidth] = useState<number>(340);
  const [activeStage, setActiveStage] = useState<'full' | 'squeezed' | 'compact' | 'folded'>('squeezed');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const frameRef = React.useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const frameEl = frameRef.current;
    if (!frameEl) return;
    const frameLeft = frameEl.getBoundingClientRect().left;
    const rootFontSize =
      typeof window !== 'undefined'
        ? parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16
        : 16;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const rawPx = moveEvent.clientX - frameLeft;
      const logicalW = Math.round((rawPx / rootFontSize) * 16);
      const nextW = Math.max(160, Math.min(540, logicalW));
      setPlaygroundWidth(nextW);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const heroReactCode = `<Kbd
  variant="${variant}"
  size="${size}"
  compact="${compact}"
  shortcut="Ctrl+Shift+P"
/>`;

  const heroQtCode = `ChaSetKbd {
    variant: "${variant}"
    size: "${size}"
    compact: "${compact}"
    shortcut: "Ctrl+Shift+P"
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Kbd"
      description="Displays keyboard shortcuts, key combinations, and keycap badges with smart compact truncation."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Adjust variant, size, and compact symbol mode in real time with synchronized previews for Web and Desktop.
        </p>

        <ComponentPreview
          title="Kbd Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Variant:</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as KbdVariant)}
                  options={[
                    { label: 'Outline', value: 'outline' },
                    { label: 'Solid', value: 'solid' },
                    { label: 'Subtle', value: 'subtle' },
                    { label: 'Inverted', value: 'inverted' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(s) => setSize(s as KbdSize)}
                  options={[
                    { label: 'Extra Small (xs)', value: 'xs' },
                    { label: 'Small (sm)', value: 'sm' },
                    { label: 'Default', value: 'default' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Compact:</span>
                <SegmentedControl
                  size="sm"
                  value={compact}
                  onChange={(c) => setCompact(c as KbdCompact)}
                  options={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Always', value: 'always' },
                    { label: 'Never', value: 'never' },
                  ]}
                />
              </div>
            </div>
          }
        >
          <div className="flex items-center justify-center p-6">
            <Kbd
              variant={variant}
              size={size}
              compact={compact}
              shortcut="Ctrl+Shift+P"
            />
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Kbd, Shortcut } from '@chahu/cha-set';\n\n<Kbd shortcut="Ctrl+K" />`}
        qtCode={`import ChaSet\n\nChaSetKbd {\n    shortcut: "Ctrl+K"\n}`}
      />

      {/* 3. Variants */}
      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Four distinct visual styles designed for menus, search fields, dialogs, and inverted tooltips.
        </p>
        <Card className="flex flex-wrap items-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Outline (Default)</span>
            <Kbd variant="outline" shortcut="Ctrl+K" compact="never" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Solid</span>
            <Kbd variant="solid" shortcut="Ctrl+K" compact="never" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Subtle</span>
            <Kbd variant="subtle" shortcut="Ctrl+K" compact="never" />
          </div>
          <div className="flex flex-col items-center gap-2 rounded-md bg-foreground p-3 text-background">
            <span className="text-xs text-background/80">Inverted (Tooltip)</span>
            <Kbd variant="inverted" shortcut="Ctrl+S" compact="never" />
          </div>
        </Card>
      </section>

      {/* 4. Key Combinations & Symbols */}
      <section id="combinations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Key Combinations & Symbols
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Support for multi-key combinations, alternative choices, and compact modifier symbols.
        </p>
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Compact Modifier Symbols:</span>
            <Kbd shortcut="Ctrl+Alt+Shift+P" compact="always" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Alternative Key Choices:</span>
            <Kbd shortcut="Space / Enter" compact="never" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Multi-Modifier Sequence:</span>
            <Kbd shortcut="Ctrl + Shift + P" compact="never" />
          </div>
        </Card>
      </section>

      {/* 5. Menu Trailing Shortcuts */}
      <section id="menu-shortcuts" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Menu Trailing Shortcuts
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Dedicated Shortcut component with built-in right-alignment and non-shrinking behavior for menu items.
        </p>
        <Card className="max-w-xs p-2 space-y-1">
          <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-quick ease-standard">
            <span>New File</span>
            <Shortcut value="Ctrl+N" />
          </div>
          <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-quick ease-standard">
            <span>Save Document</span>
            <Shortcut value="Ctrl+S" />
          </div>
          <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-quick ease-standard">
            <span>Command Palette</span>
            <Shortcut value="Ctrl+Shift+P" />
          </div>
        </Card>
      </section>

      {/* 6. Narrow Container Adaptation */}
      <section id="narrow-container" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Narrow Container Adaptation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          When the parent container is squeezed, the label is truncated while the shortcut stays intact or compresses into symbols.
        </p>
        <div className="flex flex-col gap-6">
          <Card className="w-56 p-2 space-y-1 border-dashed">
            <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm">
              <span className="flex-1 min-w-0 truncate text-foreground">Very Long Action Name That Truncates</span>
              <Shortcut value="Ctrl+P" compact="always" />
            </div>
            <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm">
              <span className="flex-1 min-w-0 truncate text-foreground">Export Project as Archive</span>
              <Shortcut value="Ctrl+Shift+E" compact="always" />
            </div>
          </Card>

          {/* Interactive Multi-Stage Responsive Playground */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-foreground">
                Interactive Multi-Stage Responsive Playground
              </h3>
              <p className="text-xs text-muted-foreground">
                Drag the right handle or adjust the slider to observe how the shortcut bar progresses through 4 adaptive stages:
                Full scale → Squeezed micro-scale → Compact symbols → +N folded badge with floating popover.
              </p>
            </div>

            {/* Controls: Slider & Quick Presets */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-64">
                <span className="text-xs text-muted-foreground shrink-0">Width:</span>
                <Slider
                  value={playgroundWidth}
                  min={160}
                  max={540}
                  step={1}
                  onValueChange={setPlaygroundWidth}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground mr-1">Presets:</span>
                <Button
                  variant={playgroundWidth === 460 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(460)}
                >
                  Full (28.75rem)
                </Button>
                <Button
                  variant={playgroundWidth === 330 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(330)}
                >
                  Squeezed (20.63rem)
                </Button>
                <Button
                  variant={playgroundWidth === 250 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(250)}
                >
                  Compact (15.63rem)
                </Button>
                <Button
                  variant={playgroundWidth === 180 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(180)}
                >
                  Folded (11.25rem)
                </Button>
              </div>
            </div>

            {/* Live Telemetry Badges */}
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="font-mono text-xs">
                Width: {(playgroundWidth * 0.0625).toFixed(2)}rem
              </Badge>
              {activeStage === 'full' && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs"
                >
                  Stage 1: Full (完整文字)
                </Badge>
              )}
              {activeStage === 'squeezed' && (
                <Badge
                  variant="outline"
                  className="border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs"
                >
                  Stage 2: Squeezed (等比微缩)
                </Badge>
              )}
              {activeStage === 'compact' && (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs"
                >
                  Stage 3: Compact (图标符号)
                </Badge>
              )}
              {activeStage === 'folded' && (
                <Badge
                  variant="outline"
                  className="border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs"
                >
                  Stage 4: Folded (+N 折叠)
                </Badge>
              )}
            </div>

            {/* Interactive Resizable Frame */}
            <div className="pt-2">
              <div
                ref={frameRef}
                style={{ width: `${playgroundWidth * 0.0625}rem` }}
                className={`relative flex items-center rounded-md border border-dashed border-border bg-background shadow-xs ${
                  isDragging
                    ? 'ring-1 ring-ring transition-none'
                    : 'transition-[width] duration-150 ease-out'
                }`}
              >
                <div className="flex-1 min-w-0 overflow-hidden py-1 px-2">
                  <ShortcutBar
                    preset="address-bar"
                    additionalShortcuts={[
                      { id: 'tab', keys: ['Tab'], label: '补全', priority: 2 },
                      { id: 'copy', keys: ['Ctrl', 'C'], label: '复制路径', priority: 4 },
                    ]}
                    onStageChange={setActiveStage}
                  />
                </div>

                {/* Right Edge Drag Handle */}
                <div
                  onMouseDown={handleDragStart}
                  className={`group relative flex w-3.5 shrink-0 cursor-col-resize select-none items-center justify-center self-stretch rounded-r transition-colors ${
                    isDragging
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/70'
                  }`}
                  title="Drag right handle to resize container width"
                >
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="block h-1 w-1 rounded-full bg-muted-foreground/50 group-hover:bg-foreground/70 transition-colors" />
                    <span className="block h-1 w-1 rounded-full bg-muted-foreground/50 group-hover:bg-foreground/70 transition-colors" />
                    <span className="block h-1 w-1 rounded-full bg-muted-foreground/50 group-hover:bg-foreground/70 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 7. Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Interactive micro-interaction transitions aligned with ChaSet tokens.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
            <li>
              Interactive state changes (hover and active) animate over{' '}
              <code className="text-xs bg-muted px-1 rounded">duration-quick</code> with the{' '}
              <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve.
            </li>
            <li>
              Durations and easing resolve from theme tokens, so{' '}
              <code>prefers-reduced-motion</code> zeroes them automatically (Qt: governed by{' '}
              <code>ThemeTokens.animationsEnabled</code>).
            </li>
          </ul>
        </div>
      </section>

      {/* 8. Component Reference */}
      <ComponentReference
        name="Kbd"
        componentId="kbd"
        props={[
          {
            name: 'variant',
            type: "'outline' | 'solid' | 'subtle' | 'inverted'",
            default: "'outline'",
            description: 'Visual presentation variant matching container surfaces.',
          },
          {
            name: 'size',
            type: "'xs' | 'sm' | 'default' | 'md'",
            default: "'default'",
            description: 'Size scale controlling keycap height, padding, and font size.',
          },
          {
            name: 'compact',
            type: "'auto' | 'always' | 'never'",
            default: "'auto'",
            description: 'Whether to convert verbose modifiers to compact symbols (Ctrl to ⌃).',
          },
          {
            name: 'overflow',
            type: "'collapse' | 'hide' | 'visible'",
            default: "'collapse'",
            description: 'Overflow strategy when space is constrained in narrow containers.',
          },
          {
            name: 'shortcut',
            type: 'string',
            default: "''",
            description: 'Serialized shortcut combination string to parse automatically.',
          },
          {
            name: 'separator',
            type: 'string',
            default: "'+'",
            description: 'Custom separator character between combination keys.',
          },
          {
            name: 'className',
            type: 'string',
            default: "''",
            description: 'Optional additional Tailwind CSS class names.',
          },
        ]}
      />
    </DocLayout>
  );
}
