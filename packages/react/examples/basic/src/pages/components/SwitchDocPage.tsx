import React, { useState } from 'react';
import { Switch, type SwitchSize, Checkbox, SegmentedControl, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SwitchDocPage() {
  const { t } = useChaSetI18n();
  const [size, setSize] = useState<SwitchSize>('default');
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDesc, setShowDesc] = useState(true);

  const heroReactCode = `<Switch
  size="${size}"
  checked={${checked}}
  disabled={${disabled}}
  readOnly={${readOnly}}
  loading={${loading}}
  onCheckedChange={setChecked}
  label="Airplane Mode"
  ${showDesc ? 'description="Disable cellular, Wi-Fi, and Bluetooth radios."\n' : ''}/>`;

  const heroQtCode = `ChaSetSwitch {
    size: "${size}"
    checked: ${checked}
    disabled: ${disabled}
    readOnly: ${readOnly}
    loading: ${loading}
    label: "Airplane Mode"
    ${showDesc ? 'description: "Disable cellular, Wi-Fi, and Bluetooth radios."\n    ' : ''}onToggled: function(checked) {
        // handle toggle
    }
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Switch"
      description="A control that allows the user to toggle between checked and not checked states, with support for async loading, read-only mode, and helper descriptions."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.switch.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.switch.overviewDesc', 'Explore interactive switch behaviors, async loading, read-only states, descriptions, and sizes across Web and Qt Desktop.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.switch.sandboxTitle', 'Switch Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('showcase.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(v) => setSize(v as SwitchSize)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('formsA.switch.sizeSm', 'Small (sm)'), value: 'sm' },
                  ]}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4">
                <Checkbox
                  size="sm"
                  checked={checked}
                  onCheckedChange={(val) => setChecked(val as boolean)}
                  label={t('formsA.switch.checked', 'Checked')}
                />

                <Checkbox
                  size="sm"
                  checked={disabled}
                  onCheckedChange={(val) => setDisabled(val as boolean)}
                  label={t('common.disabled', 'Disabled')}
                />

                <Checkbox
                  size="sm"
                  checked={readOnly}
                  onCheckedChange={(val) => setReadOnly(val as boolean)}
                  label={t('formsA.switch.readOnly', 'Read-Only')}
                />

                <Checkbox
                  size="sm"
                  checked={loading}
                  onCheckedChange={(val) => setLoading(val as boolean)}
                  label={t('common.loading', 'Loading')}
                />

                <Checkbox
                  size="sm"
                  checked={showDesc}
                  onCheckedChange={(val) => setShowDesc(val as boolean)}
                  label={t('formsA.switch.descriptionLabel', 'Description')}
                />
              </div>
            </div>
          }
        >
          <div className="flex items-center justify-center p-6">
            <Switch
              size={size}
              checked={checked}
              disabled={disabled}
              readOnly={readOnly}
              loading={loading}
              onCheckedChange={setChecked}
              label={t('formsA.switch.airplaneMode', 'Airplane Mode')}
              description={showDesc ? t('formsA.switch.airplaneModeDesc', 'Disable cellular, Wi-Fi, and Bluetooth radios.') : undefined}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Switch } from '@chahu/cha-set';\n\n<Switch\n  checked={enabled}\n  onCheckedChange={setEnabled}\n  label="Enable Notifications"\n  description="Receive daily push updates on this device."\n/>`}
        qtCode={`import ChaSet\n\nChaSetSwitch {\n    checked: enabled\n    label: "Enable Notifications"\n    description: "Receive daily push updates on this device."\n    onToggled: enabled = checked\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.examplesAndStates', 'Examples & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.switch.examplesSubtitle', 'Visual matrix of common switch configurations and interactive states.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.switch.standardToggleTitle', 'Standard Toggle')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.switch.standardToggleDesc', 'Standard track with smooth spring animation')}</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch defaultChecked={false} label={t('formsA.switch.offLabel', 'Off')} />
              <Switch defaultChecked={true} label={t('formsA.switch.onLabel', 'On')} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.switch.asyncLoadingTitle', 'Async Loading State')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.switch.asyncLoadingDesc', 'Busy indicator while awaiting server confirmation')}</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch loading defaultChecked={false} label={t('formsA.switch.connecting', 'Connecting...')} />
              <Switch loading defaultChecked={true} label={t('formsA.switch.syncing', 'Syncing...')} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.switch.helperDescTitle', 'With Helper Description')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.switch.helperDescSubtitle', 'Multi-line title and descriptive subtext')}</span>
            <div className="pt-2">
              <Switch
                defaultChecked={true}
                label={t('formsA.switch.cloudSyncLabel', 'Automatic cloud synchronization')}
                description={t('formsA.switch.cloudSyncDesc', 'Upload changes in real time when network is available.')}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.switch.disabledReadOnlyTitle', 'Disabled & Read-Only States')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.switch.disabledReadOnlyDesc', 'Dimmed non-interactive vs locked presentation')}</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch disabled defaultChecked={false} label={t('formsA.switch.disabledOff', 'Disabled Off')} />
              <Switch readOnly defaultChecked={true} label={t('formsA.switch.readOnlyOn', 'Read-only On')} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.switch.sizeVariantsTitle', 'Size Variants')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.switch.sizeVariantsDesc', 'Default size vs compact toolbar density')}</span>
            <div className="flex items-center gap-6 pt-2">
              <Switch size="default" defaultChecked={true} label={t('formsA.switch.defaultSize', 'Default size')} />
              <Switch size="sm" defaultChecked={true} label={t('formsA.switch.smallSize', 'Small size (sm)')} />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Keyboard Navigation */}
            <ComponentReference
        name="Switch"
        componentId="switch"
        props={[
            {
              name: 'checked',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.checkedDesc', 'Whether the switch is toggled on (checked).'),
            },
            {
              name: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.defaultCheckedDesc', 'The default checked state for uncontrolled usage.'),
            },
            {
              name: 'onCheckedChange',
              type: '(checked: boolean) => void',
              default: '—',
              description: t('components.switch.onCheckedChangeDesc', 'Event handler called when the checked state changes.'),
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: t('components.switch.sizeDesc', 'The size scale of the switch track and thumb.'),
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.disabledDesc', 'Disables user interactions and applies muted opacity.'),
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.readOnlyDesc', 'Whether the switch is read-only (prevents interaction without muted opacity).'),
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.loadingDesc', 'Shows an animated spinner inside the thumb and prevents toggling.'),
            },
            {
              name: 'label',
              type: 'React.ReactNode',
              default: '—',
              description: t('components.switch.labelDesc', 'Optional companion label rendered alongside the switch.'),
            },
            {
              name: 'description',
              type: 'React.ReactNode',
              default: '—',
              description: t('components.switch.helperDesc', 'Optional helper text displayed below the label.'),
            },
            {
              name: 'forceHover',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.forceHoverDesc', 'Visual testing aid to force hover state.'),
            },
            {
              name: 'forceFocus',
              type: 'boolean',
              default: 'false',
              description: t('components.switch.forceFocusDesc', 'Visual testing aid to force focus ring.'),
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: t('components.switch.classNameDesc', 'Additional CSS class names to apply to the switch track element.'),
            },
          ]}
      />
    </DocLayout>
  );
}
