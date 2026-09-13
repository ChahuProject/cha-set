import React, { useState } from 'react';
import { AddressBar, Card, CodeBlock, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function AddressBarDocPage() {
  const [currentPath, setCurrentPath] = useState('C:/Users/Development/Projects/cha-set');
  const [history, setHistory] = useState<string[]>([
    'C:/',
    'C:/Users',
    'C:/Users/Development',
    'C:/Users/Development/Projects',
    'C:/Users/Development/Projects/cha-set',
  ]);
  const [historyIndex, setHistoryIndex] = useState(4);
  const [refreshCount, setRefreshCount] = useState(0);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigateTo = (newPath: string) => {
    const trimmed = newPath.replace(/\\/g, '/');
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(trimmed);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(trimmed);
  };

  const handleBack = () => {
    if (canGoBack) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setCurrentPath(history[nextIdx]);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCurrentPath(history[nextIdx]);
    }
  };

  const handleRefresh = () => {
    setRefreshCount((c) => c + 1);
  };

  const heroReactCode = `<AddressBar
  path={currentPath}
  canGoBack={canGoBack}
  canGoForward={canGoForward}
  onNavigate={(newPath) => setCurrentPath(newPath)}
  onBack={handleBack}
  onForward={handleForward}
  onRefresh={() => console.log('Refreshed')}
  suggestions={[
    'C:/Users/Development/cha-set',
    'C:/Windows/System32',
    'D:/Projects/qt-demo',
    '/var/log/nginx',
  ]}
/>`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Address Bar"
      description="Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          title="Address Bar Sandbox"
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground mr-1">Quick Locations:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('C:/Users/Development/cha-set')}
              >
                Project Root
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('C:/Windows/System32')}
              >
                System32
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('/var/log/nginx')}
              >
                POSIX /var/log
              </Button>
            </div>
          }
        >
          <div className="w-full space-y-4 p-6 bg-muted/20 border border-dashed border-border rounded-xl">
            <AddressBar
              path={currentPath}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onNavigate={navigateTo}
              onBack={handleBack}
              onForward={handleForward}
              onRefresh={handleRefresh}
              suggestions={[
                'C:/Users/Development/cha-set',
                'C:/Windows/System32',
                'D:/Projects/qt-demo',
                '/var/log/nginx',
                '/etc/nginx/sites-available',
              ]}
            />

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
              <span>
                Active Path: <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">{currentPath}</code>
              </span>
              <span>Refreshes: {refreshCount}</span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground">
          Motion tokens and kinematic transitions for mode transitions and suggestions.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            Breadcrumb segment hover highlights transition over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-quick</code> (100ms) with{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve (Qt counterpart:{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.motionQuick</code>).
          </li>
          <li>
            Suggestions popover renders with an entry scale and fade animation over 120ms.
          </li>
          <li>
            Respects <code className="text-xs bg-muted px-1 rounded">prefers-reduced-motion</code> on Web and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.animationsEnabled</code> in Qt.
          </li>
        </ul>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <p className="text-sm text-muted-foreground">
          Keyboard shortcuts and button activation patterns.
        </p>
        <KeyboardShortcutsTable componentId="address-bar" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'path',
              type: 'string',
              default: "''",
              description: 'Current path string rendered in breadcrumb and edit modes.',
            },
            {
              name: 'defaultValue',
              type: 'string',
              default: "''",
              description: 'Initial path string for uncontrolled usage.',
            },
            {
              name: 'onNavigate',
              type: '(path: string) => void',
              default: 'undefined',
              description: 'Callback invoked when a new path is committed via segment click or Enter.',
            },
            {
              name: 'showNavButtons',
              type: 'boolean',
              default: 'true',
              description: 'Whether to show back, forward, up, and refresh navigation buttons.',
            },
            {
              name: 'canGoBack',
              type: 'boolean',
              default: 'false',
              description: 'Enables the backward history navigation button.',
            },
            {
              name: 'canGoForward',
              type: 'boolean',
              default: 'false',
              description: 'Enables the forward history navigation button.',
            },
            {
              name: 'suggestions',
              type: 'string[]',
              default: '[]',
              description: 'List of auto-complete or history path strings in the dropdown popover.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables all interactions and input editing.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
