import React, { useState } from 'react';
import {
  Breadcrumb,
  type PathSegment,
  Button,
  SegmentedControl,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function BreadcrumbDocPage() {
  const { t } = useChaSetI18n();

  const initialSegments: PathSegment[] = React.useMemo(
    () => [
      { label: t('surfaces.breadcrumb.computer', 'Computer'), path: '/', isRoot: true, icon: 'monitor' },
      { label: t('surfaces.breadcrumb.systemC', 'System (C:)'), path: 'C:/', isDrive: true, icon: 'package' },
      { label: t('surfaces.breadcrumb.users', 'Users'), path: 'C:/Users', icon: 'folder' },
      { label: t('surfaces.breadcrumb.developer', 'Developer'), path: 'C:/Users/Developer', icon: 'folder' },
      { label: t('surfaces.breadcrumb.workspace', 'Workspace'), path: 'C:/Users/Developer/Workspace', icon: 'folder' },
      { label: 'ChaSet', path: 'C:/Users/Developer/Workspace/ChaSet', icon: 'folder' },
      { label: t('surfaces.breadcrumb.packages', 'packages'), path: 'C:/Users/Developer/Workspace/ChaSet/packages', icon: 'folder' },
      { label: t('surfaces.breadcrumb.react', 'react'), path: 'C:/Users/Developer/Workspace/ChaSet/packages/react', icon: 'folder' },
    ],
    [t],
  );

  const [segments, setSegments] = useState<PathSegment[]>(initialSegments);
  const [activePath, setActivePath] = useState('C:/Users/Developer/Workspace/ChaSet/packages/react');
  const [maxVisible, setMaxVisible] = useState('5');
  const [disabled, setDisabled] = useState(false);
  const [lastNavigated, setLastNavigated] = useState('');

  const handleNavigate = (path: string) => {
    setActivePath(path);
    setLastNavigated(path);
    const idx = segments.findIndex((s) => s.path === path);
    if (idx >= 0) {
      setSegments(segments.slice(0, idx + 1));
    }
  };

  const resetPath = () => {
    setSegments(initialSegments);
    setActivePath('C:/Users/Developer/Workspace/ChaSet/packages/react');
    setLastNavigated('');
  };

  const heroReactCode = `<Breadcrumb
  segments={segments}
  activePath="${activePath}"
  disabled={${disabled}}
  maxVisibleItems={${maxVisible}}
  onNavigate={(path) => handleNavigate(path)}
/>`;

  const heroQtCode = `ChaSetBreadcrumb {
    width: parent.width
    segments: demoSegments
    disabled: ${disabled}
    onNavigateRequested: function(path) {
        handleNavigate(path)
    }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Breadcrumb"
      description={t(
        'components.breadcrumb.description',
        'Hierarchical path navigation trail with overflow ellipsis and dropdown subfolder browsing.',
      )}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2">{t('surfaces.breadcrumb.overviewHeading', 'Interactive Overview')}</DocText>
        <DocText role="p" className="mb-4 text-muted-foreground">
          {t(
            'surfaces.breadcrumb.overviewDesc',
            'Interactive hierarchical path breadcrumb with segment navigation, subfolder browsing, and overflow collapsing.',
          )}
        </DocText>

        <ComponentPreview
          title={t('surfaces.breadcrumb.sandboxTitle', 'Breadcrumb Interactive Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="outline" onClick={resetPath}>
                {t('surfaces.breadcrumb.resetPath', 'Reset Path')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDisabled((prev) => !prev)}
              >
                {disabled ? t('common.enabled', 'Enable') : t('common.disabled', 'Disable')}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('surfaces.breadcrumb.maxVisible', 'Max Visible:')}</span>
                <SegmentedControl
                  size="sm"
                  value={maxVisible}
                  onValueChange={(val) => setMaxVisible(String(val))}
                  options={[
                    { label: '3', value: '3' },
                    { label: '5', value: '5' },
                    { label: '7', value: '7' },
                  ]}
                />
              </div>
            </div>
          }
        >
          <div className="flex w-full flex-col gap-4 p-6">
            <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
              <Breadcrumb
                segments={segments}
                activePath={activePath}
                disabled={disabled}
                maxVisibleItems={Number(maxVisible)}
                onNavigate={handleNavigate}
              />
            </div>
            {lastNavigated ? (
              <div className="text-xs text-muted-foreground">
                {t('surfaces.breadcrumb.navigatedTo', 'Navigated to: %1').replace('%1', lastNavigated)}
              </div>
            ) : null}
          </div>
        </ComponentPreview>
      </section>

      <DocAnatomy
        id="anatomy"
        reactCode={`import { Breadcrumb } from '@chahu/cha-set';

<Breadcrumb
  segments={[
    { label: 'Home', path: '/', isRoot: true, icon: 'monitor' },
    { label: 'Workspace', path: '/workspace', icon: 'folder' },
    { label: 'ChaSet', path: '/workspace/chaset', icon: 'folder' },
  ]}
  activePath="/workspace/chaset"
  onNavigate={(path) => console.log(path)}
/>`}
        qtCode={`import ChaSet

ChaSetBreadcrumb {
    segments: [
        { label: "Home", path: "/", isRoot: true, icon: "monitor" },
        { label: "Workspace", path: "/workspace", icon: "folder" },
        { label: "ChaSet", path: "/workspace/chaset", icon: "folder" }
    ]
    onNavigateRequested: function(path) {
        console.log(path)
    }
}`}
      />

      <section id="animations" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('surfaces.breadcrumb.animationsTitle', 'Animations')}</DocText>
        <DocText role="p" className="text-muted-foreground">
          {t(
            'surfaces.breadcrumb.animationsDesc',
            'Segment hover and dropdown menus follow standard motion duration and entrance curves.',
          )}
        </DocText>
        <DocMarkdown id="breadcrumb" section="animations" />
      </section>

      <section id="keyboard" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.keyboardNavigation', 'Keyboard Navigation')}</DocText>
        <DocMarkdown id="breadcrumb" section="keyboard" />
      </section>

      <section id="props" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.propsReference', 'Props Reference')}</DocText>
        <DocMarkdown id="breadcrumb" section="props" />
      </section>
    </DocLayout>
  );
}
export default BreadcrumbDocPage;
