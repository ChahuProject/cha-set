import React, { useState } from 'react';
import {
  ShortcutBar,
  type ShortcutBarMode,
  type ShortcutPresetName,
  type KbdSize,
  type KbdVariant,
  SegmentedControl,
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

export function ShortcutBarDocPage() {
  const { t } = useChaSetI18n();
  const [shortcutMode, setShortcutMode] = useState<ShortcutBarMode>('auto');
  const [preset, setPreset] = useState<ShortcutPresetName>('address-bar');
  const [size, setSize] = useState<KbdSize>('xs');
  const [variant, setVariant] = useState<KbdVariant>('outline');
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
      const rawDist = moveEvent.clientX - frameLeft;
      const logicalW = Math.round((rawDist / rootFontSize) * 16);
      const nextW = Math.max(60, Math.min(540, logicalW));
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

  const heroReactCode = `<ShortcutBar
  mode="${shortcutMode}"
  preset="${preset}"
  size="${size}"
  variant="${variant}"
/>`;

  const heroQtCode = `ChaSetShortcutBar {
    mode: "${shortcutMode}"
    preset: "${preset}"
    size: "${size}"
    variant: "${variant}"
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Shortcut Bar"
      description={t(
        'components.shortcutBar.description',
        'Interactive multi-stage responsive keyboard shortcut bar that progressively adapts from full text to compact symbols, overflow drawer, and keyboard icon.'
      )}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.shortcutBar.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'components.shortcutBar.overviewDesc',
            'Test shortcut bar adaptation across widths, modes, and presets with live drag resizing and instant icon mode toggling.'
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.shortcutBar.sandboxTitle', 'Shortcut Bar Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('desktopComposite.shortcutBar.modeLabel', 'Mode:')}</span>
                <SegmentedControl
                  size="sm"
                  value={shortcutMode}
                  onChange={(m) => setShortcutMode(m as ShortcutBarMode)}
                  options={[
                    { label: t('desktopComposite.shortcutBar.modeAuto', 'Auto (Responsive)'), value: 'auto' },
                    { label: t('desktopComposite.shortcutBar.modeIcon', 'Icon (Compact)'), value: 'icon' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('desktopComposite.shortcutBar.presetLabel', 'Preset:')}</span>
                <SegmentedControl
                  size="sm"
                  value={preset}
                  onChange={(p) => setPreset(p as ShortcutPresetName)}
                  options={[
                    { label: t('components.shortcutBar.presetAddressBar', 'Address Bar'), value: 'address-bar' },
                    { label: t('components.shortcutBar.presetDialog', 'Dialog'), value: 'dialog' },
                    { label: t('components.shortcutBar.presetDropdown', 'Dropdown'), value: 'dropdown' },
                    { label: t('components.shortcutBar.presetTree', 'Tree View'), value: 'tree' },
                    { label: t('components.shortcutBar.presetTable', 'Data Table'), value: 'table' },
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
                <span className="text-muted-foreground text-xs">{t('common.variant', 'Variant:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as KbdVariant)}
                  options={[
                    { label: t('desktopComposite.kbd.variantOutline', 'Outline'), value: 'outline' },
                    { label: t('desktopComposite.kbd.variantSolid', 'Solid'), value: 'solid' },
                    { label: t('desktopComposite.kbd.variantSubtle', 'Subtle'), value: 'subtle' },
                  ]}
                />
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-4 p-6 w-full">
            {/* Width Slider & Preset Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-64">
                <span className="text-xs text-muted-foreground shrink-0">{t('desktopComposite.shortcutBar.widthLabel', 'Container Width:')}</span>
                <Slider
                  value={playgroundWidth}
                  min={60}
                  max={540}
                  step={1}
                  onValueChange={setPlaygroundWidth}
                  className="flex-1"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground mr-1">{t('desktopComposite.shortcutBar.presetsLabel', 'Width Presets:')}</span>
                <Button
                  variant={playgroundWidth === 460 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(460)}
                >
                  {t('desktopComposite.shortcutBar.presetFull', 'Full ({{value}})', { value: '28.75rem' })}
                </Button>
                <Button
                  variant={playgroundWidth === 330 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(330)}
                >
                  {t('desktopComposite.shortcutBar.presetSqueezed', 'Squeezed ({{value}})', { value: '20.63rem' })}
                </Button>
                <Button
                  variant={playgroundWidth === 250 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(250)}
                >
                  {t('desktopComposite.shortcutBar.presetCompact', 'Compact ({{value}})', { value: '15.63rem' })}
                </Button>
                <Button
                  variant={playgroundWidth === 180 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(180)}
                >
                  {t('desktopComposite.shortcutBar.presetFolded', 'Folded ({{value}})', { value: '11.25rem' })}
                </Button>
                <Button
                  variant={playgroundWidth === 60 ? 'secondary' : 'outline'}
                  size="xs"
                  onClick={() => setPlaygroundWidth(60)}
                >
                  {t('desktopComposite.shortcutBar.presetIcon', 'Icon ({{value}})', { value: '3.75rem' })}
                </Button>
              </div>
            </div>

            {/* Live Telemetry Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className="font-mono text-xs">
                Width: {(playgroundWidth * 0.0625).toFixed(2)}rem
              </Badge>
              {shortcutMode === 'icon' || playgroundWidth < 80 ? (
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-primary text-xs"
                >
                  {t('desktopComposite.shortcutBar.stageIcon', 'Stage 5: Keyboard Icon (Ultra Narrow)')}
                </Badge>
              ) : (
                <>
                  {activeStage === 'full' && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs"
                    >
                      {t('desktopComposite.shortcutBar.stageFull', 'Stage 1: Full (Text Labels)')}
                    </Badge>
                  )}
                  {activeStage === 'squeezed' && (
                    <Badge
                      variant="outline"
                      className="border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs"
                    >
                      {t('desktopComposite.shortcutBar.stageSqueezed', 'Stage 2: Squeezed (Scaled Text)')}
                    </Badge>
                  )}
                  {activeStage === 'compact' && (
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs"
                    >
                      {t('desktopComposite.shortcutBar.stageCompact', 'Stage 3: Compact (Symbols)')}
                    </Badge>
                  )}
                  {activeStage === 'folded' && (
                    <Badge
                      variant="outline"
                      className="border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs"
                    >
                      {t('desktopComposite.shortcutBar.stageFolded', 'Stage 4: Folded (+N Drawer)')}
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Resizable Frame */}
            <div className="pt-2 flex justify-center">
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
                    mode={shortcutMode}
                    preset={preset}
                    size={size}
                    variant={variant}
                    additionalShortcuts={
                      preset === 'address-bar'
                        ? [
                            {
                              id: 'tab',
                              keys: ['Tab'],
                              label: t('desktopComposite.shortcutBar.completeLabel', 'Autocomplete'),
                              priority: 2,
                            },
                            {
                              id: 'copy',
                              keys: ['Ctrl', 'C'],
                              label: t('desktopComposite.shortcutBar.copyPathLabel', 'Copy Path'),
                              priority: 4,
                            },
                          ]
                        : undefined
                    }
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
                  title={t('desktopComposite.shortcutBar.dragHandleTooltip', 'Drag right handle to resize container width')}
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
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ShortcutBar } from '@chahu/cha-set';\n\n<ShortcutBar preset="address-bar" mode="auto" />`}
        qtCode={`import ChaSet\n\nChaSetShortcutBar {\n    preset: "address-bar"\n    mode: "auto"\n}`}
      />

      {/* 3. Animations */}
      <DocMarkdown id="shortcut-bar" section="animations" />

      {/* 4. Keyboard Navigation */}
      <DocMarkdown id="shortcut-bar" section="keyboard" />

      {/* 5. Props Reference */}
      <DocMarkdown id="shortcut-bar" section="props" />
    </DocLayout>
  );
}
