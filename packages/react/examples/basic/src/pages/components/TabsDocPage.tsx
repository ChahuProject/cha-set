import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, type TabsVariant, type TabsSize, Card, SegmentedControl, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function TabsDocPage() {
  const { t } = useChaSetI18n();
  const [activeTab, setActiveTab] = useState('account');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [variant, setVariant] = useState<TabsVariant>('default');
  const [size, setSize] = useState<TabsSize>('default');

  const heroReactCode = `<Tabs
  defaultValue="account"
  variant="${variant}"
  size="${size}"
  orientation="${orientation}"
>
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p>Manage your account settings and preferences.</p>
  </TabsContent>
  <TabsContent value="password">
    <p>Change your password and security credentials.</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Configure notifications and display options.</p>
  </TabsContent>
</Tabs>`;

  const heroQtCode = `ChaSetTabs {
    currentValue: "account"
    variant: "${variant}"
    size: "${size}"
    orientation: "${orientation}"

    ChaSetTabsList {
        ChaSetTabsTrigger { value: "account"; text: "Account" }
        ChaSetTabsTrigger { value: "password"; text: "Password" }
        ChaSetTabsTrigger { value: "settings"; text: "Settings" }
    }

    ChaSetTabsContent {
        value: "account"
        Text { text: "Manage your account settings and preferences." }
    }
    ChaSetTabsContent {
        value: "password"
        Text { text: "Change your password and security credentials." }
    }
    ChaSetTabsContent {
        value: "settings"
        Text { text: "Configure notifications and display options." }
    }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Tabs"
      description="A set of layered content sections known as tab panels, displayed one at a time."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'examples', title: 'Examples & Variants' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test interactive tab switching, pill vs line underline styles, size scaling, and keyboard arrow navigation.
        </p>

        <ComponentPreview
          title="Tabs Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('showcase.variant', 'Variant:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as TabsVariant)}
                  options={[
                    { label: t('surfaces.tabs.pill', 'Pill (default)'), value: 'default' },
                    { label: t('surfaces.tabs.line', 'Line'), value: 'line' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('showcase.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(s) => setSize(s as TabsSize)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('surfaces.tabs.small', 'Small (sm)'), value: 'sm' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('surfaces.tabs.orientation', 'Orientation:')}</span>
                <SegmentedControl
                  size="sm"
                  value={orientation}
                  onChange={(v) => setOrientation(v as any)}
                  options={[
                    { label: t('surfaces.tabs.horizontal', 'Horizontal'), value: 'horizontal' },
                    { label: t('surfaces.tabs.vertical', 'Vertical'), value: 'vertical' },
                  ]}
                />
              </div>
            </div>
          }
        >
          <Card className="w-full max-w-md p-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as string)}
              variant={variant}
              size={size}
              orientation={orientation}
            >
              <TabsList className={orientation === 'vertical' ? 'flex-col h-auto w-40 p-1' : ''}>
                <TabsTrigger value="account" className={orientation === 'vertical' ? 'w-full justify-start' : ''}>
                  {t('surfaces.tabs.account', 'Account')}
                </TabsTrigger>
                <TabsTrigger value="password" className={orientation === 'vertical' ? 'w-full justify-start' : ''}>
                  {t('surfaces.tabs.password', 'Password')}
                </TabsTrigger>
                <TabsTrigger value="settings" className={orientation === 'vertical' ? 'w-full justify-start' : ''}>
                  {t('surfaces.tabs.settings', 'Settings')}
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50 min-h-24">
                <TabsContent value="account" className="mt-0">
                  <h4 className="font-semibold text-sm text-foreground mb-1">{t('surfaces.tabs.accountTitle', 'Account Information')}</h4>
                  <p className="text-xs text-muted-foreground">{t('surfaces.tabs.accountDesc', "Make changes to your account here. Click save when you're done.")}</p>
                </TabsContent>
                <TabsContent value="password" className="mt-0">
                  <h4 className="font-semibold text-sm text-foreground mb-1">{t('surfaces.tabs.passwordTitle', 'Security Credentials')}</h4>
                  <p className="text-xs text-muted-foreground">{t('surfaces.tabs.passwordDesc', "Change your password here. After saving, you'll be logged out.")}</p>
                </TabsContent>
                <TabsContent value="settings" className="mt-0">
                  <h4 className="font-semibold text-sm text-foreground mb-1">{t('surfaces.tabs.settingsTitle', 'App Settings')}</h4>
                  <p className="text-xs text-muted-foreground">{t('surfaces.tabs.settingsDesc', 'Manage your notification frequency and display preferences.')}</p>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </ComponentPreview>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tabs support standard horizontal and vertical arrow navigation with automatic selection or manual Space/Enter commit.
        </p>
        <KeyboardShortcutsTable componentId="tabs" />
      </section>

      {/* 2. Installation */}
      <section id="installation" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock language="bash" code="pnpm add @chahu/cha-set" />
      </section>

      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@chahu/cha-set';\n\n<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="analytics">Analytics</TabsTrigger>\n    <TabsTrigger value="reports">Reports</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Overview pane</TabsContent>\n  <TabsContent value="analytics">Analytics pane</TabsContent>\n  <TabsContent value="reports">Reports pane</TabsContent>\n</Tabs>`}
        qtCode={`import ChaSet\n\nChaSetTabs {\n    currentValue: "overview"\n    ChaSetTabsList {\n        ChaSetTabsTrigger { value: "overview"; text: "Overview" }\n        ChaSetTabsTrigger { value: "analytics"; text: "Analytics" }\n        ChaSetTabsTrigger { value: "reports"; text: "Reports" }\n    }\n}`}
      />

      {/* 4. Examples & Variants */}
      <section id="examples" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual matrix of tab variants, sizes, badges, and disabled states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-foreground">{t('surfaces.tabs.lineVariantTitle', 'Line Variant (Underline)')}</span>
                <p className="text-xs text-muted-foreground">{t('surfaces.tabs.lineVariantDesc', 'Full-width bottom accent border for navigation headers')}</p>
              </div>
              <Tabs defaultValue="all" variant="line">
                <TabsList>
                  <TabsTrigger value="all">{t('surfaces.tabs.allItems', 'All Items')}</TabsTrigger>
                  <TabsTrigger value="pending">{t('surfaces.tabs.pending', 'Pending')}</TabsTrigger>
                  <TabsTrigger value="completed">{t('surfaces.tabs.completed', 'Completed')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-foreground">{t('surfaces.tabs.badgesCountsTitle', 'With Badges & Counts')}</span>
                <p className="text-xs text-muted-foreground">{t('surfaces.tabs.badgesCountsDesc', 'Integrated status counters and notification count tags')}</p>
              </div>
              <Tabs defaultValue="inbox">
                <TabsList>
                  <TabsTrigger value="inbox" badge="12">{t('surfaces.tabs.inbox', 'Inbox')}</TabsTrigger>
                  <TabsTrigger value="unread" badge="3">{t('surfaces.tabs.unread', 'Unread')}</TabsTrigger>
                  <TabsTrigger value="archived">{t('surfaces.tabs.archived', 'Archived')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-foreground">{t('surfaces.tabs.compactTitle', 'Compact Size (sm)')}</span>
                <p className="text-xs text-muted-foreground">{t('surfaces.tabs.compactDesc', 'High-density tab triggers for compact headers and toolbars')}</p>
              </div>
              <Tabs defaultValue="code" size="sm">
                <TabsList>
                  <TabsTrigger value="code">{t('surfaces.tabs.code', 'Code')}</TabsTrigger>
                  <TabsTrigger value="issues">{t('surfaces.tabs.issues', 'Issues')}</TabsTrigger>
                  <TabsTrigger value="pulls">{t('surfaces.tabs.pulls', 'Pull Requests')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-foreground">{t('surfaces.tabs.disabledTriggerTitle', 'Disabled Trigger')}</span>
                <p className="text-xs text-muted-foreground">{t('surfaces.tabs.disabledTriggerDesc', 'Individual tab triggers blocked with 50% opacity')}</p>
              </div>
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">{t('surfaces.tabs.activeTab', 'Active Tab')}</TabsTrigger>
                  <TabsTrigger value="disabled" disabled>
                    {t('surfaces.tabs.disabledTab', 'Disabled Tab')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
      <section id="props" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'defaultValue',
              type: 'string',
              default: 'undefined',
              description: 'The value of the tab that should be active when initially rendered (uncontrolled).',
            },
            {
              name: 'value',
              type: 'string',
              default: 'undefined',
              description: 'The controlled value of the active tab.',
            },
            {
              name: 'onValueChange',
              type: '(value: string) => void',
              default: 'undefined',
              description: 'Event handler called when the active tab changes.',
            },
            {
              name: 'variant',
              type: "'default' | 'line'",
              default: "'default'",
              description: 'Visual presentation style: pill container (default) or underline tab bar (line).',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'Size scale of the tabs triggers and container.',
            },
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: 'The orientation of the tabs (controls keyboard navigation axis).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true on TabsTrigger, prevents interaction on that tab.',
            },
            {
              name: 'badge',
              type: 'ReactNode | string',
              default: 'undefined',
              description: 'Optional count badge or text label rendered inside the trigger.',
            },
            {
              name: 'icon',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional leading icon element rendered inside the trigger.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
