import React, { useState } from 'react';
import { ColorPicker, type ColorPickerMode, type ColorPickerSize, SegmentedControl, Checkbox, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function ColorPickerDocPage() {
  const { t } = useChaSetI18n();
  const [color, setColor] = useState('#1d7ae0');
  const [mode, setMode] = useState<ColorPickerMode>('inline');
  const [size, setSize] = useState<ColorPickerSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [movable, setMovable] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showHex, setShowHex] = useState(true);
  const [showSwatches, setShowSwatches] = useState(true);

  const heroReactCode = `<ColorPicker
  value="${color}"
  mode="${mode}"
  size="${size}"
  movable={${movable}}
  disabled={${disabled}}
  showPreview={${showPreview}}
  showHex={${showHex}}
  showSwatches={${showSwatches}}
  onChange={setColor}
/>`;

  const heroQtCode = `ChaSetColorPicker {
    value: "${color}"
    mode: "${mode}"
    size: "${size}"
    movable: ${movable}
    disabled: ${disabled}
    showPreview: ${showPreview}
    showHex: ${showHex}
    showSwatches: ${showSwatches}
    onHexChanged: function(newHex) {
        // handle color change
    }
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="ColorPicker"
      description={t('components.colorPicker.description', 'An interactive color selection component featuring 4 selector panels (Square in HueRing, Circle Color Wheel, Triangle in HueRing, and Swatches), live hex input with copy button, and independent multi-channel sliders (RGB, HSV, CMYK, LAB).')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.colorPicker.overviewDesc', 'Experiment with modes, sizes, swatches, and states across Web (React) and Desktop (Qt Quick).')}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.colorPicker.sandboxTitle', 'ColorPicker Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Mode toggle */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('components.colorPicker.mode', 'Mode:')}</span>
                <SegmentedControl
                  size="sm"
                  value={mode}
                  onChange={(v) => setMode(v as ColorPickerMode)}
                  options={[
                    { label: t('components.colorPicker.modeInline', 'Inline'), value: 'inline' },
                    { label: t('components.colorPicker.modePopover', 'Popover'), value: 'popover' },
                  ]}
                />
              </div>

              {/* Size selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('components.colorPicker.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(v) => setSize(v as ColorPickerSize)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('components.colorPicker.sizeSm', 'SM'), value: 'sm' },
                  ]}
                />
              </div>

              {/* Disabled toggle */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label={t('common.disabled', 'Disabled')}
              />

              {/* Movable toggle */}
              <Checkbox
                size="sm"
                checked={movable}
                onCheckedChange={(val) => setMovable(val)}
                label={t('components.colorPicker.movable', 'Movable')}
              />

              {/* Show preview toggle */}
              <Checkbox
                size="sm"
                checked={showPreview}
                onCheckedChange={(val) => setShowPreview(val)}
                label={t('components.colorPicker.preview', 'Preview')}
              />

              {/* Show hex toggle */}
              <Checkbox
                size="sm"
                checked={showHex}
                onCheckedChange={(val) => setShowHex(val)}
                label={t('components.colorPicker.hexInput', 'Hex Input')}
              />

              {/* Show swatches toggle */}
              <Checkbox
                size="sm"
                checked={showSwatches}
                onCheckedChange={(val) => setShowSwatches(val)}
                label={t('components.colorPicker.swatches', 'Swatches')}
              />
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-96">
            <ColorPicker
              value={color}
              mode={mode}
              size={size}
              movable={movable}
              disabled={disabled}
              showPreview={showPreview}
              showHex={showHex}
              showSwatches={showSwatches}
              onChange={setColor}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t('components.colorPicker.selectedColor', 'Selected Color:')}</span>
              <span className="font-mono font-semibold text-foreground px-2 py-0.5 rounded bg-muted">
                {color}
              </span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ColorPicker } from '@chahu/cha-set';\n\n<ColorPicker\n  value={accentColor}\n  mode="popover"\n  onChange={setAccentColor}\n/>`}
        qtCode={`import ChaSet\n\nChaSetColorPicker {\n    value: "#1d7ae0"\n    mode: "popover"\n    size: "default"\n    onColorChanged: accentColor = color\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('components.colorPicker.examplesTitle', 'Examples & States')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.colorPicker.examplesDesc', 'Matrix of common color picker configurations, modes, and sizes.')}
        </DocText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popover Swatch Trigger */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('components.colorPicker.popoverTitle', 'Popover Dropdown Mode')}</span>
            <span className="text-xs text-muted-foreground">
              {t('components.colorPicker.popoverDesc', 'Compact trigger button showing current color and hex code with floating panel.')}
            </span>
            <div className="pt-2">
              <ColorPicker mode="popover" defaultValue="#ef4444" />
            </div>
          </Card>

          {/* Compact Size */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('components.colorPicker.compactTitle', 'Compact Size (sm)')}</span>
            <span className="text-xs text-muted-foreground">
              {t('components.colorPicker.compactDesc', 'Smaller dimensions and font size designed for tight sidebar panels.')}
            </span>
            <div className="pt-2">
              <ColorPicker size="sm" defaultValue="#22c55e" />
            </div>
          </Card>

          {/* Disabled State */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('components.colorPicker.disabledTitle', 'Disabled State')}</span>
            <span className="text-xs text-muted-foreground">
              {t('components.colorPicker.disabledDesc', 'Readonly display with 50% opacity and disabled pointer events.')}
            </span>
            <div className="pt-2">
              <ColorPicker disabled defaultValue="#8b5cf6" />
            </div>
          </Card>

          {/* Custom Preset Colors */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('components.colorPicker.customPresetsTitle', 'Custom Preset Swatches')}</span>
            <span className="text-xs text-muted-foreground">
              {t('components.colorPicker.customPresetsDesc', 'Specific project palette supplied via the presetColors prop.')}
            </span>
            <div className="pt-2">
              <ColorPicker
                defaultValue="#f59e0b"
                presetColors={['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#6366f1']}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Component Reference */}
            <DocMarkdown id="color-picker" section="keyboard" />

      <DocMarkdown id="color-picker" section="props" />
    </DocLayout>
  );
}
