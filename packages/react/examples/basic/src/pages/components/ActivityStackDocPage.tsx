import React, { useState } from 'react';
import {
  ActivityStack,
  ActivityCard,
  type ActivityStackEntry,
  type ActivityTone,
  Button,
  SegmentedControl,
  useChaSetI18n,
} from '@chahu/cha-set';
import type { ActivityPlacement } from '@chahu/spec/shared/placement';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocText } from '../../components/DocText';

interface SampleCardData {
  id: string;
  tone: ActivityTone;
  title: string;
  detail: string;
  meta: string;
  progress: number;
}

export function ActivityStackDocPage() {
  const { t } = useChaSetI18n();

  const [placement, setPlacement] = useState<ActivityPlacement>('bottom-right');
  const [maxVisible, setMaxVisible] = useState('3');
  const [collapsed, setCollapsed] = useState(false);

  const initialItems: SampleCardData[] = [
    {
      id: 'task-1',
      tone: 'neutral',
      title: t('overlays.activityStack.sampleTaskTitle', 'Sync Pipeline'),
      detail: t('overlays.activityStack.sampleTaskDetail', 'Pushing changes to remote branch'),
      meta: '2.4s',
      progress: 0.65,
    },
    {
      id: 'task-2',
      tone: 'success',
      title: t('overlays.activityStack.sampleSuccessTitle', 'Build Succeeded'),
      detail: t('overlays.activityStack.sampleSuccessDetail', 'Artifacts passed all unit tests'),
      meta: 'Done',
      progress: 1,
    },
    {
      id: 'task-3',
      tone: 'warning',
      title: t('overlays.activityStack.sampleWarningTitle', 'Dependency Warning'),
      detail: t('overlays.activityStack.sampleWarningDetail', 'Detected 3 deprecated API calls'),
      meta: 'Warn',
      progress: -1,
    },
    {
      id: 'task-4',
      tone: 'danger',
      title: t('overlays.activityStack.sampleDangerTitle', 'Build Failed'),
      detail: t('overlays.activityStack.sampleDangerDetail', 'Linker error: undefined symbol _main'),
      meta: 'Error',
      progress: -1,
    },
  ];

  const [items, setItems] = useState<SampleCardData[]>(initialItems);

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addCard = () => {
    const nextIdx = items.length + 1;
    const tones: ActivityTone[] = ['neutral', 'success', 'warning', 'danger'];
    const tone = tones[nextIdx % tones.length] || 'neutral';
    setItems((prev) => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        tone,
        title: `${t('overlays.activityStack.jobPrefix', 'Job #')}${nextIdx}`,
        detail: `Execution step ${nextIdx} in progress`,
        meta: `${nextIdx}s`,
        progress: tone === 'success' ? 1 : 0.4,
      },
    ]);
  };

  const removeCard = () => {
    setItems((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
  };

  const entries: ActivityStackEntry[] = items.map((item) => ({
    id: item.id,
    node: (
      <ActivityCard
        itemId={item.id}
        tone={item.tone}
        title={item.title}
        detail={item.detail}
        meta={item.meta}
        progress={item.progress}
        icon={<span className="text-xs font-bold">{item.tone[0]?.toUpperCase()}</span>}
        onDismiss={() => handleDismiss(item.id)}
        dismissLabel={`Dismiss ${item.title}`}
      />
    ),
  }));

  const placementOptions = [
    { label: t('overlays.activityStack.bottomRight', 'Bottom Right'), value: 'bottom-right' },
    { label: t('overlays.activityStack.bottomLeft', 'Bottom Left'), value: 'bottom-left' },
    { label: t('overlays.activityStack.topRight', 'Top Right'), value: 'top-right' },
    { label: t('overlays.activityStack.topLeft', 'Top Left'), value: 'top-left' },
    { label: t('overlays.activityStack.bottomCenter', 'Bottom Center'), value: 'bottom-center' },
  ];

  const heroReactCode = `<ActivityStack
  placement="${placement}"
  maxVisible={${maxVisible}}
  collapsible
  label="Activity Stack"
  entries={[
    {
      id: "card-1",
      node: (
        <ActivityCard
          itemId="card-1"
          tone="neutral"
          title="${t('overlays.activityStack.sampleTaskTitle', 'Sync Pipeline')}"
          detail="${t('overlays.activityStack.sampleTaskDetail', 'Pushing changes to remote branch')}"
          progress={0.65}
          onDismiss={() => removeCard("card-1")}
        />
      ),
    },
  ]}
/>`;

  const heroQtCode = `ChaSetActivityStack {
    anchorItem: sandboxBox
    placement: "${placement}"
    maxVisible: ${maxVisible}
    collapsible: true
    entries: [
        {
            id: "card-1",
            tone: "neutral",
            title: "${t('overlays.activityStack.sampleTaskTitle', 'Sync Pipeline')}",
            detail: "${t('overlays.activityStack.sampleTaskDetail', 'Pushing changes to remote branch')}",
            progress: 0.65,
            dismissible: true
        }
    ]
}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Activity Stack"
      description={t(
        'components.activityStack.description',
        'Floating viewport-anchored stack of activity cards with 8-way placement, overflow, and collapse.',
      )}
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'installation', title: t('showcase.installation', 'Installation') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2">{t('overlays.activityStack.overviewHeading', 'Interactive Overview')}</DocText>
        <DocText role="p" className="mb-4 text-muted-foreground">
          {t(
            'overlays.activityStack.overviewDesc',
            'Viewport-anchored floating activity cards featuring adaptive width, smooth slide/fade transitions, overflow pills, and collapsible summary row.',
          )}
        </DocText>

        <ComponentPreview
          title={t('overlays.activityStack.sandboxTitle', 'Activity Stack Interactive Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="outline" onClick={addCard}>
                {t('overlays.activityStack.addCard', 'Add Card')}
              </Button>
              <Button size="sm" variant="outline" onClick={removeCard} disabled={items.length === 0}>
                {t('overlays.activityStack.removeCard', 'Remove Card')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCollapsed((prev) => !prev)}>
                {t('overlays.activityStack.toggleCollapse', 'Toggle Collapse')}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('overlays.activityStack.placement', 'Placement:')}</span>
                <SegmentedControl
                  size="sm"
                  value={placement}
                  onValueChange={(val) => setPlacement(val as ActivityPlacement)}
                  options={placementOptions}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('overlays.activityStack.maxVisible', 'Max Visible:')}</span>
                <SegmentedControl
                  size="sm"
                  value={maxVisible}
                  onValueChange={(val) => setMaxVisible(String(val))}
                  options={[
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                  ]}
                />
              </div>
            </div>
          }
        >
          <div className="relative min-h-[22rem] w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/20 p-6">
            <div className="flex h-full min-h-[18rem] items-center justify-center">
              <span className="text-xs text-muted-foreground">
                {t('overlays.activityStack.activeCardsCount', 'Active cards: {{count}}', { count: items.length })}
              </span>
            </div>
            <ActivityStack
              entries={entries}
              placement={placement}
              maxVisible={Number(maxVisible)}
              collapsible
              defaultCollapsed={collapsed}
              label={t('overlays.activityStack.accessibleLabel', 'Activity Stack')}
              summaryLabel="active tasks"
              className="!absolute max-w-sm"
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.installation', 'Installation')}</DocText>
        <div className="mt-4 rounded-lg border border-border bg-card p-4 font-mono text-xs">
          <code>npm install @chahu/cha-set</code>
        </div>
      </section>

      <section id="animations" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('overlays.activityStack.animationsTitle', 'Animations')}</DocText>
        <DocText role="p" className="text-muted-foreground">
          {t(
            'overlays.activityStack.animationsDesc',
            'Card entry/exit and summary row collapse use standard motion tokens and respect prefers-reduced-motion.',
          )}
        </DocText>
        <DocMarkdown id="activity-stack" section="animations" />
      </section>

      <section id="keyboard" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.keyboardNavigation', 'Keyboard Navigation')}</DocText>
        <DocMarkdown id="activity-stack" section="keyboard" />
      </section>

      <section id="props" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.propsReference', 'Props Reference')}</DocText>
        <DocMarkdown id="activity-stack" section="props" />
      </section>
    </DocLayout>
  );
}
export default ActivityStackDocPage;
