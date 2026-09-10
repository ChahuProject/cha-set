import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, Card } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function TabsDocPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  const heroReactCode = `<Tabs defaultValue="account" orientation="${orientation}">
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
      category="Components"
      title="Tabs"
      description="A set of layered content sections known as tab panels, displayed one at a time."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'examples', title: 'Examples' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test interactive tab switching with smooth pill transitions and keyboard arrow navigation.
        </p>

        <ComponentPreview
          title="Tabs Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Orientation:</span>
                <Tabs value={orientation} onValueChange={(v) => setOrientation(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="horizontal" className="h-6 px-2.5 text-xs">Horizontal</TabsTrigger>
                    <TabsTrigger value="vertical" className="h-6 px-2.5 text-xs">Vertical</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          }
        >
          <Card className="w-full max-w-md p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} orientation={orientation}>
              <TabsList className={orientation === 'vertical' ? 'flex-col h-auto w-40 p-1' : ''}>
                <TabsTrigger value="account" className={orientation === 'vertical' ? 'w-full justify-start' : ''}>
                  Account
                </TabsTrigger>
                <TabsTrigger value="password" className={orientation === 'vertical' ? 'w-full justify-start' : ''}>
                  Password
                </TabsTrigger>
                <TabsTrigger value="settings" className={orientation === 'vertical' ? 'w-full justify-start' : ''}>
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50 min-h-[6rem]">
                <TabsContent value="account" className="mt-0">
                  <h4 className="font-semibold text-sm text-foreground mb-1">Account Information</h4>
                  <p className="text-xs text-muted-foreground">Make changes to your account here. Click save when you're done.</p>
                </TabsContent>
                <TabsContent value="password" className="mt-0">
                  <h4 className="font-semibold text-sm text-foreground mb-1">Security Credentials</h4>
                  <p className="text-xs text-muted-foreground">Change your password here. After saving, you'll be logged out.</p>
                </TabsContent>
                <TabsContent value="settings" className="mt-0">
                  <h4 className="font-semibold text-sm text-foreground mb-1">App Settings</h4>
                  <p className="text-xs text-muted-foreground">Manage your notification frequency and display preferences.</p>
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
        <p className="text-sm text-muted-foreground mb-4">
          Import the Tabs components into your project:
        </p>
        <CodeBlock
          language="bash"
          code={`# React Web
pnpm add @chahu/cha-set

# Qt Desktop (CMakeLists.txt)
target_link_libraries(YourApp PRIVATE ChaSet)`}
        />
      </section>

      {/* 3. Anatomy */}
      <section id="anatomy" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Anatomy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tabs components follow the shadcn compound structure:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@chahu/cha-set';

export default function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview pane</TabsContent>
      <TabsContent value="analytics">Analytics pane</TabsContent>
      <TabsContent value="reports">Reports pane</TabsContent>
    </Tabs>
  );
}`}
        />
      </section>

      {/* 4. Disabled State */}
      <section id="disabled" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Disabled State
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Individual tab triggers can be disabled to prevent user interaction.
        </p>
        <Card className="p-6 mb-4">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Tab</TabsTrigger>
              <TabsTrigger value="disabled" disabled>
                Disabled Tab
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
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
              name: 'orientation',
              type: '"horizontal" | "vertical"',
              default: '"horizontal"',
              description: 'The orientation of the tabs (controls keyboard navigation axis).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true on TabsTrigger, prevents interaction on that tab.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
