import React, { useState } from 'react';
import { Button, Card, SegmentedControl, Checkbox, Input, Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, type TooltipSide, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function TooltipDocPage() {
  const { t } = useChaSetI18n();
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
      category="Overlays & Feedback"
      title="Tooltip"
      description={t('components.tooltip.description', 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.tooltip.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.tooltip.overviewDesc',
            'Test interactive hover delays, side positioning, keyboard shortcut badges, directional arrows, and disabled behavior across Web and Qt Quick Desktop. Placement policy: dense vertical lists (menu items, select options, sidebar nav, virtual rows) default to right so bubbles never cover the prev/next sibling; top-docked chrome defaults to bottom; bottom-docked chrome to top; modal close buttons to bottom; everything else to top.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.tooltip.sandboxTitle', 'Tooltip Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Side Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('overlays.tooltip.side', 'Side:')}</span>
                <SegmentedControl
                  size="sm"
                  value={side}
                  onChange={(v) => setSide(v as TooltipSide)}
                  options={[
                    { label: t('overlays.popover.sideTop', 'Top'), value: 'top' },
                    { label: t('overlays.popover.sideBottom', 'Bottom'), value: 'bottom' },
                    { label: t('overlays.popover.sideLeft', 'Left'), value: 'left' },
                    { label: t('overlays.popover.sideRight', 'Right'), value: 'right' },
                  ]}
                />
              </div>

              {/* Delay Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('overlays.tooltip.delay', 'Delay:')}</span>
                <SegmentedControl
                  size="sm"
                  value={String(delay)}
                  onChange={(v) => setDelay(Number(v))}
                  options={[
                    { label: t('overlays.tooltip.delayInstant', 'Instant (0ms)'), value: '0' },
                    { label: t('overlays.tooltip.delayDefault', 'Default (200ms)'), value: '200' },
                    { label: t('overlays.tooltip.delay500', '500ms'), value: '500' },
                  ]}
                />
              </div>

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('overlays.tooltip.text', 'Text:')}</span>
                <Input
                  size="sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-36 h-8 text-xs"
                />
              </div>

              {/* Shortcut Input */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('overlays.tooltip.shortcut', 'Shortcut:')}</span>
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
                label={t('overlays.tooltip.arrow', 'Arrow')}
              />

              {/* Disabled Toggle */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(Boolean(val))}
                label={t('overlays.tooltip.disabled', 'Disabled')}
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
              <Button variant="outline">{t('overlays.tooltip.hoverOrFocus', 'Hover or Focus Me')}</Button>
            </Tooltip>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from '@chahu/cha-set';\n\n<TooltipProvider delayDuration={200}>\n  <Tooltip>\n    <TooltipTrigger asChild>\n      <Button variant="outline">Hover me</Button>\n    </TooltipTrigger>\n    <TooltipContent side="top">Add to library</TooltipContent>\n  </Tooltip>\n</TooltipProvider>\n\n// Shorthand wrapper\n<Tooltip content="Add to library" side="top">\n  <Button variant="outline">Hover me</Button>\n</Tooltip>`}
        qtCode={`import ChaSet\n\nChaSetTooltip {\n    text: "Add to library"\n    side: "top"\n    delay: 200\n    ChaSetButton { text: "Hover me"; variant: "outline" }\n}`}
      />

      {/* 4. Examples & States */}
      <section id="examples" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('showcase.examplesAndStates', 'Examples & States')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.tooltip.examplesDesc', 'Visual matrix of common Tooltip configurations across all 4 directional placements and interaction states.')}
        </DocText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('overlays.tooltip.topPlacementTitle', 'Top Placement (Default)')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('overlays.tooltip.topPlacementDesc', 'Centered horizontally above the target')}</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content={t('overlays.tooltip.topPlacementContent', 'Tooltip above target')} side="top" delayDuration={0}>
                <Button variant="secondary" size="sm">{t('overlays.tooltip.topPlacementButton', 'Top Tooltip')}</Button>
              </Tooltip>
            </div>
          </div>

          {/* Bottom Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('overlays.tooltip.bottomPlacementTitle', 'Bottom Placement')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('overlays.tooltip.bottomPlacementDesc', 'Centered horizontally below the target')}</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content={t('overlays.tooltip.bottomPlacementContent', 'Tooltip below target')} side="bottom" delayDuration={0}>
                <Button variant="secondary" size="sm">{t('overlays.tooltip.bottomPlacementButton', 'Bottom Tooltip')}</Button>
              </Tooltip>
            </div>
          </div>

          {/* Left Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('overlays.tooltip.leftPlacementTitle', 'Left Placement')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('overlays.tooltip.leftPlacementDesc', 'Centered vertically to the left of the target')}</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content={t('overlays.tooltip.leftPlacementContent', 'Tooltip on left')} side="left" delayDuration={0}>
                <Button variant="secondary" size="sm">{t('overlays.tooltip.leftPlacementButton', 'Left Tooltip')}</Button>
              </Tooltip>
            </div>
          </div>

          {/* Right Placement */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('overlays.tooltip.rightPlacementTitle', 'Right Placement')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('overlays.tooltip.rightPlacementDesc', 'Centered vertically to the right of the target')}</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content={t('overlays.tooltip.rightPlacementContent', 'Tooltip on right')} side="right" delayDuration={0}>
                <Button variant="secondary" size="sm">{t('overlays.tooltip.rightPlacementButton', 'Right Tooltip')}</Button>
              </Tooltip>
            </div>
          </div>

          {/* Keyboard Shortcut */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('overlays.tooltip.shortcutHintTitle', 'Keyboard Shortcut Hint')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('overlays.tooltip.shortcutHintDesc', 'Productivity hint badge for fast power-user discovery')}</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content={t('overlays.tooltip.shortcutHintContent', 'Save Document')} shortcut="Ctrl+S" side="top" delayDuration={0}>
                <Button variant="secondary" size="sm">{t('overlays.tooltip.shortcutHintButton', 'Save Action')}</Button>
              </Tooltip>
            </div>
          </div>

          {/* Directional Arrow */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">{t('overlays.tooltip.directionalArrowTitle', 'Directional Arrow')}</span>
            <span className="text-xs text-muted-foreground mb-3">{t('overlays.tooltip.directionalArrowDesc', 'Pointer triangle anchored directly toward trigger')}</span>
            <div className="flex items-center justify-center py-6">
              <Tooltip content={t('overlays.tooltip.directionalArrowContent', 'Anchored Pointer')} arrow side="top" delayDuration={0}>
                <Button variant="secondary" size="sm">{t('overlays.tooltip.directionalArrowButton', 'With Arrow')}</Button>
              </Tooltip>
            </div>
          </div>

          {/* Menu Items: Right Default */}
          <div className="flex flex-col gap-2 p-6 rounded-lg border border-border bg-card">
            <span className="text-xs font-semibold text-foreground">
              {t('overlays.tooltip.menuItemsRightTitle', 'Menu Items (Right Default)')}
            </span>
            <span className="text-xs text-muted-foreground mb-3">
              {t('overlays.tooltip.menuItemsRightDesc', 'Dense vertical lists use right so the bubble never covers the prev/next sibling item')}
            </span>
            <div className="flex flex-col items-stretch gap-1 py-2">
              <Tooltip content={t('overlays.tooltip.menuItemsRightPinContent', 'Pinned — keeps siblings visible')} side="right" delayDuration={0}>
                <Button variant="ghost" size="sm" className="justify-start">
                  {t('overlays.tooltip.menuItemsRightPinButton', 'Pin tab')}
                </Button>
              </Tooltip>
              <Tooltip content={t('overlays.tooltip.menuItemsRightDuplicateContent', 'Duplicate this row')} side="right" delayDuration={0}>
                <Button variant="ghost" size="sm" className="justify-start">
                  {t('overlays.tooltip.menuItemsRightDuplicateButton', 'Duplicate')}
                </Button>
              </Tooltip>
              <Tooltip content={t('overlays.tooltip.menuItemsRightDeleteContent', 'Remove permanently')} side="right" delayDuration={0}>
                <Button variant="ghost" size="sm" className="justify-start">
                  {t('overlays.tooltip.menuItemsRightDeleteButton', 'Delete')}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <DocMarkdown id="tooltip" section="animations" />

                        <DocMarkdown id="tooltip" section="keyboard" />

            <DocMarkdown id="tooltip" section="props" />
    </DocLayout>
  );
}
