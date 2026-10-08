import React, { useState } from 'react';
import { SegmentedControl, type SegmentedControlOption, Card, Button, Checkbox, CodeBlock, GridIcon, ListIcon, TableIcon, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SegmentedControlDocPage() {
  const { t } = useChaSetI18n();
  const [selectedSize, setSelectedSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [activeView, setActiveView] = useState<string | number>('grid');
  const [disabled, setDisabled] = useState(false);

  const viewOptions = [
    { label: t('formsA.segmentedControl.grid', 'Grid'), value: 'grid', icon: <GridIcon className="size-3.5" />, tooltip: { content: t('desktopComposite.segmentedControl.gridTip', 'Grid layout'), shortcut: 'Ctrl+1' } },
    { label: t('formsA.segmentedControl.list', 'List'), value: 'list', icon: <ListIcon className="size-3.5" />, tooltip: { content: t('desktopComposite.segmentedControl.listTip', 'List layout'), shortcut: 'Ctrl+2' } },
    { label: t('formsA.segmentedControl.gallery', 'Gallery'), value: 'gallery', icon: <TableIcon className="size-3.5" />, badge: 3, tooltip: { content: t('desktopComposite.segmentedControl.galleryTip', 'Gallery view'), shortcut: 'Ctrl+3' } },
  ];

  const menuOptions = [
    { label: t('formsA.segmentedControl.off', 'Off'), value: 0 },
    { label: t('formsA.segmentedControl.line', 'Line'), value: 1 },
    { label: t('formsA.segmentedControl.dot', 'Dot'), value: 2 },
  ];

  const heroReactCode = `<SegmentedControl
  size="${selectedSize}"
  options={[
    { label: 'Grid', value: 'grid', icon: <GridIcon />, tooltip: { content: 'Grid layout', shortcut: 'Ctrl+1' } },
    { label: 'List', value: 'list', icon: <ListIcon />, tooltip: { content: 'List layout', shortcut: 'Ctrl+2' } },
    { label: 'Gallery', value: 'gallery', icon: <TableIcon />, badge: 3, tooltip: { content: 'Gallery view', shortcut: 'Ctrl+3' } },
  ]}
  value={activeView}
  onValueChange={setActiveView}
  disabled={${disabled}}
/>`;

  const heroQtCode = `ChaSetSegmentedControl {
    size: "${selectedSize}"
    options: [
        { label: "Grid", value: "grid", icon: "grid", tooltip: { text: "Grid layout", shortcut: "Ctrl+1" } },
        { label: "List", value: "list", icon: "list", tooltip: { text: "List layout", shortcut: "Ctrl+2" } },
        { label: "Gallery", value: "gallery", icon: "table", badge: 3, tooltip: { text: "Gallery view", shortcut: "Ctrl+3" } }
    ]
    value: activeView
    disabled: ${disabled}
    onValueSelected: (val) => activeView = val
}`;


  return (
    <DocLayout
      category="Forms & Inputs"
      title="Segmented Control"
      description={t('components.segmentedControl.description', 'A compact pill-style segmented switch for toolbars, menus, and view toggles with icon and badge support.')}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.segmentedControl.overviewHeading', 'Interactive Overview')}</h2>
        <ComponentPreview title={t('desktopComposite.segmentedControl.sandboxTitle', 'Segmented Control Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">{t('showcase.size', 'Size:')}</span>
                <div className="flex items-center gap-1">
                  {(['sm', 'default', 'lg'] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedSize === s ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <Checkbox
                checked={disabled}
                onCheckedChange={(c) => setDisabled(Boolean(c))}
                label={t('common.disabled', 'Disabled')}
              />
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <SegmentedControl
              size={selectedSize}
              options={viewOptions}
              value={activeView}
              onValueChange={setActiveView}
              disabled={disabled}
            />
            <div className="text-xs text-muted-foreground">
              {t('formsA.segmentedControl.currentSelection', 'Current selection: {{value}}', { value: String(activeView) })}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { SegmentedControl } from '@chahu/cha-set';

<SegmentedControl
  options={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ]}
  value="day"
  onValueChange={(v) => console.log(v)}
/>`}
        qtCode={`import ChaSet

ChaSetSegmentedControl {
    model: ["Day", "Week", "Month"]
    currentIndex: 0
}`}
      />



      <section id="sizes-badges" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.segmentedControl.sizesBadgesTitle', 'Sizes & Badges')}</h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('formsA.segmentedControl.smDesc', 'Small (sm - Menu & Toolbar dense)')}</div>
            <SegmentedControl size="sm" options={viewOptions} defaultValue="grid" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('formsA.segmentedControl.defaultDesc', 'Default (Standard controls)')}</div>
            <SegmentedControl size="default" options={viewOptions} defaultValue="grid" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('formsA.segmentedControl.lgDesc', 'Large (lg - Prominent tabs style)')}</div>
            <SegmentedControl size="lg" options={viewOptions} defaultValue="grid" />
          </div>
        </Card>
      </section>

      <section id="fixed-width-truncation" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.segmentedControl.fixedWidthTitle', 'Fixed Width & Truncation')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('formsA.segmentedControl.truncationSubtitle', 'By default, segments auto-adapt to their content length. When equalWidth, fullWidth, or itemWidth is configured, segments enforce equal or fixed dimensions and truncate overflowing text with an ellipsis.')}
        </p>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('formsA.segmentedControl.autoAdaptiveTitle', 'Auto-Adaptive Content Width (Default)')}</div>
            <SegmentedControl
              options={[
                { label: t('formsA.segmentedControl.optShort', 'Short'), value: 'short' },
                { label: t('formsA.segmentedControl.optVar', 'Variable Length Title'), value: 'var' },
                { label: t('formsA.segmentedControl.optLong', 'Long Description Tab'), value: 'long' },
              ]}
              defaultValue="var"
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('formsA.segmentedControl.fixedWidthTitle', 'Fixed Width per Item with Ellipsis (itemWidth=110)')}</div>
            <SegmentedControl
              itemWidth={110}
              options={[
                { label: t('formsA.segmentedControl.optCompact', 'Compact'), value: 'compact' },
                { label: t('formsA.segmentedControl.optTruncate', 'Very Long Option Text That Truncates'), value: 'long' },
                { label: t('formsA.segmentedControl.optSettings', 'Settings'), value: 'settings' },
              ]}
              defaultValue="compact"
            />
          </div>
        </Card>
      </section>

      <section id="menu-inline-title" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.segmentedControl.menuInlineTitle', 'Menu & Inline Title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('formsA.segmentedControl.menuTitleSubtitle', 'Supports an optional prefix title to seamlessly embed within context menu rows and parameter settings panels.')}
        </p>
        <Card className="p-6">
          <SegmentedControl
            title={t('formsA.segmentedControl.gridStyleTitle', 'Grid Style:')}
            size="sm"
            options={menuOptions}
            defaultValue={1}
          />
        </Card>
      </section>

      <section id="tooltips-custom-hints" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.segmentedControl.tooltipsHintsTitle', 'Tooltips & Custom Hints')}</h2>
        <p className="text-sm text-muted-foreground">
          Options support rich interactive tooltips. You can provide plain text, keyboard shortcut badges, custom placement, rich custom content, or a global <code>renderTooltip</code> function.
        </p>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('desktopComposite.segmentedControl.perOptionTitle', 'Per-Option Tooltips with Shortcuts & Arrows')}</div>
            <SegmentedControl
              options={[
                { label: t('desktopComposite.segmentedControl.dayLabel', 'Day'), value: 'day', tooltip: { content: t('desktopComposite.segmentedControl.dailyTip', 'Daily summary view'), shortcut: 'Ctrl+D', arrow: true } },
                { label: t('desktopComposite.segmentedControl.weekLabel', 'Week'), value: 'week', tooltip: { content: t('desktopComposite.segmentedControl.weeklyTip', 'Weekly timeline view'), shortcut: 'Ctrl+W', arrow: true } },
                { label: t('desktopComposite.segmentedControl.monthLabel', 'Month'), value: 'month', tooltip: { content: t('desktopComposite.segmentedControl.monthlyTip', 'Monthly overview calendar'), shortcut: 'Ctrl+M', arrow: true } },
                { label: t('desktopComposite.segmentedControl.yearLabel', 'Year'), value: 'year', disabled: true, tooltip: { content: t('desktopComposite.segmentedControl.annualTip', 'Annual archive (Requires Pro plan)'), arrow: true } },
              ]}
              defaultValue="day"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">{t('desktopComposite.segmentedControl.globalRenderTooltipTitle', 'Global renderTooltip Customization')}</div>
            <SegmentedControl
              options={[
                { label: t('desktopComposite.segmentedControl.autoLabel', 'Auto'), value: 'auto' },
                { label: t('desktopComposite.segmentedControl.darkLabel', 'Dark'), value: 'dark' },
                { label: t('desktopComposite.segmentedControl.lightLabel', 'Light'), value: 'light' },
              ]}
              defaultValue="auto"
              tooltipSide="bottom"
              renderTooltip={(opt: SegmentedControlOption) => (
                <div className="flex flex-col gap-0.5 py-0.5">

                  <span className="font-semibold text-foreground">Theme: {opt.label}</span>
                  <span className="text-muted-foreground text-micro">{t('desktopComposite.segmentedControl.switchScheme', 'Switch application color scheme')}</span>
                </div>
              )}
            />
          </div>
        </Card>
      </section>

      <ComponentReference
        name="SegmentedControl"
        componentId="segmented-control"
        props={[
          {
            name: 'options',
            type: 'SegmentedControlOption[]',
            required: true,
            description: t('components.segmentedControl.optionsDesc', 'Array of option objects ({ label, value, icon?, badge?, disabled?, tooltip? }).'),
          },
          {
            name: 'value',
            type: 'string | number',
            required: false,
            description: t('components.segmentedControl.valueDesc', 'Controlled active value.'),
          },
          {
            name: 'defaultValue',
            type: 'string | number',
            required: false,
            description: t('components.segmentedControl.defaultValueDesc', 'Initial value when uncontrolled.'),
          },
          {
            name: 'onValueChange',
            type: '(value: string | number) => void',
            required: false,
            description: t('components.segmentedControl.onValueChangeDesc', 'Callback invoked when a new segment is selected.'),
          },
          {
            name: 'size',
            type: "'sm' | 'default' | 'lg'",
            default: "'default'",
            required: false,
            description: t("components.segmentedControl.sizeDesc", "Physical dimension variant ('sm', 'default', 'lg')."),
          },
          {
            name: 'title',
            type: 'string',
            required: false,
            description: t('components.segmentedControl.titleDesc', 'Optional prefix label displayed before the segments.'),
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            required: false,
            description: t('components.segmentedControl.disabledDesc', 'Whether the entire segmented control is disabled.'),
          },
          {
            name: 'fullWidth',
            type: 'boolean',
            default: 'false',
            required: false,
            description: t('components.segmentedControl.fullWidthDesc', 'Whether segments expand equally to fill the parent container.'),
          },
          {
            name: 'equalWidth',
            type: 'boolean',
            default: 'false',
            required: false,
            description: t('components.segmentedControl.equalWidthDesc', 'Whether all segments share an identical fixed width while hugging content.'),
          },
          {
            name: 'itemWidth',
            type: 'number',
            required: false,
            description: t('components.segmentedControl.itemWidthDesc', 'Explicit fixed width allocated to each segment option.'),
          },
          {
            name: 'tooltipSide',
            type: "'top' | 'bottom' | 'left' | 'right'",
            default: "'top'",
            required: false,
            description: t('components.segmentedControl.tooltipSideDesc', 'Default side placement for option tooltips.'),
          },
          {
            name: 'tooltipDelayDuration',
            type: 'number',
            default: '200',
            required: false,
            description: t('components.segmentedControl.tooltipDelayDesc', 'Default hover delay duration in ms before displaying option tooltips.'),
          },
          {
            name: 'renderTooltip',
            type: '(option: SegmentedControlOption) => React.ReactNode',
            required: false,
            description: t('components.segmentedControl.renderTooltipDesc', 'Custom render function for option tooltips, allowing full user customization.'),
          },
        ]}
      />
    </DocLayout>
  );
}

