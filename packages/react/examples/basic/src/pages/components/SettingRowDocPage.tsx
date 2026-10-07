import React, { useState } from 'react';
import { SettingRow, Switch, Card, Button, Separator, CodeBlock, ZapIcon, RotateCcwIcon, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SettingRowDocPage() {
  const { t } = useChaSetI18n();
  const [hardwareAccel, setHardwareAccel] = useState(true);
  const [highlightTarget, setHighlightTarget] = useState<string>('');

  const triggerHighlight = (id: string) => {
    setHighlightTarget(id);
    setTimeout(() => {
      setHighlightTarget('');
    }, 1800);
  };

  const heroReactCode = `<SettingRow
  name="Hardware Acceleration"
  icon={<ZapIcon className="size-4" />}
  badge="Recommended"
  description="Enable GPU-accelerated rasterization and smooth rendering."
  highlightId="hw-accel"
  highlightTarget="${highlightTarget}"
>
  <Switch checked={${hardwareAccel}} onCheckedChange={setHardwareAccel} />
</SettingRow>`;

  const heroQtCode = `ChaSetSettingRow {
    name: "Hardware Acceleration"
    icon: "zap"
    badge: "Recommended"
    description: "Enable GPU-accelerated rasterization and smooth rendering."
    highlightId: "hw-accel"
    highlightTarget: "${highlightTarget}"

    ChaSetSwitch {
        checked: ${hardwareAccel}
        onToggled: (val) => hardwareAccel = val
    }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Setting Row"
      description="Standardized preferences and settings item row layout with title, description, embedded control zone, and anchor flash highlight."
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview title="Setting Row Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerHighlight('hw-accel')}
              >
                {t('surfaces.settingRow.triggerFlash')}
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-lg mx-auto py-4">
            <Card className="p-2 space-y-1">
              <SettingRow
                name={t('surfaces.settingRow.hwAccelName')}
                icon={<ZapIcon className="size-4 text-primary" />}
                badge={t('surfaces.settingRow.recommended')}
                description={t('surfaces.settingRow.hwAccelDesc')}
                highlightId="hw-accel"
                highlightTarget={highlightTarget}
              >
                <Switch
                  checked={hardwareAccel}
                  onCheckedChange={setHardwareAccel}
                />
              </SettingRow>

              <Separator className="my-1" />

              <SettingRow
                name={t('surfaces.settingRow.autoUpdateName')}
                icon={<RotateCcwIcon className="size-4 text-muted-foreground" />}
                description={t('surfaces.settingRow.autoUpdateDesc')}
                highlightId="auto-update"
                highlightTarget={highlightTarget}
              >
                <Switch defaultChecked />
              </SettingRow>
            </Card>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { SettingRow, Switch } from '@chahu/cha-set';

<SettingRow
  title="Automatic Sync"
  description="Sync files automatically in the background"
  control={<Switch checked={true} />}
/>`}
        qtCode={`import ChaSet

ChaSetSettingRow {
    width: parent.width
    title: "Automatic Sync"
    description: "Sync files automatically in the background"
}`}
      />



      <section id="anchor-jump-flash" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground" data-toc-title="Anchor Jump & Flash">{t('surfaces.settingRow.anchorJumpTitle')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('surfaces.settingRow.anchorJumpDesc')}
        </p>
        <Card className="p-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerHighlight('hw-accel')}
          >
            {t('surfaces.settingRow.jumpHwAccel')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerHighlight('auto-update')}
          >
            {t('surfaces.settingRow.jumpAutoUpdate')}
          </Button>
        </Card>
      </section>

      <ComponentReference
        name="SettingRow"
        componentId="setting-row"
        props={[
          {
            name: 'name',
            type: 'ReactNode | string',
            required: true,
            description: 'Primary title label for the setting item.',
          },
          {
            name: 'description',
            type: 'ReactNode | string',
            required: false,
            description: 'Secondary explanatory subtitle text.',
          },
          {
            name: 'icon',
            type: 'ReactNode | string',
            required: false,
            description: 'Optional leading icon or badge avatar.',
          },
          {
            name: 'badge',
            type: 'ReactNode | string',
            required: false,
            description: 'Optional trailing badge tag next to title.',
          },
          {
            name: 'size',
            type: "'default' | 'sm'",
            default: "'default'",
            required: false,
            description: "Density size variant ('default' or 'sm').",
          },
          {
            name: 'highlightId',
            type: 'string',
            required: false,
            description: 'Unique identifier used for anchor jump targeting.',
          },
          {
            name: 'highlightTarget',
            type: 'string',
            required: false,
            description: 'Active target identifier. When matching highlightId, triggers pulse.',
          },
          {
            name: 'highlight',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Direct boolean override to force active highlight animation.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            required: false,
            description: 'Whether the setting row and controls are dimmed and disabled.',
          },
        ]}
      />
    </DocLayout>
  );
}

