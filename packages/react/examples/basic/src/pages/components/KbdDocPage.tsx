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
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function KbdDocPage() {
  const { t } = useChaSetI18n();
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
      description={t('components.kbd.description', 'Displays keyboard shortcuts, key combinations, and keycap badges with smart compact truncation.')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.kbd.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.kbd.overviewDesc', 'Adjust variant, size, and compact symbol mode in real time with synchronized previews for Web and Desktop.')}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.kbd.sandboxTitle', 'Kbd Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.variant', 'Variant:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as KbdVariant)}
                  options={[
                    { label: t('desktopComposite.kbd.variantOutline', 'Outline'), value: 'outline' },
                    { label: t('desktopComposite.kbd.variantSolid', 'Solid'), value: 'solid' },
                    { label: t('desktopComposite.kbd.variantSubtle', 'Subtle'), value: 'subtle' },
                    { label: t('desktopComposite.kbd.variantInverted', 'Inverted'), value: 'inverted' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(s) => setSize(s as KbdSize)}
                  options={[
                    { label: t('desktopComposite.kbd.sizeXs', 'Extra Small (xs)'), value: 'xs' },
                    { label: t('desktopComposite.kbd.sizeSm', 'Small (sm)'), value: 'sm' },
                    { label: t('common.default', 'Default'), value: 'default' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('components.kbd.compact', 'Compact:')}</span>
                <SegmentedControl
                  size="sm"
                  value={compact}
                  onChange={(c) => setCompact(c as KbdCompact)}
                  options={[
                    { label: t('components.kbd.auto', 'Auto'), value: 'auto' },
                    { label: t('components.kbd.always', 'Always'), value: 'always' },
                    { label: t('components.kbd.never', 'Never'), value: 'never' },
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
        <DocText role="h2" data-toc-title={t('components.kbd.variantsTitle', 'Variants')} className="mb-3">
          {t('components.kbd.variantsTitle', 'Variants')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.kbd.variantsDesc', 'Four distinct visual styles designed for menus, search fields, dialogs, and inverted tooltips.')}
        </DocText>
        <Card className="flex flex-wrap items-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('desktopComposite.kbd.outlineDefault', 'Outline (Default)')}</span>
            <Kbd variant="outline" shortcut="Ctrl+K" compact="never" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('desktopComposite.kbd.variantSolid', 'Solid')}</span>
            <Kbd variant="solid" shortcut="Ctrl+K" compact="never" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('desktopComposite.kbd.variantSubtle', 'Subtle')}</span>
            <Kbd variant="subtle" shortcut="Ctrl+K" compact="never" />
          </div>
          <div className="flex flex-col items-center gap-2 rounded-md bg-foreground p-3 text-background">
            <span className="text-xs text-background/80">{t('desktopComposite.kbd.invertedTooltip', 'Inverted (Tooltip)')}</span>
            <Kbd variant="inverted" shortcut="Ctrl+S" compact="never" />
          </div>
        </Card>
      </section>

      {/* 4. Key Combinations & Symbols */}
      <section id="combinations" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.kbd.combinationsTitle', 'Key Combinations & Symbols')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.kbd.combinationsDesc', 'Support for multi-key combinations, alternative choices, and compact modifier symbols.')}
        </DocText>
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t('desktopComposite.kbd.compactSymbols', 'Compact Modifier Symbols:')}</span>
            <Kbd shortcut="Ctrl+Alt+Shift+P" compact="always" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t('desktopComposite.kbd.altChoices', 'Alternative Key Choices:')}</span>
            <Kbd shortcut="Space / Enter" compact="never" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t('desktopComposite.kbd.multiModifier', 'Multi-Modifier Sequence:')}</span>
            <Kbd shortcut="Ctrl + Shift + P" compact="never" />
          </div>
        </Card>
      </section>

      {/* 5. Menu Trailing Shortcuts */}
      <section id="menu-shortcuts" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.kbd.menuTitle', 'Menu Trailing Shortcuts')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.kbd.menuDesc', 'Dedicated Shortcut component with built-in right-alignment and non-shrinking behavior for menu items.')}
        </DocText>
        <Card className="max-w-xs p-2 space-y-1">
          <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-quick ease-standard">
            <span>{t('desktopComposite.kbd.newFile', 'New File')}</span>
            <Shortcut value="Ctrl+N" />
          </div>
          <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-quick ease-standard">
            <span>{t('desktopComposite.kbd.saveDocument', 'Save Document')}</span>
            <Shortcut value="Ctrl+S" />
          </div>
          <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-quick ease-standard">
            <span>{t('desktopComposite.kbd.commandPalette', 'Command Palette')}</span>
            <Shortcut value="Ctrl+Shift+P" />
          </div>
        </Card>
      </section>

      {/* 6. Narrow Container Adaptation */}
      <section id="narrow-container" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.kbd.narrowTitle', 'Narrow Container Adaptation')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.kbd.narrowDesc', 'When the parent container is squeezed, the label is truncated while the shortcut stays intact or compresses into symbols.')}
        </DocText>
        <div className="flex flex-col gap-6">
          <Card className="w-56 p-2 space-y-1 border-dashed">
            <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm">
              <span className="flex-1 min-w-0 truncate text-foreground">{t('desktopComposite.kbd.veryLongAction', 'Very Long Action Name That Truncates')}</span>
              <Shortcut value="Ctrl+P" compact="always" />
            </div>
            <div className="flex items-center justify-between rounded px-2 py-1.5 text-sm">
              <span className="flex-1 min-w-0 truncate text-foreground">{t('desktopComposite.kbd.exportProject', 'Export Project as Archive')}</span>
              <Shortcut value="Ctrl+Shift+E" compact="always" />
            </div>
          </Card>

          {/* Responsive ShortcutBar Demonstration */}
          <Card className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{t('navigation.shortcut-bar', 'Shortcut Bar')}</span>
              <Badge variant="outline" className="text-xs">{t('desktopComposite.shortcutBar.modeAuto', 'Auto (Responsive)')}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('components.shortcutBar.description', 'Interactive multi-stage responsive keyboard shortcut bar that progressively adapts from full text to compact symbols, overflow drawer, and keyboard icon.')}
            </p>
            <div className="pt-2">
              <ShortcutBar preset="address-bar" mode="auto" />
            </div>
          </Card>
        </div>
      </section>


      {/* 7. Animations */}
      <DocMarkdown id="kbd" section="animations" />

      {/* 8. Component Reference */}
            <DocMarkdown id="kbd" section="keyboard" />

      <DocMarkdown id="kbd" section="props" />
    </DocLayout>
  );
}
