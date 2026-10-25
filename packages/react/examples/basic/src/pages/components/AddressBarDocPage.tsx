import React, { useState } from 'react';
import { AddressBar, CopyableBadge, Card, CodeBlock, Button, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function AddressBarDocPage() {
  const { t } = useChaSetI18n();
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
      setCurrentPath(history[nextIdx] ?? '');
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCurrentPath(history[nextIdx] ?? '');
    }
  };

  const handleRefresh = () => {
    setRefreshCount((c) => c + 1);
  };

  const heroReactCode = `<AddressBar
  path={currentPath}
  canGoBack={canGoBack}
  canGoForward={canGoForward}
  showSearch
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
      description={t('components.address-bar.description', 'Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing.')}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('showcase.interactiveOverview', 'Interactive Overview')}</DocText>
        <ComponentPreview
          qtCode={`ChaSetAddressBar {
    width: parent.width
    path: currentPath
    canGoBack: canGoBack
    canGoForward: canGoForward
    onNavigateRequested: (path) => navigateTo(path)
    onBackRequested: handleBack()
    onForwardRequested: handleForward()
    onRefreshRequested: handleRefresh()
}`}
          title={t('desktopComposite.addressBar.sandboxTitle', 'Address Bar Sandbox')}
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground mr-1">{t('desktopComposite.addressBar.quickLocations', 'Quick Locations:')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('C:/Users/Development/cha-set')}
              >
                {t('desktopComposite.addressBar.locProjectRoot', 'Project Root')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('C:/Windows/System32')}
              >
                {t('desktopComposite.addressBar.locSystem32', 'System32')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('/var/log/nginx')}
              >
                {t('desktopComposite.addressBar.locPosixLog', 'POSIX /var/log')}
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
              <span className="flex items-center gap-1.5">
                {t('desktopComposite.addressBar.activePath', 'Active Path:')} <CopyableBadge size="sm" text={currentPath} className="font-mono text-xs" />
              </span>
              <span>{t('desktopComposite.addressBar.refreshes', 'Refreshes: {{count}}', { count: refreshCount })}</span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { AddressBar } from '@chahu/cha-set';

<AddressBar
  path="/home/project"
  canGoBack={false}
  canGoForward={false}
  onNavigate={(path) => console.log(path)}
/>`}
        qtCode={`import ChaSet

ChaSetAddressBar {
    width: parent.width
    path: "/home/project"
    canGoBack: false
    canGoForward: false
    onNavigateRequested: (path) => console.log(path)
}`}
      />



      <section id="animations" className="space-y-4 pt-6">
        <DocText role="h2">{t('showcase.animations', 'Animations')}</DocText>
        <DocText role="p">
          {t('desktopComposite.addressBar.animationsDesc', 'Motion tokens and kinematic transitions for mode transitions and suggestions.')}
        </DocText>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.addressBar.animHoverPrefix', 'Breadcrumb segment hover highlights transition over')}{' '}
            <CopyableBadge size="sm" text="duration-quick" className="font-mono text-xs" /> {t('desktopComposite.addressBar.animHoverMid', '(100ms) with')}{' '}
            <CopyableBadge size="sm" text="ease-standard" className="font-mono text-xs" /> {t('desktopComposite.addressBar.animHoverSuffix', 'curve (Qt counterpart:')}{' '}
            <CopyableBadge size="sm" text="ThemeTokens.motionQuick" className="font-mono text-xs" />).
          </li>
          <li>
            {t('desktopComposite.addressBar.animSuggest', 'Suggestions popover renders with an entry scale and fade animation over 120ms.')}
          </li>
          <li>
            {t('desktopComposite.taskHud.animReducedPrefix', 'Respects')} <CopyableBadge size="sm" text="prefers-reduced-motion" className="font-mono text-xs" /> {t('desktopComposite.taskHud.animReducedMid', 'on Web and')}{' '}
            <CopyableBadge size="sm" text="ThemeTokens.animationsEnabled" className="font-mono text-xs" /> {t('desktopComposite.taskHud.animReducedSuffix', 'in Qt.')}
          </li>
        </ul>
      </section>

      <DocMarkdown id="address-bar" section="keyboard" />

      <DocMarkdown id="address-bar" section="props" />
    </DocLayout>
  );
}
