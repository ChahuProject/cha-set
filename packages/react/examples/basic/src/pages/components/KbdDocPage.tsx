import React, { useState } from 'react';
import {
  Kbd,
  Shortcut,
  type KbdVariant,
  type KbdSize,
  type KbdCompact,
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
  DropdownMenuItem,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from '../../components/ComponentReference';

export function KbdDocPage() {
  const [variant, setVariant] = useState<KbdVariant>('outline');
  const [size, setSize] = useState<KbdSize>('default');
  const [compact, setCompact] = useState<KbdCompact>('auto');

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
                <Tabs value={variant} onValueChange={(v) => setVariant(v as KbdVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="outline" className="h-6 px-2 text-xs">Outline</TabsTrigger>
                    <TabsTrigger value="solid" className="h-6 px-2 text-xs">Solid</TabsTrigger>
                    <TabsTrigger value="subtle" className="h-6 px-2 text-xs">Subtle</TabsTrigger>
                    <TabsTrigger value="inverted" className="h-6 px-2 text-xs">Inverted</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <Tabs value={size} onValueChange={(s) => setSize(s as KbdSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="xs" className="h-6 px-2.5 text-xs">Extra Small (xs)</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Compact:</span>
                <Tabs value={compact} onValueChange={(c) => setCompact(c as KbdCompact)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="auto" className="h-6 px-2.5 text-xs">Auto</TabsTrigger>
                    <TabsTrigger value="always" className="h-6 px-2.5 text-xs">Always</TabsTrigger>
                    <TabsTrigger value="never" className="h-6 px-2.5 text-xs">Never</TabsTrigger>
                  </TabsList>
                </Tabs>
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
          <div className="flex flex-col items-center gap-2 rounded-md bg-primary p-3 text-primary-foreground">
            <span className="text-xs text-primary-foreground/80">Inverted (Tooltip)</span>
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
