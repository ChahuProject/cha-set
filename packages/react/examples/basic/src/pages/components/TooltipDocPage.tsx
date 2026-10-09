import React, { useState } from 'react';
import { Button, Card, SegmentedControl, Checkbox, Input, Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, type TooltipSide, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

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
      description="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.tooltip.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test interactive hover delays, side positioning, keyboard shortcut badges, directional arrows, and disabled behavior across Web and Qt Quick Desktop.
        </p>

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.examplesAndStates', 'Examples & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.tooltip.examplesDesc', 'Visual matrix of common Tooltip configurations across all 4 directional placements and interaction states.')}
        </p>

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
        </div>
      </section>

      {/* Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.tooltip.animationsDesc', 'Motion behavior and timing for the tooltip bubble on open and close.')}
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.tooltip.animationsBullet1', 'Opening fades and zooms in using animate-in with fade-in-0 and zoom-in-95, over duration-short with the ease-entrance curve.')}
          </li>
          <li>
            {t('desktopComposite.tooltip.animationsBullet2', 'Closing fades and zooms out using animate-out with fade-out-0 and zoom-out-95, delaying unmount until the exit animation finishes.')}
          </li>
          <li>
            {t('showcase.animationsItem2', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
          </li>
        </ul>
      </section>

            <ComponentReference
        name="Tooltip"
        componentId="tooltip"
        props={[
            {
              name: 'content',
              type: 'ReactNode | string',
              default: "''",
              description: t('components.tooltip.contentDesc', 'The content rendered inside the floating tooltip bubble.'),
            },
            {
              name: 'shortcut',
              type: 'string',
              default: "''",
              description: t('components.tooltip.shortcutDesc', 'Keyboard shortcut badge rendered inside the tooltip bubble.'),
            },
            {
              name: 'arrow',
              type: 'boolean',
              default: 'false',
              description: t('components.tooltip.arrowDesc', 'Whether to render a directional arrow pointing toward the trigger.'),
            },
            {
              name: 'side',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'top'",
              description: t('components.tooltip.sideDesc', 'The preferred placement relative to the trigger.'),
            },
            {
              name: 'avoidCollisions',
              type: 'boolean',
              default: 'true',
              description: t('components.tooltip.avoidCollisionsDesc', 'Whether to shift the bubble back inside the viewport on overflow; false pins exact side placement.'),
            },
            {
              name: 'delayDuration',
              type: 'number',
              default: '200',
              description: t('components.tooltip.delayDesc', 'Hover delay in milliseconds before the tooltip opens.'),
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: t('components.tooltip.disabledDesc', 'Prevents the tooltip from opening when hovering or focusing.'),
            },
            {
              name: 'asChild',
              type: 'boolean',
              default: 'false',
              description: t('components.tooltip.asChildDesc', 'Merges trigger props and event handlers directly onto the single child element.'),
            },
            {
              name: 'open',
              type: 'boolean',
              default: 'undefined',
              description: t('components.tooltip.openDesc', 'Controlled open state of the tooltip.'),
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              default: 'undefined',
              description: t('components.tooltip.onOpenChangeDesc', 'Callback executed when the open state changes.'),
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: t('components.tooltip.classNameDesc', 'Additional CSS class names applied to the element.'),
            },
          ]}
      />
    </DocLayout>
  );
}
