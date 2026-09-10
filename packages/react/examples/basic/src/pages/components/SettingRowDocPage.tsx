import React, { useState } from 'react';
import { SettingRow, Switch, Card, Button, Separator } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SettingRowDocPage() {
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
  icon="⚡"
  badge="Recommended"
  description="Enable GPU-accelerated rasterization and smooth rendering."
  highlightId="hw-accel"
  highlightTarget="${highlightTarget}"
>
  <Switch checked={${hardwareAccel}} onCheckedChange={setHardwareAccel} />
</SettingRow>`;

  const heroQtCode = `ChaSetSettingRow {
    name: "Hardware Acceleration"
    icon: "⚡"
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
      category="Interactive Controls"
      title="Setting Row"
      description="Standardized preferences and settings item row layout with title, description, embedded control zone, and anchor flash highlight."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'anchor', title: 'Anchor Jump & Flash' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'code', title: 'Implementation Code' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerHighlight('hw-accel')}
              >
                Trigger Anchor Flash
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-lg mx-auto py-4">
            <Card className="p-2 space-y-1">
              <SettingRow
                name="Hardware Acceleration"
                icon="⚡"
                badge="Recommended"
                description="Enable GPU-accelerated rasterization and smooth viewport rendering."
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
                name="Auto-Check Updates"
                icon="🔄"
                description="Periodically verify semantic releases and download patches in background."
                highlightId="auto-update"
                highlightTarget={highlightTarget}
              >
                <Switch defaultChecked />
              </SettingRow>
            </Card>
          </div>
        </ComponentPreview>
      </section>

      <section id="anchor" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Anchor Jump & Flash</h2>
        <p className="text-sm text-muted-foreground">
          Allows deep-linking or shortcut jumps from modal dialogs directly into a specific setting row. When <code>highlightTarget === highlightId</code>, a 3-cycle pulse flash draws attention to the targeted preference.
        </p>
        <Card className="p-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerHighlight('hw-accel')}
          >
            Jump to Hardware Accel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerHighlight('auto-update')}
          >
            Jump to Auto-Updates
          </Button>
        </Card>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <KeyboardShortcutsTable componentId="setting-row" />
      </section>

      <section id="code" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Implementation Code</h2>
        <div className="space-y-4">
          <CodeBlock language="tsx" code={heroReactCode} />
          <CodeBlock language="qml" code={heroQtCode} />
        </div>
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
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
      </section>
    </DocLayout>
  );
}

